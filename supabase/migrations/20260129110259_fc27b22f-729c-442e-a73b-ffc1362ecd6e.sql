-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Create a more secure INSERT policy that validates project ownership or allows public tracking for published sites
CREATE POLICY "Insert analytics for published projects or own projects"
ON public.analytics_events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = analytics_events.project_id
    AND (projects.is_published = true OR projects.user_id = auth.uid())
  )
);