import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

const ctaTitleMap: Record<string, string> = {
  doctor: 'Sağlığınız İçin Profesyonel Bakım',
  dentist: 'Sağlıklı Gülüşünüze Bugün Başlayın',
  lawyer: 'Hukuki Güvenceniz İçin Buradayız',
  restaurant: 'Unutulmaz Bir Yemek Deneyimi Sizi Bekliyor',
  cafe: 'Özenle Hazırlanan Kahveniz Sizi Bekliyor',
  hotel: 'Hayalinizdeki Konaklama Deneyimi',
  beauty_salon: 'Güzelliğinize Değer Katıyoruz',
  gym: 'Hedeflerinize Birlikte Ulaşalım',
  veterinary: 'Dostlarınız İçin En İyisi',
  pharmacy: 'Sağlığınızda Güvenilir Ortağınız',
};

const ctaDescMap: Record<string, string> = {
  doctor: 'İlk muayeneniz ücretsiz. Randevunuzu hemen alın ve sağlığınızı güvence altına alın.',
  dentist: 'İlk muayeneniz ücretsiz! Sağlıklı gülüşünüz için hemen randevu alın.',
  lawyer: 'İlk danışmanız tamamen ücretsiz. Haklarınızı korumak için hemen iletişime geçin.',
  restaurant: 'Özel günleriniz için masanızı ayırtın. Unutulmaz bir akşam sizi bekliyor.',
  cafe: 'Özel blendlerimizi ve taze pastalarımızı keşfedin. Sizi bekliyoruz!',
  hotel: 'Erken rezervasyon fırsatlarından yararlanın. En uygun fiyatları kaçırmayın.',
  beauty_salon: 'Randevunuzu alın ve profesyonel bakım ile en iyi halinize ulaşın.',
  gym: 'İlk ders ücretsiz! Fitness hedeflerinize ulaşmak için hemen başlayın.',
  veterinary: 'Dostunuzun sağlığı için randevunuzu alın. İlk muayene ücretsizdir.',
  pharmacy: 'Sağlık sorularınız için uzman eczacılarımıza danışın.',
};

export function mapCtaSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);
  const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';

  const businessName = safeGet(projectData, 'formData.businessName', '')
    || safeGet(projectData, 'generatedContent.metadata.siteName', '');

  // Title: business name based, or sector-based fallback
  if (businessName) {
    overrides.title = `${businessName} ile Tanışın`;
  } else if (ctaTitleMap[sectorKey]) {
    overrides.title = ctaTitleMap[sectorKey];
  }

  // Description: sector-based
  if (ctaDescMap[sectorKey] && sectionProps.description !== undefined) {
    overrides.description = ctaDescMap[sectorKey];
  }

  // CTA button text from sector profile
  const ctaText = profile?.ctaText;
  if (ctaText && sectionProps.buttonText !== undefined) {
    overrides.buttonText = ctaText;
  }

  return { ...sectionProps, ...overrides };
}
