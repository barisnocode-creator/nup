
-- 1. Add day_schedules JSONB column to appointment_settings
ALTER TABLE public.appointment_settings
ADD COLUMN day_schedules jsonb DEFAULT NULL;

-- 2. Add new columns to blocked_slots for partial-day blocking
ALTER TABLE public.blocked_slots
ADD COLUMN block_start_time text DEFAULT NULL,
ADD COLUMN block_end_time text DEFAULT NULL,
ADD COLUMN block_type text NOT NULL DEFAULT 'full_day';

-- 3. Drop the unique constraint on blocked_date+project_id if exists, since now we can have multiple blocks per date
-- First find and drop existing unique constraint
DO $$
BEGIN
  -- Drop unique index if it exists
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'blocked_slots_project_id_blocked_date_key') THEN
    ALTER TABLE public.blocked_slots DROP CONSTRAINT blocked_slots_project_id_blocked_date_key;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'unique_blocked_date_per_project') THEN
    DROP INDEX public.unique_blocked_date_per_project;
  END IF;
END $$;

-- 4. Update the auto-provision trigger to include day_schedules
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
BEGIN
  CASE NEW.profession
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
  END CASE;

  INSERT INTO public.appointment_settings (
    project_id, user_id, is_enabled, timezone,
    slot_duration_minutes, buffer_minutes, working_days,
    working_hours_start, working_hours_end,
    lunch_break_start, lunch_break_end, max_advance_days,
    day_schedules
  ) VALUES (
    NEW.id, NEW.user_id, true, 'Europe/Istanbul',
    v_slot_duration, 0, v_working_days,
    v_hours_start, v_hours_end,
    v_lunch_start, v_lunch_end, 30,
    v_day_schedules
  );

  RETURN NEW;
END;
$function$;
