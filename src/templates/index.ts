import { TemplateConfig, TemplateComponent } from './types';
import { HealthcareModernTemplate } from './temp1';

// Template registry - add new templates here
const templateRegistry: Record<string, {
  config: TemplateConfig;
  component: TemplateComponent;
}> = {
  temp1: {
    config: {
      id: 'temp1',
      name: 'Healthcare Modern',
      description: 'Clean, professional template designed for healthcare providers',
      supportedProfessions: ['doctor', 'dentist', 'pharmacist'],
      supportedTones: ['professional', 'friendly', 'premium'],
    },
    component: HealthcareModernTemplate,
  },
  // Future templates can be added here:
  // temp2: { config: {...}, component: MinimalClinicTemplate },
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
    // Fallback to temp1 if template not found
    console.warn(`Template "${templateId}" not found, falling back to temp1`);
    return templateRegistry.temp1.component;
  }
  return template.component;
}

// Automatically select the best template based on profession and tone
export function selectTemplate(
  profession: string,
  tone?: string
): string {
  // For now, we only have temp1, so return it
  // In the future, this logic can be expanded to match
  // profession/tone combinations to specific templates
  
  const templates = Object.entries(templateRegistry);
  
  for (const [id, { config }] of templates) {
    if (config.supportedProfessions.includes(profession)) {
      if (!tone || config.supportedTones.includes(tone)) {
        return id;
      }
    }
  }
  
  // Default fallback
  return 'temp1';
}

// Export the default template ID
export const DEFAULT_TEMPLATE_ID = 'temp1';
