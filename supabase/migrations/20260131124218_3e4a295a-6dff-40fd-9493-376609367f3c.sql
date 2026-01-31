-- Create custom_domains table for managing user custom domains
CREATE TABLE public.custom_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  verification_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'verified', 'failed')),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_custom_domains_project_id ON public.custom_domains(project_id);
CREATE INDEX idx_custom_domains_domain ON public.custom_domains(domain);
CREATE INDEX idx_custom_domains_status ON public.custom_domains(status);

-- Enable Row Level Security
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only manage domains for their own projects
CREATE POLICY "Users can view their own project domains"
ON public.custom_domains
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = custom_domains.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add domains to their own projects"
ON public.custom_domains
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = custom_domains.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own project domains"
ON public.custom_domains
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = custom_domains.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own project domains"
ON public.custom_domains
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = custom_domains.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Create a function to ensure only one primary domain per project
CREATE OR REPLACE FUNCTION public.ensure_single_primary_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE public.custom_domains 
    SET is_primary = false 
    WHERE project_id = NEW.project_id 
    AND id != NEW.id 
    AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for primary domain management
CREATE TRIGGER ensure_single_primary_domain_trigger
BEFORE INSERT OR UPDATE ON public.custom_domains
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_primary_domain();

-- Update public_projects view to include verified custom domain info
DROP VIEW IF EXISTS public.public_projects;

CREATE VIEW public.public_projects WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.name,
  p.profession,
  p.subdomain,
  p.template_id,
  p.generated_content,
  p.is_published,
  p.published_at,
  cd.domain as custom_domain
FROM public.projects p
LEFT JOIN public.custom_domains cd ON cd.project_id = p.id AND cd.is_primary = true AND cd.status = 'verified'
WHERE p.is_published = true;

-- Grant access to the view
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_projects TO authenticated;