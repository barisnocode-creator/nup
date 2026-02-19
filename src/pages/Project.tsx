import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthWallOverlay } from '@/components/website-preview/AuthWallOverlay';
import { AuthModal } from '@/components/auth/AuthModal';
import { SiteEditor } from '@/components/editor/SiteEditor';
import { useToast } from '@/hooks/use-toast';
import { usePageView } from '@/hooks/usePageView';
import { getCatalogTemplate } from '@/templates/catalog';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

interface ProjectData {
  id: string;
  name: string;
  profession: string;
  status: string;
  subdomain?: string | null;
  is_published?: boolean;
  template_id?: string;
  form_data: any;
  generated_content: any;
  site_sections?: SiteSection[];
  site_theme?: SiteTheme;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [sections, setSections] = useState<SiteSection[]>([]);
  const [theme, setTheme] = useState<SiteTheme>({});

  usePageView(id, '/preview');

  // Set window globals for booking components to access
  useEffect(() => {
    if (project?.id) {
      (window as any).__PROJECT_ID__ = project.id;
      (window as any).__SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL;
    }
    return () => {
      delete (window as any).__PROJECT_ID__;
      delete (window as any).__SUPABASE_URL__;
    };
  }, [project?.id]);

  // Fetch project
  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, profession, status, subdomain, is_published, template_id, form_data, generated_content, site_sections, site_theme')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        toast({ title: 'Proje bulunamadı', description: 'Bu proje mevcut değil veya erişim yetkiniz yok.', variant: 'destructive' });
        navigate('/dashboard');
        return;
      }

      const p = data as unknown as ProjectData;
      setProject(p);
      setLoading(false);

      // If draft with no content, generate
      if (p.status === 'draft' && !p.generated_content) {
        generateWebsite(id, p);
        return;
      }

      // Priority 1: site_sections already exist
      const siteSections = p.site_sections as SiteSection[] | null;
      if (siteSections && Array.isArray(siteSections) && siteSections.length > 0) {
        setSections(siteSections);
        setTheme((p.site_theme as SiteTheme) || {});
        return;
      }

      // Priority 2: generated_content exists but no sections → create sections from catalog or content
      if (p.generated_content) {
        const catalogDef = getCatalogTemplate(p.template_id || '');
        let newSections: SiteSection[];

        if (catalogDef && catalogDef.sections.length > 0) {
          newSections = catalogDef.sections.map((sec, i) => ({
            id: `${sec.type}_${i}_${Date.now()}`,
            type: sec.type === 'HeroCentered' ? 'hero-centered' :
                  sec.type === 'HeroSplit' ? 'hero-split' :
                  sec.type === 'HeroOverlay' ? 'hero-overlay' :
                  sec.type === 'ServicesGrid' ? 'services-grid' :
                  sec.type === 'AboutSection' ? 'about-section' :
                  sec.type === 'StatisticsCounter' ? 'statistics-counter' :
                  sec.type === 'TestimonialsCarousel' ? 'testimonials-carousel' :
                  sec.type === 'ContactForm' ? 'contact-form' :
                  sec.type === 'CTABanner' ? 'cta-banner' :
                  sec.type === 'FAQAccordion' ? 'faq-accordion' :
                  sec.type === 'ImageGallery' ? 'image-gallery' :
                  sec.type === 'PricingTable' ? 'pricing-table' :
                  sec.type === 'AppointmentBooking' ? 'appointment-booking' :
                  sec.type === 'NaturalHeader' ? 'natural-header' :
                  sec.type === 'NaturalHero' ? 'natural-hero' :
                  sec.type === 'NaturalIntro' ? 'natural-intro' :
                  sec.type === 'NaturalArticleGrid' ? 'natural-article-grid' :
                  sec.type === 'NaturalNewsletter' ? 'natural-newsletter' :
                  sec.type === 'NaturalFooter' ? 'natural-footer' :
                  sec.type,
            locked: sec.required || i === 0,
            props: sec.defaultProps,
          }));
        } else {
          // Minimal fallback from generated_content
          newSections = createSectionsFromContent(p.generated_content);
        }

        setSections(newSections);
        // Save to DB
        await supabase.from('projects').update({
          site_sections: newSections as any,
          updated_at: new Date().toISOString(),
        }).eq('id', p.id);
      }
    }
    fetchProject();
  }, [id, navigate]);

  const generateWebsite = async (projectId: string, proj: ProjectData) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-website', { body: { projectId } });
      if (error || !data?.content) {
        toast({ title: 'Oluşturma hatası', description: 'Web sitesi oluşturulamadı.', variant: 'destructive' });
        return;
      }
      setProject(prev => prev ? { ...prev, generated_content: data.content, status: 'generated' } : null);
      // Create sections from generated content
      const newSections = createSectionsFromContent(data.content);
      setSections(newSections);
      await supabase.from('projects').update({
        site_sections: newSections as any,
        updated_at: new Date().toISOString(),
      }).eq('id', projectId);
      toast({ title: 'Web sitesi oluşturuldu!', description: 'Profesyonel siteniz hazır.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Hata', description: 'Beklenmeyen bir hata oluştu.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  // Generation in progress
  if (generating || (project.status === 'draft' && !project.generated_content)) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Open Lucius</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 gradient-hero rounded-3xl animate-pulse opacity-30" />
              <div className="relative w-32 h-32 gradient-hero rounded-3xl flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{project.profession}</span>
              <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
            </div>
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {generating ? 'AI ile siteniz oluşturuluyor...' : 'Siteniz hazırlanıyor'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Auth wall for non-authenticated users
  if (!user) {
    return (
      <>
        <AuthWallOverlay
          onEmailSignIn={() => setAuthModalOpen(true)}
          onGoogleSignIn={signInWithGoogle}
          onAppleSignIn={signInWithApple}
          isLoading={false}
        />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  // Main editor
  return (
    <SiteEditor
      projectId={project.id}
      projectName={project.name}
      initialSections={sections}
      initialTheme={theme}
      subdomain={project.subdomain}
      isPublished={project.is_published}
      onPublished={(sub) => setProject(prev => prev ? { ...prev, subdomain: sub, is_published: true } : null)}
      projectData={{
        generatedContent: project.generated_content,
        formData: project.form_data,
        sector: project.form_data?.businessType ?? project.form_data?.sector ?? '',
      }}
    />
  );
}

// Helper: create minimal sections from generated_content
function createSectionsFromContent(content: any): SiteSection[] {
  const sections: SiteSection[] = [];
  const { pages, metadata } = content || {};

  if (pages?.home?.hero) {
    sections.push({
      id: `hero_${Date.now()}`,
      type: 'hero-centered',
      locked: true,
      props: {
        title: pages.home.hero.title || metadata?.siteName || 'Hoş Geldiniz',
        subtitle: pages.home.hero.subtitle || '',
        description: pages.home.hero.description || '',
        primaryButtonText: 'İletişime Geç',
        primaryButtonLink: '#contact',
        secondaryButtonText: '',
        secondaryButtonLink: '',
        backgroundImage: '',
      },
    });
  }

  if (pages?.services?.servicesList || pages?.home?.highlights) {
    const list = pages?.services?.servicesList || pages?.home?.highlights || [];
    sections.push({
      id: `services_${Date.now()}`,
      type: 'services-grid',
      props: {
        sectionTitle: pages?.services?.hero?.title || 'Hizmetlerimiz',
        sectionSubtitle: 'Neler Yapıyoruz',
        sectionDescription: '',
        services: list.slice(0, 6).map((s: any) => ({
          icon: s.icon || '⭐',
          title: s.title,
          description: s.description,
          image: '',
        })),
      },
    });
  }

  if (pages?.about?.story || pages?.home?.welcome) {
    sections.push({
      id: `about_${Date.now()}`,
      type: 'about-section',
      props: {
        title: pages?.about?.story?.title || pages?.home?.welcome?.title || 'Hakkımızda',
        subtitle: 'Biz Kimiz?',
        description: pages?.about?.story?.content || pages?.home?.welcome?.content || '',
        features: '',
        image: '',
        imagePosition: 'right',
      },
    });
  }

  if (pages?.contact?.info) {
    sections.push({
      id: `contact_${Date.now()}`,
      type: 'contact-form',
      props: {
        sectionTitle: pages.contact.form?.title || 'Bize Ulaşın',
        sectionSubtitle: 'İletişim',
        sectionDescription: '',
        address: pages.contact.info.address || '',
        phone: pages.contact.info.phone || '',
        email: pages.contact.info.email || '',
        submitButtonText: 'Mesaj Gönder',
      },
    });
  }

  sections.push({
    id: `cta_${Date.now()}`,
    type: 'cta-banner',
    props: {
      title: 'Hemen Başlayalım',
      description: 'Sizinle çalışmak için sabırsızlanıyoruz.',
      buttonText: 'İletişime Geç',
      buttonLink: '#contact',
    },
  });

  return sections;
}
