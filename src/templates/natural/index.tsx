import { useState } from 'react';
import { TemplateProps } from '../types';
import { NaturalHeader } from './components/NaturalHeader';
import { NaturalFooter } from './components/NaturalFooter';
import { NaturalFullLandingPage } from './pages/FullLandingPage';
import { UpgradeModal } from '@/components/website-preview/UpgradeModal';
import './styles/natural.css';

export function NaturalTemplate({
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

  return (
    <div className="natural-template min-h-screen bg-background text-foreground">
      {isEditable && (
        <div className="sticky top-14 z-20 py-2 px-4 border-b bg-background/95 border-border backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              ✏️ Düzenlemek için herhangi bir metin veya görsele tıklayın
            </span>
          </div>
        </div>
      )}

      <NaturalHeader
        siteName={content.metadata.siteName}
        isEditable={isEditable}
        onFieldEdit={handleFieldEdit}
      />

      <NaturalFullLandingPage
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

      <NaturalFooter
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
