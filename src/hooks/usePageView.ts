import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

function getDeviceType(): 'mobile' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ? 'mobile' : 'desktop';
}

function getVisitorId(): string {
  const storageKey = 'ol_visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
}

export function usePageView(projectId: string | undefined | null, pagePath?: string) {
  useEffect(() => {
    if (!projectId) return;

    const trackPageView = async () => {
      try {
        // Use the secure edge function endpoint instead of direct database access
        const { error } = await supabase.functions.invoke('track-analytics', {
          body: {
            project_id: projectId,
            event_type: 'page_view',
            page_path: pagePath || window.location.pathname,
            user_agent: navigator.userAgent,
            device_type: getDeviceType(),
            visitor_id: getVisitorId(),
          },
        });

        if (error) {
          console.error('Failed to track page view:', error);
        }
      } catch (err) {
        console.error('Analytics tracking error:', err);
      }
    };

    trackPageView();
  }, [projectId, pagePath]);
}
