import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // Max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  return false;
}

// Allowed event types whitelist
const ALLOWED_EVENT_TYPES = ['page_view', 'click', 'scroll', 'form_submit'];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Rate limit check
    if (isRateLimited(clientIp)) {
      console.log(`Rate limited IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { project_id, event_type, page_path, user_agent, device_type, visitor_id } = body;

    // Validate required fields
    if (!project_id) {
      return new Response(
        JSON.stringify({ error: "project_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate event_type
    if (!event_type || !ALLOWED_EVENT_TYPES.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid event_type. Allowed: ${ALLOWED_EVENT_TYPES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate page_path length
    if (page_path && page_path.length > 500) {
      return new Response(
        JSON.stringify({ error: "page_path too long (max 500 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role (to bypass RLS for validation)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the project exists and get ownership info
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, is_published, user_id")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      console.log(`Project not found: ${project_id}`);
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is the project owner (for unpublished projects)
    let isOwner = false;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const authClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const token = authHeader.replace("Bearer ", "");
        const { data: claimsData } = await authClient.auth.getClaims(token);
        if (claimsData?.claims?.sub === project.user_id) {
          isOwner = true;
        }
      } catch {
        // Ignore auth errors - user is not authenticated
      }
    }

    // Allow analytics for published projects OR project owners viewing their own projects
    if (!project.is_published && !isOwner) {
      console.log(`Attempted analytics for unpublished project: ${project_id}`);
      return new Response(
        JSON.stringify({ error: "Project is not published" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the analytics event (trigger will anonymize visitor_id and user_agent)
    const { error: insertError } = await supabase
      .from("analytics_events")
      .insert({
        project_id,
        event_type,
        page_path: page_path || null,
        user_agent: user_agent || null,
        device_type: device_type || null,
        visitor_id: visitor_id || null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to track event" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Tracked ${event_type} for project ${project_id} from ${clientIp}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in track-analytics:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
