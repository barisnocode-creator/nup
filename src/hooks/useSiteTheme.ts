import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { loadGoogleFont, hexToHsl, isValidHex } from './useThemeColors';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

interface SiteThemeData {
  siteName: string;
  sections: SiteSection[];
  theme: SiteTheme | null;
  loading: boolean;
}

/**
 * Fetches site_theme and site_sections for a given subdomain,
 * then injects the theme CSS variables into :root and loads Google Fonts.
 * Cleans up on unmount so it doesn't leak into the SaaS dashboard.
 */
export function useSiteTheme(subdomain: string | undefined): SiteThemeData {
  const [siteData, setSiteData] = useState<SiteThemeData>({
    siteName: '',
    sections: [],
    theme: null,
    loading: true,
  });

  useEffect(() => {
    if (!subdomain) {
      setSiteData(prev => ({ ...prev, loading: false }));
      return;
    }

    let cancelled = false;

    supabase
      .from('public_projects')
      .select('name, site_sections, site_theme')
      .eq('subdomain', subdomain)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) {
          if (!cancelled) setSiteData(prev => ({ ...prev, loading: false }));
          return;
        }

        const theme = data.site_theme as SiteTheme | null;

        setSiteData({
          siteName: data.name || '',
          sections: (data.site_sections as unknown as SiteSection[]) || [],
          theme,
          loading: false,
        });

        // --- Inject theme CSS variables into :root ---
        const root = document.documentElement;
        const injectedProps: string[] = [];

        if (theme?.colors) {
          for (const [key, val] of Object.entries(theme.colors)) {
            if (typeof val === 'string') {
              // Convert HEX to HSL so Tailwind's hsl(var(--x)) works correctly
              const converted = isValidHex(val) ? hexToHsl(val) : val;
              root.style.setProperty(`--${key}`, converted);
              injectedProps.push(`--${key}`);
            }
          }
        }

        // --- Load and apply Google Fonts ---
        if (theme?.fonts) {
          const { heading, body } = theme.fonts as { heading?: string; body?: string };
          if (heading) {
            loadGoogleFont(heading);
            root.style.setProperty('--font-heading', `'${heading}', Georgia, serif`);
            injectedProps.push('--font-heading');
          }
          if (body) {
            loadGoogleFont(body);
            root.style.setProperty('--font-body', `'${body}', system-ui, sans-serif`);
            injectedProps.push('--font-body');
          }
        }

        // --- Border radius ---
        if ((theme as any)?.borderRadius) {
          root.style.setProperty('--radius', (theme as any).borderRadius);
          injectedProps.push('--radius');
        }

        // Store for cleanup
        (root as any).__blogThemeProps = injectedProps;
      });

    return () => {
      cancelled = true;
      // Cleanup injected props so they don't leak into the SaaS dashboard
      const root = document.documentElement;
      const props: string[] = (root as any).__blogThemeProps || [];
      props.forEach(p => root.style.removeProperty(p));
      delete (root as any).__blogThemeProps;
    };
  }, [subdomain]);

  return siteData;
}
