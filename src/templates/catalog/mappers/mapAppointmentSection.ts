import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapAppointmentSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  if (profile) {
    const label = profile.sectionLabels.appointment;
    if (label) {
      if (sectionProps.sectionTitle !== undefined) overrides.sectionTitle = label;
      if (sectionProps.title !== undefined) overrides.title = label;
      if (sectionProps.submitButtonText !== undefined) overrides.submitButtonText = label;
    }

    // Adapt subtitle based on sector
    const subtitleMap: Record<string, string> = {
      doctor: 'Online Randevu Alın',
      dentist: 'Online Randevu Alın',
      lawyer: 'Danışma Randevusu',
      restaurant: 'Masa Ayırın',
      cafe: 'Bize Ulaşın',
      hotel: 'Oda Rezervasyonu',
      beauty_salon: 'Randevunuzu Alın',
      gym: 'Ücretsiz Deneme',
      veterinary: 'Randevu Alın',
    };
    const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';
    if (subtitleMap[sectorKey]) {
      if (sectionProps.sectionSubtitle !== undefined) overrides.sectionSubtitle = subtitleMap[sectorKey];
      if (sectionProps.subtitle !== undefined) overrides.subtitle = subtitleMap[sectorKey];
    }
  }

  return { ...sectionProps, ...overrides };
}
