import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, LayoutGrid, Eye, Sparkles } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getAllTemplates } from '@/templates';
import { getCatalogTemplate } from '@/templates/catalog';
import { mapContentToTemplate, type ProjectData } from '@/templates/catalog/contentMapper';
import { filterIncompatibleSections } from '@/templates/catalog/mappers';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import type { SiteSection } from '@/components/sections/types';
import { cn } from '@/lib/utils';
import { templateToPreset } from '@/themes/presets';
import { hexToHSL } from '@/lib/utils';
import { loadGoogleFont } from '@/hooks/useThemeColors';
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
    let mapped = mapContentToTemplate(def.sections, projectData);
    // Extra safety: filter incompatible sections even if mapSections already does it
    if (sector) {
      mapped = filterIncompatibleSections(mapped, sector);
    }
    return mapped.map((sec, i) => ({
      id: `preview_${sec.type}_${i}`,
      type: sec.type,
      props: sec.defaultProps,
      locked: sec.required,
    }));
  }, [previewTemplateId, projectData]);

  // Apply theme CSS variables when previewing a template
  useEffect(() => {
    if (!previewTemplateId) return;
    const preset = templateToPreset[previewTemplateId];
    if (!preset) return;

    const root = document.documentElement;
    const savedValues: Record<string, string> = {};

    // Save current values and apply preset colors
    if (preset.colors) {
      Object.entries(preset.colors).forEach(([key, vals]) => {
        if (Array.isArray(vals) && vals.length > 0) {
          const cssVar = `--${key}`;
          savedValues[cssVar] = root.style.getPropertyValue(cssVar);
          const hslVal = vals[0].startsWith('#') ? hexToHSL(vals[0]) : vals[0];
          root.style.setProperty(cssVar, hslVal);
        }
      });
    }

    // Apply fonts
    if (preset.fontFamily?.heading) {
      loadGoogleFont(preset.fontFamily.heading);
      savedValues['--font-heading'] = root.style.getPropertyValue('--font-heading');
      root.style.setProperty('--font-heading', `'${preset.fontFamily.heading}', sans-serif`);
    }
    if (preset.fontFamily?.body) {
      loadGoogleFont(preset.fontFamily.body);
      savedValues['--font-body'] = root.style.getPropertyValue('--font-body');
      root.style.setProperty('--font-body', `'${preset.fontFamily.body}', sans-serif`);
    }
    if (preset.borderRadius) {
      savedValues['--radius'] = root.style.getPropertyValue('--radius');
      root.style.setProperty('--radius', preset.borderRadius);
    }

    return () => {
      // Restore previous values
      Object.entries(savedValues).forEach(([k, v]) => {
        if (v) root.style.setProperty(k, v);
        else root.style.removeProperty(k);
      });
    };
  }, [previewTemplateId]);
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
        <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none overflow-hidden flex flex-col bg-white p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setPreviewTemplateId(null)} className="gap-2 text-gray-700 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
              <span className="text-sm font-medium text-gray-900">
                {previewTemplate?.name || previewTemplateId} — Önizleme
              </span>
            </div>
            <Button size="sm" onClick={() => { onSelectTemplate(previewTemplateId); onClose(); }} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0">
              <LayoutGrid className="w-4 h-4" />
              Bu Şablonu Kullan
            </Button>
          </div>
          <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 flex-shrink-0">
            <p className="text-xs text-orange-700">
              Metin içerikleri işletme verilerinizi göstermektedir. Görseller şablon varsayılanlarını kullanır.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
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
      <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none overflow-hidden flex flex-col bg-white p-0">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 flex-shrink-0 bg-gray-50 border-b border-gray-200">
          <div>
            <DialogHeader className="space-y-0 p-0">
              <DialogTitle className="text-2xl font-bold text-gray-900">Şablon Değiştir</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1.5">
                Mevcut görsel ve metinleriniz korunur, yeni düzene uyarlanır.
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2 flex-shrink-0 mt-1 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
            <Sparkles className="w-4 h-4" />
            Karıştır
          </Button>
        </div>

        {/* Carousel */}
        <div className="flex-1 min-h-0 flex flex-col bg-white">
          {sector && (
            <p className="text-xs text-gray-500 px-8 pt-4 pb-1">
              İşletme türünüze özel şablonlar gösteriliyor
            </p>
          )}
          <div
            ref={scrollRef}
            data-carousel-scroll
            className="flex-1 flex flex-row gap-5 overflow-x-auto overflow-y-hidden px-8 py-6 items-start"
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
                    'relative w-[340px] h-[560px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-lg',
                    isSelected && !isCurrent && 'ring-3 ring-orange-500 border-2 border-orange-500',
                    isCurrent && 'ring-2 ring-orange-400/60 border-2 border-orange-400',
                    !isSelected && !isCurrent && 'border-2 border-gray-200 hover:border-gray-300',
                  )}
                  style={{ scrollSnapAlign: 'start' }}
                  onClick={() => {
                    if (!isCurrent) setSelectedTemplateId(template.id);
                  }}
                >
                  {/* Current template badge */}
                  {isCurrent && (
                    <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                      Mevcut şablon
                    </div>
                  )}

                  {/* Selected badge (non-current) */}
                  {isSelected && !isCurrent && (
                    <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                      Seçili
                    </div>
                  )}

                  {/* Thumbnail */}
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=800&fit=crop';
                    }}
                  />

                  {/* Always-visible bottom gradient with name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-4 px-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-[10px] font-medium uppercase tracking-wider rounded-full px-2.5 py-0.5 mb-1.5">
                      {template.category}
                    </span>
                    <p className="text-white font-semibold text-base leading-tight">{template.name}</p>
                  </div>

                  {/* Hover overlay — preview button */}
                  <div className={cn(
                    'absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200',
                    'opacity-0 group-hover:opacity-100',
                  )}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1.5 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
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
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="text-gray-600 border-gray-300 hover:bg-gray-100">
            İptal
          </Button>
          <Button onClick={handleApply} disabled={isApplyDisabled} className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-200 disabled:text-gray-400 border-0">
            Şablonu Uygula →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
