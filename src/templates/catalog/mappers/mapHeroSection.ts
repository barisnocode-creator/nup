import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapHeroSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  const title = safeGet(projectData, 'generatedContent.pages.home.hero.title', '')
    || profile?.heroTitle || '';
  const description = safeGet(projectData, 'generatedContent.pages.home.hero.description', '')
    || profile?.heroDescription || '';
  const subtitle = safeGet(projectData, 'generatedContent.pages.home.hero.subtitle', '')
    || profile?.heroSubtitle || '';
  const businessName = safeGet(projectData, 'formData.businessName', '')
    || safeGet(projectData, 'generatedContent.metadata.siteName', '');

  if (title) overrides.title = title;
  if (description) overrides.description = description;
  if (subtitle) overrides.subtitle = subtitle;
  if (businessName && sectionProps.badge !== undefined) overrides.badge = businessName;

  // CTA text from sector profile
  const ctaText = safeGet(projectData, 'generatedContent.pages.home.hero.ctaText', '')
    || profile?.ctaText || '';
  if (ctaText && sectionProps.buttonText !== undefined) overrides.buttonText = ctaText;

  // HeroPortfolio special mapping
  if (businessName && sectionProps.name !== undefined) {
    overrides.name = businessName;
    if (!title && !sectionProps.title) {
      const profession = safeGet(projectData, 'generatedContent.metadata.profession', '');
      if (profession) overrides.title = profession;
    }
    const bio = safeGet(projectData, 'generatedContent.pages.about.story.content', '');
    if (bio) overrides.bio = bio;
  }

  return { ...sectionProps, ...overrides };
}
