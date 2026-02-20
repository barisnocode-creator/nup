import { TemplateConfig } from './types';
import { getAllCatalogTemplates, type TemplateDefinition } from './catalog';

// Import preview image
import pencilCafePreview from '@/assets/pencil-cafe-reference.png';

// Template registry — only Specialty Cafe now
const templateRegistry: Record<string, {
  config: TemplateConfig;
}> = {
  'specialty-cafe': {
    config: {
      id: 'specialty-cafe',
      name: 'Specialty Cafe',
      description: 'Haight Ashbury tarzı, sıcak terracotta tonlarında specialty cafe tasarımı',
      category: 'Yeme & İçme',
      preview: pencilCafePreview,
      supportedProfessions: ['food', 'cafe', 'coffee', 'restaurant', 'bakery', 'bar', 'bistro', 'patisserie', 'retail', 'service', 'health', 'creative', 'technology', 'other'],
      supportedTones: ['warm', 'elegant', 'premium', 'modern', 'friendly', 'professional', 'bold', 'calm'],
    },
  },
};

/**
 * Convert a catalog TemplateDefinition to a TemplateConfig for gallery display.
 */
function catalogToConfig(def: TemplateDefinition): TemplateConfig {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    category: def.category,
    preview: def.preview || pencilCafePreview,
    supportedProfessions: def.supportedIndustries,
    supportedTones: ['warm', 'professional', 'modern', 'elegant'],
  };
}

// Get all template configurations
export function getAllTemplates(): TemplateConfig[] {
  const componentTemplates = Object.values(templateRegistry).map(t => t.config);
  const catalogTemplates = getAllCatalogTemplates().map(catalogToConfig);
  const componentIds = new Set(componentTemplates.map(t => t.id));
  const uniqueCatalog = catalogTemplates.filter(t => !componentIds.has(t.id));
  return [...componentTemplates, ...uniqueCatalog];
}

// Get a specific template configuration
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  if (templateRegistry[templateId]) return templateRegistry[templateId].config;
  const catalogTemplates = getAllCatalogTemplates();
  const def = catalogTemplates.find(t => t.id === templateId);
  return def ? catalogToConfig(def) : null;
}

// Get a template component by ID — no longer used for live rendering
export function getTemplate(templateId: string): any {
  return null;
}

// Auto-select best template based on sector
export function selectTemplate(
  profession: string,
  _tone?: string
): string {
  const lower = (profession || '').toLowerCase();
  if (['cafe', 'coffee', 'bakery', 'patisserie'].some(k => lower.includes(k))) return 'specialty-cafe';
  if (['restaurant', 'bistro', 'fine_dining', 'steakhouse', 'seafood'].some(k => lower.includes(k))) return 'restaurant-elegant';
  if (['hotel', 'resort', 'hostel', 'motel', 'apart'].some(k => lower.includes(k))) return 'hotel-luxury';
  if (['developer', 'engineer', 'freelancer', 'architect', 'designer', 'creative', 'technology'].some(k => lower.includes(k))) return 'engineer-portfolio';
  // For all other sectors (doctor, lawyer, dentist, gym, beauty, etc.) — MedCare Pro
  return 'medcare-pro';
}

export type { TemplateConfig };
export type { TemplateDefinition };

export const DEFAULT_TEMPLATE_ID = 'medcare-pro';

const DIRECT_RENDER_TEMPLATES = new Set<string>();

export function isComponentTemplate(templateId: string): boolean {
  return DIRECT_RENDER_TEMPLATES.has(templateId);
}
