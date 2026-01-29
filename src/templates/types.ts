import { ComponentType } from 'react';
import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  supportedProfessions: string[];
  supportedTones: string[];
  preview?: string;
}

export interface TemplateProps {
  content: GeneratedContent;
  colorPreference: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Legacy image-only props (for backward compatibility)
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export type TemplateComponent = ComponentType<TemplateProps>;
