import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Eye } from 'lucide-react';
import { getAllTemplates, type TemplateConfig } from '@/templates';

interface TemplateGalleryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onPreview: (templateId: string) => void;
}



export function TemplateGalleryOverlay({
  isOpen,
  onClose,
  currentTemplateId,
  onPreview,
}: TemplateGalleryOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const templates = getAllTemplates();

  // Sort: current template first
  const sorted = [...templates].sort((a, b) => {
    if (a.id === currentTemplateId) return -1;
    if (b.id === currentTemplateId) return 1;
    return 0;
  });

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => closeRef.current?.focus());
    }
  }, [isOpen]);

  // Horizontal scroll with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    // Convert vertical scroll to horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Template galerisi"
          className="fixed inset-0 z-[80] bg-white flex flex-col"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] as any }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Template Değiştir</h2>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Kapat"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cards area */}
          <div className="flex-1 flex items-center overflow-hidden px-6">
            <div
              ref={scrollRef}
              onWheel={handleWheel}
              className="flex gap-5 overflow-x-auto pb-4 pt-2 scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              {sorted.map((tpl) => {
                const isCurrent = tpl.id === currentTemplateId;
                return (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isCurrent={isCurrent}
                    onPreview={() => {
                      if (!isCurrent) onPreview(tpl.id);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TemplateCard({
  template,
  isCurrent,
  onPreview,
}: {
  template: TemplateConfig;
  isCurrent: boolean;
  onPreview: () => void;
}) {
  return (
    <div
      role="button"
      aria-label={`${template.name} template'i`}
      aria-current={isCurrent ? 'true' : undefined}
      className="group shrink-0 flex flex-col"
      style={{ width: 280 }}
    >
      {/* Preview image with 3:5 ratio */}
      <div
        className="relative rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:shadow-xl group-hover:scale-[1.02]"
        style={{ aspectRatio: '3/5' }}
      >
        <img
          src={template.preview}
          alt={template.name}
          loading="lazy"
          className="w-full h-full object-cover object-top"
        />

        {/* Current badge */}
        {isCurrent && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            <Check className="w-3.5 h-3.5" />
            Kullanılan
          </div>
        )}

        {/* Hover overlay for non-current */}
        {!isCurrent && (
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
            onClick={onPreview}
          >
            <button className="flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Önizle
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <p className="text-sm font-medium text-gray-900">{template.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{template.category}</p>
      </div>
    </div>
  );
}
