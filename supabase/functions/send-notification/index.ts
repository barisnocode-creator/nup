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

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

const STATUS_TR: Record<string, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  cancelled: "İptal Edildi",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const { project_id, appointment_id, event_type, appointment_data } = body;

    if (!project_id || !event_type) {
      return json({ error: "project_id and event_type required" }, 400);
    }

    // Get project info
    const { data: project } = await supabase
      .from("projects")
      .select("id, user_id, name")
      .eq("id", project_id)
      .single();

    if (!project) return json({ error: "Project not found" }, 404);

    // Get provider profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, preferences")
      .eq("user_id", project.user_id)
      .single();

    // Check notification settings
    const { data: settings } = await supabase
      .from("appointment_settings")
      .select("notification_email_enabled, reminder_24h_enabled, reminder_2h_enabled")
      .eq("project_id", project_id)
      .single();

    // Skip reminders if disabled
    if (event_type === "reminder_24h" && settings && !settings.reminder_24h_enabled) {
      return json({ skipped: true, reason: "24h reminder disabled" });
    }
    if (event_type === "reminder_2h" && settings && !settings.reminder_2h_enabled) {
      return json({ skipped: true, reason: "2h reminder disabled" });
    }

    // Get templates for this event
    const { data: templates } = await supabase
      .from("notification_templates")
      .select("*")
      .eq("project_id", project_id)
      .eq("event_type", event_type)
      .eq("is_enabled", true);

    if (!templates || templates.length === 0) {
      return json({ skipped: true, reason: "No enabled templates" });
    }

    // Build template variables
    const vars: Record<string, string> = {
      client_name: appointment_data?.client_name || "",
      client_email: appointment_data?.client_email || "",
      client_phone: appointment_data?.client_phone || "",
      date: appointment_data?.date || appointment_data?.appointment_date || "",
      time: appointment_data?.start_time || appointment_data?.time || "",
      end_time: appointment_data?.end_time || "",
      status: STATUS_TR[appointment_data?.status || "pending"] || appointment_data?.status || "",
      project_name: project.name || "",
      provider_name: profile?.display_name || "",
    };

    const results: { target: string; channel: string; status: string }[] = [];

    for (const template of templates) {
      const filledSubject = fillTemplate(template.subject, vars);
      const filledBody = fillTemplate(template.body_template, vars);

      if (template.target === "provider" && template.channel === "in_app") {
        // Create in-app notification for provider
        const { data: notification, error: notifErr } = await supabase
          .from("notifications")
          .insert({
            user_id: project.user_id,
            project_id,
            appointment_id: appointment_id || null,
            type: event_type,
            title: filledSubject,
            body: filledBody,
            channel: "in_app",
          })
          .select("id")
          .single();

        // Log it
        await supabase.from("notification_logs").insert({
          notification_id: notification?.id || null,
          project_id,
          appointment_id: appointment_id || null,
          event_type,
          channel: "in_app",
          recipient_email: null,
          recipient_type: "provider",
          status: notifErr ? "failed" : "sent",
          error_message: notifErr?.message || null,
        });

        results.push({ target: "provider", channel: "in_app", status: notifErr ? "failed" : "sent" });
      }

      if (template.target === "client" && template.channel === "email") {
        // Email sending - currently logged as pending (no email service yet)
        // When Resend API key is added, actual email sending will happen here
        const emailEnabled = settings?.notification_email_enabled ?? true;

        await supabase.from("notification_logs").insert({
          project_id,
          appointment_id: appointment_id || null,
          event_type,
          channel: "email",
          recipient_email: vars.client_email,
          recipient_type: "client",
          status: emailEnabled ? "pending" : "skipped",
          error_message: emailEnabled ? "Email service not configured" : "Email notifications disabled",
        });

        results.push({ target: "client", channel: "email", status: emailEnabled ? "pending" : "skipped" });
      }

      // Provider email notifications
      if (template.target === "provider" && template.channel === "email") {
        await supabase.from("notification_logs").insert({
          project_id,
          appointment_id: appointment_id || null,
          event_type,
          channel: "email",
          recipient_email: null,
          recipient_type: "provider",
          status: "pending",
          error_message: "Email service not configured",
        });
        results.push({ target: "provider", channel: "email", status: "pending" });
      }

      // Client in-app (future - clients don't have accounts yet)
      if (template.target === "client" && template.channel === "in_app") {
        // Skip - clients don't have user accounts
      }
    }

    return json({ success: true, results });
  } catch (err) {
    console.error("send-notification error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
