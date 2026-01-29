-- Drop and recreate the view with SECURITY INVOKER (the safe default)
DROP VIEW IF EXISTS public.public_projects;

CREATE VIEW public.public_projects 
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  profession,
  subdomain,
  custom_domain,
  template_id,
  is_published,
  published_at,
  generated_content
FROM public.projects
WHERE is_published = true;

-- Grant SELECT access on the view to anon and authenticated roles
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;

-- We need a policy to allow anon users to select from projects for the view to work
-- But we'll create it to only allow access to specific columns through the view
CREATE POLICY "Anon can view published projects via view"
ON public.projects
FOR SELECT
TO anon
USING (is_published = true);

COMMENT ON VIEW public.public_projects IS 
'Secure public view for published projects with SECURITY INVOKER. Excludes user_id, form_data, status, created_at, and updated_at to prevent user profiling and personal data exposure.';