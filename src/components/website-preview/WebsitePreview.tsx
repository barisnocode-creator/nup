import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import { getTemplate } from '@/templates';
import type { EditorSelection, ImageData } from './EditorSidebar';

interface WebsitePreviewProps {
  content: GeneratedContent;
  colorPreference: string;
  templateId?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Section management props
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  // Section style overrides
  sectionStyles?: { [sectionId: string]: SectionStyle };
  // Legacy props
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export function WebsitePreview({ 
  content, 
  colorPreference, 
  templateId = 'temp1',
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
  sectionOrder,
  onMoveSection,
  onDeleteSection,
  sectionStyles,
  selectedImage,
  onImageSelect,
}: WebsitePreviewProps) {
  const Template = getTemplate(templateId);

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  return (
    <Template
      content={content}
      colorPreference={colorPreference}
      isEditable={isEditable}
      onFieldEdit={handleFieldEdit}
      editorSelection={editorSelection}
      onEditorSelect={onEditorSelect}
      sectionOrder={sectionOrder}
      onMoveSection={onMoveSection}
      onDeleteSection={onDeleteSection}
      sectionStyles={sectionStyles}
      selectedImage={selectedImage}
      onImageSelect={onImageSelect}
    />
  );
}
