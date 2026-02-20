import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

const titleMap: Record<string, string> = {
  doctor: 'Randevu Al',
  dentist: 'Randevu Al',
  lawyer: 'Ücretsiz Danışma',
  restaurant: 'Rezervasyon',
  cafe: 'Rezervasyon',
  hotel: 'Oda Rezervasyonu',
  beauty_salon: 'Randevu Al',
  gym: 'Ücretsiz Deneme',
  veterinary: 'Randevu Al',
  pharmacy: 'Bize Ulaşın',
};

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
  pharmacy: 'Bize Yazın',
};

const submitMap: Record<string, string> = {
  doctor: 'Randevu Oluştur',
  dentist: 'Randevu Oluştur',
  lawyer: 'Danışma Talep Et',
  restaurant: 'Rezervasyon Yap',
  cafe: 'Rezervasyon Yap',
  hotel: 'Oda Ayırt',
  beauty_salon: 'Randevu Oluştur',
  gym: 'Deneme Dersi Al',
  veterinary: 'Randevu Oluştur',
  pharmacy: 'Gönder',
};

export function mapAppointmentSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);
  const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';

  if (profile) {
    // Override appointment label from sector profile
    const label = profile.sectionLabels.appointment;
    if (label) {
      if (sectionProps.submitButtonText !== undefined) overrides.submitButtonText = label;
    }
  }

  // Apply title map
  if (titleMap[sectorKey]) {
    if (sectionProps.sectionTitle !== undefined) overrides.sectionTitle = titleMap[sectorKey];
    if (sectionProps.title !== undefined) overrides.title = titleMap[sectorKey];
  }

  // Apply subtitle map
  if (subtitleMap[sectorKey]) {
    if (sectionProps.sectionSubtitle !== undefined) overrides.sectionSubtitle = subtitleMap[sectorKey];
    if (sectionProps.subtitle !== undefined) overrides.subtitle = subtitleMap[sectorKey];
  }

  // Apply submit button map (higher priority than sector profile label)
  if (submitMap[sectorKey]) {
    if (sectionProps.submitButtonText !== undefined) overrides.submitButtonText = submitMap[sectorKey];
  }

  return { ...sectionProps, ...overrides };
}
