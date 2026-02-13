import { TemplateConfig, TemplateComponent } from './types';
import { PilatesTemplate } from './pilates';

// Import preview image
import templatePilates from '@/assets/template-pilates.jpg';

// Template registry - only pilates1
const templateRegistry: Record<string, {
  config: TemplateConfig;
  component: TemplateComponent;
}> = {
  pilates1: {
    config: {
      id: 'pilates1',
      name: 'Wellness Studio',
      description: 'Warm, elegant template for pilates studios, yoga centers, and wellness spaces',
      category: 'Wellness',
      preview: templatePilates,
      supportedProfessions: ['pilates', 'yoga', 'fitness', 'pt', 'gym', 'wellness', 'spa', 'doctor', 'dentist', 'pharmacist', 'service', 'retail', 'food', 'technology', 'creative', 'other'],
      supportedTones: ['warm', 'elegant', 'premium', 'calm', 'professional', 'friendly', 'bold', 'modern'],
    },
    component: PilatesTemplate,
  },
};

// Get all template configurations
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templateRegistry).map(t => t.config);
}

// Get a specific template configuration
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return templateRegistry[templateId]?.config || null;
}

// Get a template component by ID
export function getTemplate(templateId: string): TemplateComponent {
  const template = templateRegistry[templateId];
  if (!template) {
    console.warn(`Template "${templateId}" not found, falling back to pilates1`);
    return templateRegistry.pilates1.component;
  }
  return template.component;
}

// Automatically select the best template
export function selectTemplate(
  _profession: string,
  _tone?: string
): string {
  return 'pilates1';
}

// Export types for external use
export type { TemplateConfig };

// Export the default template ID
export const DEFAULT_TEMPLATE_ID = 'pilates1';
