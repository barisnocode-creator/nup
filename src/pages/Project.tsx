import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  profession: string;
  status: string;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, profession, status')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        navigate('/dashboard');
        return;
      }

      setProject(data);
      setLoading(false);
    }

    fetchProject();
  }, [id, navigate]);

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
                Your website is being prepared
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're setting up your professional website. This usually takes a few moments.
              You'll be notified when it's ready.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium capitalize">{project.status}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
