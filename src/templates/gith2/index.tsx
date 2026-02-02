import { TemplateProps } from '../types';
import { Gith2Header } from './components/TemplateHeader';
import { Gith2Footer } from './components/TemplateFooter';
import { Gith2FullLandingPage } from './pages/FullLandingPage';

export function GitH2Template({
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Gith2Header 
        siteName={content.metadata.siteName}
        isEditable={isEditable}
      />
      <main>
        <Gith2FullLandingPage
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
      <Gith2Footer
        siteName={content.metadata.siteName}
        contactInfo={content.pages.contact.info}
      />
    </div>
  );
}
