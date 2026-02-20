/**
 * Template Catalog Registry
 * Provides lookup, filtering and resolution functions for schema-driven templates.
 */

import { allDefinitions, type TemplateDefinition, type TemplateSectionDef } from './definitions';
import { templateToPreset, type ThemePresetValues } from '@/themes/presets';

// Re-export types
export type { TemplateDefinition, TemplateSectionDef };

// ─── Lookup Functions ─────────────────────────────────────────────

/** Get all template definitions */
export function getAllCatalogTemplates(): TemplateDefinition[] {
  return allDefinitions;
}

/** Get a template definition by ID */
export function getCatalogTemplate(templateId: string): TemplateDefinition | null {
  return allDefinitions.find(t => t.id === templateId) || null;
}

/** Find templates matching an industry */
export function getTemplatesForIndustry(industry: string): TemplateDefinition[] {
  const lower = industry.toLowerCase();
  return allDefinitions.filter(t =>
    t.supportedIndustries.some(si => si === lower) || t.industry === lower
  );
}

/** Resolve the theme preset for a catalog template */
export function getCatalogTheme(templateId: string): ThemePresetValues | null {
  const def = getCatalogTemplate(templateId);
  if (!def) return null;
  return templateToPreset[def.themePresetKey] || null;
}

/** Auto-select best catalog template for a given profession/sector */
export function selectCatalogTemplate(profession: string, sector?: string): TemplateDefinition | null {
  const keys = [sector, profession].filter(Boolean).map(k => k!.toLowerCase());
  
  // Sector-to-template priority map (same as edge function)
  const priorityMap: Record<string, string> = {
    cafe: 'specialty-cafe', coffee: 'specialty-cafe', bakery: 'specialty-cafe', patisserie: 'specialty-cafe',
    restaurant: 'restaurant-elegant', bistro: 'restaurant-elegant', bar: 'restaurant-elegant', 'fine-dining': 'restaurant-elegant',
    hotel: 'hotel-luxury', resort: 'hotel-luxury', hostel: 'hotel-luxury', accommodation: 'hotel-luxury',
    developer: 'engineer-portfolio', engineer: 'engineer-portfolio', freelancer: 'engineer-portfolio',
    designer: 'engineer-portfolio', creative: 'engineer-portfolio', technology: 'engineer-portfolio', software: 'engineer-portfolio',
    dentist: 'dental-clinic', dental: 'dental-clinic', orthodontics: 'dental-clinic',
  };

  for (const key of keys) {
    // Check priority map first
    if (priorityMap[key]) {
      const def = allDefinitions.find(t => t.id === priorityMap[key]);
      if (def) return def;
    }
    // Then check partial matches in supportedIndustries
    const match = allDefinitions.find(t =>
      t.supportedIndustries.some(si => key.includes(si) || si.includes(key))
    );
    if (match) return match;
  }

  // Default: medcare-pro (most versatile)
  return allDefinitions.find(t => t.id === 'medcare-pro') || allDefinitions[0] || null;
}
