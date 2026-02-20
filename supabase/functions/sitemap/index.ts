import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Support: /sitemap/{subdomain} or ?subdomain=xxx
    const pathParts = url.pathname.split("/").filter(Boolean);
    const subdomain =
      url.searchParams.get("subdomain") ||
      pathParts[pathParts.length - 1] ||
      "";

    if (!subdomain || subdomain === "sitemap") {
      return new Response(
        JSON.stringify({ error: "Subdomain required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the project
    const { data: project, error } = await supabase
      .from("public_projects")
      .select("id, name, subdomain, site_sections, custom_domain")
      .eq("subdomain", subdomain)
      .maybeSingle();

    if (error || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine base URL
    const baseUrl = project.custom_domain
      ? `https://${project.custom_domain}`
      : `https://${subdomain}.openlucius.com`;

    const now = new Date().toISOString().split("T")[0];

    // Extract blog posts from site_sections
    const sections = (project.site_sections as any[]) || [];
    const blogSection = sections.find((s: any) => s.type === "AddableBlog");
    const blogProps = blogSection?.props || {};

    const blogUrls: string[] = [];

    for (let i = 1; i <= 4; i++) {
      const slug = blogProps[`post${i}Slug`];
      const title = blogProps[`post${i}Title`];
      const image = blogProps[`post${i}Image`];
      const date = blogProps[`post${i}Date`];

      if (slug && slug !== `konu-${i}`) {
        const postDate = date ? date.split("T")[0] : now;
        const imageTag = image
          ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(title || "")}</image:title>
    </image:image>`
          : "";

        blogUrls.push(`
  <url>
    <loc>${escapeXml(baseUrl)}/blog/${escapeXml(slug)}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>`);
      }
    }

    const staticPages = [
      { path: "", priority: "1.0", freq: "weekly" },
      { path: "/hizmetler", priority: "0.9", freq: "monthly" },
      { path: "/hakkimizda", priority: "0.7", freq: "monthly" },
      { path: "/iletisim", priority: "0.7", freq: "monthly" },
      { path: "/blog", priority: "0.9", freq: "weekly" },
    ];

    const staticUrlsXml = staticPages
      .map(
        (page) => `
  <url>
    <loc>${escapeXml(baseUrl)}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${staticUrlsXml}
${blogUrls.join("")}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeXml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
