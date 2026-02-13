
-- 1. appointment_settings tablosu
CREATE TABLE public.appointment_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  timezone text NOT NULL DEFAULT 'Europe/Istanbul',
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  buffer_minutes integer NOT NULL DEFAULT 0,
  working_days jsonb NOT NULL DEFAULT '[1,2,3,4,5]'::jsonb,
  working_hours_start text NOT NULL DEFAULT '09:00',
  working_hours_end text NOT NULL DEFAULT '18:00',
  lunch_break_start text DEFAULT '12:00',
  lunch_break_end text DEFAULT '13:00',
  max_advance_days integer NOT NULL DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

ALTER TABLE public.appointment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointment settings"
  ON public.appointment_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointment settings"
  ON public.appointment_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointment settings"
  ON public.appointment_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointment settings"
  ON public.appointment_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Anonim kullanıcılar sadece is_enabled kontrolü için okuyabilir
CREATE POLICY "Anyone can read enabled appointment settings"
  ON public.appointment_settings FOR SELECT
  USING (is_enabled = true);

CREATE TRIGGER update_appointment_settings_updated_at
  BEFORE UPDATE ON public.appointment_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. appointments tablosu
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  client_note text,
  appointment_date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  timezone text NOT NULL DEFAULT 'Europe/Istanbul',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Proje sahipleri tüm randevuları görebilir
CREATE POLICY "Project owners can view appointments"
  ON public.appointments FOR SELECT
  USING (public.user_owns_project(project_id));

CREATE POLICY "Project owners can update appointments"
  ON public.appointments FOR UPDATE
  USING (public.user_owns_project(project_id));

CREATE POLICY "Project owners can delete appointments"
  ON public.appointments FOR DELETE
  USING (public.user_owns_project(project_id));

-- Anonim kullanıcılar randevu oluşturabilir (service role üzerinden edge function ile)
CREATE POLICY "Anyone can insert appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

-- 3. blocked_slots tablosu
CREATE TABLE public.blocked_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  blocked_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, blocked_date)
);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocked slots"
  ON public.blocked_slots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocked slots"
  ON public.blocked_slots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocked slots"
  ON public.blocked_slots FOR DELETE
  USING (auth.uid() = user_id);

-- Anonim kullanıcılar bloklu günleri görebilir (slot hesabı için)
CREATE POLICY "Anyone can read blocked slots"
  ON public.blocked_slots FOR SELECT
  USING (true);

-- 4. Otomatik provizyon trigger'ı
CREATE OR REPLACE FUNCTION public.auto_provision_appointment_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_slot_duration integer;
  v_working_days jsonb;
  v_hours_start text;
  v_hours_end text;
  v_lunch_start text;
  v_lunch_end text;
BEGIN
  -- Sektör bazlı varsayılanlar
  CASE NEW.profession
    WHEN 'service' THEN
      v_slot_duration := 60;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00';
      v_hours_end := '18:00';
      v_lunch_start := '12:00';
      v_lunch_end := '13:00';
    WHEN 'food' THEN
      v_slot_duration := 120;
      v_working_days := '[1,2,3,4,5,6,0]'::jsonb;
      v_hours_start := '10:00';
      v_hours_end := '22:00';
      v_lunch_start := NULL;
      v_lunch_end := NULL;
    WHEN 'creative' THEN
      v_slot_duration := 45;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '10:00';
      v_hours_end := '19:00';
      v_lunch_start := '12:30';
      v_lunch_end := '13:30';
    WHEN 'technology' THEN
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00';
      v_hours_end := '18:00';
      v_lunch_start := '12:00';
      v_lunch_end := '13:00';
    WHEN 'retail' THEN
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5,6]'::jsonb;
      v_hours_start := '09:00';
      v_hours_end := '20:00';
      v_lunch_start := NULL;
      v_lunch_end := NULL;
    ELSE
      v_slot_duration := 30;
      v_working_days := '[1,2,3,4,5]'::jsonb;
      v_hours_start := '09:00';
      v_hours_end := '18:00';
      v_lunch_start := '12:00';
      v_lunch_end := '13:00';
  END CASE;

  INSERT INTO public.appointment_settings (
    project_id, user_id, is_enabled, timezone,
    slot_duration_minutes, buffer_minutes, working_days,
    working_hours_start, working_hours_end,
    lunch_break_start, lunch_break_end, max_advance_days
  ) VALUES (
    NEW.id, NEW.user_id, true, 'Europe/Istanbul',
    v_slot_duration, 0, v_working_days,
    v_hours_start, v_hours_end,
    v_lunch_start, v_lunch_end, 30
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_provision_appointments
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_provision_appointment_settings();
