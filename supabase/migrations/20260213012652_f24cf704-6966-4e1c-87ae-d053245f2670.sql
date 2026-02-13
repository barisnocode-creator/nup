
-- Add form_fields, consent columns to appointment_settings
ALTER TABLE public.appointment_settings
  ADD COLUMN IF NOT EXISTS form_fields jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS consent_text text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS consent_required boolean NOT NULL DEFAULT true;

-- Add form_data, consent_given to appointments
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS consent_given boolean DEFAULT false;

-- Update auto_provision trigger to include sector-based form_fields
CREATE OR REPLACE FUNCTION public.auto_provision_appointment_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_slot_duration integer;
  v_working_days jsonb;
  v_hours_start text;
  v_hours_end text;
  v_lunch_start text;
  v_lunch_end text;
  v_day_schedules jsonb;
  v_form_fields jsonb;
BEGIN
  -- Base form fields (always present)
  v_form_fields := '[
    {"id":"client_name","type":"text","label":"Adınız","required":true,"system":true,"order":0,"placeholder":"Adınızı girin"},
    {"id":"client_email","type":"email","label":"E-posta","required":true,"system":true,"order":1,"placeholder":"E-posta adresiniz"}
  ]'::jsonb;

  CASE NEW.profession
    WHEN 'health' THEN
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00'; v_hours_end := '18:00';
      v_lunch_start := '12:00'; v_lunch_end := '13:00';
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "2": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "3": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "4": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "5": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "6": {"enabled": false, "start": "", "end": "", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"complaint","type":"textarea","label":"Şikayet / Belirti","required":true,"system":false,"order":3,"placeholder":"Şikayetinizi kısaca açıklayın"},
        {"id":"previous_treatment","type":"select","label":"Önceki tedavi var mı?","required":false,"system":false,"order":4,"options":["Evet","Hayır"]}
      ]'::jsonb;

    WHEN 'service' THEN
      v_slot_duration := 60;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00'; v_hours_end := '18:00';
      v_lunch_start := '12:00'; v_lunch_end := '13:00';
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "2": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "3": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "4": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "5": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "6": {"enabled": false, "start": "", "end": "", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"subject","type":"text","label":"Konu","required":false,"system":false,"order":3,"placeholder":"Görüşme konusu"},
        {"id":"company_name","type":"text","label":"Şirket Adı","required":false,"system":false,"order":4,"placeholder":"Şirket adınız"}
      ]'::jsonb;

    WHEN 'food' THEN
      v_slot_duration := 120;
      v_working_days := '[1,2,3,4,5,6,0]'::jsonb;
      v_hours_start := '10:00'; v_hours_end := '22:00';
      v_lunch_start := NULL; v_lunch_end := NULL;
      v_day_schedules := '{
        "0": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "1": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "2": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "3": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "4": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "5": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []},
        "6": {"enabled": true, "start": "10:00", "end": "22:00", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":true,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"guest_count","type":"select","label":"Kişi Sayısı","required":true,"system":false,"order":3,"options":["1-2","3-4","5-6","7+"]},
        {"id":"special_request","type":"textarea","label":"Özel İstek","required":false,"system":false,"order":4,"placeholder":"Alerjiniz veya özel isteğiniz varsa belirtin"}
      ]'::jsonb;

    WHEN 'creative' THEN
      v_slot_duration := 45;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '10:00'; v_hours_end := '19:00';
      v_lunch_start := '12:30'; v_lunch_end := '13:30';
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "10:00", "end": "19:00", "breaks": [{"start": "12:30", "end": "13:30"}]},
        "2": {"enabled": true, "start": "10:00", "end": "19:00", "breaks": [{"start": "12:30", "end": "13:30"}]},
        "3": {"enabled": true, "start": "10:00", "end": "19:00", "breaks": [{"start": "12:30", "end": "13:30"}]},
        "4": {"enabled": true, "start": "10:00", "end": "19:00", "breaks": [{"start": "12:30", "end": "13:30"}]},
        "5": {"enabled": true, "start": "10:00", "end": "19:00", "breaks": [{"start": "12:30", "end": "13:30"}]},
        "6": {"enabled": false, "start": "", "end": "", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"project_type","type":"select","label":"Proje Türü","required":false,"system":false,"order":3,"options":["Logo","Web","Sosyal Medya","Diğer"]},
        {"id":"briefing","type":"textarea","label":"Brifing Notu","required":false,"system":false,"order":4,"placeholder":"Projeniz hakkında kısa bilgi"}
      ]'::jsonb;

    WHEN 'technology' THEN
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00'; v_hours_end := '18:00';
      v_lunch_start := '12:00'; v_lunch_end := '13:00';
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "2": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "3": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "4": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "5": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "6": {"enabled": false, "start": "", "end": "", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"subject","type":"text","label":"Konu","required":false,"system":false,"order":3,"placeholder":"Görüşme konusu"}
      ]'::jsonb;

    WHEN 'retail' THEN
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5,6]'::jsonb;
      v_hours_start := '09:00'; v_hours_end := '20:00';
      v_lunch_start := NULL; v_lunch_end := NULL;
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []},
        "2": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []},
        "3": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []},
        "4": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []},
        "5": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []},
        "6": {"enabled": true, "start": "09:00", "end": "20:00", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"subject","type":"text","label":"Konu","required":false,"system":false,"order":3,"placeholder":"Görüşme konusu"},
        {"id":"client_note","type":"textarea","label":"Not","required":false,"system":false,"order":4,"placeholder":"Eklemek istediğiniz not"}
      ]'::jsonb;

    ELSE
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00'; v_hours_end := '18:00';
      v_lunch_start := '12:00'; v_lunch_end := '13:00';
      v_day_schedules := '{
        "0": {"enabled": false, "start": "", "end": "", "breaks": []},
        "1": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "2": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "3": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "4": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "5": {"enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
        "6": {"enabled": false, "start": "", "end": "", "breaks": []}
      }'::jsonb;
      v_form_fields := v_form_fields || '[
        {"id":"client_phone","type":"tel","label":"Telefon","required":false,"system":false,"order":2,"placeholder":"Telefon numaranız"},
        {"id":"subject","type":"text","label":"Konu","required":false,"system":false,"order":3,"placeholder":"Görüşme konusu"},
        {"id":"client_note","type":"textarea","label":"Not","required":false,"system":false,"order":4,"placeholder":"Eklemek istediğiniz not"}
      ]'::jsonb;
  END CASE;

  INSERT INTO public.appointment_settings (
    project_id, user_id, is_enabled, timezone,
    slot_duration_minutes, buffer_minutes, working_days,
    working_hours_start, working_hours_end,
    lunch_break_start, lunch_break_end, max_advance_days,
    day_schedules, form_fields, consent_required, consent_text
  ) VALUES (
    NEW.id, NEW.user_id, true, 'Europe/Istanbul',
    v_slot_duration, 0, v_working_days,
    v_hours_start, v_hours_end,
    v_lunch_start, v_lunch_end, 30,
    v_day_schedules, v_form_fields, true,
    'Kişisel verilerimin işlenmesini kabul ediyorum.'
  );

  RETURN NEW;
END;
$function$;
