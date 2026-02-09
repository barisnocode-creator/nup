import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, perPage = 20 } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid query" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PIXABAY_API_KEY = Deno.env.get("PIXABAY_API_KEY");
    if (!PIXABAY_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Pixabay API not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&image_type=photo&orientation=horizontal&min_width=800&per_page=${Math.min(perPage, 40)}&safesearch=true`;

    console.log(`Searching Pixabay for: "${query}"`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: "Image search failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const images = (data.hits || []).map((hit: any) => ({
      id: hit.id,
      previewURL: hit.previewURL,
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      imageWidth: hit.imageWidth,
      imageHeight: hit.imageHeight,
      user: hit.user,
    }));

    console.log(`Found ${images.length} images for "${query}"`);

    return new Response(
      JSON.stringify({ images, totalHits: data.totalHits }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
