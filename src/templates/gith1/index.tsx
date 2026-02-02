import { TemplateProps } from '../types';
import { Gith1Header } from './components/TemplateHeader';
import { Gith1Footer } from './components/TemplateFooter';
import { Gith1FullLandingPage } from './pages/FullLandingPage';

export function GitH1Template({
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
  const isDark = colorPreference === 'dark';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Gith1Header 
        siteName={content.metadata.siteName}
        isEditable={isEditable}
      />
      <main>
        <Gith1FullLandingPage
          content={content}
          isDark={isDark}
          isEditable={isEditable}
          onFieldEdit={onFieldEdit}
          onLockedFeature={onLockedFeature}
          editorSelection={editorSelection}
          onEditorSelect={onEditorSelect}
          sectionOrder={sectionOrder}
          onMoveSection={onMoveSection}
          onDeleteSection={onDeleteSection}
          sectionStyles={sectionStyles}
          selectedImage={selectedImage}
          onImageSelect={onImageSelect}
        />
      </main>
      <Gith1Footer
        siteName={content.metadata.siteName}
        contactInfo={content.pages.contact.info}
      />
    </div>
  );
}
