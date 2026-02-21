import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VERCEL_API = "https://api.vercel.com";

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

async function vercelFetch(path: string, token: string, options: RequestInit = {}) {
  const teamId = Deno.env.get("VERCEL_TEAM_ID");
  const separator = path.includes("?") ? "&" : "?";
  const url = `${VERCEL_API}${path}${teamId ? `${separator}teamId=${teamId}` : ""}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const VERCEL_TOKEN = Deno.env.get("VERCEL_API_TOKEN");

    if (!VERCEL_TOKEN) {
      throw new Error("VERCEL_API_TOKEN is not configured");
    }

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

    // Verify ownership
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id, subdomain, name, vercel_project_id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subdomain = project.subdomain || projectId.slice(0, 8);
    const projectName = `site-${subdomain}`;
    const rewriteTarget = `https://expert-page-gen.lovable.app/site/${subdomain}`;

    // Build the two files to deploy
    const vercelJson = JSON.stringify({
      rewrites: [
        { source: "/(.*)", destination: `${rewriteTarget}/$1` }
      ]
    }, null, 2);

    const indexHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${project.name || subdomain}</title></head><body></body></html>`;

    // Deploy to Vercel
    const deployPayload: Record<string, unknown> = {
      name: projectName,
      files: [
        { file: "vercel.json", data: toBase64(vercelJson) },
        { file: "index.html", data: toBase64(indexHtml) },
      ],
      projectSettings: {
        framework: null,
      },
      target: "production",
    };

    // If we already have a Vercel project, reuse it
    if (project.vercel_project_id) {
      deployPayload.project = project.vercel_project_id;
    }

    console.log(`Deploying rewrite project "${projectName}" to Vercel...`);

    const deployRes = await vercelFetch("/v13/deployments", VERCEL_TOKEN, {
      method: "POST",
      body: JSON.stringify(deployPayload),
    });

    const deployData = await deployRes.json();

    if (!deployRes.ok) {
      console.error("Vercel deploy error:", JSON.stringify(deployData));
      throw new Error(deployData.error?.message || `Vercel deploy failed (${deployRes.status})`);
    }

    const vercelUrl = `https://${deployData.url}`;
    const vercelProjectId = deployData.projectId;

    // Update database: mark published + store Vercel info
    await supabaseAdmin
      .from("projects")
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
        vercel_project_id: vercelProjectId,
        vercel_url: vercelUrl,
        subdomain: subdomain,
      })
      .eq("id", projectId);

    // Check for custom domain
    const { data: customDomain } = await supabaseAdmin
      .from("custom_domains")
      .select("domain")
      .eq("project_id", projectId)
      .in("status", ["verified", "active"])
      .limit(1)
      .maybeSingle();

    const publicUrl = `https://expert-page-gen.lovable.app/site/${subdomain}`;
    const finalUrl = customDomain?.domain
      ? `https://${customDomain.domain}`
      : vercelUrl;

    return new Response(
      JSON.stringify({
        success: true,
        url: finalUrl,
        vercelUrl,
        publicUrl,
        vercelProjectId,
        customDomain: customDomain?.domain || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Deploy error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
