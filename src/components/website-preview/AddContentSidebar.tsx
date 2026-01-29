import { X, FileText, PenLine, FolderPlus, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
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
      <SheetContent side="left" noOverlay hideCloseButton className="w-[280px] p-0 overflow-y-auto shadow-xl border-r">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
          <span className="text-sm font-medium">
            {showPageTypes ? 'Select Page Type' : 'Add'}
          </span>
          <button 
            onClick={() => showPageTypes ? setShowPageTypes(false) : onClose()} 
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="py-1">
          {showPageTypes ? (
            // Page Type Selection
            <div>
              {pageTypes.map((type) => {
                const exists = isPageExists(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => !exists && handleAddPage(type.id)}
                    disabled={exists}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                      exists 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {exists ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 text-sm">
                      {type.label}
                      {exists && (
                        <span className="text-xs text-muted-foreground ml-2">(Added)</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Main Menu
            <div>
              {/* Add Page Option */}
              <button
                onClick={() => setShowPageTypes(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm">Page</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </button>

              {/* Add Blog Post Option */}
              <button
                onClick={handleAddBlogPost}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
              >
                <PenLine className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm">Blog post</span>
              </button>

              {/* Add Folder Option (Phase 2) */}
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-2.5 opacity-50 cursor-not-allowed text-left"
              >
                <FolderPlus className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm">
                  Folder
                  <span className="text-xs text-muted-foreground ml-2">(Soon)</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
