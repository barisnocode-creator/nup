import { X, FileText, PenLine, FolderPlus, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

interface AddContentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (pageType: string) => void;
  onAddBlogPost: () => void;
  existingPages: string[];
}

const pageTypes = [
  { id: 'about', label: 'About', description: 'Tell your story and build trust' },
  { id: 'services', label: 'Services', description: 'Showcase what you offer' },
  { id: 'contact', label: 'Contact', description: 'Let visitors reach you' },
  { id: 'blog', label: 'Blog', description: 'Share news and articles' },
  { id: 'faq', label: 'FAQ', description: 'Answer common questions' },
  { id: 'pricing', label: 'Pricing', description: 'Display your pricing plans' },
  { id: 'team', label: 'Team', description: 'Introduce your team members' },
  { id: 'portfolio', label: 'Portfolio', description: 'Showcase your work' },
  { id: 'testimonials', label: 'Testimonials', description: 'Show client reviews' },
];

export function AddContentSidebar({
  isOpen,
  onClose,
  onAddPage,
  onAddBlogPost,
  existingPages,
}: AddContentSidebarProps) {
  const [showPageTypes, setShowPageTypes] = useState(false);

  const handleAddPage = (pageType: string) => {
    onAddPage(pageType);
    setShowPageTypes(false);
    onClose();
  };

  const handleAddBlogPost = () => {
    onAddBlogPost();
    onClose();
  };

  const isPageExists = (pageId: string) => existingPages.includes(pageId);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[320px] sm:w-[320px] p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              {showPageTypes ? 'Select Page Type' : 'Add'}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => showPageTypes ? setShowPageTypes(false) : onClose()}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="p-2">
          {showPageTypes ? (
            // Page Type Selection
            <div className="space-y-1">
              {pageTypes.map((type) => {
                const exists = isPageExists(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => !exists && handleAddPage(type.id)}
                    disabled={exists}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      exists 
                        ? 'opacity-50 cursor-not-allowed bg-muted/30' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {exists ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-2">
                        {type.label}
                        {exists && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Added</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            // Main Menu
            <div className="space-y-1">
              {/* Add Page Option */}
              <button
                onClick={() => setShowPageTypes(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Page</div>
                  <div className="text-xs text-muted-foreground">
                    Add a new page to your website
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Add Blog Post Option */}
              <button
                onClick={handleAddBlogPost}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Blog post</div>
                  <div className="text-xs text-muted-foreground">
                    Create content to engage visitors
                  </div>
                </div>
              </button>

              {/* Add Folder Option (Phase 2) */}
              <button
                disabled
                className="w-full flex items-center gap-3 p-3 rounded-lg opacity-50 cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium flex items-center gap-2">
                    Folder
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Coming soon</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Group pages together
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
