import { GeneratedContent } from '@/types/generated-website';
import { getTemplate } from '@/templates';
import type { ImageData } from './ImageEditorSidebar';

interface WebsitePreviewProps {
  content: GeneratedContent;
  colorPreference: string;
  templateId?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export function WebsitePreview({ 
  content, 
  colorPreference, 
  templateId = 'temp1',
  isEditable = false,
  onFieldEdit,
  selectedImage,
  onImageSelect,
}: WebsitePreviewProps) {
  // Get the template component based on templateId
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
      selectedImage={selectedImage}
      onImageSelect={onImageSelect}
    />
  );
}
