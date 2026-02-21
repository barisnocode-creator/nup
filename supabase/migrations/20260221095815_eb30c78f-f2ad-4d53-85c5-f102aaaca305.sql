
CREATE OR REPLACE FUNCTION public.get_project_analytics(p_project_id uuid, p_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_result jsonb;
  v_total_views bigint;
  v_views_last_7_days bigint;
  v_unique_visitors bigint;
  v_mobile_count bigint;
  v_desktop_count bigint;
  v_views_over_time jsonb;
  v_page_views jsonb;
  v_hourly_views jsonb;
  v_start_date timestamptz;
BEGIN
  -- Auth check: only project owner can call this
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  v_start_date := now() - (p_days || ' days')::interval;

  -- Total views (all time, excluding preview)
  SELECT count(*) INTO v_total_views
  FROM public.analytics_events
  WHERE project_id = p_project_id
    AND (page_path IS NULL OR page_path != '/preview');

  -- Views last 7 days
  SELECT count(*) INTO v_views_last_7_days
  FROM public.analytics_events
  WHERE project_id = p_project_id
    AND (page_path IS NULL OR page_path != '/preview')
    AND created_at >= now() - interval '7 days';

  -- Unique visitors
  SELECT count(DISTINCT visitor_id) INTO v_unique_visitors
  FROM public.analytics_events
  WHERE project_id = p_project_id
    AND (page_path IS NULL OR page_path != '/preview')
    AND visitor_id IS NOT NULL;

  -- Device breakdown
  SELECT count(*) FILTER (WHERE device_type = 'mobile'),
         count(*) FILTER (WHERE device_type = 'desktop')
  INTO v_mobile_count, v_desktop_count
  FROM public.analytics_events
  WHERE project_id = p_project_id
    AND (page_path IS NULL OR page_path != '/preview');

  -- Views over time (last p_days days)
  SELECT coalesce(jsonb_agg(row_to_json(t) ORDER BY t.date), '[]'::jsonb)
  INTO v_views_over_time
  FROM (
    SELECT d::date::text AS date,
           count(e.id) AS views
    FROM generate_series(v_start_date::date, now()::date, '1 day'::interval) d
    LEFT JOIN public.analytics_events e
      ON e.project_id = p_project_id
      AND (e.page_path IS NULL OR e.page_path != '/preview')
      AND e.created_at::date = d::date
    GROUP BY d::date
    ORDER BY d::date
  ) t;

  -- Page views breakdown
  SELECT coalesce(jsonb_agg(row_to_json(t) ORDER BY t.views DESC), '[]'::jsonb)
  INTO v_page_views
  FROM (
    SELECT coalesce(page_path, '/') AS path, count(*) AS views
    FROM public.analytics_events
    WHERE project_id = p_project_id
      AND (page_path IS NULL OR page_path != '/preview')
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 20
  ) t;

  -- Hourly distribution
  SELECT coalesce(jsonb_agg(row_to_json(t) ORDER BY t.hour), '[]'::jsonb)
  INTO v_hourly_views
  FROM (
    SELECT h AS hour, count(e.id) AS views
    FROM generate_series(0, 23) h
    LEFT JOIN public.analytics_events e
      ON e.project_id = p_project_id
      AND (e.page_path IS NULL OR e.page_path != '/preview')
      AND extract(hour FROM e.created_at) = h
    GROUP BY h
    ORDER BY h
  ) t;

  v_result := jsonb_build_object(
    'total_views', v_total_views,
    'views_last_7_days', v_views_last_7_days,
    'unique_visitors', v_unique_visitors,
    'mobile_count', v_mobile_count,
    'desktop_count', v_desktop_count,
    'views_over_time', v_views_over_time,
    'page_views', v_page_views,
    'hourly_views', v_hourly_views
  );

  RETURN v_result;
END;
$$;
