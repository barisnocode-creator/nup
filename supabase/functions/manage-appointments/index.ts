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
    // GET
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

      if (type === "notes") {
        const dateFrom = url.searchParams.get("date_from");
        const dateTo = url.searchParams.get("date_to");
        let query = supabase
          .from("agenda_notes")
          .select("*")
          .eq("project_id", projectId)
          .eq("user_id", userId)
          .order("note_date", { ascending: true });
        if (dateFrom) query = query.gte("note_date", dateFrom);
        if (dateTo) query = query.lte("note_date", dateTo);
        const { data } = await query;
        return json({ notes: data || [] });
      }

      // Randevuları getir (with optional date range)
      const status = url.searchParams.get("status");
      const dateFrom = url.searchParams.get("date_from");
      const dateTo = url.searchParams.get("date_to");
      let query = supabase
        .from("appointments")
        .select("*")
        .eq("project_id", projectId)
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (status) query = query.eq("status", status);
      if (dateFrom) query = query.gte("appointment_date", dateFrom);
      if (dateTo) query = query.lte("appointment_date", dateTo);

      const { data } = await query;
      return json({ appointments: data || [] });
    }

    // PATCH: Update appointment
    if (req.method === "PATCH") {
      const body = await req.json();
      const { appointment_id, status, internal_note } = body;

      if (!appointment_id) {
        return json({ error: "appointment_id required" }, 400);
      }

      const updates: Record<string, unknown> = {};
      if (status) {
        if (!["confirmed", "cancelled", "pending"].includes(status)) {
          return json({ error: "Invalid status" }, 400);
        }
        updates.status = status;
      }
      if (internal_note !== undefined) {
        updates.internal_note = internal_note;
      }

      if (Object.keys(updates).length === 0) {
        return json({ error: "No valid fields to update" }, 400);
      }

      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", appointment_id)
        .eq("project_id", projectId)
        .select()
        .single();

      if (error) return json({ error: "Failed to update" }, 500);
      return json({ appointment: data });
    }

    // PUT: Update settings
    if (req.method === "PUT") {
      const body = await req.json();
      const allowedFields = [
        "is_enabled", "timezone", "slot_duration_minutes", "buffer_minutes",
        "working_days", "working_hours_start", "working_hours_end",
        "lunch_break_start", "lunch_break_end", "max_advance_days",
        "day_schedules", "form_fields", "consent_text", "consent_required"
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

    // POST: Action-based
    if (req.method === "POST") {
      const body = await req.json();
      const action = body.action || "block_date";

      // Create appointment manually
      if (action === "create_appointment") {
        const { appointment_date, start_time, end_time, client_name, client_email, client_phone, client_note, status: apptStatus, internal_note } = body;
        if (!appointment_date || !start_time || !end_time || !client_name || !client_email) {
          return json({ error: "Missing required fields" }, 400);
        }

        const { data, error } = await supabase
          .from("appointments")
          .insert({
            project_id: projectId,
            appointment_date,
            start_time,
            end_time,
            client_name,
            client_email,
            client_phone: client_phone || null,
            client_note: client_note || null,
            internal_note: internal_note || null,
            status: apptStatus || "confirmed",
            consent_given: true,
          })
          .select()
          .single();

        if (error) return json({ error: "Failed to create appointment" }, 500);
        return json({ appointment: data }, 201);
      }

      // Agenda notes CRUD
      if (action === "create_note") {
        const { note_date, content } = body;
        if (!note_date || !content) return json({ error: "note_date and content required" }, 400);
        const { data, error } = await supabase
          .from("agenda_notes")
          .insert({ project_id: projectId, user_id: userId, note_date, content })
          .select()
          .single();
        if (error) return json({ error: "Failed to create note" }, 500);
        return json({ note: data }, 201);
      }

      if (action === "update_note") {
        const { note_id, content } = body;
        if (!note_id || !content) return json({ error: "note_id and content required" }, 400);
        const { data, error } = await supabase
          .from("agenda_notes")
          .update({ content })
          .eq("id", note_id)
          .eq("project_id", projectId)
          .eq("user_id", userId)
          .select()
          .single();
        if (error) return json({ error: "Failed to update note" }, 500);
        return json({ note: data });
      }

      if (action === "delete_note") {
        const { note_id } = body;
        if (!note_id) return json({ error: "note_id required" }, 400);
        await supabase
          .from("agenda_notes")
          .delete()
          .eq("id", note_id)
          .eq("project_id", projectId)
          .eq("user_id", userId);
        return json({ success: true });
      }

      // Block date (default action, backward compatible)
      const { blocked_date, reason, block_type, block_start_time, block_end_time } = body;
      if (!blocked_date) return json({ error: "blocked_date required" }, 400);

      const insertData: Record<string, unknown> = {
        project_id: projectId,
        user_id: userId,
        blocked_date,
        reason: reason || null,
        block_type: block_type || "full_day",
      };

      if ((block_type || "full_day") === "time_range") {
        if (!block_start_time || !block_end_time) {
          return json({ error: "block_start_time and block_end_time required for time_range" }, 400);
        }
        insertData.block_start_time = block_start_time;
        insertData.block_end_time = block_end_time;
      }

      const { data, error } = await supabase
        .from("blocked_slots")
        .insert(insertData)
        .select()
        .single();

      if (error) return json({ error: "Failed to block date" }, 500);
      return json({ blocked_slot: data }, 201);
    }

    // DELETE
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
