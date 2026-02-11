import { Globe, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  onDelete?: (projectId: string) => void;
}

export function WebsitePreviewCard({ project, onDelete }: WebsitePreviewCardProps) {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (project.is_published) {
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
          Published
        </Badge>
      );
    }
    
    switch (project.status) {
      case 'draft':
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Draft
          </Badge>
        );
      case 'generated':
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden card-hover group border-border/60">
        {/* Preview Area */}
        <div className="relative h-48 bg-gradient-to-br from-primary/15 via-primary/5 to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">{project.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{getProfessionLabel(project.profession)}</p>
          </div>
          
          {/* Status Badge + Delete */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {getStatusBadge()}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-background/70 backdrop-blur-sm hover:bg-destructive/90 hover:text-destructive-foreground rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Siteyi sil</AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>{project.name}</strong> sitesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(project.id)}
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <CardContent className="p-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {project.subdomain ? `${project.subdomain}.lovable.app` : 'Not published yet'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {project.is_published && project.subdomain && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:text-primary"
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
    </motion.div>
  );
}
