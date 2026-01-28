import { useState } from 'react';
import { GeneratedContent, WebsitePage } from '@/types/generated-website';
import { WebsiteHeader } from './WebsiteHeader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { UpgradeModal } from './UpgradeModal';
import { LockedFeatureButton } from './LockedFeatureButton';
import { Palette, Layout } from 'lucide-react';

interface WebsitePreviewProps {
  content: GeneratedContent;
  colorPreference: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function WebsitePreview({ 
  content, 
  colorPreference, 
  isEditable = false,
  onFieldEdit 
}: WebsitePreviewProps) {
  const [currentPage, setCurrentPage] = useState<WebsitePage>('home');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>('');

  const isDark = colorPreference === 'dark';
  const isNeutral = colorPreference === 'neutral';

  const themeClasses = isDark 
    ? 'bg-slate-900 text-white' 
    : isNeutral 
      ? 'bg-stone-50 text-stone-900'
      : 'bg-white text-gray-900';

  const handleLockedFeature = (feature: string) => {
    setLockedFeature(feature);
    setUpgradeModalOpen(true);
  };

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Editing Toolbar for logged-in users */}
      {isEditable && (
        <div className={`sticky top-14 z-20 py-2 px-4 border-b ${
          isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-gray-50/95 border-gray-200'
        } backdrop-blur-sm`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                ✏️ Click on highlighted text to edit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LockedFeatureButton 
                label="Colors" 
                onClick={() => handleLockedFeature('Change colors')}
              />
              <LockedFeatureButton 
                label="Layout" 
                onClick={() => handleLockedFeature('Change layout')}
              />
            </div>
          </div>
        </div>
      )}

      <WebsiteHeader 
        siteName={content.metadata.siteName}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
      />
      
      <main>
        {currentPage === 'home' && (
          <HomePage 
            content={content.pages.home} 
            isDark={isDark} 
            isNeutral={isNeutral}
            isEditable={isEditable}
            onFieldEdit={handleFieldEdit}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage 
            content={content.pages.about} 
            isDark={isDark} 
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage 
            content={content.pages.services} 
            isDark={isDark} 
            isNeutral={isNeutral}
            isEditable={isEditable}
            onLockedFeature={handleLockedFeature}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage 
            content={content.pages.contact} 
            isDark={isDark} 
            isNeutral={isNeutral}
            isEditable={isEditable}
            onFieldEdit={handleFieldEdit}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDark ? 'border-slate-700 bg-slate-950' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} {content.metadata.siteName}. All rights reserved.
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            {content.metadata.tagline}
          </p>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />
    </div>
  );
}
