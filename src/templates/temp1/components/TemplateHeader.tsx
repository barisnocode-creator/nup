import { EditableText } from '@/components/website-preview/EditableText';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface TemplateHeaderProps {
  siteName: string;
  currentPage: string;
  onNavigate: (sectionId: string) => void;
  isDark: boolean;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  hasBlog?: boolean;
}

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

export function TemplateHeader({
  siteName,
  currentPage,
  onNavigate,
  isDark,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
  hasBlog = false,
}: TemplateHeaderProps) {
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    onNavigate(sectionId);
  };

  const isSiteNameSelected = editorSelection?.fields.some(f => f.fieldPath === 'metadata.siteName');

  return (
    <header className={`sticky top-14 z-40 py-4 border-b backdrop-blur-sm ${
      isDark ? 'border-slate-800 bg-slate-900/95' : 'border-gray-100 bg-white/95'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
              isDark ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
            }`}>
              {siteName.charAt(0)}
            </div>
            <EditableText
              value={siteName}
              fieldPath="metadata.siteName"
              fieldLabel="Site Name"
              sectionTitle="Header"
              sectionId="header"
              as="span"
              isEditable={isEditable}
              isSelected={isSiteNameSelected}
              onSelect={onEditorSelect}
              additionalFields={[
                {
                  label: 'Tagline',
                  fieldPath: 'metadata.tagline',
                  value: '',
                  type: 'text',
                  canRegenerate: true,
                },
              ]}
              className="text-xl font-bold font-display"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === id
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
          <button className={`md:hidden p-2 rounded-lg ${
            isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
