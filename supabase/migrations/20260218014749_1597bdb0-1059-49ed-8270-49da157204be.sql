
-- Add new columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS site_sections jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS site_theme jsonb DEFAULT '{}'::jsonb;

-- Recreate public_projects view to include new columns
DROP VIEW IF EXISTS public.public_projects;
CREATE VIEW public.public_projects AS
SELECT 
  id,
  name,
  profession,
  subdomain,
  custom_domain,
  generated_content,
  chai_blocks,
  chai_theme,
  site_sections,
  site_theme,
  template_id,
  is_published,
  published_at
FROM public.projects
WHERE is_published = true;

-- Grant access to the view
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;
