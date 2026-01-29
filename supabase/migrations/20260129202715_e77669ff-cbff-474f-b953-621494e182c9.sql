-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Validated insert for analytics" ON public.analytics_events;

-- Create a new restrictive INSERT policy that only allows service_role
-- This means only the track-analytics edge function can insert events
CREATE POLICY "Only service role can insert analytics"
ON public.analytics_events
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add a comment explaining the security model
COMMENT ON POLICY "Only service role can insert analytics" ON public.analytics_events IS 
'Analytics events can only be inserted via the track-analytics edge function which uses service_role. This prevents direct database access from untrusted clients and enables rate limiting, validation, and project existence checks at the edge function level.';