import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hexToHsl, isValidHex } from '@/hooks/useThemeColors';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { WebsitePreview } from '@/components/website-preview/WebsitePreview';
import { GeneratedContent } from '@/types/generated-website';
import { Loader2, Globe } from 'lucide-react';
import { usePageView } from '@/hooks/usePageView';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

interface PublicProject {
  id: string;
  name: string;
  profession: string;
  subdomain: string;
  generated_content: GeneratedContent | null;
  site_sections?: SiteSection[];
  site_theme?: SiteTheme;
  template_id?: string;
}

function buildThemeStyle(theme: SiteTheme | undefined): string {
  if (!theme?.colors) return '';
  const c = theme.colors;
  const vars: Record<string, string> = {};
  for (const [key, val] of Object.entries(c)) {
    if (typeof val === 'string') {
      vars[`--${key}`] = isValidHex(val) ? hexToHsl(val) : val;
    }
  }
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ');
}

// Platform domains that should NOT be treated as custom domains
const PLATFORM_HOSTNAMES = [
  'localhost',
  'lovable.app',
  'lovable.dev',
  'webcontainer.io',
];

function isPlatformDomain(hostname: string): boolean {
  return PLATFORM_HOSTNAMES.some(ph => hostname === ph || hostname.endsWith(`.${ph}`));
}

export default function PublicWebsite() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      const hostname = window.location.hostname;
      const isCustomDomain = !isPlatformDomain(hostname) && !subdomain;

      // Case 1: /site/:subdomain route
      if (subdomain) {
        const { data, error } = await supabase
          .from('public_projects')
          .select('id, name, profession, subdomain, generated_content, site_sections, site_theme, template_id')
          .eq('subdomain', subdomain)
          .maybeSingle();

        if (error || !data) { setNotFound(true); setLoading(false); return; }
        setProject(data as unknown as PublicProject);
        setLoading(false);
        return;
      }

      // Case 2: Custom domain (hostname lookup)
      if (isCustomDomain) {
        // First check custom_domains table for project_id
        const { data: domainData } = await supabase
          .from('custom_domains_safe')
          .select('project_id')
          .eq('domain', hostname)
          .in('status', ['verified', 'active'])
          .maybeSingle();

        if (domainData?.project_id) {
          const { data } = await supabase
            .from('public_projects')
            .select('id, name, profession, subdomain, generated_content, site_sections, site_theme, template_id')
            .eq('id', domainData.project_id)
            .maybeSingle();

          if (data) {
            setProject(data as unknown as PublicProject);
            setLoading(false);
            return;
          }
        }

        // Also check custom_domain column on public_projects
        const { data: projectByDomain } = await supabase
          .from('public_projects')
          .select('id, name, profession, subdomain, generated_content, site_sections, site_theme, template_id')
          .eq('custom_domain', hostname)
          .maybeSingle();

        if (projectByDomain) {
          setProject(projectByDomain as unknown as PublicProject);
          setLoading(false);
          return;
        }

        setNotFound(true);
        setLoading(false);
        return;
      }

      // No subdomain and platform domain → 404
      setNotFound(true);
      setLoading(false);
    }

    fetchProject();
  }, [subdomain]);

  // Set document title
  useEffect(() => {
    if (project?.generated_content?.metadata?.siteName) {
      document.title = `${project.generated_content.metadata.siteName} | Open Lucius`;
    } else if (project?.name) {
      document.title = project.name;
    }
  }, [project]);

  // Inject sitemap link
  useEffect(() => {
    if (project?.subdomain) {
      const existingLink = document.querySelector('link[rel="sitemap"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'sitemap';
        link.type = 'application/xml';
        link.title = 'Sitemap';
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        link.href = `${supabaseUrl}/functions/v1/sitemap?subdomain=${project.subdomain}`;
        document.head.appendChild(link);
      }
    }
  }, [project?.subdomain]);

  usePageView(project?.id || null, '/public');

  // Set project globals for appointment booking
  useEffect(() => {
    if (project?.id) {
      (window as any).__PROJECT_ID__ = project.id;
      (window as any).__SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL;
    }
  }, [project?.id]);

  const themeStyleTag = useMemo(() => {
    if (!project?.site_theme) return null;
    const cssVars = buildThemeStyle(project.site_theme);
    if (!cssVars) return null;
    return <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />;
  }, [project?.site_theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading website...</p>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Globe className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Website Not Found</h1>
            <p className="text-muted-foreground">
              The website you're looking for doesn't exist or hasn't been published yet.
            </p>
          </div>
          <a href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            Go to Open Lucius
          </a>
        </div>
      </div>
    );
  }

  const siteSections = project.site_sections as SiteSection[] | undefined;
  const hasSiteSections = siteSections && Array.isArray(siteSections) && siteSections.length > 0;

  return (
    <>
      {themeStyleTag}

      {hasSiteSections ? (
        <SectionRenderer sections={siteSections!} />
      ) : (
        project.generated_content && (
          <WebsitePreview content={project.generated_content} colorPreference="light" isEditable={false} />
        )
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/90 backdrop-blur-sm border shadow-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Powered by</span>
          <span className="font-semibold text-foreground">Open Lucius</span>
        </a>
      </div>
    </>
  );
}
