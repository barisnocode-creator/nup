import { useCallback } from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react';
import { getSectionComponent } from '@/components/sections/registry';
import type { SiteSection } from '@/components/sections/types';
import { cn } from '@/lib/utils';

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
}

export function EditorCanvas({
  sections,
  isEditing,
  selectedSectionId,
  onSelectSection,
  onUpdateProps,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
  onAddAt,
}: EditorCanvasProps) {
  const handleSectionClick = useCallback((e: React.MouseEvent, sectionId: string) => {
    if (!isEditing) return;
    e.stopPropagation();
    onSelectSection(sectionId);
  }, [isEditing, onSelectSection]);

  const handleCanvasClick = useCallback(() => {
    if (isEditing) onSelectSection(null);
  }, [isEditing, onSelectSection]);

  return (
    <div className="flex-1 overflow-auto" onClick={handleCanvasClick}>
      <div className="min-h-screen">
        {sections.map((section, index) => {
          const Component = getSectionComponent(section.type);
          const isSelected = selectedSectionId === section.id;
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;

          return (
            <div key={section.id}>
              {/* Add button between sections */}
              {isEditing && index === 0 && (
                <AddBetweenButton onClick={() => onAddAt(0)} />
              )}

              <div
                className={cn(
                  'relative group',
                  isEditing && 'cursor-pointer',
                )}
                onClick={(e) => handleSectionClick(e, section.id)}
              >
                {/* Section content */}
                {Component ? (
                  <Component
                    section={section}
                    isEditing={isEditing}
                    onUpdate={(props) => onUpdateProps(section.id, props)}
                  />
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Bilinmeyen bölüm: {section.type}</p>
                  </div>
                )}

                {/* Hover / Selection overlay */}
                {isEditing && (
                  <>
                    {/* Border overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 pointer-events-none transition-all duration-150 z-10',
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'ring-0 group-hover:ring-1 group-hover:ring-primary/30'
                      )}
                    />

                    {/* Section label + actions */}
                    <div
                      className={cn(
                        'absolute top-2 right-2 flex items-center gap-1 z-20 transition-opacity duration-150',
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      )}
                    >
                      {/* Type label */}
                      <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                        {section.type}
                      </div>

                      {/* Action buttons - only when selected */}
                      {isSelected && (
                        <div className="flex items-center gap-0.5 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-0.5 shadow-sm">
                          {!isFirst && (
                            <ActionBtn icon={ArrowUp} title="Yukarı taşı" onClick={(e) => { e.stopPropagation(); onMoveUp(section.id); }} />
                          )}
                          {!isLast && (
                            <ActionBtn icon={ArrowDown} title="Aşağı taşı" onClick={(e) => { e.stopPropagation(); onMoveDown(section.id); }} />
                          )}
                          <ActionBtn icon={Copy} title="Çoğalt" onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }} />
                          {!section.locked && (
                            <ActionBtn icon={Trash2} title="Sil" onClick={(e) => { e.stopPropagation(); onRemove(section.id); }} destructive />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Add button after section */}
              {isEditing && (
                <AddBetweenButton onClick={() => onAddAt(index + 1)} />
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {sections.length === 0 && isEditing && (
          <div className="flex items-center justify-center min-h-[400px]">
            <button
              onClick={() => onAddAt(0)}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
            >
              <Plus className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Bölüm Ekle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddBetweenButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative h-0 z-10 flex items-center justify-center group/add">
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="absolute opacity-0 group-hover/add:opacity-100 focus:opacity-100 transition-opacity duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg hover:bg-primary/90 -translate-y-1/2"
      >
        <Plus className="w-3 h-3" />
        Ekle
      </button>
      <div className="absolute inset-x-0 h-px bg-transparent group-hover/add:bg-primary/20 transition-colors" />
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick, destructive }: { icon: any; title: string; onClick: (e: React.MouseEvent) => void; destructive?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        destructive
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
