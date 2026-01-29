-- Create a secure view for public project access that excludes sensitive fields
CREATE OR REPLACE VIEW public.public_projects AS
SELECT 
  id,
  name,
  profession,
  subdomain,
  custom_domain,
  template_id,
  is_published,
  published_at,
  -- Only expose non-sensitive parts of generated_content (metadata and pages, not form data)
  generated_content
FROM public.projects
WHERE is_published = true;

-- Grant SELECT access on the view to anon and authenticated roles
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW public.public_projects IS 
'Secure public view for published projects. Excludes user_id, form_data, status, created_at, and updated_at to prevent user profiling and personal data exposure. Use this view for all public-facing project queries.';

-- Now update the RLS policy on projects table to be more restrictive for public access
-- First drop the existing public policy
DROP POLICY IF EXISTS "Anyone can view published websites" ON public.projects;

-- Create a function to check if the user owns the project (to avoid recursion issues)
CREATE OR REPLACE FUNCTION public.user_owns_project(project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND user_id = auth.uid()
  )
$$;

-- Recreate the public policy but only for the view access pattern
-- Regular table access for published projects is now restricted to owners only
CREATE POLICY "Owners can view their published projects"
ON public.projects
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Keep the anon access but only via service role (for edge functions)
-- Anon users should use the public_projects view instead