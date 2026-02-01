import { FullLandingPage } from './pages/FullLandingPage';
import type { TemplateProps } from '../types';

export function VideoStudioTemplate({
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
}: TemplateProps) {
  // Default section order for Video Studio template
  const defaultOrder = ['hero', 'portfolio', 'awards', 'about', 'services', 'team', 'contact'];
  const activeSectionOrder = sectionOrder || defaultOrder;

  return (
    <FullLandingPage
      content={content}
      isEditable={isEditable}
      editorSelection={editorSelection}
      onEditorSelect={onEditorSelect}
      sectionOrder={activeSectionOrder}
      onMoveSection={onMoveSection}
      onDeleteSection={onDeleteSection}
      sectionStyles={sectionStyles}
    />
  );
}
