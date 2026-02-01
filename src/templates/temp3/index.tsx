import { useState } from 'react';
import { TemplateProps } from '../types';
import { ElegantHeader } from './components/TemplateHeader';
import { ElegantFooter } from './components/TemplateFooter';
import { ElegantFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';

export function ElegantMinimalTemplate({
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
    <div className="min-h-screen bg-[#F7F5F3] text-[#37322F]">
      {/* Elegant vertical border lines */}
      <div className="fixed left-0 top-0 w-px h-full bg-[rgba(55,50,47,0.08)] z-10 pointer-events-none" />
      <div className="fixed right-0 top-0 w-px h-full bg-[rgba(55,50,47,0.08)] z-10 pointer-events-none" />

      {/* Editing Indicator */}
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b bg-[#F7F5F3]/95 border-[#E0DEDB] backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#605A57]">
                ✏️ Click on any text or image to edit
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLockedFeature('Change colors')}
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#E0DEDB] text-[#49423D] hover:bg-white transition-colors"
              >
                🎨 Colors
              </button>
              <button
                onClick={() => handleLockedFeature('Change layout')}
                className="px-4 py-1.5 rounded-full text-xs font-medium border border-[#E0DEDB] text-[#49423D] hover:bg-white transition-colors"
              >
                📐 Layout
              </button>
            </div>
          </div>
        </div>
      )}

      <ElegantHeader
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
        <ElegantFullLandingPage
          content={content}
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

      <ElegantFooter
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
