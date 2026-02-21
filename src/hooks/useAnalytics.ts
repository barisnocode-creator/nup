import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalViews: number;
  viewsLast7Days: number;
  uniqueVisitors: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
  };
  viewsOverTime: {
    date: string;
    views: number;
  }[];
  pageViews: {
    path: string;
    views: number;
  }[];
  hourlyViews: {
    hour: number;
    views: number;
  }[];
}

export function useAnalytics(projectId: string | undefined) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);

      const { data: result, error: rpcError } = await supabase
        .rpc('get_project_analytics', {
          p_project_id: projectId,
          p_days: 30,
        });

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      if (!result) {
        setError('No data returned');
        return;
      }

      const r = result as any;

      setData({
        totalViews: r.total_views || 0,
        viewsLast7Days: r.views_last_7_days || 0,
        uniqueVisitors: r.unique_visitors || 0,
        deviceBreakdown: {
          mobile: r.mobile_count || 0,
          desktop: r.desktop_count || 0,
        },
        viewsOverTime: (r.views_over_time || []).map((v: any) => ({
          date: v.date,
          views: Number(v.views) || 0,
        })),
        pageViews: (r.page_views || []).map((v: any) => ({
          path: v.path,
          views: Number(v.views) || 0,
        })),
        hourlyViews: (r.hourly_views || []).map((v: any) => ({
          hour: Number(v.hour),
          views: Number(v.views) || 0,
        })),
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Realtime subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`analytics-realtime-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}
