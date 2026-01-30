-- Fix the SECURITY DEFINER warning by explicitly setting the view to SECURITY INVOKER
-- This is the correct approach since the view filters by is_published = true at the SQL level

DROP VIEW IF EXISTS public.public_projects;

CREATE VIEW public.public_projects 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  profession,
  subdomain,
  custom_domain,
  template_id,
  generated_content,
  is_published,
  published_at
FROM public.projects
WHERE is_published = true;

-- Grant SELECT on the view to anonymous and authenticated users
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;