import { Home, Palette, Layout, Plus, HelpCircle, Eye, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  projectName: string;
  currentSection: string;
  onNavigate: (section: string) => void;
  onCustomize: () => void;
  onAddSection: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onDashboard: () => void;
  isPublished?: boolean;
}

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'values', label: 'Values' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
  { id: 'cta', label: 'CTA' },
];

export function EditorToolbar({
  projectName,
  currentSection,
  onNavigate,
  onCustomize,
  onAddSection,
  onPreview,
  onPublish,
  onDashboard,
  isPublished = false,
}: EditorToolbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDashboard}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Customize Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCustomize}
            className="gap-2"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </Button>

          {/* Pages Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Layout className="w-4 h-4" />
                <span className="hidden sm:inline">Pages</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-background border shadow-lg z-[100]">
              {sections.map((section) => (
                <DropdownMenuItem
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className={currentSection === section.id ? 'bg-accent' : ''}
                >
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Section Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddSection}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>

          {/* Help Button */}
          <Button variant="ghost" size="sm" className="gap-2">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Center Section - Project Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <span className="text-sm font-medium text-muted-foreground">{projectName}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Preview Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          {/* Publish Button */}
          <Button
            size="sm"
            onClick={onPublish}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>{isPublished ? 'Published' : 'Publish'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
