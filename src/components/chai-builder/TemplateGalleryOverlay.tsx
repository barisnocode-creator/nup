import { useEffect, useRef, useCallback, useState, Suspense, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Eye } from 'lucide-react';
import { getAllTemplates, getTemplate, type TemplateConfig } from '@/templates';
import { useIsMobile } from '@/hooks/use-mobile';
import type { GeneratedContent } from '@/types/generated-website';

interface TemplateGalleryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onPreview: (templateId: string) => void;
  generatedContent?: GeneratedContent | null;
}

// Default demo content for preview when no generated_content exists
const defaultDemoContent: GeneratedContent = {
  pages: {
    home: {
      hero: { title: 'Hoş Geldiniz', subtitle: 'Profesyonel Hizmet', description: 'Size en iyi deneyimi sunmak için buradayız.' },
      welcome: { title: 'Hakkımızda', content: 'Yılların deneyimiyle sizlere hizmet veriyoruz.' },
      highlights: [
        { title: 'Uzman Kadro', description: 'Alanında uzman ekibimiz.', icon: '⭐' },
        { title: 'Kaliteli Hizmet', description: 'En yüksek standartlarda.', icon: '✨' },
        { title: 'Müşteri Memnuniyeti', description: 'Müşterilerimizin mutluluğu önceliğimiz.', icon: '💎' },
      ],
      statistics: [
        { value: '10+', label: 'Yıl Deneyim' },
        { value: '500+', label: 'Mutlu Müşteri' },
        { value: '50+', label: 'Proje' },
        { value: '%98', label: 'Memnuniyet' },
      ],
    },
    about: {
      hero: { title: 'Hakkımızda', subtitle: 'Bizi Tanıyın' },
      story: { title: 'Hikayemiz', content: 'Yılların deneyimiyle sizlere en iyi hizmeti sunuyoruz.' },
      values: [{ title: 'Kalite', description: 'Her işte kaliteyi ön planda tutuyoruz.' }],
      team: { title: 'Ekibimiz', description: 'Uzman kadromuzla yanınızdayız.' },
    },
    services: {
      hero: { title: 'Hizmetlerimiz', subtitle: 'Neler Yapıyoruz' },
      intro: { title: 'Hizmetler', content: 'Geniş hizmet yelpazemizle sizlere destek oluyoruz.' },
      servicesList: [
        { title: 'Danışmanlık', description: 'Profesyonel danışmanlık hizmeti.', icon: '📋' },
        { title: 'Eğitim', description: 'Kapsamlı eğitim programları.', icon: '📚' },
      ],
    },
    contact: {
      hero: { title: 'İletişim', subtitle: 'Bize Ulaşın' },
      info: { address: 'İstanbul, Türkiye', phone: '+90 555 000 0000', email: 'info@example.com', hours: 'Pazartesi - Cumartesi: 09:00 - 18:00' },
      form: { title: 'Mesaj Gönderin', subtitle: 'Sorularınız için formu doldurun.' },
    },
  },
  metadata: { siteName: 'Demo İşletme', tagline: 'Profesyonel Hizmet' },
};

// Error boundary for template render failures
class TemplateErrorBoundary extends Component<{ children: ReactNode; fallbackImage: string }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <img src={this.props.fallbackImage} alt="Template preview" className="w-full h-full object-cover object-top" />;
    }
    return this.props.children;
  }
}

// Hook for responsive card sizing
function useResponsiveCard() {
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardWidth = isMobile ? 200 : isTablet ? 240 : 280;
  const useLiveRender = !isMobile;

  return { isMobile, isTablet, cardWidth, useLiveRender };
}

export function TemplateGalleryOverlay({
  isOpen,
  onClose,
  currentTemplateId,
  onPreview,
  generatedContent,
}: TemplateGalleryOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const templates = getAllTemplates();
  const { isMobile, cardWidth } = useResponsiveCard();

  const content = generatedContent || defaultDemoContent;

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

  // Horizontal scroll with mouse wheel (desktop only)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isMobile || !scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, [isMobile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Template galerisi"
          className="fixed inset-0 z-[80] bg-white flex flex-col"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            willChange: 'transform',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: isMobile ? 0.25 : 0.3, ease: [0.32, 0.72, 0, 1] as any }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Template Değiştir</h2>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Kapat"
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
          </div>

          {/* Cards area */}
          <div className="flex-1 flex items-center overflow-hidden px-4 md:px-6">
            <div
              ref={scrollRef}
              onWheel={handleWheel}
              className="flex gap-3 md:gap-5 overflow-x-auto pb-4 pt-2 scrollbar-hide"
              style={{
                scrollBehavior: 'smooth',
                scrollSnapType: isMobile ? 'x mandatory' : undefined,
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              {sorted.map((tpl) => {
                const isCurrent = tpl.id === currentTemplateId;
                return (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isCurrent={isCurrent}
                    content={content}
                    cardWidth={cardWidth}
                    isMobile={isMobile}
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
  content,
  cardWidth,
  isMobile,
  onPreview,
}: {
  template: TemplateConfig;
  isCurrent: boolean;
  content: GeneratedContent;
  cardWidth: number;
  isMobile: boolean;
  onPreview: () => void;
}) {
  const TemplateComponent = getTemplate(template.id);
  const RENDER_WIDTH = 1200;
  const ASPECT_RATIO = 3 / 5;
  const cardHeight = cardWidth / ASPECT_RATIO;
  const scale = cardWidth / RENDER_WIDTH;
  const renderHeight = cardHeight / scale;

  return (
    <div
      role="button"
      aria-label={`${template.name} template'i`}
      aria-current={isCurrent ? 'true' : undefined}
      className="group shrink-0 flex flex-col"
      style={{
        width: cardWidth,
        scrollSnapAlign: isMobile ? 'start' : undefined,
        touchAction: 'pan-x',
      }}
    >
      {/* Template render / static image */}
      <div
        className="relative rounded-xl overflow-hidden shadow-md transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl"
        style={{
          width: cardWidth,
          height: cardHeight,
          willChange: 'transform, box-shadow',
        }}
      >
        {isMobile ? (
          /* Mobile: static preview image for performance */
          <img
            src={template.preview}
            alt={template.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          /* Desktop/Tablet: live scaled render */
          <div
            style={{
              width: RENDER_WIDTH,
              height: renderHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <TemplateErrorBoundary fallbackImage={template.preview}>
              <Suspense fallback={
                <img src={template.preview} alt={template.name} className="w-full h-full object-cover object-top" />
              }>
                <TemplateComponent
                  content={content}
                  colorPreference="warm"
                  isEditable={false}
                />
              </Suspense>
            </TemplateErrorBoundary>
          </div>
        )}

        {/* Current badge */}
        {isCurrent && (
          <div className={`absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1 md:gap-1.5 bg-emerald-500 text-white font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm z-10 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Kullanılan
          </div>
        )}

        {/* Hover overlay (desktop only) */}
        {!isCurrent && !isMobile && (
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer z-10"
            onClick={onPreview}
          >
            <button className="flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Önizle
            </button>
          </div>
        )}
      </div>

      {/* Info + mobile preview button */}
      <div className="mt-2 md:mt-3 px-1 flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-900">{template.name}</p>
          <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{template.category}</p>
        </div>
        {/* Mobile: always-visible preview button */}
        {!isCurrent && isMobile && (
          <button
            onClick={onPreview}
            className="flex items-center gap-1 text-[11px] font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md active:bg-purple-100 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Önizle
          </button>
        )}
      </div>
    </div>
  );
}
