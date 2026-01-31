import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!projectId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics events for this project
        const { data: events, error: fetchError } = await supabase
          .from('analytics_events')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Total views
        const totalViews = events?.length || 0;

        // Views last 7 days
        const viewsLast7Days = events?.filter(e => 
          new Date(e.created_at) >= sevenDaysAgo
        ).length || 0;

        // Unique visitors
        const uniqueVisitorIds = new Set(events?.map(e => e.visitor_id).filter(Boolean));
        const uniqueVisitors = uniqueVisitorIds.size;

        // Device breakdown
        const mobileCount = events?.filter(e => e.device_type === 'mobile').length || 0;
        const desktopCount = events?.filter(e => e.device_type === 'desktop').length || 0;

        // Views over time (last 30 days, grouped by date)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const viewsByDate = new Map<string, number>();

        // Initialize all dates in range
        for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          viewsByDate.set(dateStr, 0);
        }

        // Count views per date
        events?.forEach(e => {
          const dateStr = new Date(e.created_at).toISOString().split('T')[0];
          if (viewsByDate.has(dateStr)) {
            viewsByDate.set(dateStr, (viewsByDate.get(dateStr) || 0) + 1);
          }
        });

        const viewsOverTime = Array.from(viewsByDate.entries())
          .map(([date, views]) => ({ date, views }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Page views grouped by path
        const pageViewsMap = new Map<string, number>();
        events?.forEach(e => {
          const path = e.page_path || '/';
          pageViewsMap.set(path, (pageViewsMap.get(path) || 0) + 1);
        });
        const pageViews = Array.from(pageViewsMap.entries())
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views);

        // Hourly views
        const hourlyViewsMap = new Map<number, number>();
        for (let i = 0; i < 24; i++) {
          hourlyViewsMap.set(i, 0);
        }
        events?.forEach(e => {
          const hour = new Date(e.created_at).getHours();
          hourlyViewsMap.set(hour, (hourlyViewsMap.get(hour) || 0) + 1);
        });
        const hourlyViews = Array.from(hourlyViewsMap.entries())
          .map(([hour, views]) => ({ hour, views }))
          .sort((a, b) => a.hour - b.hour);

        setData({
          totalViews,
          viewsLast7Days,
          uniqueVisitors,
          deviceBreakdown: {
            mobile: mobileCount,
            desktop: desktopCount,
          },
          viewsOverTime,
          pageViews,
          hourlyViews,
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId]);

  return { data, loading, error };
}
