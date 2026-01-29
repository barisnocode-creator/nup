import { ComponentType } from 'react';
import { GeneratedContent } from '@/types/generated-website';
import type { ImageData } from '@/components/website-preview/ImageEditorSidebar';

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
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export type TemplateComponent = ComponentType<TemplateProps>;
