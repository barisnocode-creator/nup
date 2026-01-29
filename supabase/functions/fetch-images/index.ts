import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Profession-specific search terms for Pixabay
const professionSearchTerms: Record<string, Record<string, string>> = {
  doctor: {
    heroHome: "medical clinic reception modern healthcare",
    heroAbout: "doctor team professional hospital",
    heroServices: "medical equipment modern clinic",
    heroBlog: "healthcare medical research",
    heroContact: "medical consultation doctor patient",
  },
  dentist: {
    heroHome: "dental clinic modern reception",
    heroAbout: "dentist team professional clinic",
    heroServices: "dental equipment modern technology",
    heroBlog: "dental care oral hygiene",
    heroContact: "dental consultation patient",
  },
  pharmacist: {
    heroHome: "pharmacy modern drugstore interior",
    heroAbout: "pharmacist professional team",
    heroServices: "pharmacy medications medicine",
    heroBlog: "medicine health supplements",
    heroContact: "pharmacy consultation customer",
  },
};

// Blog post category to search terms mapping
const blogCategorySearchTerms: Record<string, string> = {
  health: "health wellness lifestyle",
  dental: "dental care teeth smile",
  medicine: "medicine pharmacy health",
  nutrition: "nutrition healthy food",
  wellness: "wellness fitness health",
  prevention: "preventive healthcare medical",
  skincare: "skincare dermatology health",
  pediatric: "pediatric children healthcare",
  default: "healthcare medical professional",
};

async function fetchPixabayImage(
  query: string,
  apiKey: string,
  minWidth: number = 1200
): Promise<string | null> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&min_width=${minWidth}&per_page=5&safesearch=true`;

    console.log(`Fetching Pixabay image for: ${query}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      // Pick a random image from top 5 results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.hits.length));
      const imageUrl = data.hits[randomIndex].largeImageURL;
      console.log(`Found image: ${imageUrl.substring(0, 50)}...`);
      return imageUrl;
    }

    console.log(`No images found for query: ${query}`);
    return null;
  } catch (error) {
    console.error(`Error fetching Pixabay image:`, error);
    return null;
  }
}

async function fetchBlogImage(
  postTitle: string,
  category: string,
  apiKey: string
): Promise<string | null> {
  // Try category-specific search first
  const categoryTerms = blogCategorySearchTerms[category.toLowerCase()] || blogCategorySearchTerms.default;
  
  let imageUrl = await fetchPixabayImage(categoryTerms, apiKey, 1200);
  
  // If no result, try with a more generic health query
  if (!imageUrl) {
    imageUrl = await fetchPixabayImage("healthcare medical professional", apiKey, 1200);
  }
  
  return imageUrl;
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

    const PIXABAY_API_KEY = Deno.env.get("PIXABAY_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PIXABAY_API_KEY) {
      console.error("PIXABAY_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Pixabay API not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch project data
    console.log("Fetching project:", projectId);
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      console.error("Project fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profession = project.profession || "doctor";
    const generatedContent = project.generated_content || {};
    const searchTerms = professionSearchTerms[profession] || professionSearchTerms.doctor;

    console.log(`Fetching Pixabay images for profession: ${profession}`);

    // Fetch hero images for all pages
    const images: Record<string, string> = {};
    
    const imagePromises = Object.entries(searchTerms).map(async ([key, query]) => {
      const imageUrl = await fetchPixabayImage(query, PIXABAY_API_KEY, 1920);
      if (imageUrl) {
        images[key] = imageUrl;
      }
    });

    await Promise.all(imagePromises);

    console.log(`Fetched ${Object.keys(images).length} hero images`);

    // Fetch blog post images
    const blogPosts = generatedContent.pages?.blog?.posts || [];
    const updatedBlogPosts = [];

    for (const post of blogPosts) {
      const featuredImage = await fetchBlogImage(
        post.title,
        post.category || "default",
        PIXABAY_API_KEY
      );
      updatedBlogPosts.push({
        ...post,
        featuredImage: featuredImage || undefined,
      });
    }

    console.log(`Fetched images for ${updatedBlogPosts.length} blog posts`);

    // Update the generated_content with images
    const updatedContent = {
      ...generatedContent,
      images,
      pages: {
        ...generatedContent.pages,
        blog: generatedContent.pages?.blog
          ? {
              ...generatedContent.pages.blog,
              posts: updatedBlogPosts,
            }
          : undefined,
      },
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

    console.log("Pixabay images fetched and saved successfully");
    return new Response(
      JSON.stringify({
        success: true,
        images,
        blogPostsUpdated: updatedBlogPosts.length,
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
