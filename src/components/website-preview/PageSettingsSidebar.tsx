import { X, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface PageSettings {
  title?: string;
  label?: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
  seoDescription?: string;
  socialImage?: string;
}

interface PageSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
  pageSettings?: PageSettings;
  onSettingsChange: (settings: PageSettings) => void;
  onRegenerateTitle: () => void;
  isRegenerating?: boolean;
}

const pageLabels: Record<string, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
  blog: 'Blog',
};

export function PageSettingsSidebar({
  isOpen,
  onClose,
  pageName,
  pageSettings,
  onSettingsChange,
  onRegenerateTitle,
  isRegenerating = false,
}: PageSettingsSidebarProps) {
  const handleTitleChange = (value: string) => {
    onSettingsChange({
      ...pageSettings,
      title: value,
    });
  };

  const handleLabelChange = (value: string) => {
    onSettingsChange({
      ...pageSettings,
      label: value,
    });
  };

  const handleShowInHeaderChange = (checked: boolean) => {
    onSettingsChange({
      ...pageSettings,
      showInHeader: checked,
    });
  };

  const handleShowInFooterChange = (checked: boolean) => {
    onSettingsChange({
      ...pageSettings,
      showInFooter: checked,
    });
  };

  const handleSeoDescriptionChange = (value: string) => {
    onSettingsChange({
      ...pageSettings,
      seoDescription: value,
    });
  };

  const displayLabel = pageLabels[pageName] || pageName;
  const titleLength = pageSettings?.title?.length || 0;
  const descriptionLength = pageSettings?.seoDescription?.length || 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" noOverlay hideCloseButton className="w-[280px] p-0 overflow-y-auto shadow-xl border-r">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
          <span className="text-sm font-medium">{displayLabel} Page</span>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="page-title">Title</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1 text-xs"
                onClick={onRegenerateTitle}
                disabled={isRegenerating}
              >
                <Sparkles className="w-3 h-3" />
                Regenerate
              </Button>
            </div>
            <Input
              id="page-title"
              value={pageSettings?.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title..."
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              SEO title for search results. {titleLength}/60 characters recommended.
            </p>
          </div>

          {/* Label Section */}
          <div className="space-y-2">
            <Label htmlFor="page-label">Navigation Label</Label>
            <Input
              id="page-label"
              value={pageSettings?.label || displayLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Navigation label..."
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              How this page appears in navigation menus.
            </p>
          </div>

          {/* Show Link Section */}
          <div className="space-y-3">
            <Label>Show link in</Label>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-header"
                  checked={pageSettings?.showInHeader ?? true}
                  onCheckedChange={(checked) => handleShowInHeaderChange(checked as boolean)}
                />
                <Label htmlFor="show-header" className="text-sm font-normal cursor-pointer">
                  Header
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-footer"
                  checked={pageSettings?.showInFooter ?? true}
                  onCheckedChange={(checked) => handleShowInFooterChange(checked as boolean)}
                />
                <Label htmlFor="show-footer" className="text-sm font-normal cursor-pointer">
                  Footer
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* SEO Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">SEO</h3>
            
            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={pageSettings?.seoDescription || ''}
                onChange={(e) => handleSeoDescriptionChange(e.target.value)}
                placeholder="Brief description for search engines..."
                className="text-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {descriptionLength}/160 characters recommended.
              </p>
            </div>
          </div>

          <Separator />

          {/* Social Image Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Social Image</h3>
            <p className="text-xs text-muted-foreground">
              Image shown when sharing on social media.
            </p>
            
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors cursor-pointer">
              {pageSettings?.socialImage ? (
                <img 
                  src={pageSettings.socialImage} 
                  alt="Social preview" 
                  className="w-full h-auto rounded-md"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Upload image (1200×630 recommended)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
