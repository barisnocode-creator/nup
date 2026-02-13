import { ComponentType } from 'react';
import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  supportedProfessions: string[];
  supportedTones: string[];
}

export interface TemplateProps {
  content: GeneratedContent;
  colorPreference: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Section management props
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  // Section style overrides
  sectionStyles?: { [sectionId: string]: SectionStyle };
  // Image regeneration from action box
  onImageRegenerate?: (imageData: ImageData) => void;
  // Legacy image-only props (for backward compatibility)
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export type TemplateComponent = ComponentType<TemplateProps>;
