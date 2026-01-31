import { useState } from 'react';
import { Globe, Image, FileImage, Layout, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ImageType } from '@/pages/Studio';

interface Project {
  id: string;
  name: string;
}

interface ApplyToWebsiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageType: ImageType;
  projects: Project[];
}

type ApplyTarget = 'logo' | 'favicon' | 'ogImage' | 'heroImage';

const applyTargets: { value: ApplyTarget; label: string; icon: typeof Globe; description: string }[] = [
  { value: 'logo', label: 'Logo', icon: FileImage, description: "Header'da görünür" },
  { value: 'favicon', label: 'Favicon', icon: Image, description: 'Browser sekmesi ikonu' },
  { value: 'ogImage', label: 'Sosyal Paylaşım Görseli', icon: Globe, description: 'Link paylaşımlarında görünür' },
  { value: 'heroImage', label: 'Hero Arka Planı', icon: Layout, description: 'Ana sayfa arka planı' },
];

export function ApplyToWebsiteModal({
  open,
  onOpenChange,
  imageUrl,
  imageType,
  projects,
}: ApplyToWebsiteModalProps) {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<ApplyTarget>('logo');
  const [isApplying, setIsApplying] = useState(false);

  // Auto-select first project if only one exists
  useState(() => {
    if (projects.length === 1 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  });

  const handleApply = async () => {
    if (!selectedProject) {
      toast({
        title: "Proje seçin",
        description: "Lütfen bir proje seçin.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);

    try {
      // Fetch current project data
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('generated_content')
        .eq('id', selectedProject)
        .single();

      if (fetchError) throw fetchError;

      const currentContent = (project?.generated_content as Record<string, any>) || {};
      let updatedContent = { ...currentContent };

      // Update the appropriate field based on target
      switch (selectedTarget) {
        case 'logo':
          updatedContent = {
            ...updatedContent,
            siteSettings: {
              ...(updatedContent.siteSettings || {}),
              logo: imageUrl,
            },
          };
          break;
        case 'favicon':
          updatedContent = {
            ...updatedContent,
            siteSettings: {
              ...(updatedContent.siteSettings || {}),
              favicon: imageUrl,
            },
          };
          break;
        case 'ogImage':
          updatedContent = {
            ...updatedContent,
            pageSettings: {
              ...(updatedContent.pageSettings || {}),
              home: {
                ...(updatedContent.pageSettings?.home || {}),
                socialImage: imageUrl,
              },
            },
          };
          break;
        case 'heroImage':
          updatedContent = {
            ...updatedContent,
            images: {
              ...(updatedContent.images || {}),
              heroHome: imageUrl,
            },
          };
          break;
      }

      // Update the project
      const { error: updateError } = await supabase
        .from('projects')
        .update({ generated_content: updatedContent })
        .eq('id', selectedProject);

      if (updateError) throw updateError;

      toast({
        title: "Uygulandı!",
        description: `Görsel ${applyTargets.find(t => t.value === selectedTarget)?.label} olarak kaydedildi.`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error applying image:', error);
      toast({
        title: "Hata",
        description: error.message || "Görsel uygulanırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Web Sitesine Uygula</DialogTitle>
          <DialogDescription>
            Görseli nereye uygulamak istediğinizi seçin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Selection */}
          {projects.length > 1 && (
            <div className="space-y-2">
              <Label>Proje</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Proje seçin" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {projects.length === 1 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{projects[0].name}</p>
            </div>
          )}

          {projects.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <p>Henüz projeniz yok.</p>
              <p className="text-sm">Önce bir web sitesi oluşturun.</p>
            </div>
          )}

          {/* Target Selection */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <Label>Uygulama Hedefi</Label>
              <RadioGroup 
                value={selectedTarget} 
                onValueChange={(v) => setSelectedTarget(v as ApplyTarget)}
                className="space-y-2"
              >
                {applyTargets.map((target) => {
                  const Icon = target.icon;
                  return (
                    <label
                      key={target.value}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={target.value} />
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{target.label}</p>
                        <p className="text-xs text-muted-foreground">{target.description}</p>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* Preview */}
          {imageUrl && (
            <div className="space-y-2">
              <Label>Önizleme</Label>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={isApplying || projects.length === 0 || !selectedProject}
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uygulanıyor...
              </>
            ) : (
              'Uygula'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
