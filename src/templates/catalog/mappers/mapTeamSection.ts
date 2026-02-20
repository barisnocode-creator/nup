import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapTeamSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  // ChefShowcase / team section — try generated_content first
  const team = safeGet<any[]>(projectData, 'generatedContent.pages.about.team', []);
  if (team.length > 0) {
    const first = team[0];
    const name = first?.name;
    const bio = first?.bio || first?.description;
    if (name) overrides.title = name;
    if (bio) overrides.description = bio;
  }

  // Fallback: use sector-based subtitle label
  if (!overrides.title && sectionProps.title === '') {
    const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';
    const chefLabels: Record<string, string> = {
      restaurant: 'Baş Şefimiz',
      cafe: 'Baristamız',
      food: 'Şefimiz',
      bistro: 'Baş Aşçımız',
    };
    if (chefLabels[sectorKey]) overrides.subtitle = chefLabels[sectorKey];

    // About story as description fallback
    const aboutStory = safeGet(projectData, 'generatedContent.pages.about.story.content', '');
    if (aboutStory && !overrides.description) overrides.description = aboutStory;
  }

  // Use sector label for section title (subtitle prop)
  const teamLabel = profile?.sectionLabels?.team;
  if (teamLabel && sectionProps.subtitle !== undefined && !overrides.subtitle) {
    overrides.subtitle = teamLabel;
  }

  return { ...sectionProps, ...overrides };
}
