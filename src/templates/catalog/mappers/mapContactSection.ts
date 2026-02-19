import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';

export const compatibleSectors: string[] = []; // all sectors

export function mapContactSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};

  const phone = safeGet(projectData, 'generatedContent.pages.contact.info.phone', '');
  const email = safeGet(projectData, 'generatedContent.pages.contact.info.email', '');
  const address = safeGet(projectData, 'generatedContent.pages.contact.info.address', '');

  if (phone) overrides.phone = phone;
  if (email) overrides.email = email;
  if (address) overrides.address = address;

  return { ...sectionProps, ...overrides };
}
