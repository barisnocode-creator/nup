-- Add template_id column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'temp1';

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_template_id ON public.projects(template_id);