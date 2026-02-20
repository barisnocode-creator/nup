/**
 * Mapper orchestrator — selects the right mapper for each section type
 * and applies sector compatibility checks.
 */
import type { TemplateSectionDef } from '../definitions';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

import { mapHeroSection, compatibleSectors as heroSectors } from './mapHeroSection';
import { mapServicesSection, compatibleSectors as servicesSectors } from './mapServicesSection';
import { mapContactSection, compatibleSectors as contactSectors } from './mapContactSection';
import { mapAboutSection, compatibleSectors as aboutSectors } from './mapAboutSection';
import { mapCtaSection, compatibleSectors as ctaSectors } from './mapCtaSection';
import { mapTeamSection, compatibleSectors as teamSectors } from './mapTeamSection';
import { mapTestimonialsSection, compatibleSectors as testimonialsSectors } from './mapTestimonialsSection';
import { mapAppointmentSection, compatibleSectors as appointmentSectors } from './mapAppointmentSection';
import { mapFaqSection } from './mapFaqSection';
import { safeGet } from './utils';

type MapperFn = (props: Record<string, any>, data: ProjectData) => Record<string, any>;

interface MapperEntry {
  fn: MapperFn;
  compatibleSectors: string[];
}

const mapperRegistry: Record<string, MapperEntry> = {};

function register(types: string[], fn: MapperFn, sectors: string[]) {
  types.forEach(t => { mapperRegistry[t] = { fn, compatibleSectors: sectors }; });
}

// Hero variants
register(
  ['HeroCafe', 'HeroDental', 'HeroRestaurant', 'HeroHotel', 'HeroPortfolio', 'HeroCentered', 'HeroSplit', 'HeroOverlay', 'HeroMedical'],
  mapHeroSection,
  heroSectors
);

// Services/Features
register(
  ['CafeFeatures', 'DentalServices', 'ServicesGrid'],
  mapServicesSection,
  servicesSectors
);

// Contact
register(['ContactForm'], mapContactSection, contactSectors);

// About
register(['AboutSection', 'CafeStory'], mapAboutSection, aboutSectors);

// CTA
register(['CTABanner'], mapCtaSection, ctaSectors);

// Team
register(['ChefShowcase'], mapTeamSection, teamSectors);

// Testimonials
register(['TestimonialsCarousel'], mapTestimonialsSection, testimonialsSectors);

// Appointment / Booking
register(['AppointmentBooking', 'DentalBooking'], mapAppointmentSection, appointmentSectors);

// FAQ
register(['FAQAccordion'], mapFaqSection, []);

