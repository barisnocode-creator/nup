import { useState } from 'react';
import { TemplateProps } from '../types';
import { LawyerHeader } from './components/TemplateHeader';
import { LawyerFooter } from './components/TemplateFooter';
import { LawyerFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';
import './styles/lawyer.css';

export function LawyerTemplate({
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
  sectionStyles,
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

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lawyer-template min-h-screen" style={{ background: 'var(--lw-white)', color: 'var(--lw-black)' }}>
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b" style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'var(--lw-gray-200)' }}>
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--lw-gray-500)' }}>
              ✏️ Click on any text or image to edit
            </span>
          </div>
        </div>
      )}

      <LawyerHeader
        siteName={content.metadata.siteName}
        onNavigate={handleNavigate}
      />

      <main>
        <LawyerFullLandingPage
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

      <LawyerFooter
        siteName={content.metadata.siteName}
        tagline={content.metadata.tagline}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={lockedFeature}
      />
    </div>
  );
}
