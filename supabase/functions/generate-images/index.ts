import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ImagePrompt {
  key: string;
  prompt: string;
}

interface ExtractedData {
  businessName?: string;
  services?: string[];
  targetAudience?: string;
  story?: string;
}

// Sector-specific keywords for dynamic image generation
const sectorKeywords: Record<string, { primary: string; secondary: string; style: string }> = {
  food: {
    primary: "restaurant cafe food dining cuisine",
    secondary: "chef kitchen culinary cooking",
    style: "warm inviting appetizing delicious"
  },
  retail: {
    primary: "store shop retail interior products",
    secondary: "shopping customer display merchandise",
    style: "modern bright welcoming stylish"
  },
  service: {
    primary: "professional office business workspace",
    secondary: "team consultation meeting corporate",
    style: "professional trustworthy reliable"
  },
  creative: {
    primary: "design studio creative workspace art",
    secondary: "artist designer portfolio creative",
    style: "modern artistic innovative inspiring"
  },
  technology: {
    primary: "tech startup office modern digital",
    secondary: "software developer coding innovation",
    style: "innovative digital modern futuristic"
  },
  other: {
    primary: "professional business modern workspace",
    secondary: "team office collaboration meeting",
    style: "professional clean trustworthy"
  },
  doctor: {
    primary: "medical clinic healthcare hospital",
    secondary: "doctor patient consultation care",
    style: "professional trustworthy caring"
  },
  dentist: {
    primary: "dental clinic teeth orthodontics",
    secondary: "dentist patient smile oral health",
    style: "clean modern professional friendly"
  },
  pharmacist: {
    primary: "pharmacy drugstore medicine",
    secondary: "pharmacist medication prescription",
    style: "clean professional healthcare"
  }
};

function getImagePrompts(
  profession: string,
  businessName: string,
  extractedData?: ExtractedData
): ImagePrompt[] {
  const keywords = sectorKeywords[profession] || sectorKeywords.other;
  const services = extractedData?.services?.slice(0, 2).join(', ') || '';
  const serviceContext = services ? `featuring ${services},` : '';

  return [
    {
      key: "heroHome",
      prompt: `Professional ${keywords.primary} for ${businessName}, ${serviceContext} ${keywords.style}, high quality photography style, 16:9 aspect ratio hero image, no text on image`
    },
    {
      key: "heroAbout",
      prompt: `${keywords.secondary} team at ${businessName}, professional atmosphere, ${keywords.style}, 16:9 aspect ratio, no text on image`
    },
    {
      key: "heroServices",
      prompt: `${keywords.primary} showcasing professional services at ${businessName}, ${keywords.style}, professional setting, 16:9 aspect ratio, no text on image`
    }
  ];
}

function getBlogImageTopic(profession: string): string {
  const topicMap: Record<string, string> = {
    food: "culinary food cooking restaurant",
    retail: "shopping retail products store",
    service: "professional business consulting",
    creative: "design art creative portfolio",
    technology: "technology software digital innovation",
    other: "professional business modern",
    doctor: "healthcare medical wellness",
    dentist: "dental oral health smile",
    pharmacist: "pharmacy medicine health"
  };
  return topicMap[profession] || topicMap.other;
}

