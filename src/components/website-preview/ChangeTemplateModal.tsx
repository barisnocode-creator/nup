import { useState, useMemo } from 'react';
import { RefreshCw, X, Check, Eye, LayoutGrid } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getAllTemplates, type TemplateConfig } from '@/templates';
import { cn } from '@/lib/utils';

interface ChangeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

export function ChangeTemplateModal({
  isOpen,
  onClose,
  currentTemplateId,
  onSelectTemplate,
  onPreview,
}: ChangeTemplateModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Get all templates and shuffle them on regenerate
  const templates = useMemo(() => {
    const allTemplates = getAllTemplates();
    // Shuffle the templates based on shuffleKey
    if (shuffleKey > 0) {
      return [...allTemplates].sort(() => Math.random() - 0.5);
    }
    return allTemplates;
  }, [shuffleKey]);

  const handleRegenerate = () => {
    setShuffleKey(prev => prev + 1);
  };

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplateId(templateId === selectedTemplateId ? null : templateId);
  };

  const handlePreview = (templateId: string) => {
    onPreview(templateId);
    onClose();
  };

  const handleSelect = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Change template</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Your original images and text will be used, but they may be rearranged to fit the new layout.
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </DialogHeader>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((template) => {
              const isCurrentTemplate = template.id === currentTemplateId;
              const isSelected = template.id === selectedTemplateId;

              return (
                <div
                  key={template.id}
                  className={cn(
                    'group relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer',
                    isCurrentTemplate && 'ring-2 ring-primary ring-offset-2',
                    isSelected && !isCurrentTemplate && 'border-primary',
                    !isSelected && !isCurrentTemplate && 'border-border hover:border-muted-foreground/50'
                  )}
                  onClick={() => handleTemplateClick(template.id)}
                >
                  {/* Current Template Badge */}
                  {isCurrentTemplate && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="gap-1 bg-primary text-primary-foreground">
                        <Check className="w-3 h-3" />
                        Your template
                      </Badge>
                    </div>
                  )}

                  {/* Preview Image */}
                  <AspectRatio ratio={4 / 5}>
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay with Actions */}
                    {isSelected && !isCurrentTemplate && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(template.id);
                          }}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(template.id);
                          }}
                          className="gap-2"
                        >
                          <LayoutGrid className="w-4 h-4" />
                          Use this template
                        </Button>
                      </div>
                    )}
                  </AspectRatio>

                  {/* Template Info */}
                  <div className="p-3 bg-background">
                    <h3 className="font-medium text-sm truncate">{template.name}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {template.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
