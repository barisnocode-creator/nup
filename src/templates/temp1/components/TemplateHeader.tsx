import { WebsitePage } from '@/types/generated-website';
import { EditableField } from '@/components/website-preview/EditableField';

interface TemplateHeaderProps {
  siteName: string;
  currentPage: WebsitePage;
  onNavigate: (page: WebsitePage) => void;
  isDark: boolean;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  hasBlog?: boolean;
}

export function TemplateHeader({
  siteName,
  currentPage,
  onNavigate,
  isDark,
  isEditable = false,
  onFieldEdit,
  hasBlog = false,
}: TemplateHeaderProps) {
  const navItems: { page: WebsitePage; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'about', label: 'About' },
    { page: 'services', label: 'Services' },
    { page: 'contact', label: 'Contact' },
  ];

  if (hasBlog) {
    navItems.push({ page: 'blog', label: 'Blog' });
  }

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  return (
    <header className={`py-4 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              isDark ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
            }`}>
              {siteName.charAt(0)}
            </div>
            {isEditable ? (
              <EditableField
                value={siteName}
                fieldPath="metadata.siteName"
                onSave={handleFieldEdit}
                className="text-xl font-bold"
                isEditable={isEditable}
              />
            ) : (
              <span className="text-xl font-bold">{siteName}</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page || (currentPage === 'blog-post' && page === 'blog')
                    ? isDark
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
