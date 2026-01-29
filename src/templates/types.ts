import { ComponentType } from 'react';
import { GeneratedContent } from '@/types/generated-website';

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
}

export type TemplateComponent = ComponentType<TemplateProps>;
