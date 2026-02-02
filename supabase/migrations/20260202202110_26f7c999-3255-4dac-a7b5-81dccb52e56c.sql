-- Chaibuilder SDK için yeni sütunlar ekle
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS chai_blocks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS chai_theme JSONB DEFAULT '{}'::jsonb;

-- Mevcut verileri koruyarak güncellenmiş public_projects view
DROP VIEW IF EXISTS public.public_projects;

CREATE VIEW public.public_projects 
WITH (security_invoker = true) AS
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