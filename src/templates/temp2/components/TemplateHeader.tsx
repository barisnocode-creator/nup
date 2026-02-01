import { EditableText } from '@/components/website-preview/EditableText';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface BoldHeaderProps {
  siteName: string;
  currentPage: string;
  onNavigate: (sectionId: string) => void;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  hasBlog?: boolean;
}

const navItems = [
  { id: 'hero', label: 'ANA SAYFA' },
  { id: 'about', label: 'HAKKIMIZDA' },
  { id: 'services', label: 'HİZMETLER' },
  { id: 'gallery', label: 'ÇALIŞMALAR' },
  { id: 'contact', label: 'İLETİŞİM' },
];

export function BoldHeader({
  siteName,
  currentPage,
  onNavigate,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
  hasBlog = false,
}: BoldHeaderProps) {
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    onNavigate(sectionId);
  };

  const isSiteNameSelected = editorSelection?.fields.some(f => f.fieldPath === 'metadata.siteName');

  return (
    <header className="sticky top-14 z-40 py-6 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Name - Bold uppercase style */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center">
              <span className="text-gray-950 font-black text-xl">
                {siteName.charAt(0)}
              </span>
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
              className="text-xl font-black uppercase tracking-widest text-white"
            />
          </div>

          {/* Navigation - Uppercase with sharp look */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`text-sm font-bold tracking-wider transition-colors ${
                  currentPage === id
                    ? 'text-white border-b-2 border-white pb-1'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <button className="hidden md:block px-6 py-3 bg-white text-gray-950 font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors">
            Başla
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
