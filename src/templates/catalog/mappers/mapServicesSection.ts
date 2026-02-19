import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapServicesSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  const servicesList = safeGet<any[]>(projectData, 'generatedContent.pages.services.servicesList', []);
  const highlights = safeGet<any[]>(projectData, 'generatedContent.pages.home.highlights', []);
  let sources = servicesList.length > 0 ? servicesList : highlights;

  // Fallback to sector profile services
  if (sources.length === 0 && profile?.services) {
    sources = profile.services.map(s => ({ title: s.name, description: s.description }));
  }

  if (sources.length === 0) return { ...sectionProps };

  // Map onto features or services array
  const key = Array.isArray(sectionProps.services) ? 'services' :
              Array.isArray(sectionProps.features) ? 'features' : null;

  if (key) {
    const existing = sectionProps[key] as any[];
    overrides[key] = existing.map((item: any, i: number) => {
      const src = sources[i];
      if (!src) return item;
      return {
        ...item,
        title: src.title || src.name || item.title,
        description: src.description || item.description,
      };
    });
  }

  // Map section title — use sector label if available
  const servicesTitle = safeGet(projectData, 'generatedContent.pages.services.hero.title', '')
    || profile?.sectionLabels?.services || '';
  if (servicesTitle && sectionProps.title !== undefined) overrides.title = servicesTitle;

  return { ...sectionProps, ...overrides };
}
