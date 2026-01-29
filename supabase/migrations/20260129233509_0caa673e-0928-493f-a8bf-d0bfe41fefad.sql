-- Remove the direct anonymous access policy on projects table
-- Anonymous users should ONLY access published projects through the public_projects view
-- which already excludes sensitive fields (user_id, form_data)

DROP POLICY IF EXISTS "Anon can view published projects via view" ON public.projects;

-- Ensure the public_projects view is properly configured to exclude sensitive data
-- (It already excludes user_id and form_data based on the types.ts definition)
-- Just verify it exists and has correct structure
DROP VIEW IF EXISTS public.public_projects;

CREATE VIEW public.public_projects AS
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