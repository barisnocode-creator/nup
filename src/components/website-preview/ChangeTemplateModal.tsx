import { useState, useMemo, useEffect } from 'react';
import { RefreshCw, Check, Eye, LayoutGrid } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getAllTemplates } from '@/templates';
import { cn } from '@/lib/utils';

interface ChangeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

export function ChangeTemplateModal({
  isOpen, onClose, currentTemplateId, onSelectTemplate, onPreview,
}: ChangeTemplateModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    if (isOpen) setSelectedTemplateId(null);
  }, [isOpen]);

  const templates = useMemo(() => {
    const allTemplates = getAllTemplates();
    if (shuffleKey > 0) return [...allTemplates].sort(() => Math.random() - 0.5);
    return allTemplates;
  }, [shuffleKey]);

  const handleRegenerate = () => {
    setShuffleKey(prev => prev + 1);
    setSelectedTemplateId(null);
  };

  const handleTemplateClick = (templateId: string) => {
    if (templateId === currentTemplateId) return;
    setSelectedTemplateId(templateId === selectedTemplateId ? null : templateId);
  };

  const handlePreview = (templateId: string) => {
    onPreview(templateId);
    onClose();
  };

  const handleSelect = (templateId: string) => {
    onSelectTemplate(templateId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Şablon Değiştir</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Mevcut içerikleriniz korunarak yeni düzene aktarılacaktır.
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2 border-gray-200 dark:border-zinc-700">
              <RefreshCw className="w-4 h-4" />
              Karıştır
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((template) => {
              const isCurrentTemplate = template.id === currentTemplateId;
              const isSelected = template.id === selectedTemplateId;

              return (
                <div
                  key={template.id}
                  className={cn(
                    'group relative rounded-lg border-2 overflow-hidden transition-all',
                    isCurrentTemplate && 'ring-2 ring-blue-500 ring-offset-2 cursor-default',
                    !isCurrentTemplate && 'cursor-pointer',
                    isSelected && !isCurrentTemplate && 'border-blue-500',
                    !isSelected && !isCurrentTemplate && 'border-gray-200 dark:border-zinc-700 hover:border-gray-400'
                  )}
                  onClick={() => handleTemplateClick(template.id)}
                >
                  {isCurrentTemplate && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="gap-1 bg-blue-600 text-white">
                        <Check className="w-3 h-3" />
                        Mevcut
                      </Badge>
                    </div>
                  )}

                  <AspectRatio ratio={4 / 5}>
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=500&fit=crop';
                      }}
                    />
                    
                    <div className={cn(
                      'absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 transition-opacity',
                      isSelected && !isCurrentTemplate ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      isCurrentTemplate && 'hidden'
                    )}>
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handlePreview(template.id); }} className="gap-2">
                        <Eye className="w-4 h-4" />
                        Önizle
                      </Button>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSelect(template.id); }} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <LayoutGrid className="w-4 h-4" />
                        Bu Şablonu Kullan
                      </Button>
                    </div>
                  </AspectRatio>

                  <div className="p-3 bg-white dark:bg-zinc-800">
                    <h3 className="font-medium text-sm truncate text-gray-900 dark:text-white">{template.name}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{template.category}</p>
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
