import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WebsitePreview } from '@/components/website-preview/WebsitePreview';
import { RenderChaiBlocks } from '@chaibuilder/sdk/render';
import { GeneratedContent } from '@/types/generated-website';
import { Loader2, Globe } from 'lucide-react';
import { usePageView } from '@/hooks/usePageView';

interface PublicProject {
  id: string;
  name: string;
  profession: string;
  subdomain: string;
  generated_content: GeneratedContent | null;
  chai_blocks?: any[];
  chai_theme?: any;
  template_id?: string;
}

// Extract theme color (light mode = index 0)
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
      if (!subdomain) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('public_projects')
        .select('id, name, profession, subdomain, generated_content, chai_blocks, chai_theme, template_id')
        .eq('subdomain', subdomain)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

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

  // Set project globals for appointment booking block
  useEffect(() => {
    if (project?.id) {
      (window as any).__PROJECT_ID__ = project.id;
      (window as any).__SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL;
    }
  }, [project?.id]);

  // Inject theme CSS variables
  const themeStyleTag = useMemo(() => {
    if (!project?.chai_theme) return null;
    const cssVars = buildThemeStyle(project.chai_theme);
    if (!cssVars) return null;
    return <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />;
  }, [project?.chai_theme]);

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

  const colorPreference = 'light';
  const hasChaiBlocks = project.chai_blocks && project.chai_blocks.length > 0;

  return (
    <>
      {themeStyleTag}

      {hasChaiBlocks ? (
        <div className="min-h-screen">
          <RenderChaiBlocks blocks={project.chai_blocks || []} />
        </div>
      ) : (
        project.generated_content && (
          <WebsitePreview 
            content={project.generated_content} 
            colorPreference={colorPreference}
            isEditable={false}
          />
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
