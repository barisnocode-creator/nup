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
  chai_blocks?: any[];
  chai_theme?: any;
  site_sections?: SiteSection[];
  site_theme?: SiteTheme;
  template_id?: string;
}

// Extract theme color (for legacy chai_theme format: [light, dark] arrays)
function extractColor(colors: Record<string, any> | undefined, key: string, fallback: string): string {
  if (!colors) return fallback;
  const val = colors[key];
  if (Array.isArray(val) && val[0]) return val[0];
  if (typeof val === 'string') return val;
  return fallback;
}

function buildThemeStyle(theme: any): string {
  if (!theme?.colors) return '';
  const c = theme.colors;
  const vars: Record<string, string> = {
    '--background': extractColor(c, 'background', '#ffffff'),
    '--foreground': extractColor(c, 'foreground', '#1a1a1a'),
    '--primary': extractColor(c, 'primary', '#f97316'),
    '--primary-foreground': extractColor(c, 'primary-foreground', '#ffffff'),
    '--secondary': extractColor(c, 'secondary', '#f4f4f5'),
    '--secondary-foreground': extractColor(c, 'secondary-foreground', '#4a4a4a'),
    '--muted': extractColor(c, 'muted', '#f4f4f5'),
    '--muted-foreground': extractColor(c, 'muted-foreground', '#737373'),
    '--accent': extractColor(c, 'accent', '#f97316'),
    '--accent-foreground': extractColor(c, 'accent-foreground', '#ffffff'),
    '--border': extractColor(c, 'border', '#e5e5e5'),
    '--input': extractColor(c, 'input', '#e5e5e5'),
    '--ring': extractColor(c, 'ring', '#f97316'),
    '--card': extractColor(c, 'card', '#ffffff'),
    '--card-foreground': extractColor(c, 'card-foreground', '#1a1a1a'),
  };
  return Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; ');
}

export default function PublicWebsite() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!subdomain) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from('public_projects')
        .select('id, name, profession, subdomain, generated_content, chai_blocks, chai_theme, site_sections, site_theme, template_id')
        .eq('subdomain', subdomain)
        .maybeSingle();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      const projectData = data as unknown as PublicProject;
      setProject(projectData);
      setLoading(false);

      if (projectData.generated_content?.metadata?.siteName) {
        document.title = `${projectData.generated_content.metadata.siteName} | Open Lucius`;
      }
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

  // Determine which theme to use: site_theme > chai_theme
  const activeTheme = project?.site_theme || project?.chai_theme;
  const themeStyleTag = useMemo(() => {
    if (!activeTheme) return null;
    const cssVars = buildThemeStyle(activeTheme);
    if (!cssVars) return null;
    return <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />;
  }, [activeTheme]);

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

  // Priority 1: site_sections
  const siteSections = project.site_sections as SiteSection[] | undefined;
  const hasSiteSections = siteSections && Array.isArray(siteSections) && siteSections.length > 0;

  // Priority 2: chai_blocks (convert inline for display)
  const hasChaiBlocks = !hasSiteSections && project.chai_blocks && Array.isArray(project.chai_blocks) && project.chai_blocks.length > 0;

  // Convert chai_blocks to SiteSection format for rendering
  const convertedSections = useMemo(() => {
    if (!hasChaiBlocks || !project.chai_blocks) return [];
    const typeMap: Record<string, string> = {
      HeroCentered: 'hero-centered', HeroSplit: 'hero-split', HeroOverlay: 'hero-overlay',
      ServicesGrid: 'services-grid', AboutSection: 'about-section', StatisticsCounter: 'statistics-counter',
      TestimonialsCarousel: 'testimonials-carousel', ContactForm: 'contact-form', CTABanner: 'cta-banner',
      FAQAccordion: 'faq-accordion', ImageGallery: 'image-gallery', PricingTable: 'pricing-table',
      AppointmentBooking: 'appointment-booking', NaturalHeader: 'natural-header', NaturalHero: 'natural-hero',
      NaturalIntro: 'natural-intro', NaturalArticleGrid: 'natural-article-grid', NaturalNewsletter: 'natural-newsletter',
      NaturalFooter: 'natural-footer',
    };
    const skip = new Set(['_id', '_type', '_position', '_name', 'styles', 'blockProps', 'inBuilder', 'containerClassName']);
    return project.chai_blocks.map((b: any, i: number) => {
      const props: Record<string, any> = {};
      for (const [k, v] of Object.entries(b)) { if (!skip.has(k)) props[k] = v; }
      return { id: b._id || `s_${i}`, type: typeMap[b._type] || b._type, locked: i === 0, props } as SiteSection;
    });
  }, [hasChaiBlocks, project.chai_blocks]);

  const sectionsToRender = hasSiteSections ? siteSections! : hasChaiBlocks ? convertedSections : [];

  return (
    <>
      {themeStyleTag}

      {sectionsToRender.length > 0 ? (
        <SectionRenderer sections={sectionsToRender} />
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
