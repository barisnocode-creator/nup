import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { WebsitePreview } from '@/components/website-preview/WebsitePreview';
import { AuthWallOverlay } from '@/components/website-preview/AuthWallOverlay';
import { AuthModal } from '@/components/auth/AuthModal';
import { GeneratedContent } from '@/types/generated-website';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  profession: string;
  status: string;
  form_data: {
    websitePreferences?: {
      colorPreference?: string;
    };
  } | null;
  generated_content: GeneratedContent | null;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, profession, status, form_data, generated_content')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        navigate('/dashboard');
        return;
      }

      // Cast the data properly
      const projectData = data as unknown as Project;
      setProject(projectData);
      setLoading(false);

      // If project is draft and no generated content, trigger generation
      if (projectData.status === 'draft' && !projectData.generated_content) {
        generateWebsite(id);
      }
    }

    fetchProject();
  }, [id, navigate]);

  const generateWebsite = async (projectId: string) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-website', {
        body: { projectId },
      });

      if (error) {
        console.error('Generation error:', error);
        toast({
          title: 'Generation failed',
          description: 'Failed to generate website content. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (data?.content) {
        setProject(prev => prev ? {
          ...prev,
          generated_content: data.content,
          status: 'generated',
        } : null);
        
        toast({
          title: 'Website generated!',
          description: 'Your professional website has been created.',
        });
      }
    } catch (err) {
      console.error('Generation error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAppleSignIn = async () => {
    const { error } = await signInWithApple();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // Generation in progress
  if (generating || (project.status === 'draft' && !project.generated_content)) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
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
              Back to Dashboard
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 gradient-hero rounded-3xl animate-pulse opacity-30" />
              <div className="relative w-32 h-32 gradient-hero rounded-3xl flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-primary-foreground" />
              </div>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {project.profession}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
            </div>

            {/* Status Message */}
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xl font-semibold text-primary">
                  {generating ? 'Generating your website with AI...' : 'Your website is being prepared'}
                </span>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're creating your professional website using AI. This usually takes 30-60 seconds.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Website preview with optional auth wall
  const colorPreference = project.form_data?.websitePreferences?.colorPreference || 'light';
  const isAuthenticated = !!user;

  return (
    <div className="relative min-h-screen">
      {/* Fixed Header for authenticated users */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Open Lucius</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Preview Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button size="sm" disabled className="opacity-60">
                Edit Website
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Website Preview */}
      <div className={`${isAuthenticated ? 'pt-14' : ''} ${!isAuthenticated ? 'overflow-hidden h-screen pointer-events-none' : ''}`}>
        {project.generated_content && (
          <WebsitePreview 
            content={project.generated_content} 
            colorPreference={colorPreference}
          />
        )}
      </div>

      {/* Auth Wall for non-authenticated users */}
      {!isAuthenticated && project.generated_content && (
        <AuthWallOverlay
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          onEmailSignIn={() => setAuthModalOpen(true)}
          isLoading={false}
        />
      )}

      {/* Email Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}
