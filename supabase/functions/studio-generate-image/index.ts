import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface GenerateRequest {
  type: 'logo' | 'social' | 'poster' | 'creative';
  prompt: string;
  imageId: string;
  style?: string;
  editInstruction?: string;
  previousImageUrl?: string;
  businessName?: string;
}

// Build the appropriate prompt based on type
function buildImagePrompt(request: GenerateRequest): string {
  const { type, prompt, style = 'modern', editInstruction, businessName } = request;

  // If editing an existing image
  if (editInstruction) {
    return `${prompt}. Modification: ${editInstruction}. High quality, professional design.`;
  }

  // Build type-specific prompts
  switch (type) {
    case 'logo':
      return `Professional logo design for ${businessName || 'a business'}. ${style} style, clean vector aesthetic, suitable for website and print, minimalist design. ${prompt}. High quality, professional design.`;
    
    case 'social':
      return `Social media post graphic, square format (1:1 aspect ratio), modern design, eye-catching, vibrant colors. ${prompt}. Professional marketing material.`;
    
    case 'poster':
      return `Professional poster design, vertical A4 format, bold typography, eye-catching layout. ${prompt}. High quality print-ready design.`;
    
    case 'creative':
    default:
      return `${prompt}. High quality, professional design, artistic composition.`;
  }
}

// Get image dimensions based on type
function getImageDimensions(type: string): { width: number; height: number } {
  switch (type) {
    case 'logo':
      return { width: 512, height: 512 };
    case 'social':
      return { width: 1024, height: 1024 };
    case 'poster':
      return { width: 768, height: 1024 };
    case 'creative':
    default:
      return { width: 1024, height: 1024 };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: GenerateRequest = await req.json();
    const { type, prompt, imageId, editInstruction, previousImageUrl, businessName, style } = body;

    if (!type || !prompt || !imageId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${type} image for user ${user.id}:`, prompt);

    // Verify the image record belongs to the user
    const { data: imageRecord, error: imageError } = await supabase
      .from('studio_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (imageError || !imageRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the prompt
    const fullPrompt = buildImagePrompt({ type, prompt, style, editInstruction, previousImageUrl, businessName, imageId });
    const dimensions = getImageDimensions(type);

    console.log('Full prompt:', fullPrompt);
    console.log('Dimensions:', dimensions);

    // Call Lovable AI API for image generation
    const imageResponse = await fetch('https://api.lovable.dev/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'flux.schnell',
        prompt: fullPrompt,
        n: 1,
        size: `${dimensions.width}x${dimensions.height}`,
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('Image generation failed:', errorText);
      
      // Update status to failed
      await supabase
        .from('studio_images')
        .update({ status: 'failed' })
        .eq('id', imageId);

      return new Response(
        JSON.stringify({ success: false, error: 'Image generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageData = await imageResponse.json();
    console.log('Image generation response:', JSON.stringify(imageData).substring(0, 200));

    // Get the image URL from the response
    let imageUrl = '';
    if (imageData.data && imageData.data[0]) {
      if (imageData.data[0].url) {
        imageUrl = imageData.data[0].url;
      } else if (imageData.data[0].b64_json) {
        // If base64, we need to upload to storage
        const base64Data = imageData.data[0].b64_json;
        const fileName = `${user.id}/studio/${type}/${Date.now()}.png`;
        
        // Decode base64 and upload
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-images')
          .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload image');
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('user-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }
    }

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.log('Generated image URL:', imageUrl);

    // Update the studio_images record
    const { error: updateError } = await supabase
      .from('studio_images')
      .update({
        image_url: imageUrl,
        status: 'completed',
        metadata: {
          style,
          dimensions,
          editInstruction: editInstruction || null,
        },
      })
      .eq('id', imageId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update image record');
    }

    return new Response(
      JSON.stringify({ success: true, imageUrl, imageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in studio-generate-image:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
