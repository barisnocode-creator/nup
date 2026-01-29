-- Add publishing columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- Create index for faster subdomain lookups
CREATE INDEX IF NOT EXISTS idx_projects_subdomain ON public.projects(subdomain) WHERE subdomain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published) WHERE is_published = true;

-- Add RLS policy for public access to published websites
CREATE POLICY "Anyone can view published websites"
ON public.projects
FOR SELECT
USING (is_published = true);