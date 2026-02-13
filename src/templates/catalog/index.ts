/**
 * Template Catalog Registry
 * Provides lookup, filtering and resolution functions for schema-driven templates.
 */

import { allDefinitions, type TemplateDefinition, type TemplateSectionDef } from './definitions';
import { templateToPreset } from '@/components/chai-builder/themes/presets';
import type { ChaiThemeValues } from '@chaibuilder/sdk';

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
export function getCatalogTheme(templateId: string): Partial<ChaiThemeValues> | null {
  const def = getCatalogTemplate(templateId);
  if (!def) return null;
  return templateToPreset[def.themePresetKey] || null;
}

/** Auto-select best catalog template for a given profession */
export function selectCatalogTemplate(profession: string): TemplateDefinition | null {
  const lower = profession.toLowerCase();
  const match = allDefinitions.find(t =>
    t.supportedIndustries.some(si => lower.includes(si) || si.includes(lower))
  );
  return match || allDefinitions[0] || null;
}
