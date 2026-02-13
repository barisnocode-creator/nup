import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Globe, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WebsiteDashboardTab } from '@/components/website-dashboard/WebsiteDashboardTab';
import { BlogTab } from '@/components/website-dashboard/BlogTab';
import { DomainTab } from '@/components/website-dashboard/DomainTab';
import { SettingsTab } from '@/components/website-dashboard/SettingsTab';
import { AppointmentsPanel } from '@/components/dashboard/appointments/AppointmentsPanel';

interface Project {
  id: string;
  name: string;
  subdomain: string | null;
  is_published: boolean | null;
  custom_domain: string | null;
  generated_content: any;
}

export default function WebsiteDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, subdomain, is_published, custom_domain, generated_content')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        navigate('/dashboard');
        return;
      }

      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout activeProjectId={id}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout activeProjectId={id}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Proje bulunamadı</p>
        </div>
      </DashboardLayout>
    );
  }

  const siteUrl = project.subdomain 
    ? `${project.subdomain}.openlucius.com` 
    : 'Site URL belirtilmemiş';

  return (
    <DashboardLayout activeProjectId={id}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Website</h1>
          </div>
          <Button onClick={() => navigate(`/project/${id}`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit website
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Randevular</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Site URL and Status */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{siteUrl}</span>
            <Badge variant={project.is_published ? 'default' : 'secondary'}>
              <span className={`w-2 h-2 rounded-full mr-2 ${project.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              {project.is_published ? 'Published' : 'Unpublished'}
            </Badge>
          </div>

          <TabsContent value="dashboard">
            <WebsiteDashboardTab 
              projectId={id!} 
              isPublished={project.is_published ?? false} 
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsPanel projectId={id!} />
          </TabsContent>

          <TabsContent value="blog">
            <BlogTab projectId={id!} generatedContent={project.generated_content} />
          </TabsContent>

          <TabsContent value="domain">
            <DomainTab 
              projectId={id!} 
              subdomain={project.subdomain} 
              customDomain={project.custom_domain} 
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab 
              projectId={id!} 
              projectName={project.name}
              generatedContent={project.generated_content}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
