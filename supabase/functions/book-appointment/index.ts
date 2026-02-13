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

  try {
    // GET: Müsait slotları getir
    if (req.method === "GET") {
      const url = new URL(req.url);
      const projectId = url.searchParams.get("project_id");
      const dateStr = url.searchParams.get("date"); // YYYY-MM-DD

      if (!projectId || !dateStr) {
        return json({ error: "project_id and date are required" }, 400);
      }

      // Ayarları al
      const { data: settings, error: settingsErr } = await supabase
        .from("appointment_settings")
        .select("*")
        .eq("project_id", projectId)
        .eq("is_enabled", true)
        .single();

      if (settingsErr || !settings) {
        return json({ error: "Appointment system not available" }, 404);
      }

      // Gün kontrolü
      const dateObj = new Date(dateStr + "T00:00:00");
      const dayOfWeek = dateObj.getDay(); // 0=Pazar
      const workingDays = settings.working_days as number[];
      if (!workingDays.includes(dayOfWeek)) {
        return json({ slots: [], message: "Not a working day" });
      }

      // Bloklu gün kontrolü
      const { data: blocked } = await supabase
        .from("blocked_slots")
        .select("id")
        .eq("project_id", projectId)
        .eq("blocked_date", dateStr);

      if (blocked && blocked.length > 0) {
        return json({ slots: [], message: "This date is blocked" });
      }

      // max_advance_days kontrolü
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(dateStr + "T00:00:00");
      const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        return json({ slots: [], message: "Cannot book past dates" });
      }
      if (diffDays > settings.max_advance_days) {
        return json({ slots: [], message: "Date too far in advance" });
      }

      // Slot üret
      const slots: string[] = [];
      const [startH, startM] = settings.working_hours_start.split(":").map(Number);
      const [endH, endM] = settings.working_hours_end.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const duration = settings.slot_duration_minutes;
      const buffer = settings.buffer_minutes;

      const lunchStart = settings.lunch_break_start
        ? (() => { const [h, m] = settings.lunch_break_start.split(":").map(Number); return h * 60 + m; })()
        : null;
      const lunchEnd = settings.lunch_break_end
        ? (() => { const [h, m] = settings.lunch_break_end.split(":").map(Number); return h * 60 + m; })()
        : null;

      for (let t = startMinutes; t + duration <= endMinutes; t += duration + buffer) {
        const slotEnd = t + duration;
        // Öğle arası kontrolü
        if (lunchStart !== null && lunchEnd !== null) {
          if (t < lunchEnd && slotEnd > lunchStart) continue;
        }
        const hh = String(Math.floor(t / 60)).padStart(2, "0");
        const mm = String(t % 60).padStart(2, "0");
        slots.push(`${hh}:${mm}`);
      }

      // Dolu slotları çıkar
      const { data: booked } = await supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("project_id", projectId)
        .eq("appointment_date", dateStr)
        .neq("status", "cancelled");

      const bookedTimes = new Set((booked || []).map((a: any) => a.start_time));
      const availableSlots = slots.filter(s => !bookedTimes.has(s));

      return json({
        slots: availableSlots,
        duration: settings.slot_duration_minutes,
        timezone: settings.timezone,
      });
    }

    // POST: Randevu oluştur
    if (req.method === "POST") {
      const body = await req.json();
      const { project_id, date, start_time, client_name, client_email, client_phone, client_note } = body;

      if (!project_id || !date || !start_time || !client_name || !client_email) {
        return json({ error: "Missing required fields" }, 400);
      }

      // Ayarları al
      const { data: settings } = await supabase
        .from("appointment_settings")
        .select("*")
        .eq("project_id", project_id)
        .eq("is_enabled", true)
        .single();

      if (!settings) {
        return json({ error: "Appointment system not available" }, 404);
      }

      const duration = settings.slot_duration_minutes;
      const [h, m] = start_time.split(":").map(Number);
      const endMinTotal = h * 60 + m + duration;
      const endTime = `${String(Math.floor(endMinTotal / 60)).padStart(2, "0")}:${String(endMinTotal % 60).padStart(2, "0")}`;

      // Gün kontrolü
      const dateObj = new Date(date + "T00:00:00");
      const dayOfWeek = dateObj.getDay();
      const workingDays = settings.working_days as number[];
      if (!workingDays.includes(dayOfWeek)) {
        return json({ error: "Not a working day" }, 400);
      }

      // Bloklu gün
      const { data: blocked } = await supabase
        .from("blocked_slots")
        .select("id")
        .eq("project_id", project_id)
        .eq("blocked_date", date);

      if (blocked && blocked.length > 0) {
        return json({ error: "This date is blocked" }, 400);
      }

      // Çalışma saatleri kontrolü
      const slotStartMin = h * 60 + m;
      const [wsH, wsM] = settings.working_hours_start.split(":").map(Number);
      const [weH, weM] = settings.working_hours_end.split(":").map(Number);
      if (slotStartMin < wsH * 60 + wsM || endMinTotal > weH * 60 + weM) {
        return json({ error: "Outside working hours" }, 400);
      }

      // Öğle arası kontrolü
      if (settings.lunch_break_start && settings.lunch_break_end) {
        const [lsH, lsM] = settings.lunch_break_start.split(":").map(Number);
        const [leH, leM] = settings.lunch_break_end.split(":").map(Number);
        const lunchS = lsH * 60 + lsM;
        const lunchE = leH * 60 + leM;
        if (slotStartMin < lunchE && endMinTotal > lunchS) {
          return json({ error: "Conflicts with lunch break" }, 400);
        }
      }

      // max_advance_days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(date + "T00:00:00");
      const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return json({ error: "Cannot book past dates" }, 400);
      if (diffDays > settings.max_advance_days) return json({ error: "Date too far in advance" }, 400);

      // Çakışma kontrolü
      const { data: overlap } = await supabase
        .from("appointments")
        .select("id")
        .eq("project_id", project_id)
        .eq("appointment_date", date)
        .neq("status", "cancelled")
        .lt("start_time", endTime)
        .gt("end_time", start_time);

      if (overlap && overlap.length > 0) {
        return json({ error: "Time slot already booked" }, 409);
      }

      // Randevu oluştur
      const { data: appointment, error: insertErr } = await supabase
        .from("appointments")
        .insert({
          project_id,
          client_name,
          client_email,
          client_phone: client_phone || null,
          client_note: client_note || null,
          appointment_date: date,
          start_time,
          end_time: endTime,
          status: "pending",
          timezone: settings.timezone,
        })
        .select()
        .single();

      if (insertErr) {
        return json({ error: "Failed to create appointment" }, 500);
      }

      return json({ success: true, appointment }, 201);
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("book-appointment error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
