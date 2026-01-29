import { GeneratedContent } from '@/types/generated-website';
import { getTemplate } from '@/templates';

interface WebsitePreviewProps {
  content: GeneratedContent;
  colorPreference: string;
  templateId?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function WebsitePreview({ 
  content, 
  colorPreference, 
  templateId = 'temp1',
  isEditable = false,
  onFieldEdit 
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
    />
  );
}
