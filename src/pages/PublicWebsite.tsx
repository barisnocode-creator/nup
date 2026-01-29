import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WebsitePreview } from '@/components/website-preview/WebsitePreview';
import { GeneratedContent } from '@/types/generated-website';
import { Loader2, Globe } from 'lucide-react';
import { usePageView } from '@/hooks/usePageView';

interface PublicProject {
  id: string;
  name: string;
  profession: string;
  subdomain: string;
  generated_content: GeneratedContent | null;
}

export default function PublicWebsite() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch published project by subdomain using secure public view
  useEffect(() => {
    async function fetchProject() {
      if (!subdomain) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Use the secure public_projects view that excludes sensitive fields (user_id, form_data)
      const { data, error } = await supabase
        .from('public_projects')
        .select('id, name, profession, subdomain, generated_content')
        .eq('subdomain', subdomain)
        .maybeSingle();

      if (error) {
        console.error('Error fetching project:', error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Cast the data properly
      const projectData = data as unknown as PublicProject;
      setProject(projectData);
      setLoading(false);

      // Update page title with site name
      if (projectData.generated_content?.metadata?.siteName) {
        document.title = `${projectData.generated_content.metadata.siteName} | Open Lucius`;
      }
    }

    fetchProject();
  }, [subdomain]);

  // Track page view for analytics
  usePageView(project?.id || null, '/public');

  // Loading state
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

  // Not found state
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
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Go to Open Lucius
          </a>
        </div>
      </div>
    );
  }

  // Use default light theme since form_data is not exposed in public view for security
  const colorPreference = 'light';

  return (
    <>
      {/* Website Preview - Read Only */}
      {project.generated_content && (
        <WebsitePreview 
          content={project.generated_content} 
          colorPreference={colorPreference}
          isEditable={false}
        />
      )}

      {/* Powered by badge */}
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