import { useState } from 'react';
import { TemplateProps } from '../types';
import { PilatesHeader } from './components/TemplateHeader';
import { PilatesFooter } from './components/TemplateFooter';
import { PilatesFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';

export function PilatesTemplate({
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Editing Indicator */}
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b bg-background/95 border-border backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              ✏️ Click on any text or image to edit
            </span>
          </div>
        </div>
      )}

      <PilatesHeader
        siteName={content.metadata.siteName}
        currentPage="home"
        onNavigate={handleNavigate}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
        editorSelection={editorSelection}
        onEditorSelect={onEditorSelect}
      />

      <main>
        <PilatesFullLandingPage
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

      <PilatesFooter
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
