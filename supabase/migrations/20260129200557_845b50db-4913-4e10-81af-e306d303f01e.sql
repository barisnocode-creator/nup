-- Create a function to hash visitor identifiers for privacy
CREATE OR REPLACE FUNCTION public.hash_visitor_id(raw_visitor_id text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT encode(sha256(raw_visitor_id::bytea), 'hex')
$$;

-- Create a trigger function to auto-hash visitor_id on insert
CREATE OR REPLACE FUNCTION public.anonymize_analytics_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hash the visitor_id for privacy
  IF NEW.visitor_id IS NOT NULL THEN
    NEW.visitor_id := public.hash_visitor_id(NEW.visitor_id);
  END IF;
  
  -- Truncate user_agent to just essential info (first 100 chars) and remove identifying info
  IF NEW.user_agent IS NOT NULL THEN
    NEW.user_agent := LEFT(
      regexp_replace(NEW.user_agent, '\([^)]*\)', '', 'g'), -- Remove parenthetical info
      100
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS anonymize_analytics_on_insert ON public.analytics_events;
CREATE TRIGGER anonymize_analytics_on_insert
  BEFORE INSERT ON public.analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION public.anonymize_analytics_data();

-- Drop old INSERT policy
DROP POLICY IF EXISTS "Insert analytics for published projects or own projects" ON public.analytics_events;

-- Create a more restrictive INSERT policy with validation
-- Only allow inserts where:
-- 1. The project is published OR owned by current user
-- 2. Event type is from allowed list
-- 3. Page path is reasonable length
CREATE POLICY "Validated insert for analytics"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Project must be published or owned by user
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analytics_events.project_id
      AND (projects.is_published = true OR projects.user_id = auth.uid())
    )
    -- Event type must be valid
    AND event_type IN ('page_view', 'click', 'scroll', 'form_submit')
    -- Page path must be reasonable
    AND (page_path IS NULL OR length(page_path) <= 500)
  );

-- Add a comment explaining the privacy measures
COMMENT ON FUNCTION public.hash_visitor_id(text) IS 'Hashes visitor IDs using SHA-256 for privacy protection';
COMMENT ON FUNCTION public.anonymize_analytics_data() IS 'Trigger function that anonymizes visitor data before storing';
COMMENT ON TRIGGER anonymize_analytics_on_insert ON public.analytics_events IS 'Automatically anonymizes visitor tracking data on insert';