import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';

export const compatibleSectors = ['restaurant', 'cafe', 'food'];

export function mapTeamSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};

  const team = safeGet<any[]>(projectData, 'generatedContent.pages.about.team', []);
  if (team.length > 0) {
    const first = team[0];
    const name = first?.name;
    const bio = first?.bio || first?.description;
    if (name) overrides.title = name;
    if (bio) overrides.description = bio;
  }

  return { ...sectionProps, ...overrides };
}
