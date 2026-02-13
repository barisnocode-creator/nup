import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface RegenerateRequest {
  projectId: string;
  fieldPath: string;
  currentValue?: string;
  variants?: number;
}

// Field type detection for prompt customization
function getFieldType(fieldPath: string): { type: string; description: string } {
  const lowercasePath = fieldPath.toLowerCase();
  
  if (lowercasePath.includes('title') || lowercasePath.includes('headline')) {
    return { type: 'headline', description: 'a compelling headline that grabs attention' };
  }
  if (lowercasePath.includes('subtitle')) {
    return { type: 'subtitle', description: 'a supportive subtitle that complements the headline' };
  }
  if (lowercasePath.includes('description') || lowercasePath.includes('content')) {
    return { type: 'description', description: 'an engaging description that provides detail and value' };
  }
  if (lowercasePath.includes('tagline')) {
    return { type: 'tagline', description: 'a memorable tagline that captures the brand essence' };
  }
  if (lowercasePath.includes('value') && lowercasePath.includes('statistic')) {
    return { type: 'statistic', description: 'a believable statistic value (number with unit like "10+" or "24/7" or "98%")' };
  }
  if (lowercasePath.includes('label') && lowercasePath.includes('statistic')) {
    return { type: 'stat_label', description: 'a short, clear label for a statistic (2-3 words max)' };
  }
  
  return { type: 'text', description: 'professional, engaging text' };
}

// Extract context from the generated content
function extractContext(generatedContent: any): { profession: string; siteName: string; tone: string } {
  return {
    profession: generatedContent?.pages?.home?.hero?.subtitle || 'professional',
    siteName: generatedContent?.metadata?.siteName || 'Business',
    tone: 'professional and welcoming',
  };
}

// Get current value from content using fieldPath
function getValueFromPath(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    // Handle array notation like statistics[0]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current?.[arrayMatch[1]]?.[parseInt(arrayMatch[2])];
    } else {
      current = current?.[key];
    }
    if (current === undefined) return '';
  }
  
  return typeof current === 'string' ? current : '';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { projectId, fieldPath, currentValue, variants: variantCount } = await req.json() as RegenerateRequest;
    const wantVariants = (variantCount && variantCount > 1);
    if (!projectId || !fieldPath) {
      throw new Error('Missing required fields: projectId and fieldPath');
    }

    console.log(`Regenerating content for field: ${fieldPath} in project: ${projectId}`);

    // Fetch project and verify ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, profession, generated_content')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found');
    }

    if (project.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this project');
    }

    // Extract context from project
    const context = extractContext(project.generated_content);
    const fieldInfo = getFieldType(fieldPath);
    
    // Get current value if not provided
    const existingValue = currentValue || getValueFromPath(project.generated_content, fieldPath);

    // Build AI prompt
    const baseInstructions = `You are a professional content writer for a ${project.profession} business website.
Site name: ${context.siteName}
Current content: "${existingValue}"
Requirements:
- Maintain a professional, ${context.tone} tone
- Make it different but equally engaging and relevant
- Do NOT include quotes around your response`;

    let prompt: string;
    if (wantVariants) {
      prompt = `${baseInstructions}

Generate 3 alternative versions of this ${fieldInfo.type} (${fieldInfo.description}):
1. SHORT: Maximum 5 words, punchy
2. MEDIUM: Similar length to current content
3. LONG: Slightly longer, more descriptive

Return ONLY a JSON array with exactly 3 strings, no explanation:
["short version", "medium version", "long version"]`;
    } else {
      prompt = `${baseInstructions}

Generate ${fieldInfo.description} for a ${project.profession} website.
- Keep approximately the same length as the current content
- Return ONLY the new text, no explanation or additional formatting

Generate a new ${fieldInfo.type}:`;
    }

    console.log('Calling AI Gateway for content regeneration...');

    // Call Lovable AI Gateway
    const response = await fetch('https://ai-gateway.lovable.dev/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const rawContent = aiResponse.choices?.[0]?.message?.content?.trim() || '';

    if (!rawContent) {
      throw new Error('AI returned empty content');
    }

    if (wantVariants) {
      // Try to parse as JSON array
      let variantsArr: string[] = [];
      try {
        // Extract JSON array from response (handle markdown code blocks)
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          variantsArr = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback: use as single value
        variantsArr = [rawContent];
      }

      const result = variantsArr.map((text: string, i: number) => ({
        text: text.replace(/^["']|["']$/g, ''),
        length: i === 0 ? 'short' : i === 1 ? 'medium' : 'long',
      }));

      console.log(`Generated ${result.length} variants for ${fieldPath}`);

      return new Response(
        JSON.stringify({ success: true, fieldPath, variants: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Single value (backward compatible)
    console.log(`Generated new content for ${fieldPath}: "${rawContent.substring(0, 50)}..."`);

    return new Response(
      JSON.stringify({ success: true, fieldPath, newValue: rawContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in regenerate-content:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
