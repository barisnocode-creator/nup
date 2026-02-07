-- Fix public_projects view: remove security_invoker=true so anonymous visitors can see published websites
-- The view itself is the security boundary: it only shows published projects and excludes sensitive fields

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
    is_published,
    published_at,
    template_id
  FROM public.projects
  WHERE is_published = true;

-- Grant SELECT to anon and authenticated roles
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;