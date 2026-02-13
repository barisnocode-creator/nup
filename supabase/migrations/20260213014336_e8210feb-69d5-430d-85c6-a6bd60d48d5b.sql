
-- 1. notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  project_id uuid NOT NULL,
  appointment_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  channel text NOT NULL DEFAULT 'in_app',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_project ON public.notifications (project_id);

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 2. notification_templates table
CREATE TABLE public.notification_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  target text NOT NULL DEFAULT 'client',
  subject text NOT NULL,
  body_template text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  channel text NOT NULL DEFAULT 'email',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
  ON public.notification_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own templates"
  ON public.notification_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates"
  ON public.notification_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates"
  ON public.notification_templates FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. notification_logs table
CREATE TABLE public.notification_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id uuid,
  project_id uuid NOT NULL,
  appointment_id uuid,
  event_type text NOT NULL,
  channel text NOT NULL,
  recipient_email text,
  recipient_type text NOT NULL DEFAULT 'client',
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owners can view notification logs"
  ON public.notification_logs FOR SELECT USING (public.user_owns_project(project_id));
CREATE POLICY "Service role can insert notification logs"
  ON public.notification_logs FOR INSERT WITH CHECK (true);

CREATE INDEX idx_notification_logs_project ON public.notification_logs (project_id);
CREATE INDEX idx_notification_logs_appointment ON public.notification_logs (appointment_id, event_type);

-- 4. Add reminder columns to appointment_settings
ALTER TABLE public.appointment_settings
  ADD COLUMN reminder_24h_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN reminder_2h_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN notification_email_enabled boolean NOT NULL DEFAULT true;

-- 5. Auto-provision default notification templates when a project is created
CREATE OR REPLACE FUNCTION public.auto_provision_notification_templates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notification_templates (project_id, user_id, event_type, target, subject, body_template, channel) VALUES
    (NEW.id, NEW.user_id, 'new_appointment', 'client', 'Randevu Talebiniz Alındı - {{project_name}}', 'Sayın {{client_name}}, {{date}} tarihinde saat {{time}} için randevu talebiniz alınmıştır. Onay durumu size bildirilecektir.', 'email'),
    (NEW.id, NEW.user_id, 'new_appointment', 'provider', 'Yeni Randevu Talebi - {{client_name}}', '{{client_name}} ({{client_email}}) {{date}} tarihinde saat {{time}} için randevu talebinde bulundu.', 'in_app'),
    (NEW.id, NEW.user_id, 'confirmed', 'client', 'Randevunuz Onaylandı - {{project_name}}', 'Sayın {{client_name}}, {{date}} tarihinde saat {{time}}-{{end_time}} arasındaki randevunuz onaylanmıştır.', 'email'),
    (NEW.id, NEW.user_id, 'confirmed', 'provider', 'Randevu Onaylandı - {{client_name}}', '{{client_name}} ile {{date}} saat {{time}} randevusu onaylandı.', 'in_app'),
    (NEW.id, NEW.user_id, 'cancelled', 'client', 'Randevunuz İptal Edildi - {{project_name}}', 'Sayın {{client_name}}, {{date}} tarihindeki randevunuz iptal edilmiştir. Yeni randevu için web sitemizi ziyaret edin.', 'email'),
    (NEW.id, NEW.user_id, 'cancelled', 'provider', 'Randevu İptal Edildi - {{client_name}}', '{{client_name}} ile {{date}} saat {{time}} randevusu iptal edildi.', 'in_app'),
    (NEW.id, NEW.user_id, 'reminder_24h', 'client', 'Randevu Hatırlatması - Yarın {{time}}', 'Sayın {{client_name}}, yarın saat {{time}} için {{project_name}} ile randevunuzu hatırlatırız.', 'email'),
    (NEW.id, NEW.user_id, 'reminder_24h', 'provider', 'Yarınki Randevu - {{client_name}}', '{{client_name}} ile yarın saat {{time}} randevunuz var.', 'in_app'),
    (NEW.id, NEW.user_id, 'reminder_2h', 'client', 'Randevu Hatırlatması - Bugün {{time}}', 'Sayın {{client_name}}, bugün saat {{time}} için {{project_name}} ile randevunuzu hatırlatırız.', 'email'),
    (NEW.id, NEW.user_id, 'reminder_2h', 'provider', 'Yaklaşan Randevu - {{client_name}}', '{{client_name}} ile bugün saat {{time}} randevunuz var.', 'in_app');
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_provision_notification_templates_trigger
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_provision_notification_templates();
