import { X, ChevronRight, Settings, Image, Type, BarChart3, Users, Briefcase, HelpCircle, Phone, Megaphone, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GeneratedContent } from '@/types/generated-website';

interface HomeEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: GeneratedContent;
  onSectionSelect: (sectionId: string) => void;
  onPageSettings: () => void;
  onGenerateGalleryImages?: () => void;
  isGeneratingGallery?: boolean;
}

const sections = [
  { 
    id: 'hero', 
    label: 'Hero', 
    icon: Image, 
    description: 'Main heading, subtitle, and featured image' 
  },
  { 
    id: 'statistics', 
    label: 'Statistics', 
    icon: BarChart3, 
    description: 'Key numbers and achievements' 
  },
  { 
    id: 'about', 
    label: 'About', 
    icon: Users, 
    description: 'Your story and values' 
  },
  { 
    id: 'services', 
    label: 'Services', 
    icon: Briefcase, 
    description: 'What you offer' 
  },
  { 
    id: 'gallery', 
    label: 'Gallery', 
    icon: Camera, 
    description: 'Facility images' 
  },
  { 
    id: 'faq', 
    label: 'FAQ', 
    icon: HelpCircle, 
    description: 'Frequently asked questions' 
  },
  { 
    id: 'contact', 
    label: 'Contact', 
    icon: Phone, 
    description: 'Contact information' 
  },
  { 
    id: 'cta', 
    label: 'Call to Action', 
    icon: Megaphone, 
    description: 'Final call to action' 
  },
];

export function HomeEditorSidebar({
  isOpen,
  onClose,
  content,
  onSectionSelect,
  onPageSettings,
  onGenerateGalleryImages,
  isGeneratingGallery = false,
}: HomeEditorSidebarProps) {
  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    onClose();
  };

  // Check if gallery has images
  const hasGalleryImages = content?.images?.galleryImages && 
    Array.isArray(content.images.galleryImages) && 
    content.images.galleryImages.length > 0;

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
          {/* Section List */}
          <div>
            {sections.map((section) => {
              const Icon = section.icon;
              const isGallery = section.id === 'gallery';
              
              return (
                <div key={section.id}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{section.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </button>
                  
                  {/* Gallery generate button */}
                  {isGallery && !hasGalleryImages && onGenerateGalleryImages && (
                    <div className="ml-8 mr-4 mb-1">
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
              );
            })}
          </div>
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
