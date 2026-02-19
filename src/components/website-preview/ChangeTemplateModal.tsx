import { useState, useMemo, useEffect, useRef } from 'react';
import { RefreshCw, ArrowLeft, LayoutGrid, Eye, Sparkles } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getAllTemplates } from '@/templates';
import { getCatalogTemplate } from '@/templates/catalog';
import { mapContentToTemplate, type ProjectData } from '@/templates/catalog/contentMapper';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import type { SiteSection } from '@/components/sections/types';
import { cn } from '@/lib/utils';

interface ChangeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  projectData?: ProjectData | null;
}

export function ChangeTemplateModal({
  isOpen, onClose, currentTemplateId, onSelectTemplate, onPreview, projectData,
}: ChangeTemplateModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplateId);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedTemplateId(currentTemplateId);
      setPreviewTemplateId(null);
    }
  }, [isOpen, currentTemplateId]);

  const sector = (projectData as any)?.sector as string | undefined;

  const templates = useMemo(() => {
    const all = getAllTemplates();
    let list = shuffleKey > 0 ? [...all].sort(() => Math.random() - 0.5) : [...all];

    if (sector) {
      const lower = sector.toLowerCase();
      const matched: typeof list = [];
      const rest: typeof list = [];
      list.forEach(t => {
        if (t.supportedProfessions?.some(p => p.toLowerCase().includes(lower) || lower.includes(p.toLowerCase()))) {
          matched.push(t);
        } else {
          rest.push(t);
        }
      });
      list = [...matched, ...rest];
    }
    return list;
  }, [shuffleKey, sector]);

  // Live preview sections
  const previewSections = useMemo<SiteSection[]>(() => {
    if (!previewTemplateId) return [];
    const def = getCatalogTemplate(previewTemplateId);
    if (!def) return [];
    const mapped = mapContentToTemplate(def.sections, projectData);
    return mapped.map((sec, i) => ({
      id: `preview_${sec.type}_${i}`,
      type: sec.type,
      props: sec.defaultProps,
      locked: sec.required,
    }));
  }, [previewTemplateId, projectData]);

  const handleRegenerate = () => {
    setShuffleKey(prev => prev + 1);
    setSelectedTemplateId(currentTemplateId);
  };

  const handleApply = () => {
    if (selectedTemplateId && selectedTemplateId !== currentTemplateId) {
      onSelectTemplate(selectedTemplateId);
      onClose();
    }
  };

  // Live preview mode
  if (previewTemplateId) {
    const previewTemplate = templates.find(t => t.id === previewTemplateId);
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[90vw] max-w-[1200px] h-[85vh] overflow-hidden flex flex-col bg-background border-border p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setPreviewTemplateId(null)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
              <span className="text-sm font-medium text-foreground">
                {previewTemplate?.name || previewTemplateId} — Önizleme
              </span>
            </div>
            <Button size="sm" onClick={() => { onSelectTemplate(previewTemplateId); onClose(); }} className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Bu Şablonu Kullan
            </Button>
          </div>
          <div className="px-4 py-2 bg-muted/50 border-b border-border flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              Metin içerikleri işletme verilerinizi göstermektedir. Görseller şablon varsayılanlarını kullanır.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-[1200px] mx-auto">
              <SectionRenderer sections={previewSections} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Gallery mode — horizontal carousel
  const isApplyDisabled = selectedTemplateId === currentTemplateId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[1200px] h-[85vh] overflow-hidden flex flex-col bg-background border-border p-0">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <div>
            <DialogHeader className="space-y-0 p-0">
              <DialogTitle className="text-2xl font-bold text-foreground">Şablon Değiştir</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                Mevcut görsel ve metinleriniz korunur, yeni düzene uyarlanır.
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2 flex-shrink-0 mt-1">
            <Sparkles className="w-4 h-4" />
            Karıştır
          </Button>
        </div>

        {/* Carousel */}
        <div className="flex-1 min-h-0 flex flex-col">
          {sector && (
            <p className="text-xs text-muted-foreground px-8 pb-2">
              İşletme türünüze özel şablonlar gösteriliyor
            </p>
          )}
          <div
            ref={scrollRef}
            className="flex-1 flex flex-row gap-4 overflow-x-auto overflow-y-hidden px-8 pb-6 pt-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingRight: '80px',
              scrollbarWidth: 'none',
            }}
          >
            <style>{`[data-carousel-scroll]::-webkit-scrollbar { display: none; }`}</style>
            {templates.map((template) => {
              const isCurrent = template.id === currentTemplateId;
              const isSelected = template.id === selectedTemplateId;

              return (
                <div
                  key={template.id}
                  className={cn(
                    'relative w-[340px] h-[560px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group',
                    isSelected && !isCurrent && 'border-2 border-primary',
                    isCurrent && 'border-2 border-primary/50',
                    !isSelected && !isCurrent && 'border-2 border-transparent hover:border-border',
                  )}
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={() => {
                    if (!isCurrent) setSelectedTemplateId(template.id);
                  }}
                >
                  {/* Current template badge */}
                  {isCurrent && (
                    <div className="absolute top-3 left-3 z-10 bg-foreground text-background rounded-full px-3 py-1 text-xs font-medium">
                      Mevcut şablon
                    </div>
                  )}

                  {/* Thumbnail */}
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop';
                    }}
                  />

                  {/* Hover overlay */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity duration-200',
                    'opacity-0 group-hover:opacity-100',
                    isCurrent && 'group-hover:opacity-0',
                  )}>
                    <p className="text-white font-medium text-sm mb-2">{template.name}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-fit gap-1.5"
                      onClick={(e) => { e.stopPropagation(); setPreviewTemplateId(template.id); }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Önizle
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleApply} disabled={isApplyDisabled}>
            Şablonu Uygula →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
