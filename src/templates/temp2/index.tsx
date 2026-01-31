import { useState } from 'react';
import { TemplateProps } from '../types';
import { BoldHeader } from './components/TemplateHeader';
import { BoldFooter } from './components/TemplateFooter';
import { BoldFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';

export function BoldAgencyTemplate({
  content,
  colorPreference,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder,
  onMoveSection,
  onDeleteSection,
  selectedImage,
  onImageSelect,
}: TemplateProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string>('');

  // Bold Agency uses a dark-first approach
  const isDark = colorPreference !== 'light';
  const isNeutral = colorPreference === 'neutral';

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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Editing Indicator */}
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">
                ✏️ Click on any text or image to edit • Sidebar opens for editing
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLockedFeature('Change colors')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                🎨 Colors
              </button>
              <button
                onClick={() => handleLockedFeature('Change layout')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                📐 Layout
              </button>
            </div>
          </div>
        </div>
      )}

      <BoldHeader
        siteName={content.metadata.siteName}
        currentPage="home"
        onNavigate={handleNavigate}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        editorSelection={editorSelection}
        onEditorSelect={onEditorSelect}
        hasBlog={hasBlog}
      />

      <main>
        <BoldFullLandingPage
          content={content}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
          onFieldEdit={handleFieldEdit}
          onLockedFeature={handleLockedFeature}
          editorSelection={editorSelection}
          onEditorSelect={onEditorSelect}
          sectionOrder={sectionOrder}
          onMoveSection={onMoveSection}
          onDeleteSection={onDeleteSection}
          selectedImage={selectedImage}
          onImageSelect={onImageSelect}
        />
      </main>

      <BoldFooter
        siteName={content.metadata.siteName}
        tagline={content.metadata.tagline}
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
