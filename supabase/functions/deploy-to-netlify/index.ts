import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChaiBlock {
  _id: string;
  _type: string;
  _name?: string;
  [key: string]: unknown;
}

// Convert chai blocks to static HTML
function blocksToHtml(blocks: ChaiBlock[], theme: Record<string, unknown>, projectName: string): string {
  // Extract theme colors
  const primaryColor = (theme?.primaryColor as string) || "#6366f1";
  const fontFamily = (theme?.fontFamily as string) || "Inter, sans-serif";
  const bodyBg = (theme?.bodyBg as string) || "#ffffff";
  const bodyText = (theme?.bodyText as string) || "#1f2937";

  // Build HTML from blocks - render each block as a section
  let sectionsHtml = "";

  for (const block of blocks) {
    const blockType = block._type || "Box";
    const content = renderBlock(block, blocks);
    if (content) {
      sectionsHtml += content;
    }
  }

  // If no renderable blocks, show placeholder
  if (!sectionsHtml.trim()) {
    sectionsHtml = `<section class="min-h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-4xl font-bold">${escapeHtml(projectName)}</h1><p class="mt-4 text-gray-600">Website coming soon</p></div></section>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectName)}</title>
  <meta name="description" content="${escapeHtml(projectName)} - Professional Website">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${primaryColor};
    }
    body {
      font-family: ${fontFamily};
      background-color: ${bodyBg};
      color: ${bodyText};
      margin: 0;
      padding: 0;
    }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBlock(block: ChaiBlock, allBlocks: ChaiBlock[]): string {
  const type = block._type;

  // Get children blocks
  const children = allBlocks.filter((b) => (b._parent as string) === block._id);
  // Skip child blocks at top level (they'll be rendered inside their parent)
  if (block._parent) return "";

  // Render based on _type and known props
  const styles = (block._styles_attrs as Record<string, string>) || {};
  const className = styles?.className || "";
  const content = (block._content as string) || (block.content as string) || "";
  const tag = (block._tag as string) || "div";

  // Recursively render children
  let childrenHtml = "";
  for (const child of children) {
    childrenHtml += renderChildBlock(child, allBlocks);
  }

  const innerHtml = content || childrenHtml;

  if (!innerHtml.trim() && children.length === 0) {
    // Try to extract any text-like props
    const text = (block.title as string) || (block.heading as string) || (block.text as string) || "";
    if (text) {
      return `<${tag} class="${escapeHtml(className)}">${escapeHtml(text)}</${tag}>`;
    }
    return "";
  }

  return `<${tag} class="${escapeHtml(className)}">${innerHtml}</${tag}>`;
}

function renderChildBlock(block: ChaiBlock, allBlocks: ChaiBlock[]): string {
  const styles = (block._styles_attrs as Record<string, string>) || {};
  const className = styles?.className || "";
  const content = (block._content as string) || (block.content as string) || "";
  const tag = (block._tag as string) || "div";

  const children = allBlocks.filter((b) => (b._parent as string) === block._id);
  let childrenHtml = "";
  for (const child of children) {
    childrenHtml += renderChildBlock(child, allBlocks);
  }

  const innerHtml = content || childrenHtml;

  if (block._type === "Image" || block._type === "image") {
    const src = (block._src as string) || (block.src as string) || "";
    const alt = (block._alt as string) || (block.alt as string) || "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${escapeHtml(className)}" />`;
  }

  if (block._type === "Link" || block._type === "link") {
    const href = (block._href as string) || (block.href as string) || "#";
    return `<a href="${escapeHtml(href)}" class="${escapeHtml(className)}">${innerHtml || escapeHtml((block._content as string) || "")}</a>`;
  }

  const text = (block.title as string) || (block.heading as string) || (block.text as string) || "";

  return `<${tag} class="${escapeHtml(className)}">${innerHtml || escapeHtml(text)}</${tag}>`;
}

// Create a simple zip file with just index.html
// Netlify accepts file digest deploys - we'll use the simpler approach
async function createDeployPayload(htmlContent: string): Promise<{ sha1: string; content: Uint8Array }> {
  const encoder = new TextEncoder();
  const content = encoder.encode(htmlContent);

  // Calculate SHA1 hash
  const hashBuffer = await crypto.subtle.digest("SHA-1", content);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha1 = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return { sha1, content };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NETLIFY_API_TOKEN = Deno.env.get("NETLIFY_API_TOKEN");
    if (!NETLIFY_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Netlify API token is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth check
    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch project and verify ownership
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const chaiBlocks = (project.chai_blocks as ChaiBlock[]) || [];
    const chaiTheme = (project.chai_theme as Record<string, unknown>) || {};

    // Generate static HTML
    const html = blocksToHtml(chaiBlocks, chaiTheme, project.name);

    // Prepare file for Netlify deploy
    const { sha1, content } = await createDeployPayload(html);

    let netlifySiteId = project.netlify_site_id;

    // Step 1: Create site if it doesn't exist
    if (!netlifySiteId) {
      const createRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `openlucius-${project.subdomain || projectId.slice(0, 8)}`,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Netlify create site error:", errText);
        return new Response(
          JSON.stringify({ error: "Failed to create Netlify site", details: errText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const siteData = await createRes.json();
      netlifySiteId = siteData.id;

      // Save site id
      await supabaseAdmin
        .from("projects")
        .update({
          netlify_site_id: netlifySiteId,
          netlify_url: siteData.ssl_url || siteData.url,
        })
        .eq("id", projectId);
    }

    // Step 2: Deploy using file digest approach
    const deployRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${netlifySiteId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "/index.html": sha1,
          },
        }),
      }
    );

    if (!deployRes.ok) {
      const errText = await deployRes.text();
      console.error("Netlify deploy error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to deploy to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deployData = await deployRes.json();
    const deployId = deployData.id;

    // Step 3: Upload the file
    const uploadRes = await fetch(
      `https://api.netlify.com/api/v1/deploys/${deployId}/files/index.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: content,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Netlify file upload error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to upload file to Netlify", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get final deploy URL
    const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${netlifySiteId}`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });
    const siteInfo = await siteRes.json();
    const netlifyUrl = siteInfo.ssl_url || siteInfo.url;

    // Check if project has a verified custom domain and set it on Netlify
    const { data: verifiedDomain } = await supabaseAdmin
      .from("custom_domains")
      .select("domain")
      .eq("project_id", projectId)
      .eq("status", "verified")
      .limit(1)
      .single();

    let netlifyCustomDomain = project.netlify_custom_domain;

    if (verifiedDomain?.domain && !netlifyCustomDomain) {
      try {
        const domainRes = await fetch(
          `https://api.netlify.com/api/v1/sites/${netlifySiteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ custom_domain: verifiedDomain.domain }),
          }
        );

        if (domainRes.ok) {
          netlifyCustomDomain = verifiedDomain.domain;
          console.log(`Custom domain set on Netlify: ${verifiedDomain.domain}`);
        } else {
          console.error("Failed to set custom domain on Netlify:", await domainRes.text());
        }
      } catch (domainErr) {
        console.error("Error setting custom domain:", domainErr);
      }
    }

    // Update project with netlify URL
    await supabaseAdmin
      .from("projects")
      .update({
        netlify_url: netlifyUrl,
        netlify_custom_domain: netlifyCustomDomain,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return new Response(
      JSON.stringify({
        success: true,
        netlifyUrl,
        netlifyCustomDomain,
        siteId: netlifySiteId,
        deployId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deploy error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
