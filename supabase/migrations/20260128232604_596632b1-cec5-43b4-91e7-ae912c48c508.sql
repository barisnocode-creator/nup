-- Add generated_content column to store AI-generated website content
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS generated_content JSONB DEFAULT NULL;

-- Add index for faster queries on status
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
