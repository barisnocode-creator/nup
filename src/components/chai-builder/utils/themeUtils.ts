import {
  templateToPreset,
  modernProfessionalPreset,
  boldAgencyPreset,
  elegantMinimalPreset,
  corporateBluePreset,
  minimalDarkPreset,
  modernSaasPreset,
  videoStudioPreset,
  vibrantCreativePreset,
} from '../themes/presets';

/**
 * Maps user color preferences to a ChaiBuilder theme preset.
 */
export function getThemeFromColorPreferences(
  colorTone?: string,
  colorMode?: string
): any {
  const tone = colorTone || 'neutral';
  const mode = colorMode || 'light';

  if (tone === 'warm' && mode === 'light') return modernProfessionalPreset;
  if (tone === 'warm' && mode === 'dark') return videoStudioPreset;
  if (tone === 'warm' && mode === 'neutral') return vibrantCreativePreset;
  if (tone === 'cool' && mode === 'light') return corporateBluePreset;
  if (tone === 'cool' && mode === 'dark') return modernSaasPreset;
  if (tone === 'cool' && mode === 'neutral') return corporateBluePreset;
  if (tone === 'neutral' && mode === 'light') return elegantMinimalPreset;
  if (tone === 'neutral' && mode === 'dark') return minimalDarkPreset;
  if (tone === 'neutral' && mode === 'neutral') return boldAgencyPreset;

  return modernProfessionalPreset;
}

/**
 * Gets the appropriate theme preset based on template ID
 */
export function getThemeForTemplate(templateId?: string): any {
  if (!templateId) return modernProfessionalPreset;
  return templateToPreset[templateId] || modernProfessionalPreset;
}
