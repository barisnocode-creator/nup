import { useCallback } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react';
import { getSectionComponent } from '@/components/sections/registry';
import type { SiteSection } from '@/components/sections/types';
import { cn } from '@/lib/utils';
import { SiteFooter } from '@/components/sections/addable/SiteFooter';
import { SiteHeader } from '@/components/sections/addable/SiteHeader';


const sectionTypeLabels: Record<string, string> = {
  'hero-centered': 'Hero', 'hero-split': 'Hero', 'hero-overlay': 'Hero',
  'HeroCafe': 'Hero', 'services-grid': 'Hizmetler', 'about-section': 'Hakkımızda',
  'statistics-counter': 'İstatistikler', 'testimonials-carousel': 'Yorumlar',
  'TestimonialsCarousel': 'Yorumlar', 'contact-form': 'İletişim', 'ContactForm': 'İletişim',
  'cta-banner': 'CTA', 'CTABanner': 'CTA', 'faq-accordion': 'SSS',
  'image-gallery': 'Galeri', 'pricing-table': 'Fiyatlar', 'appointment-booking': 'Randevu',
  'AppointmentBooking': 'Randevu', 'MenuShowcase': 'Menü', 'CafeStory': 'Hikaye',
  'CafeFeatures': 'Özellikler', 'CafeGallery': 'Galeri',
};

const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

interface EditorCanvasProps {
  sections: SiteSection[];
  isEditing: boolean;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onUpdateProps: (sectionId: string, props: Record<string, any>) => void;
  onMoveUp: (sectionId: string) => void;
  onMoveDown: (sectionId: string) => void;
  onRemove: (sectionId: string) => void;
  onDuplicate: (sectionId: string) => void;
  onAddAt: (index: number) => void;
  previewDevice?: 'desktop' | 'tablet' | 'mobile';
  sector?: string;
  addableSections?: Record<string, boolean>;
  onToggleAddableSection?: (key: string) => void;
  projectName?: string;
}

export function EditorCanvas({
  sections, isEditing, selectedSectionId, onSelectSection,
  onUpdateProps, onMoveUp, onMoveDown, onRemove, onDuplicate, onAddAt,
  previewDevice = 'desktop', sector, addableSections = {}, onToggleAddableSection, projectName,
}: EditorCanvasProps) {
  const handleSectionClick = useCallback((e: React.MouseEvent, sectionId: string) => {
    if (!isEditing) return;
    e.stopPropagation();
    onSelectSection(sectionId);
  }, [isEditing, onSelectSection]);

  const handleCanvasClick = useCallback(() => {
    if (isEditing) onSelectSection(null);
  }, [isEditing, onSelectSection]);

  const maxWidth = deviceWidths[previewDevice];

  const hasHeader = sections.some(s => s.type === 'AddableSiteHeader');

  return (
    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-zinc-900" onClick={handleCanvasClick}>
      <div
        className={cn('min-h-screen mx-auto transition-all duration-300 bg-background shadow-lg', previewDevice !== 'desktop' && 'my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700')}
        style={{ maxWidth }}
      >
        {/* Auto-inject site header if not present */}
        {!hasHeader && (
          <SiteHeader
            section={{ id: '__header__', type: 'AddableSiteHeader', props: { siteName: projectName || '' } }}
            sections={sections}
          />
        )}

        {sections.map((section, index) => {
          const Component = getSectionComponent(section.type);
          const isSelected = selectedSectionId === section.id;
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;

          return (
            <div key={section.id}>
              {isEditing && index === 0 && <AddBetweenButton onClick={() => onAddAt(0)} />}
              <div className={cn('relative group', isEditing && 'cursor-pointer')} onClick={(e) => handleSectionClick(e, section.id)}>
                {Component ? (
                  <Component section={section} isEditing={isEditing} onUpdate={(props) => onUpdateProps(section.id, props)} />
                ) : (
                  <div className="py-8 text-center text-gray-500"><p>Bilinmeyen bölüm: {section.type}</p></div>
                )}
                {isEditing && (
                  <>
                    <div className={cn('absolute inset-0 pointer-events-none transition-all duration-150 z-10',
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-0 group-hover:ring-1 group-hover:ring-blue-400/30')} />
                    <div className={cn('absolute top-2 right-2 flex items-center gap-1 z-20 transition-opacity duration-150',
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                        {sectionTypeLabels[section.type] || section.type}
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg p-0.5 shadow-sm">
                          {!isFirst && <ActionBtn icon={ArrowUp} title="Yukarı taşı" onClick={(e) => { e.stopPropagation(); onMoveUp(section.id); }} />}
                          {!isLast && <ActionBtn icon={ArrowDown} title="Aşağı taşı" onClick={(e) => { e.stopPropagation(); onMoveDown(section.id); }} />}
                          <ActionBtn icon={Copy} title="Çoğalt" onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }} />
                          {!section.locked && <ActionBtn icon={Trash2} title="Sil" onClick={(e) => { e.stopPropagation(); onRemove(section.id); }} destructive />}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {isEditing && <AddBetweenButton onClick={() => onAddAt(index + 1)} />}
            </div>
          );
        })}

        {sections.length === 0 && isEditing && (
          <div className="flex items-center justify-center min-h-[400px]">
            <button onClick={() => onAddAt(0)} className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Bölüm Ekle</span>
            </button>
          </div>
        )}

        <SiteFooter
          section={{
            id: '__footer__',
            type: 'AddableSiteFooter',
            props: {},
          }}
          sections={sections}
        />
      </div>
    </div>
  );
}

function AddBetweenButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative h-0 z-10 flex items-center justify-center group/add">
      <button onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="absolute opacity-0 group-hover/add:opacity-100 focus:opacity-100 transition-opacity duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium shadow-lg hover:bg-blue-700 -translate-y-1/2">
        <Plus className="w-3 h-3" /> Ekle
      </button>
      <div className="absolute inset-x-0 h-px bg-transparent group-hover/add:bg-blue-300/30 transition-colors" />
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick, destructive }: { icon: any; title: string; onClick: (e: React.MouseEvent) => void; destructive?: boolean }) {
  return (
    <button onClick={onClick} title={title}
      className={cn('p-1.5 rounded-md transition-colors', destructive ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white')}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
