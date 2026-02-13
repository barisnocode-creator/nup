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

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
  breaks: { start: string; end: string }[];
}

interface BlockedSlot {
  id: string;
  blocked_date: string;
  block_type: string;
  block_start_time: string | null;
  block_end_time: string | null;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  system: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
}

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function generateSlots(
  startMin: number, endMin: number, duration: number, buffer: number,
  breaks: { start: string; end: string }[]
): string[] {
  const slots: string[] = [];
  const breakRanges = breaks.map(b => ({ s: timeToMin(b.start), e: timeToMin(b.end) }));
  for (let t = startMin; t + duration <= endMin; t += duration + buffer) {
    const slotEnd = t + duration;
    const inBreak = breakRanges.some(br => t < br.e && slotEnd > br.s);
    if (!inBreak) slots.push(minToTime(t));
  }
  return slots;
}

function getNowInTimezone(tz: string): { hours: number; minutes: number } {
  const nowStr = new Date().toLocaleString("en-US", { timeZone: tz, hour12: false });
  const timePart = nowStr.split(", ")[1] || nowStr;
  const [h, m] = timePart.split(":").map(Number);
  return { hours: h === 24 ? 0 : h, minutes: m };
}

function getTodayInTimezone(tz: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}

function sanitize(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim().slice(0, 500);
  return str.replace(/<[^>]*>/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const projectId = url.searchParams.get("project_id");
      const dateStr = url.searchParams.get("date");

      if (!projectId || !dateStr) return json({ error: "project_id and date are required" }, 400);

      const { data: settings, error: settingsErr } = await supabase
        .from("appointment_settings").select("*")
        .eq("project_id", projectId).eq("is_enabled", true).single();

      if (settingsErr || !settings) return json({ error: "Appointment system not available" }, 404);

      const tz = settings.timezone || "Europe/Istanbul";
      const todayStr = getTodayInTimezone(tz);
      const dateObj = new Date(dateStr + "T00:00:00");
      const dayOfWeek = dateObj.getDay();

      const todayDate = new Date(todayStr + "T00:00:00");
      const targetDate = new Date(dateStr + "T00:00:00");
      const diffDays = Math.ceil((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return json({ slots: [], message: "Cannot book past dates" });
      if (diffDays > settings.max_advance_days) return json({ slots: [], message: "Date too far in advance" });

      let dayStart: number, dayEnd: number, dayEnabled: boolean;
      let breaks: { start: string; end: string }[] = [];
      const daySchedules = settings.day_schedules as Record<string, DaySchedule> | null;

      if (daySchedules && daySchedules[String(dayOfWeek)]) {
        const ds = daySchedules[String(dayOfWeek)];
        dayEnabled = ds.enabled;
        dayStart = ds.start ? timeToMin(ds.start) : 0;
        dayEnd = ds.end ? timeToMin(ds.end) : 0;
        breaks = ds.breaks || [];
      } else {
        const workingDays = settings.working_days as number[];
        dayEnabled = workingDays.includes(dayOfWeek);
        dayStart = timeToMin(settings.working_hours_start);
        dayEnd = timeToMin(settings.working_hours_end);
        if (settings.lunch_break_start && settings.lunch_break_end) {
          breaks = [{ start: settings.lunch_break_start, end: settings.lunch_break_end }];
        }
      }

      if (!dayEnabled) return json({ slots: [], message: "Not a working day" });

      const { data: blocked } = await supabase
        .from("blocked_slots").select("id, blocked_date, block_type, block_start_time, block_end_time")
        .eq("project_id", projectId).eq("blocked_date", dateStr);

      const fullDayBlocked = (blocked || []).some(
        (b: BlockedSlot) => b.block_type === "full_day" || b.block_type === "vacation"
      );
      if (fullDayBlocked) return json({ slots: [], message: "This date is blocked" });

      const timeRangeBlocks = (blocked || []).filter(
        (b: BlockedSlot) => b.block_type === "time_range" && b.block_start_time && b.block_end_time
      );
      const allBreaks = [
        ...breaks,
        ...timeRangeBlocks.map((b: BlockedSlot) => ({ start: b.block_start_time!, end: b.block_end_time! })),
      ];

      const duration = settings.slot_duration_minutes;
      const buffer = settings.buffer_minutes;
      let slots = generateSlots(dayStart, dayEnd, duration, buffer, allBreaks);

      if (dateStr === todayStr) {
        const now = getNowInTimezone(tz);
        const nowMin = now.hours * 60 + now.minutes;
        slots = slots.filter(s => timeToMin(s) > nowMin);
      }

      const { data: booked } = await supabase
        .from("appointments").select("start_time")
        .eq("project_id", projectId).eq("appointment_date", dateStr).neq("status", "cancelled");

      const bookedTimes = new Set((booked || []).map((a: { start_time: string }) => a.start_time));
      const availableSlots = slots.filter(s => !bookedTimes.has(s));

      // Return form_fields and consent settings along with slots
      const formFields = settings.form_fields as FormField[] | null;
      const consentRequired = settings.consent_required ?? true;
      const consentText = settings.consent_text || null;

      return json({
        slots: availableSlots,
        duration,
        timezone: tz,
        form_fields: formFields,
        consent_required: consentRequired,
        consent_text: consentText,
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const {
        project_id, date, start_time,
        client_name, client_email, client_phone, client_note,
        form_data: customFormData, consent_given,
        honeypot, form_loaded_at,
      } = body;

      // Anti-spam: honeypot check - return fake success to mislead bots
      if (honeypot) {
        return json({ success: true, appointment: { id: "fake" } }, 201);
      }

      // Anti-spam: timing check
      if (form_loaded_at) {
        const loadedAt = new Date(form_loaded_at).getTime();
        const now = Date.now();
        if (now - loadedAt < 3000) {
          return json({ error: "Lütfen formu dikkatlice doldurun" }, 400);
        }
      }

      if (!project_id || !date || !start_time || !client_name || !client_email) {
        return json({ error: "Missing required fields" }, 400);
      }

      const { data: settings } = await supabase
        .from("appointment_settings").select("*")
        .eq("project_id", project_id).eq("is_enabled", true).single();

      if (!settings) return json({ error: "Appointment system not available" }, 404);

      // Consent check
      const consentRequired = settings.consent_required ?? true;
      if (consentRequired && !consent_given) {
        return json({ error: "Gizlilik onayı gereklidir" }, 400);
      }

      // Dynamic form field validation
      const formFields = settings.form_fields as FormField[] | null;
      if (formFields) {
        for (const field of formFields) {
          if (!field.required || field.system) continue;
          const value = customFormData?.[field.id];
          if (!value || String(value).trim() === "") {
            return json({ error: `${field.label} alanı zorunludur` }, 400);
          }
        }
      }

      const tz = settings.timezone || "Europe/Istanbul";
      const duration = settings.slot_duration_minutes;
      const slotStartMin = timeToMin(start_time);
      const endMinTotal = slotStartMin + duration;
      const endTime = minToTime(endMinTotal);

      const dateObj = new Date(date + "T00:00:00");
      const dayOfWeek = dateObj.getDay();
      const daySchedules = settings.day_schedules as Record<string, DaySchedule> | null;

      let dayEnabled: boolean, dayStart: number, dayEnd: number;
      let breaks: { start: string; end: string }[] = [];

      if (daySchedules && daySchedules[String(dayOfWeek)]) {
        const ds = daySchedules[String(dayOfWeek)];
        dayEnabled = ds.enabled;
        dayStart = ds.start ? timeToMin(ds.start) : 0;
        dayEnd = ds.end ? timeToMin(ds.end) : 0;
        breaks = ds.breaks || [];
      } else {
        const workingDays = settings.working_days as number[];
        dayEnabled = workingDays.includes(dayOfWeek);
        dayStart = timeToMin(settings.working_hours_start);
        dayEnd = timeToMin(settings.working_hours_end);
        if (settings.lunch_break_start && settings.lunch_break_end) {
          breaks = [{ start: settings.lunch_break_start, end: settings.lunch_break_end }];
        }
      }

      if (!dayEnabled) return json({ error: "Not a working day" }, 400);
      if (slotStartMin < dayStart || endMinTotal > dayEnd) return json({ error: "Outside working hours" }, 400);

      const inBreak = breaks.some(br => slotStartMin < timeToMin(br.end) && endMinTotal > timeToMin(br.start));
      if (inBreak) return json({ error: "Conflicts with break time" }, 400);

      const { data: blocked } = await supabase
        .from("blocked_slots").select("id, block_type, block_start_time, block_end_time")
        .eq("project_id", project_id).eq("blocked_date", date);

      const fullBlocked = (blocked || []).some(
        (b: { block_type: string }) => b.block_type === "full_day" || b.block_type === "vacation"
      );
      if (fullBlocked) return json({ error: "This date is blocked" }, 400);

      const timeBlocked = (blocked || []).some(
        (b: { block_type: string; block_start_time: string | null; block_end_time: string | null }) =>
          b.block_type === "time_range" && b.block_start_time && b.block_end_time &&
          slotStartMin < timeToMin(b.block_end_time!) && endMinTotal > timeToMin(b.block_start_time!)
      );
      if (timeBlocked) return json({ error: "Time range is blocked" }, 400);

      const todayStr = getTodayInTimezone(tz);
      const todayDate = new Date(todayStr + "T00:00:00");
      const targetDate = new Date(date + "T00:00:00");
      const diffDays = Math.ceil((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return json({ error: "Cannot book past dates" }, 400);
      if (diffDays > settings.max_advance_days) return json({ error: "Date too far in advance" }, 400);

      if (date === todayStr) {
        const now = getNowInTimezone(tz);
        if (slotStartMin <= now.hours * 60 + now.minutes) {
          return json({ error: "Cannot book past time slots" }, 400);
        }
      }

      const { data: overlap } = await supabase
        .from("appointments").select("id")
        .eq("project_id", project_id).eq("appointment_date", date)
        .neq("status", "cancelled").lt("start_time", endTime).gt("end_time", start_time);

      if (overlap && overlap.length > 0) return json({ error: "Time slot already booked" }, 409);

      // Sanitize custom form data
      const sanitizedFormData: Record<string, string> = {};
      if (customFormData && typeof customFormData === "object") {
        for (const [key, val] of Object.entries(customFormData)) {
          sanitizedFormData[key] = sanitize(val);
        }
      }

      const { data: appointment, error: insertErr } = await supabase
        .from("appointments").insert({
          project_id,
          client_name: sanitize(client_name),
          client_email: sanitize(client_email),
          client_phone: client_phone ? sanitize(client_phone) : null,
          client_note: client_note ? sanitize(client_note) : null,
          appointment_date: date,
          start_time, end_time: endTime,
          status: "pending", timezone: tz,
          form_data: Object.keys(sanitizedFormData).length > 0 ? sanitizedFormData : null,
          consent_given: !!consent_given,
        }).select().single();

      if (insertErr) return json({ error: "Failed to create appointment" }, 500);

      // Trigger new appointment notification
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${serviceRoleKey}` },
          body: JSON.stringify({
            project_id,
            appointment_id: appointment.id,
            event_type: "new_appointment",
            appointment_data: {
              client_name: sanitize(client_name),
              client_email: sanitize(client_email),
              client_phone: client_phone ? sanitize(client_phone) : "",
              date,
              start_time,
              end_time: endTime,
              status: "pending",
            },
          }),
        });
      } catch (e) {
        console.error("Notification trigger failed:", e);
      }

      return json({ success: true, appointment }, 201);
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("book-appointment error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
