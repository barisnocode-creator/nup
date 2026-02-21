import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      vars[`--${key}`] = val;
    }
  }
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ');
}

export default function PublicWebsite() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      const FIELDS = 'id, name, profession, subdomain, generated_content, site_sections, site_theme, template_id';

      function applyProject(data: unknown) {
        const projectData = data as unknown as PublicProject;
        setProject(projectData);
        setLoading(false);
        if (projectData.generated_content?.metadata?.siteName) {
          document.title = `${projectData.generated_content.metadata.siteName} | Open Lucius`;
        }
      }

      // 1) Try by subdomain URL param
      if (subdomain) {
        const { data } = await supabase
          .from('public_projects')
          .select(FIELDS)
          .eq('subdomain', subdomain)
          .maybeSingle();
        if (data) { applyProject(data); return; }

        // 2) Lovable may pass the full domain (e.g. "nuppel.com") as the path param
        const { data: data2 } = await supabase
          .from('public_projects')
          .select(FIELDS)
          .eq('custom_domain', subdomain)
          .maybeSingle();
        if (data2) { applyProject(data2); return; }
      }

      // 3) Custom domain serving the SPA directly at "/" — look up by current hostname
      const hostname = window.location.hostname;
      const isMainDomain = ['localhost', 'lovable.app', 'lovable.dev', 'openlucius.app', 'openlucius.com']
        .some(d => hostname === d || hostname.endsWith('.' + d));
      if (!isMainDomain) {
        const { data: data3 } = await supabase
          .from('public_projects')
          .select(FIELDS)
          .eq('custom_domain', hostname)
          .maybeSingle();
        if (data3) { applyProject(data3); return; }
      }

      setNotFound(true);
      setLoading(false);
    }
    fetchProject();
  }, [subdomain]);

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
