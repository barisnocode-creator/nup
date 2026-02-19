import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';

export const compatibleSectors: string[] = []; // all sectors

export function mapCtaSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};

  const businessName = safeGet(projectData, 'formData.businessName', '')
    || safeGet(projectData, 'generatedContent.metadata.siteName', '');

  if (businessName) {
    overrides.title = `${businessName} ile Tanışın`;
  }

  return { ...sectionProps, ...overrides };
}
