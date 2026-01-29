import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, LogOut, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CreateWebsiteWizard } from '@/components/wizard/CreateWebsiteWizard';

interface Project {
  id: string;
  name: string;
  profession: string;
  status: string;
  created_at: string;
  subdomain?: string | null;
  is_published?: boolean;
}

export default function Dashboard() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch user's projects
  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, profession, status, created_at, subdomain, is_published')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoadingProjects(false);
    }

    fetchProjects();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user's display name from email
  const displayName = user?.email?.split('@')[0] || 'there';

  const getStatusBadge = (project: Project) => {
    if (project.is_published) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Published
        </span>
      );
    }
    
    switch (project.status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        );
      case 'generated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600 border border-gray-500/20">
            {project.status}
          </span>
        );
    }
  };

  const getProfessionLabel = (profession: string) => {
    switch (profession) {
      case 'doctor':
        return '🩺 Doctor';
      case 'dentist':
        return '🦷 Dentist';
      case 'pharmacist':
        return '💊 Pharmacist';
      default:
        return profession;
    }
  };

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
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              {projects.length > 0 
                ? 'Manage your healthcare websites below.'
                : 'Ready to create your professional healthcare website?'
              }
            </p>
          </div>
          {projects.length > 0 && (
            <Button size="lg" onClick={() => setWizardOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              New Website
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loadingProjects && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Projects Grid */}
        {!loadingProjects && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {getProfessionLabel(project.profession)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingProjects && projects.length === 0 && (
          <Card className="max-w-2xl mx-auto border-dashed border-2">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Create Your First Website</CardTitle>
              <CardDescription className="text-base">
                Get started by creating your professional website. Our AI will help you build a stunning site in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-4">
              <Button size="lg" className="h-12 px-8" onClick={() => setWizardOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create New Website
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Free to start
              </p>
            </CardContent>
          </Card>
        )}

        {/* Wizard Modal */}
        <CreateWebsiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      </main>
    </div>
  );
}
