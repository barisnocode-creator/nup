import { TemplateProps } from '../types';
import { Gith3Header } from './components/TemplateHeader';
import { Gith3Footer } from './components/TemplateFooter';
import { Gith3FullLandingPage } from './pages/FullLandingPage';

export function GitH3Template({
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
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Gith3Header 
        siteName={content.metadata.siteName}
        isEditable={isEditable}
      />
      <main>
        <Gith3FullLandingPage
          content={content}
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
      <Gith3Footer
        siteName={content.metadata.siteName}
        contactInfo={content.pages.contact.info}
      />
    </div>
  );
}
