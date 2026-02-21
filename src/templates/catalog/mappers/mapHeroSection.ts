import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

const badgeMap: Record<string, string> = {
  doctor: 'Uzman Klinik',
  dentist: 'Diş Kliniği',
  lawyer: 'Hukuk Bürosu',
  restaurant: '★ Fine Dining',
  cafe: 'Specialty Coffee',
  hotel: '★★★★★',
  beauty_salon: 'Güzellik Merkezi',
  gym: 'Fitness & Wellness',
  veterinary: 'Veteriner Kliniği',
  pharmacy: 'Eczane',
};

const infoItemsMap: Record<string, string[]> = {
  lawyer: ['Deneyimli Avukatlar', 'Ücretsiz İlk Danışma', 'Gizlilik Güvencesi'],
  doctor: ['Uzman Hekim', 'Modern Ekipman', 'Randevulu Sistem'],
  dentist: ['Uzman Diş Hekimi', 'Ağrısız Tedavi', 'Steril Ortam'],
  restaurant: ['Fine Dining', 'Taze Malzeme', 'Michelin Kalitesi'],
  cafe: ['Single Origin', 'Organik', 'El Yapımı'],
  hotel: ['Lüks Konfor', '5 Yıldızlı Hizmet', 'Eşsiz Manzara'],
  beauty_salon: ['Uzman Ekip', 'Premium Ürünler', 'Kişisel Bakım'],
  gym: ['Uzman Eğitmen', 'Modern Ekipman', 'Kişisel Program'],
  veterinary: ['Uzman Veteriner', 'Steril Ortam', '7/24 Acil'],
  pharmacy: ['Uzman Eczacı', 'Geniş Ürün Yelpazesi', 'Danışmanlık'],
};

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

  const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';

  if (title) overrides.title = title;
  if (description) overrides.description = description;
  if (subtitle) overrides.subtitle = subtitle;

  // Badge: businessName first, then sector-specific badge
  if (sectionProps.badge !== undefined) {
    if (businessName) {
      overrides.badge = businessName;
    } else if (badgeMap[sectorKey]) {
      overrides.badge = badgeMap[sectorKey];
    }
  }

  // infoItems: sector-specific tags
  if (sectionProps.infoItems !== undefined && infoItemsMap[sectorKey]) {
    overrides.infoItems = infoItemsMap[sectorKey];
  }

  // CTA text from sector profile
  const ctaText = safeGet(projectData, 'generatedContent.pages.home.hero.ctaText', '')
    || profile?.ctaText || '';

  // FAZ 3: Sektör profili varsa buton metinlerini HER ZAMAN override et
  if (profile) {
    const sectorCta = ctaText || profile.ctaText || 'İletişime Geç';
    const sectorServices = profile.sectionLabels?.services || 'Hizmetlerimiz';

    if (sectionProps.buttonText !== undefined) overrides.buttonText = sectorCta;
    if (sectionProps.primaryButtonText !== undefined) overrides.primaryButtonText = sectorCta;
    if (sectionProps.secondaryButtonText !== undefined) overrides.secondaryButtonText = sectorServices;
  } else if (ctaText) {
    // Sektör profili yoksa sadece ctaText varsa uygula
    if (sectionProps.buttonText !== undefined) overrides.buttonText = ctaText;
    if (sectionProps.primaryButtonText !== undefined) overrides.primaryButtonText = ctaText;
  }

  // HeroMedical stat mapping from sectorProfile
  if (profile?.stats) {
    profile.stats.forEach((stat, i) => {
      const vKey = `stat${i + 1}Value`;
      const lKey = `stat${i + 1}Label`;
      if (sectionProps[vKey] !== undefined && !sectionProps[vKey]) overrides[vKey] = stat.value;
      if (sectionProps[lKey] !== undefined && !sectionProps[lKey]) overrides[lKey] = stat.label;
    });
  }

  // HeroMedical features from sectorProfile
  if (profile?.features && Array.isArray(sectionProps.features) && sectionProps.features.length === 0) {
    overrides.features = profile.features;
  }

  // HeroMedical floatingBadge from sectorProfile
  if (profile?.floatingBadge && sectionProps.floatingBadge !== undefined && !sectionProps.floatingBadge) {
    overrides.floatingBadge = profile.floatingBadge;
  }

  // HeroMedical stat card
  if (profile?.statCardValue && sectionProps.statCardValue !== undefined && !sectionProps.statCardValue) {
    overrides.statCardValue = profile.statCardValue;
  }
  if (profile?.statCardLabel && sectionProps.statCardLabel !== undefined && !sectionProps.statCardLabel) {
    overrides.statCardLabel = profile.statCardLabel;
  }

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
