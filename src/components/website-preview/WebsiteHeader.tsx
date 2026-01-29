import { WebsitePage } from '@/types/generated-website';
import { EditableField } from './EditableField';

interface WebsiteHeaderProps {
  siteName: string;
  currentPage: WebsitePage;
  onNavigate: (page: WebsitePage) => void;
  isDark: boolean;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  hasBlog?: boolean;
}

export function WebsiteHeader({ 
  siteName, 
  currentPage, 
  onNavigate, 
  isDark,
  isEditable = false,
  onFieldEdit,
  hasBlog = false
}: WebsiteHeaderProps) {
  const handleSiteNameEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit('metadata.siteName', newValue);
    }
  };

  const pages: { id: WebsitePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    ...(hasBlog ? [{ id: 'blog' as WebsitePage, label: 'Blog' }] : []),
    { id: 'contact', label: 'Contact' },
  ];

  const isActivePage = (pageId: WebsitePage) => {
    if (pageId === 'blog' && currentPage === 'blog-post') return true;
    return currentPage === pageId;
  };

  return (
    <header className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'} border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {isEditable ? (
            <EditableField
              value={siteName}
              fieldPath="metadata.siteName"
              onSave={handleSiteNameEdit}
              className="text-xl font-bold tracking-tight"
              isEditable={isEditable}
            />
          ) : (
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              {siteName}
            </button>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePage(page.id)
                    ? isDark 
                      ? 'bg-white/10 text-white' 
                      : 'bg-primary/10 text-primary'
                    : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
