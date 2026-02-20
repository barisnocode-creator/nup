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

// MenuShowcase — sektöre göre menu item'larını Türkçeleştir + bölüm başlığını ayarla
register(['MenuShowcase', 'RestaurantMenu'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  const overrides: Record<string, any> = {};
  if (profile?.sectionLabels?.services && props.subtitle !== undefined) {
    overrides.subtitle = profile.sectionLabels.services;
  }
  if (profile?.sectionLabels?.services && props.title !== undefined && !props.title) {
    overrides.title = 'Özel Seçkilerimiz';
  }
  return { ...props, ...overrides };
}, []);

// StatisticsCounter — sektöre göre stat etiketleri
register(['StatisticsCounter'], (props, data) => {
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
  return props;
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
