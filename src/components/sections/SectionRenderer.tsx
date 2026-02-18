import type { SiteSection } from './types';
import { getSectionComponent } from './registry';

interface SectionRendererProps {
  sections: SiteSection[];
  isEditing?: boolean;
  selectedSectionId?: string | null;
  onSectionClick?: (sectionId: string) => void;
  onSectionUpdate?: (sectionId: string, props: Record<string, any>) => void;
}

export function SectionRenderer({ sections, isEditing, selectedSectionId, onSectionClick, onSectionUpdate }: SectionRendererProps) {
  return (
    <div className="min-h-screen">
      {sections.map((section) => {
        const Component = getSectionComponent(section.type);
        if (!Component) {
          return (
            <div key={section.id} className="py-8 text-center text-muted-foreground">
              <p>Bilinmeyen bölüm tipi: {section.type}</p>
            </div>
          );
        }

        const isSelected = selectedSectionId === section.id;

        return (
          <div
            key={section.id}
            className={`relative group ${isEditing ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : isEditing ? 'hover:ring-1 hover:ring-primary/30' : ''}`}
            onClick={() => isEditing && onSectionClick?.(section.id)}
          >
            <Component
              section={section}
              isEditing={isEditing}
              onUpdate={(props) => onSectionUpdate?.(section.id, props)}
            />

            {/* Editor overlay actions */}
            {isEditing && (
              <div className={`absolute top-2 right-2 flex gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                  {section.type}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