// MenuShowcase & RestaurantMenu — gerçek içerik enjeksiyonu
register(['MenuShowcase', 'RestaurantMenu'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};

  // Bölüm başlığı: generatedContent → sectorProfile → fallback
  const gcTitle = safeGet<string>(data, 'generatedContent.pages.services.hero.title', '');
  const gcSubtitle = safeGet<string>(data, 'generatedContent.pages.services.hero.subtitle', '');
  if (gcTitle) overrides.title = gcTitle;
  else if (profile?.sectionLabels?.services) overrides.title = profile.sectionLabels.services;

  if (gcSubtitle) overrides.subtitle = gcSubtitle;
  else if (profile?.sectionLabels?.services) overrides.subtitle = profile.sectionLabels.services;

  // Menü öğeleri: generatedContent.pages.services.servicesList → pages.home.highlights → sectorProfile.services
  const servicesList = safeGet<any[]>(data, 'generatedContent.pages.services.servicesList', []);
  const highlights = safeGet<any[]>(data, 'generatedContent.pages.home.highlights', []);
  const profileServices = profile?.services || [];
  let sources = servicesList.length > 0 ? servicesList : (highlights.length > 0 ? highlights : profileServices.map(s => ({ title: s.name, description: s.description })));

  if (sources.length > 0) {
    overrides.items = sources.slice(0, 6).map((src: any, i: number) => ({
      name: src.title || src.name || `Ürün ${i + 1}`,
      description: src.description || '',
      price: src.price || '',
      image: src.image || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80`,
      category: src.category || profile?.sectionLabels?.services || '',
    }));
  }

  return { ...props, ...overrides };
}, []);

// StatisticsCounter — sektöre göre stat etiketleri + generatedContent
register(['StatisticsCounter'], (props, data) => {
  // Önce generatedContent statistics bak
  const gcStats = safeGet<any[]>(data, 'generatedContent.pages.home.statistics', []);
  if (gcStats && gcStats.length > 0) {
    return { ...props, stats: gcStats.slice(0, 4).map((s: any) => ({
      value: s.value || s.number || '',
      label: s.label || s.title || '',
      suffix: s.suffix || '',
    }))};
  }

  const statsByKey: Record<string, Array<{ value: string; label: string; suffix?: string }>> = {
    doctor: [
      { value: '15', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '5000', label: 'Mutlu Hasta', suffix: '+' },
      { value: '98', label: 'Memnuniyet Oranı', suffix: '%' },
      { value: '12', label: 'Uzman Hekim', suffix: '' },
    ],
    dentist: [
      { value: '10', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '8000', label: 'Tedavi Edilen Hasta', suffix: '+' },
      { value: '99', label: 'Memnuniyet Oranı', suffix: '%' },
      { value: '6', label: 'Uzman Hekim', suffix: '' },
    ],
    lawyer: [
      { value: '20', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '2000', label: 'Çözülen Dava', suffix: '+' },
      { value: '95', label: 'Başarı Oranı', suffix: '%' },
      { value: '8', label: 'Uzman Avukat', suffix: '' },
    ],
    restaurant: [
      { value: '12', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '500', label: 'Günlük Misafir', suffix: '+' },
      { value: '150', label: 'Menü Çeşidi', suffix: '+' },
      { value: '4.9', label: 'Google Puanı', suffix: '★' },
    ],
    cafe: [
      { value: '8', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '300', label: 'Günlük Misafir', suffix: '+' },
      { value: '50', label: 'Kahve Çeşidi', suffix: '+' },
      { value: '4.8', label: 'Google Puanı', suffix: '★' },
    ],
    hotel: [
      { value: '5', label: 'Yıldız', suffix: '★' },
      { value: '120', label: 'Lüks Oda', suffix: '' },
      { value: '98', label: 'Doluluk Oranı', suffix: '%' },
      { value: '25', label: 'Yıllık Deneyim', suffix: '+' },
    ],
    engineer: [
      { value: '10', label: 'Yıllık Deneyim', suffix: '+' },
      { value: '200', label: 'Tamamlanan Proje', suffix: '+' },
      { value: '50', label: 'Mutlu Müşteri', suffix: '+' },
      { value: '5', label: 'Teknoloji Alanı', suffix: '+' },
    ],
  };

  const sectorKey = data.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';
  const stats = statsByKey[sectorKey];
  if (stats && Array.isArray(props.stats)) {
    return { ...props, stats };
  }
  // sectionTitle fallback
  if (!props.sectionTitle) {
    return { ...props, sectionTitle: 'Rakamlarla Biz' };
  }
  return props;
}, []);

// DentalTips — sektöre göre sağlık ipuçları
register(['DentalTips'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const sectorKey = data.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';
  const overrides: Record<string, any> = {};

  if (!props.title) overrides.title = sectorKey === 'dentist' ? 'Ağız Sağlığı İpuçları' : 'Sağlıklı Yaşam İpuçları';
  if (!props.subtitle) overrides.subtitle = 'Bilmeniz Gerekenler';

  // Tips: eğer tüm tip başlıkları boşsa (definitions'tan geldi) sektör defaults kullan
  const allEmpty = Array.isArray(props.tips) && props.tips.every((t: any) => !t.title && !t.content);
  if (allEmpty) {
    const defaultTips: Record<string, any[]> = {
      dentist: [
        { icon: 'Droplets', title: 'Doğru Fırçalama', content: 'Günde en az 2 kez, 2 dakika boyunca yumuşak kıllı fırçayla 45 derece açıyla fırçalayın.' },
        { icon: 'Clock', title: 'Düzenli Kontrol', content: 'Altı ayda bir diş hekiminizi ziyaret edin. Erken teşhis tedavi süresini azaltır.' },
        { icon: 'Apple', title: 'Sağlıklı Beslenme', content: 'Şekerli ve asitli yiyeceklerden kaçının. Kalsiyum zengin besinler diş sağlığını destekler.' },
        { icon: 'ShieldCheck', title: 'Koruyucu Tedaviler', content: 'Fissür örtücü ve flor uygulamaları ile dişlerinizi çürüklere karşı koruyun.' },
      ],
      doctor: [
        { icon: 'Heart', title: 'Düzenli Egzersiz', content: 'Haftada en az 150 dakika orta yoğunlukta fiziksel aktivite yapın.' },
        { icon: 'Droplets', title: 'Yeterli Su Tüketimi', content: 'Günde en az 2 litre su içerek vücudunuzu nemli tutun.' },
        { icon: 'Clock', title: 'Düzenli Check-up', content: 'Yılda bir genel sağlık kontrolü yaptırın. Erken teşhis hayat kurtarır.' },
        { icon: 'ShieldCheck', title: 'Aşı Takibi', content: 'Aşı takviminizi güncel tutarak sizi ve çevrenizi koruyun.' },
      ],
    };
    const tipList = defaultTips[sectorKey] || defaultTips.doctor;
    if (tipList) overrides.tips = tipList;
  }

  return { ...props, ...overrides };
}, []);

// RoomShowcase & HotelAmenities — sektöre uygun başlıklar
register(['RoomShowcase'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};
  if (!props.subtitle) overrides.subtitle = profile?.sectionLabels?.services || 'Odalarımız';
  if (!props.title) overrides.title = 'Konfor ve Zarafet';
  return { ...props, ...overrides };
}, []);

register(['HotelAmenities'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};
  if (!props.subtitle) overrides.subtitle = 'Olanaklar';
  if (!props.title) overrides.title = 'Premium Hizmetler';
  return { ...props, ...overrides };
}, []);

// SkillsGrid & ProjectShowcase — sektöre uygun başlıklar
register(['SkillsGrid'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};
  if (!props.subtitle) overrides.subtitle = 'Yetenekler';
  if (!props.title) overrides.title = profile?.sectionLabels?.services || 'Teknik Beceriler';
  return { ...props, ...overrides };
}, []);

register(['ProjectShowcase'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};
  if (!props.subtitle) overrides.subtitle = profile?.sectionLabels?.gallery || 'Projeler';
  if (!props.title) overrides.title = 'Son Çalışmalarım';
  return { ...props, ...overrides };
}, []);

// ─── Sector-incompatible section definitions ─────────────────────
// Key = section type, Value = list of sectors where this section IS compatible.
// If user's sector is NOT in this list, the section is removed or replaced.
const sectorCompatibility: Record<string, string[]> = {
  'RoomShowcase': ['hotel', 'resort', 'accommodation', 'motel', 'hostel', 'apart'],
  'HotelAmenities': ['hotel', 'resort', 'accommodation', 'motel', 'hostel', 'apart'],
  'RestaurantMenu': ['restaurant', 'food', 'bistro', 'cafe', 'bar', 'fine-dining', 'bakery', 'patisserie', 'coffee'],
  'ChefShowcase': ['restaurant', 'food', 'cafe', 'bistro', 'bar', 'fine-dining', 'bakery'],
  'DentalTips': ['dentist', 'dental', 'doctor', 'health', 'clinic', 'medical', 'hospital'],
  'DentalBooking': ['dentist', 'dental', 'doctor', 'health', 'clinic', 'medical', 'hospital', 'veterinary', 'physiotherapy'],
  'DentalServices': ['dentist', 'dental', 'doctor', 'health', 'clinic', 'medical', 'hospital', 'veterinary', 'physiotherapy'],
  'SkillsGrid': ['developer', 'engineer', 'freelancer', 'designer', 'creative', 'technology', 'consultant', 'architect'],
  'ProjectShowcase': ['developer', 'engineer', 'freelancer', 'designer', 'creative', 'technology', 'consultant', 'architect'],
  'MenuShowcase': ['restaurant', 'food', 'cafe', 'bistro', 'bar', 'fine-dining', 'bakery', 'patisserie', 'coffee'],
  'CafeGallery': ['cafe', 'coffee', 'food', 'restaurant', 'bistro', 'bar', 'bakery', 'patisserie', 'fine-dining'],
};

// Sections that should be replaced with a compatible alternative instead of removed
const sectionReplacements: Record<string, { type: string; propsTransform?: (props: Record<string, any>) => Record<string, any> }> = {
  'DentalServices': { type: 'ServicesGrid' },
  'DentalBooking': { type: 'AppointmentBooking', propsTransform: (p) => ({
    sectionTitle: p.title || 'Randevu',
    sectionSubtitle: p.subtitle || 'Online Randevu Alın',
    sectionDescription: p.description || 'Hemen randevunuzu oluşturun.',
    submitButtonText: 'Randevu Al',
    successMessage: 'Randevunuz alındı!',
  })},
  'MenuShowcase': { type: 'ServicesGrid' },
  'RestaurantMenu': { type: 'ServicesGrid' },
};

/**
 * Check if a section type is compatible with the user's sector.
 */
function isSectorCompatible(sectionType: string, sector: string): boolean {
  const compatList = sectorCompatibility[sectionType];
  if (!compatList) return true; // no restriction
  const lower = sector.toLowerCase().replace(/[\s-]/g, '_');
  return compatList.some(s => lower.includes(s) || s.includes(lower));
}

/**
 * Generic label replacements based on sector profile.
 */
const genericLabels = [
  'menümüz', 'menü', 'our menu', 'şeflerimiz', 'chef team',
  'odalarımız', 'rooms', 'tedavilerimiz', 'treatments',
];

function applySectorLabels(
  props: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const profile = getSectorProfile(projectData.sector);
  if (!profile) return props;

  const result = { ...props };
  const labels = profile.sectionLabels;

  for (const key of ['title', 'sectionTitle']) {
    const val = result[key];
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (genericLabels.some(g => lower.includes(g))) {
        if (lower.includes('menü') || lower.includes('menu')) result[key] = labels.services;
        else if (lower.includes('şef') || lower.includes('chef') || lower.includes('ekip') || lower.includes('team')) result[key] = labels.team;
        else if (lower.includes('oda') || lower.includes('room')) result[key] = labels.services;
        else if (lower.includes('tedavi') || lower.includes('treatment')) result[key] = labels.services;
      }
    }
  }

  return result;
}

/**
 * Filter and transform sections based on sector compatibility.
 * Exported for use in applyTemplate.
 */
export function filterIncompatibleSections(
  sections: TemplateSectionDef[],
  sector: string
): TemplateSectionDef[] {
  if (!sector) return sections;

  return sections.reduce<TemplateSectionDef[]>((acc, sec) => {
    if (isSectorCompatible(sec.type, sector)) {
      acc.push(sec);
    } else {
      // Check for replacement
      const replacement = sectionReplacements[sec.type];
      if (replacement) {
        const newProps = replacement.propsTransform
          ? replacement.propsTransform(sec.defaultProps)
          : sec.defaultProps;
        acc.push({ ...sec, type: replacement.type, defaultProps: newProps });
      }
      // else: skip (remove) the section
    }
    return acc;
  }, []);
}

/**
 * Maps project data onto template section definitions.
 * Unknown section types are returned untouched.
 */
export function mapSections(
  sections: TemplateSectionDef[],
  projectData: ProjectData
): TemplateSectionDef[] {
  const sector = projectData.sector || '';

  // First filter incompatible sections
  const filtered = filterIncompatibleSections(sections, sector);

  return filtered.map(sec => {
    const entry = mapperRegistry[sec.type];
    let mappedProps = { ...sec.defaultProps };

    if (entry) {
      if (entry.compatibleSectors.length > 0 && sector) {
        if (!entry.compatibleSectors.includes(sector)) {
          mappedProps = applySectorLabels(mappedProps, projectData);
          return { ...sec, defaultProps: mappedProps };
        }
      }
      mappedProps = entry.fn(mappedProps, projectData);
    }

    mappedProps = applySectorLabels(mappedProps, projectData);

    return { ...sec, defaultProps: mappedProps };
  });
}
