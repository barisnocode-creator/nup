-- Add form_data JSONB column to store wizard answers
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';