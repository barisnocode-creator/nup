import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapCtaSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  const businessName = safeGet(projectData, 'formData.businessName', '')
    || safeGet(projectData, 'generatedContent.metadata.siteName', '');

  if (businessName) {
    overrides.title = `${businessName} ile Tanışın`;
  }

  // CTA button text from sector profile
  const ctaText = profile?.ctaText;
  if (ctaText && sectionProps.buttonText !== undefined) {
    overrides.buttonText = ctaText;
  }

  return { ...sectionProps, ...overrides };
}
