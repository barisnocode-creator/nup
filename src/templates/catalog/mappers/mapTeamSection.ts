import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // broadened to all sectors

export function mapTeamSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  const team = safeGet<any[]>(projectData, 'generatedContent.pages.about.team', []);
  if (team.length > 0) {
    const first = team[0];
    const name = first?.name;
    const bio = first?.bio || first?.description;
    if (name) overrides.title = name;
    if (bio) overrides.description = bio;
  }

  // Use sector label for section title
  const teamLabel = profile?.sectionLabels?.team;
  if (teamLabel && sectionProps.sectionTitle !== undefined) {
    overrides.sectionTitle = teamLabel;
  }

  return { ...sectionProps, ...overrides };
}