async function generateImage(prompt: string, apiKey: string): Promise<string | null> {
  try {
    console.log("Generating image for prompt:", prompt.substring(0, 50) + "...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image generation failed:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (imageUrl) {
      console.log("Image generated successfully");
      return imageUrl;
    }
    
    console.error("No image URL in response");
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

/**
 * Upload a base64 data URI to Supabase Storage and return the public URL.
 */
async function uploadBase64ToStorage(
  supabase: any,
  base64DataUri: string,
  projectId: string,
  imageKey: string
): Promise<string | null> {
  try {
    // Extract mime type and base64 data from data URI
    const match = base64DataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      console.error("Invalid base64 data URI for key:", imageKey);
      return null;
    }
    
    const mimeType = match[1];
    const base64Data = match[2];
    const extension = mimeType.split('/')[1] || 'png';
    const filePath = `${projectId}/${imageKey}_${Date.now()}.${extension}`;
    
    // Decode base64 to Uint8Array
    const bytes = base64Decode(base64Data);
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(filePath, bytes, {
        contentType: mimeType,
        upsert: true,
      });
    
    if (error) {
      console.error("Storage upload error for", imageKey, ":", error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(filePath);
    
    console.log("Uploaded", imageKey, "to storage:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Upload exception for", imageKey, ":", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { projectId, extractedData: requestExtractedData } = await req.json();

    if (!projectId) {
      return new Response(JSON.stringify({ error: "Missing projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ============ USER AUTHENTICATION & OWNERSHIP CHECK ============
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    // Create service role client for database + storage operations
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch project data
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ============ OWNERSHIP VERIFICATION ============
    if (project.user_id !== userId) {
      console.error("Ownership check failed: user", userId, "tried to access project owned by", project.user_id);
      return new Response(JSON.stringify({ error: "Forbidden: You don't own this project" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("Ownership verified for project:", projectId);

    const profession = project.profession;
    const formData = project.form_data || {};
    
    const extractedData: ExtractedData = requestExtractedData || (formData as any)?.extractedData || {};
    const businessName = extractedData.businessName || 
                         (formData as any)?.businessInfo?.businessName || 
                         project.name || 
                         "Business";
    
    const generatedContent = project.generated_content || {};

    console.log("Generating images for sector:", profession, "- Business:", businessName);

    const imagePrompts = getImagePrompts(profession, businessName, extractedData);
    
    // Generate images one at a time to avoid rate limits
    const images: Record<string, string> = {};
    
    for (const imagePrompt of imagePrompts) {
      const base64Image = await generateImage(imagePrompt.prompt, LOVABLE_API_KEY);
      if (base64Image) {
        // Upload to storage instead of storing base64 directly
        if (base64Image.startsWith('data:')) {
          const publicUrl = await uploadBase64ToStorage(supabase, base64Image, projectId, imagePrompt.key);
          if (publicUrl) {
            images[imagePrompt.key] = publicUrl;
          } else {
            console.warn("Failed to upload", imagePrompt.key, "to storage, skipping");
          }
        } else {
          // Already a URL (shouldn't happen but handle gracefully)
          images[imagePrompt.key] = base64Image;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate blog post images if blog exists
    const blogPosts = generatedContent.pages?.blog?.posts || [];
    const updatedBlogPosts = [];
    
    const blogTopic = getBlogImageTopic(profession);
    
    for (const post of blogPosts) {
      if (!post.featuredImage) {
        const blogImagePrompt = `Professional blog article featured image about "${post.title}", ${blogTopic} topic, clean modern design, professional photography style, 16:9 aspect ratio, no text on image`;
        const base64Image = await generateImage(blogImagePrompt, LOVABLE_API_KEY);
        
        let featuredImage: string | undefined;
        if (base64Image && base64Image.startsWith('data:')) {
          const publicUrl = await uploadBase64ToStorage(supabase, base64Image, projectId, `blog_${post.id || Date.now()}`);
          featuredImage = publicUrl || undefined;
        } else if (base64Image) {
          featuredImage = base64Image;
        }
        
        updatedBlogPosts.push({
          ...post,
          featuredImage
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        updatedBlogPosts.push(post);
      }
    }

    // Update the generated_content with images - MERGE with existing (preserve Pixabay images)
    const updatedContent = {
      ...generatedContent,
      images: { ...(generatedContent.images || {}), ...images },
      pages: {
        ...generatedContent.pages,
        blog: generatedContent.pages?.blog ? {
          ...generatedContent.pages.blog,
          posts: updatedBlogPosts
        } : undefined
      }
    };

    // Save updated content
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        generated_content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save images" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Images generated and saved to storage successfully for sector:", profession);
    return new Response(
      JSON.stringify({
        success: true,
        images,
        blogPostsUpdated: updatedBlogPosts.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
