-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  page_path TEXT,
  user_agent TEXT,
  device_type TEXT,
  visitor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking (public pages)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Only project owners can view their analytics
CREATE POLICY "Project owners can view their analytics"
ON public.analytics_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = analytics_events.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Index for fast queries
CREATE INDEX idx_analytics_project_id ON public.analytics_events(project_id);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_project_created ON public.analytics_events(project_id, created_at);