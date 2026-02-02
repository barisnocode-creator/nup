import { X, ChevronRight, Settings, Image, BarChart3, Users, Briefcase, HelpCircle, Phone, Megaphone, Loader2, Camera, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GeneratedContent } from '@/types/generated-website';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface HomeEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: GeneratedContent;
  onSectionSelect: (sectionId: string) => void;
  onPageSettings: () => void;
  onGenerateGalleryImages?: () => void;
  isGeneratingGallery?: boolean;
  sectionOrder?: string[];
  onReorderSections?: (sourceIndex: number, destIndex: number) => void;
}

const sectionConfig = [
  { id: 'hero', label: 'Hero', icon: Image, description: 'Main heading, subtitle, and featured image' },
  { id: 'statistics', label: 'Statistics', icon: BarChart3, description: 'Key numbers and achievements' },
  { id: 'about', label: 'About', icon: Users, description: 'Your story and values' },
  { id: 'services', label: 'Services', icon: Briefcase, description: 'What you offer' },
  { id: 'gallery', label: 'Gallery', icon: Camera, description: 'Facility images' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
  { id: 'contact', label: 'Contact', icon: Phone, description: 'Contact information' },
  { id: 'cta', label: 'Call to Action', icon: Megaphone, description: 'Final call to action' },
];

const DEFAULT_SECTION_ORDER = ['hero', 'statistics', 'about', 'services', 'gallery', 'faq', 'contact', 'cta'];

export function HomeEditorSidebar({
  isOpen,
  onClose,
  content,
  onSectionSelect,
  onPageSettings,
  onGenerateGalleryImages,
  isGeneratingGallery = false,
  sectionOrder = DEFAULT_SECTION_ORDER,
  onReorderSections,
}: HomeEditorSidebarProps) {
  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    onClose();
  };

  // Check if gallery has images
  const hasGalleryImages = content?.images?.galleryImages && 
    Array.isArray(content.images.galleryImages) && 
    content.images.galleryImages.length > 0;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderSections) return;
    if (result.source.index === result.destination.index) return;
    
    onReorderSections(result.source.index, result.destination.index);
  };

  // Get sections in order
  const orderedSections = sectionOrder
    .map(id => sectionConfig.find(s => s.id === id))
    .filter(Boolean) as typeof sectionConfig;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" noOverlay hideCloseButton className="w-[280px] p-0 overflow-y-auto shadow-xl border-r">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
          <span className="text-sm font-medium">Home</span>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="py-1">
          {/* Section List with Drag & Drop */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {orderedSections.map((section, index) => {
                    const Icon = section.icon;
                    const isGallery = section.id === 'gallery';
                    
                    return (
                      <Draggable 
                        key={section.id} 
                        draggableId={section.id} 
                        index={index}
                        isDragDisabled={!onReorderSections}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'bg-muted shadow-lg rounded-lg' : ''}`}
                          >
                            <div className="flex items-center">
                              {/* Drag Handle */}
                              {onReorderSections && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="pl-2 pr-1 py-2.5 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="w-4 h-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                                </div>
                              )}
                              
                              <button
                                onClick={() => handleSectionClick(section.id)}
                                className="flex-1 flex items-center gap-3 px-2 py-2.5 hover:bg-muted/50 transition-colors text-left"
                              >
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span className="flex-1 text-sm">{section.label}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                              </button>
                            </div>
                            
                            {/* Gallery generate button */}
                            {isGallery && !hasGalleryImages && onGenerateGalleryImages && (
                              <div className="ml-10 mr-4 mb-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGenerateGalleryImages();
                                  }}
                                  disabled={isGeneratingGallery}
                                  className="w-full text-xs gap-2 justify-start text-muted-foreground h-8"
                                >
                                  {isGeneratingGallery ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Camera className="w-3 h-3" />
                                      Generate images
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Page Settings Footer */}
        <div className="border-t py-1 sticky bottom-0 bg-background">
          <button
            onClick={onPageSettings}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm">Page Settings</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
