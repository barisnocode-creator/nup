import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapAboutSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  const aboutTitle = safeGet(projectData, 'generatedContent.pages.about.story.title', '')
    || safeGet(projectData, 'generatedContent.pages.home.welcome.title', '')
    || profile?.aboutTitle || '';
  const aboutContent = safeGet(projectData, 'generatedContent.pages.about.story.content', '')
    || safeGet(projectData, 'generatedContent.pages.home.welcome.content', '')
    || profile?.aboutDescription || '';

  if (aboutTitle) {
    overrides.title = aboutTitle;
    if (sectionProps.sectionTitle !== undefined) overrides.sectionTitle = aboutTitle;
  }
  if (aboutContent) overrides.description = aboutContent;

  return { ...sectionProps, ...overrides };
}
