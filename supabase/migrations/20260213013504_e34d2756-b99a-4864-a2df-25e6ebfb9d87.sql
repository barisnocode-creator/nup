
-- Add internal_note to appointments
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS internal_note text;

-- Create agenda_notes table
CREATE TABLE public.agenda_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  note_date date NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agenda_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own agenda notes"
ON public.agenda_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agenda notes"
ON public.agenda_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agenda notes"
ON public.agenda_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agenda notes"
ON public.agenda_notes FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_agenda_notes_updated_at
BEFORE UPDATE ON public.agenda_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_agenda_notes_project_date ON public.agenda_notes(project_id, note_date);
CREATE INDEX idx_agenda_notes_user ON public.agenda_notes(user_id);
