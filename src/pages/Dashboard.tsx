import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CreateWebsiteWizard } from '@/components/wizard/CreateWebsiteWizard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WebsitePreviewCard } from '@/components/dashboard/WebsitePreviewCard';
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { user } = useAuth();

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

  // Get user's display name from email
  const displayName = user?.email?.split('@')[0] || 'there';

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get the most recent project for sidebar navigation
  const activeProject = projects[0];

  const handleDeleteProject = async (projectId: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) {
      toast.error('Site silinirken hata oluştu');
      console.error(error);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success('Site silindi');
    }
  };

  // Right panel content
  const rightPanelContent = (
    <div className="space-y-6">
      <GettingStartedChecklist 
        project={activeProject} 
        onCreateWebsite={() => setWizardOpen(true)} 
      />
    </div>
  );

  return (
    <DashboardLayout rightPanel={rightPanelContent} activeProjectId={activeProject?.id}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          {getGreeting()}, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome to Open Lucius
        </p>
      </div>

      {/* Loading State */}
      {loadingProjects && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Projects Section */}
      {!loadingProjects && projects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Websites</h2>
            <Button onClick={() => setWizardOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Website
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <WebsitePreviewCard key={project.id} project={project} onDelete={handleDeleteProject} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingProjects && projects.length === 0 && (
        <Card className="max-w-2xl gradient-border border-dashed border-2">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-105 transition-transform duration-300">
              <Plus className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Create Your First Website</CardTitle>
            <CardDescription className="text-base">
              Get started by creating your professional website. Our AI will help you build a stunning site in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <Button size="lg" className="h-12 px-8 shadow-md hover:shadow-lg transition-shadow" onClick={() => setWizardOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create New Website
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free to start
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mobile: Get Started Card (shown below content) */}
      <div className="xl:hidden mt-8">
        <GettingStartedChecklist 
          project={activeProject} 
          onCreateWebsite={() => setWizardOpen(true)} 
        />
      </div>

      {/* Wizard Modal */}
      <CreateWebsiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </DashboardLayout>
  );
}
