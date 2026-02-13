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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const now = new Date();

    // Calculate time windows
    // 24h reminder: appointments between 23-25 hours from now
    const h24From = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const h24To = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // 2h reminder: appointments between 1-3 hours from now
    const h2From = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const h2To = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const dateFrom24 = h24From.toISOString().split("T")[0];
    const dateTo24 = h24To.toISOString().split("T")[0];
    const dateFrom2 = h2From.toISOString().split("T")[0];
    const dateTo2 = h2To.toISOString().split("T")[0];

    // Get confirmed appointments in the 24h window
    const { data: appts24 } = await supabase
      .from("appointments")
      .select("*")
      .eq("status", "confirmed")
      .gte("appointment_date", dateFrom24)
      .lte("appointment_date", dateTo24);

    // Get confirmed appointments in the 2h window
    const { data: appts2 } = await supabase
      .from("appointments")
      .select("*")
      .eq("status", "confirmed")
      .gte("appointment_date", dateFrom2)
      .lte("appointment_date", dateTo2);

    let sentCount = 0;

    // Process 24h reminders
    for (const appt of appts24 || []) {
      // Check if already sent
      const { data: existing } = await supabase
        .from("notification_logs")
        .select("id")
        .eq("appointment_id", appt.id)
        .eq("event_type", "reminder_24h")
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Verify the appointment is actually ~24h away using timezone
      const apptDatetime = new Date(`${appt.appointment_date}T${appt.start_time}:00`);
      const diffMs = apptDatetime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 23 || diffHours > 25) continue;

      // Send notification
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          project_id: appt.project_id,
          appointment_id: appt.id,
          event_type: "reminder_24h",
          appointment_data: {
            client_name: appt.client_name,
            client_email: appt.client_email,
            client_phone: appt.client_phone,
            date: appt.appointment_date,
            start_time: appt.start_time,
            end_time: appt.end_time,
            status: appt.status,
          },
        }),
      });
      sentCount++;
    }

    // Process 2h reminders
    for (const appt of appts2 || []) {
      const { data: existing } = await supabase
        .from("notification_logs")
        .select("id")
        .eq("appointment_id", appt.id)
        .eq("event_type", "reminder_2h")
        .limit(1);

      if (existing && existing.length > 0) continue;

      const apptDatetime = new Date(`${appt.appointment_date}T${appt.start_time}:00`);
      const diffMs = apptDatetime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 1 || diffHours > 3) continue;

      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          project_id: appt.project_id,
          appointment_id: appt.id,
          event_type: "reminder_2h",
          appointment_data: {
            client_name: appt.client_name,
            client_email: appt.client_email,
            client_phone: appt.client_phone,
            date: appt.appointment_date,
            start_time: appt.start_time,
            end_time: appt.end_time,
            status: appt.status,
          },
        }),
      });
      sentCount++;
    }

    return json({ success: true, reminders_sent: sentCount });
  } catch (err) {
    console.error("process-reminders error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
