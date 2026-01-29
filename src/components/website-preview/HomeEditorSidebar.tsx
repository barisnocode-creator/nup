import { X, ChevronRight, Settings, Image, Type, BarChart3, Users, Briefcase, HelpCircle, Phone, Megaphone, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { GeneratedContent } from '@/types/generated-website';
import { cn } from '@/lib/utils';

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
      <SheetContent side="right" className="w-[320px] sm:w-[320px] p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Home</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="p-2">
          {/* Section List */}
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isGallery = section.id === 'gallery';
              
              return (
                <div key={section.id}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {section.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                  
                  {/* Gallery generate button */}
                  {isGallery && !hasGalleryImages && onGenerateGalleryImages && (
                    <div className="ml-14 mr-3 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateGalleryImages();
                        }}
                        disabled={isGeneratingGallery}
                        className="w-full text-xs gap-2"
                      >
                        {isGeneratingGallery ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Camera className="w-3 h-3" />
                            Generate Gallery Images
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
        <div className="border-t p-3 sticky bottom-0 bg-background">
          <button
            onClick={onPageSettings}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Page Settings</div>
              <div className="text-xs text-muted-foreground">
                SEO, navigation, visibility
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
