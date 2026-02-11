
-- Add Netlify integration columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS netlify_site_id text,
ADD COLUMN IF NOT EXISTS netlify_url text,
ADD COLUMN IF NOT EXISTS netlify_custom_domain text;
