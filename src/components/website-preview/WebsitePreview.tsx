import { GeneratedContent } from '@/types/generated-website';
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
      selectedImage={selectedImage}
      onImageSelect={onImageSelect}
    />
  );
}
