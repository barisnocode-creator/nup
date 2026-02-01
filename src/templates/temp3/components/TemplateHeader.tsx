import { cn } from '@/lib/utils';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface ElegantHeaderProps {
  siteName: string;
  currentPage: string;
  onNavigate: (sectionId: string) => void;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  hasBlog?: boolean;
}

export function ElegantHeader({
  siteName,
  currentPage,
  onNavigate,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
  hasBlog = false,
}: ElegantHeaderProps) {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  if (hasBlog) {
    navItems.push({ id: 'blog', label: 'Blog' });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F3]/95 backdrop-blur-sm border-b border-[rgba(55,50,47,0.08)]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#37322F] flex items-center justify-center">
              <span className="text-white text-sm font-serif font-medium">
                {siteName.charAt(0)}
              </span>
            </div>
            <span className="text-lg font-serif font-medium text-[#37322F]">
              {siteName}
            </span>
          </div>

          {/* Navigation - Pill Style */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-[rgba(55,50,47,0.08)] shadow-sm">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'px-5 py-2 text-sm font-medium rounded-full transition-all duration-200',
                    currentPage === item.id
                      ? 'bg-[#37322F] text-white'
                      : 'text-[#605A57] hover:text-[#37322F] hover:bg-[#F7F5F3]'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* CTA Button */}
          <button className="hidden sm:flex px-6 py-2.5 bg-[#37322F] text-white text-sm font-medium rounded-full hover:bg-[#4a433f] transition-colors">
            Get Started
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-full hover:bg-white transition-colors">
            <svg className="w-5 h-5 text-[#37322F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
