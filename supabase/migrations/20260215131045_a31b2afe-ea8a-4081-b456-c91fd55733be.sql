
-- Create contact_leads table
CREATE TABLE public.contact_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- SELECT: Project owner can view their leads
CREATE POLICY "Project owners can view leads"
  ON public.contact_leads FOR SELECT
  USING (user_owns_project(project_id));

-- INSERT: Anyone can insert (anonymous visitors submit forms)
CREATE POLICY "Anyone can insert leads"
  ON public.contact_leads FOR INSERT
  WITH CHECK (true);

-- UPDATE: Project owner can update (mark as read)
CREATE POLICY "Project owners can update leads"
  ON public.contact_leads FOR UPDATE
  USING (user_owns_project(project_id));

-- DELETE: Project owner can delete
CREATE POLICY "Project owners can delete leads"
  ON public.contact_leads FOR DELETE
  USING (user_owns_project(project_id));

-- Enable realtime for sidebar badge
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_leads;
