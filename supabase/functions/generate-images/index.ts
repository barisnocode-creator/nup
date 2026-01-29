import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ImagePrompt {
  key: string;
  prompt: string;
}

function getImagePrompts(profession: string, businessName: string): ImagePrompt[] {
  const professionImages: Record<string, ImagePrompt[]> = {
    doctor: [
      {
        key: "heroHome",
        prompt: `Professional medical clinic exterior or reception area for ${businessName}, modern healthcare facility, clean and welcoming, warm natural lighting, high quality photography style, 16:9 aspect ratio hero image`
      },
      {
        key: "heroAbout",
        prompt: `Friendly doctor in white coat consulting with patient in modern medical office, professional and trustworthy atmosphere, warm lighting, for ${businessName}, 16:9 aspect ratio`
      },
      {
        key: "heroServices",
        prompt: `Modern medical examination room with advanced equipment, clean and organized, professional healthcare setting for ${businessName}, 16:9 aspect ratio`
      }
    ],
    dentist: [
      {
        key: "heroHome",
        prompt: `Modern dental clinic interior with comfortable waiting area for ${businessName}, bright and welcoming dental office, clean aesthetic, warm lighting, 16:9 aspect ratio hero image`
      },
      {
        key: "heroAbout",
        prompt: `Friendly dentist and dental team in modern clinic, professional dental care setting, welcoming smiles, for ${businessName}, 16:9 aspect ratio`
      },
      {
        key: "heroServices",
        prompt: `State-of-the-art dental treatment room with modern equipment, comfortable dental chair, clean and bright environment for ${businessName}, 16:9 aspect ratio`
      }
    ],
    pharmacist: [
      {
        key: "heroHome",
        prompt: `Modern pharmacy interior with organized shelves and professional counter for ${businessName}, welcoming local pharmacy, clean and organized, warm lighting, 16:9 aspect ratio hero image`
      },
      {
        key: "heroAbout",
        prompt: `Friendly pharmacist helping customer at pharmacy counter, professional healthcare setting, organized medication shelves, for ${businessName}, 16:9 aspect ratio`
      },
      {
        key: "heroServices",
        prompt: `Pharmacy consultation area with health products and medications, professional pharmaceutical care setting for ${businessName}, 16:9 aspect ratio`
      }
    ]
  };

  return professionImages[profession] || professionImages.doctor;
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return new Response(JSON.stringify({ error: "Missing projectId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
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

    const profession = project.profession;
    const businessName = project.form_data?.businessInfo?.businessName || "Healthcare Practice";
    const generatedContent = project.generated_content || {};

    console.log("Generating images for:", profession, businessName);

    // Get prompts for this profession
    const imagePrompts = getImagePrompts(profession, businessName);
    
    // Generate images (one at a time to avoid rate limits)
    const images: Record<string, string> = {};
    
    for (const imagePrompt of imagePrompts) {
      const imageUrl = await generateImage(imagePrompt.prompt, LOVABLE_API_KEY);
      if (imageUrl) {
        images[imagePrompt.key] = imageUrl;
      }
      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate blog post images if blog exists
    const blogPosts = generatedContent.pages?.blog?.posts || [];
    const updatedBlogPosts = [];
    
    for (const post of blogPosts) {
      if (!post.featuredImage) {
        const blogImagePrompt = `Professional blog article featured image about "${post.title}", healthcare topic, clean modern design, professional photography style, 16:9 aspect ratio`;
        const featuredImage = await generateImage(blogImagePrompt, LOVABLE_API_KEY);
        updatedBlogPosts.push({
          ...post,
          featuredImage: featuredImage || undefined
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        updatedBlogPosts.push(post);
      }
    }

    // Update the generated_content with images
    const updatedContent = {
      ...generatedContent,
      images,
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

    console.log("Images generated and saved successfully");
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
