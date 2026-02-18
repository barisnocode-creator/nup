import { TemplateConfig, TemplateComponent } from './types';
import { PilatesTemplate } from './pilates';
import { LawyerTemplate } from './lawyer';
import { NaturalTemplate } from './natural';
import { getAllCatalogTemplates, type TemplateDefinition } from './catalog';

// Import preview images
import templatePilates from '@/assets/template-pilates.jpg';
import templateLawyer from '@/assets/template-lawyer.jpg';
import templateNatural from '@/assets/template-natural.jpg';

// Template registry - live-renderable component templates
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
  'lawyer-firm': {
    config: {
      id: 'lawyer-firm',
      name: 'Hukuk Bürosu',
      description: 'Avukatlar, hukuk büroları ve danışmanlık firmaları için profesyonel siyah-beyaz tasarım',
      category: 'Hukuk & Danışmanlık',
      preview: templateLawyer,
      supportedProfessions: ['lawyer', 'legal', 'law', 'attorney', 'consulting', 'finance', 'corporate'],
      supportedTones: ['professional', 'elegant', 'premium', 'modern', 'bold'],
    },
    component: LawyerTemplate,
  },
  natural: {
    config: {
      id: 'natural',
      name: 'Natural',
      description: 'Sıcak tonlarda, modern ve doğal hissiyatlı yaşam tarzı blog şablonu',
      category: 'Yaşam & Blog',
      preview: templateNatural,
      supportedProfessions: ['blog', 'lifestyle', 'magazine', 'personal', 'creative', 'photography', 'art'],
      supportedTones: ['warm', 'elegant', 'calm', 'modern', 'friendly'],
    },
    component: NaturalTemplate,
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

// Automatically select the best template (frontend version, mirrors edge function logic)
export function selectTemplate(
  profession: string,
  _tone?: string
): string {
  const key = profession.toLowerCase();
  const mapping: Record<string, string> = {
    wellness: 'pilates1', pilates: 'pilates1', yoga: 'pilates1', fitness: 'pilates1', spa: 'pilates1',
    lawyer: 'lawyer-firm', legal: 'lawyer-firm', law: 'lawyer-firm', attorney: 'lawyer-firm',
    blog: 'natural', lifestyle: 'natural', magazine: 'natural', personal: 'natural', photography: 'natural',
  };
  
  if (mapping[key]) return mapping[key];
  for (const [mapKey, templateId] of Object.entries(mapping)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return templateId;
  }
  return 'pilates1';
}

// Export types for external use
export type { TemplateConfig };

// Export catalog types for consumers
export type { TemplateDefinition };

const DIRECT_RENDER_TEMPLATES = new Set<string>();

export function isComponentTemplate(templateId: string): boolean {
  return DIRECT_RENDER_TEMPLATES.has(templateId);
}

// Export the default template ID
export const DEFAULT_TEMPLATE_ID = 'pilates1';
