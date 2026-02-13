import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function authenticate(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return null;
  return data.claims.sub as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const userId = await authenticate(req);
  if (!userId) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const projectId = url.searchParams.get("project_id");

  if (!projectId) return json({ error: "project_id required" }, 400);

  // Proje sahipliği kontrolü
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (!project) return json({ error: "Not authorized for this project" }, 403);

  try {
    // GET: Randevuları ve ayarları getir
    if (req.method === "GET") {
      const type = url.searchParams.get("type") || "appointments";

      if (type === "settings") {
        const { data } = await supabase
          .from("appointment_settings")
          .select("*")
          .eq("project_id", projectId)
          .single();
        return json({ settings: data });
      }

      if (type === "blocked") {
        const { data } = await supabase
          .from("blocked_slots")
          .select("*")
          .eq("project_id", projectId)
          .order("blocked_date", { ascending: true });
        return json({ blocked_slots: data || [] });
      }

      // Randevuları getir
      const status = url.searchParams.get("status");
      let query = supabase
        .from("appointments")
        .select("*")
        .eq("project_id", projectId)
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (status) query = query.eq("status", status);

      const { data } = await query;
      return json({ appointments: data || [] });
    }

    // PATCH: Randevu durumunu güncelle
    if (req.method === "PATCH") {
      const body = await req.json();
      const { appointment_id, status } = body;

      if (!appointment_id || !status) {
        return json({ error: "appointment_id and status required" }, 400);
      }

      if (!["confirmed", "cancelled", "pending"].includes(status)) {
        return json({ error: "Invalid status" }, 400);
      }

      const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointment_id)
        .eq("project_id", projectId)
        .select()
        .single();

      if (error) return json({ error: "Failed to update" }, 500);
      return json({ appointment: data });
    }

    // PUT: Ayarları güncelle
    if (req.method === "PUT") {
      const body = await req.json();
      const allowedFields = [
        "is_enabled", "timezone", "slot_duration_minutes", "buffer_minutes",
        "working_days", "working_hours_start", "working_hours_end",
        "lunch_break_start", "lunch_break_end", "max_advance_days"
      ];

      const updates: Record<string, unknown> = {};
      for (const key of allowedFields) {
        if (body[key] !== undefined) updates[key] = body[key];
      }

      if (Object.keys(updates).length === 0) {
        return json({ error: "No valid fields to update" }, 400);
      }

      const { data, error } = await supabase
        .from("appointment_settings")
        .update(updates)
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) return json({ error: "Failed to update settings" }, 500);
      return json({ settings: data });
    }

    // POST: Tarih blokla
    if (req.method === "POST") {
      const body = await req.json();
      const { blocked_date, reason } = body;

      if (!blocked_date) return json({ error: "blocked_date required" }, 400);

      const { data, error } = await supabase
        .from("blocked_slots")
        .insert({
          project_id: projectId,
          user_id: userId,
          blocked_date,
          reason: reason || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") return json({ error: "Date already blocked" }, 409);
        return json({ error: "Failed to block date" }, 500);
      }
      return json({ blocked_slot: data }, 201);
    }

    // DELETE: Bloklu tarihi kaldır
    if (req.method === "DELETE") {
      const blockId = url.searchParams.get("block_id");
      if (!blockId) return json({ error: "block_id required" }, 400);

      await supabase
        .from("blocked_slots")
        .delete()
        .eq("id", blockId)
        .eq("project_id", projectId)
        .eq("user_id", userId);

      return json({ success: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("manage-appointments error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
