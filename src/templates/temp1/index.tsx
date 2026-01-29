import { useState } from 'react';
import { TemplateProps } from '../types';
import { TemplateHeader } from './components/TemplateHeader';
import { TemplateFooter } from './components/TemplateFooter';
import { FullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';

export function HealthcareModernTemplate({
  content,
  colorPreference,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  selectedImage,
  onImageSelect,
}: TemplateProps) {
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
    if (onLockedFeature) {
      onLockedFeature(feature);
    } else {
      setLockedFeature(feature);
      setUpgradeModalOpen(true);
    }
  };

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  const hasBlog = content.pages.blog && content.pages.blog.posts.length > 0;

  // Scroll to section
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Editing Indicator */}
      {isEditable && (
        <div className={`sticky top-14 z-20 py-2 px-4 border-b ${
          isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-gray-50/95 border-gray-200'
        } backdrop-blur-sm`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                ✏️ Click on any text or image to edit • Sidebar opens for editing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLockedFeature('Change colors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎨 Colors
              </button>
              <button
                onClick={() => handleLockedFeature('Change layout')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📐 Layout
              </button>
            </div>
          </div>
        </div>
      )}

      <TemplateHeader
        siteName={content.metadata.siteName}
        currentPage="home"
        onNavigate={handleNavigate}
        isDark={isDark}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        hasBlog={hasBlog}
      />

      <main>
        <FullLandingPage
          content={content}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
          onFieldEdit={handleFieldEdit}
          onLockedFeature={handleLockedFeature}
          editorSelection={editorSelection}
          onEditorSelect={onEditorSelect}
          selectedImage={selectedImage}
          onImageSelect={onImageSelect}
        />
      </main>

      <TemplateFooter
        siteName={content.metadata.siteName}
        tagline={content.metadata.tagline}
        isDark={isDark}
      />

      {/* Upgrade Modal (internal fallback) */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />
    </div>
  );
}
