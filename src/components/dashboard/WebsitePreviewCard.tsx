import { Globe, ExternalLink, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  profession: string;
  status: string;
  subdomain?: string | null;
  is_published?: boolean;
  created_at: string;
}

interface WebsitePreviewCardProps {
  project: Project;
}

export function WebsitePreviewCard({ project }: WebsitePreviewCardProps) {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (project.is_published) {
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
          <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
          Published
        </Badge>
      );
    }
    
    switch (project.status) {
      case 'draft':
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Draft
          </Badge>
        );
      case 'generated':
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Ready
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {project.status}
          </Badge>
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Preview Area - Placeholder gradient */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center mx-auto mb-2">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-medium">{project.name}</p>
          <p className="text-xs text-muted-foreground">{getProfessionLabel(project.profession)}</p>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
      </div>

      {/* Card Footer */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.subdomain ? `${project.subdomain}.lovable.app` : 'Not published yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {project.is_published && project.subdomain && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/site/${project.subdomain}`, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={() => navigate(`/project/${project.id}`)}
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
