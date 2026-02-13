import { TemplateConfig, TemplateComponent } from './types';
import { PilatesTemplate } from './pilates';
import { getAllCatalogTemplates, type TemplateDefinition } from './catalog';

// Import preview image
import templatePilates from '@/assets/template-pilates.jpg';

// Template registry - only pilates1 as live-renderable component
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

/**
 * Convert a catalog TemplateDefinition to a TemplateConfig for gallery display.
 * Catalog templates don't have live-render components — they use static previews.
 */
function catalogToConfig(def: TemplateDefinition): TemplateConfig {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    category: def.category,
    preview: def.preview || templatePilates, // fallback preview
    supportedProfessions: def.supportedIndustries,
    supportedTones: ['warm', 'professional', 'modern', 'elegant'],
  };
}

// Get all template configurations (component-based + catalog-based)
export function getAllTemplates(): TemplateConfig[] {
  const componentTemplates = Object.values(templateRegistry).map(t => t.config);
  const catalogTemplates = getAllCatalogTemplates().map(catalogToConfig);

  // Merge, avoiding duplicates (component templates take priority)
  const componentIds = new Set(componentTemplates.map(t => t.id));
  const uniqueCatalog = catalogTemplates.filter(t => !componentIds.has(t.id));

  return [...componentTemplates, ...uniqueCatalog];
}

// Get a specific template configuration
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  // Check component registry first
  if (templateRegistry[templateId]) return templateRegistry[templateId].config;
  // Then check catalog
  const catalogTemplates = getAllCatalogTemplates();
  const def = catalogTemplates.find(t => t.id === templateId);
  return def ? catalogToConfig(def) : null;
}

// Get a template component by ID
// Catalog templates don't have components — fall back to pilates1
export function getTemplate(templateId: string): TemplateComponent {
  const template = templateRegistry[templateId];
  if (!template) {
    console.warn(`Template "${templateId}" not found as component, falling back to pilates1`);
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

// Export catalog types for consumers
export type { TemplateDefinition };

// Export the default template ID
export const DEFAULT_TEMPLATE_ID = 'pilates1';
