import type { SectionComponentProps } from './types';
import { HeroCentered } from './HeroCentered';
import { HeroSplit } from './HeroSplit';
import { HeroMedical } from './HeroMedical';
// Addable sections
import { AppointmentSection } from './addable/AppointmentSection';
import { FAQSection as AddableFAQSection } from './addable/FAQSection';
import { MessageFormSection } from './addable/MessageFormSection';
import { WorkingHoursMapSection } from './addable/WorkingHoursMapSection';
import { OnlineConsultationSection } from './addable/OnlineConsultationSection';
import { InsuranceSection } from './addable/InsuranceSection';
import { MenuHighlightsSection } from './addable/MenuHighlightsSection';
import { RoomAvailabilitySection } from './addable/RoomAvailabilitySection';
import { CaseEvaluationSection } from './addable/CaseEvaluationSection';
import { BeforeAfterSection } from './addable/BeforeAfterSection';
import { PetRegistrationSection } from './addable/PetRegistrationSection';
import { CallUsSection } from './addable/CallUsSection';
import { SocialProofSection } from './addable/SocialProofSection';
import { VideoSection } from './addable/VideoSection';
import { BlogSection } from './addable/BlogSection';
import { TeamGridSection } from './addable/TeamGridSection';
import { PromotionBannerSection } from './addable/PromotionBannerSection';
import { SiteFooter } from './addable/SiteFooter';
import { SiteHeader } from './addable/SiteHeader';
import { HeroOverlay } from './HeroOverlay';
import { HeroCafe } from './HeroCafe';
import { ServicesGrid } from './ServicesGrid';
import { AboutSection } from './AboutSection';
import { StatisticsCounter } from './StatisticsCounter';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { ContactForm } from './ContactForm';
import { CTABanner } from './CTABanner';
import { FAQAccordion } from './FAQAccordion';
import { ImageGallery } from './ImageGallery';
import { PricingTable } from './PricingTable';
import { AppointmentBooking } from './AppointmentBooking';
import { MenuShowcase } from './MenuShowcase';
import { CafeStory } from './CafeStory';
import { CafeFeatures } from './CafeFeatures';
import { CafeGallery } from './CafeGallery';
import { HeroDental } from './HeroDental';
import { DentalServices } from './DentalServices';
import { DentalTips } from './DentalTips';
import { DentalBooking } from './DentalBooking';
import { HeroRestaurant } from './HeroRestaurant';
import { ChefShowcase } from './ChefShowcase';
import { RestaurantMenu } from './RestaurantMenu';
import { HeroHotel } from './HeroHotel';
import { RoomShowcase } from './RoomShowcase';
import { HotelAmenities } from './HotelAmenities';
import { HeroPortfolio } from './HeroPortfolio';
import { ProjectShowcase } from './ProjectShowcase';
import { SkillsGrid } from './SkillsGrid';

type SectionComponent = React.ComponentType<SectionComponentProps>;

export const sectionRegistry: Record<string, SectionComponent> = {
  'HeroCentered': HeroCentered,
  'hero-centered': HeroCentered,
  'HeroSplit': HeroSplit,
  'hero-split': HeroSplit,
  'HeroMedical': HeroMedical,
  'hero-medical': HeroMedical,
  'HeroOverlay': HeroOverlay,
  'hero-overlay': HeroOverlay,
  'HeroCafe': HeroCafe,
  'hero-cafe': HeroCafe,
  'HeroDental': HeroDental,
  'hero-dental': HeroDental,
  'HeroRestaurant': HeroRestaurant,
  'hero-restaurant': HeroRestaurant,
  'HeroHotel': HeroHotel,
  'hero-hotel': HeroHotel,
  'HeroPortfolio': HeroPortfolio,
  'hero-portfolio': HeroPortfolio,
  'ServicesGrid': ServicesGrid,
  'services-grid': ServicesGrid,
  'DentalServices': DentalServices,
  'dental-services': DentalServices,
  'AboutSection': AboutSection,
  'about-section': AboutSection,
  'StatisticsCounter': StatisticsCounter,
  'statistics-counter': StatisticsCounter,
  'TestimonialsCarousel': TestimonialsCarousel,
  'testimonials-carousel': TestimonialsCarousel,
  'ContactForm': ContactForm,
  'contact-form': ContactForm,
  'CTABanner': CTABanner,
  'cta-banner': CTABanner,
  'FAQAccordion': FAQAccordion,
  'faq-accordion': FAQAccordion,
  'ImageGallery': ImageGallery,
  'image-gallery': ImageGallery,
  'PricingTable': PricingTable,
  'pricing-table': PricingTable,
  'AppointmentBooking': AppointmentBooking,
  'appointment-booking': AppointmentBooking,
  'MenuShowcase': MenuShowcase,
  'menu-showcase': MenuShowcase,
  'CafeStory': CafeStory,
  'cafe-story': CafeStory,
  'CafeFeatures': CafeFeatures,
  'cafe-features': CafeFeatures,
  'CafeGallery': CafeGallery,
  'cafe-gallery': CafeGallery,
  'DentalTips': DentalTips,
  'dental-tips': DentalTips,
  'DentalBooking': DentalBooking,
  'dental-booking': DentalBooking,
  'ChefShowcase': ChefShowcase,
  'chef-showcase': ChefShowcase,
  'RestaurantMenu': RestaurantMenu,
  'restaurant-menu': RestaurantMenu,
  'RoomShowcase': RoomShowcase,
  'room-showcase': RoomShowcase,
  'HotelAmenities': HotelAmenities,
  'hotel-amenities': HotelAmenities,
  'ProjectShowcase': ProjectShowcase,
  'project-showcase': ProjectShowcase,
  'SkillsGrid': SkillsGrid,
  'skills-grid': SkillsGrid,
  // Addable sections
  'AddableAppointment': AppointmentSection,
  'AddableFAQ': AddableFAQSection,
  'AddableMessageForm': MessageFormSection,
  'AddableWorkingHours': WorkingHoursMapSection,
  'AddableOnlineConsultation': OnlineConsultationSection,
  'AddableInsurance': InsuranceSection,
  'AddableMenuHighlights': MenuHighlightsSection,
  'AddableRoomAvailability': RoomAvailabilitySection,
  'AddableCaseEvaluation': CaseEvaluationSection,
  'AddableBeforeAfter': BeforeAfterSection,
  'AddablePetRegistration': PetRegistrationSection,
  'AddableCallUs': CallUsSection,
  'AddableSocialProof': SocialProofSection,
  'AddableTeamGrid': TeamGridSection,
  'AddablePromotionBanner': PromotionBannerSection,
  'AddableVideo': VideoSection,
  'AddableBlog': BlogSection,
  'AddableSiteFooter': SiteFooter,
  'AddableSiteHeader': SiteHeader as any,
};

export function getSectionComponent(type: string): SectionComponent | null {
  return sectionRegistry[type] || null;
}

// Section catalog for Add Section panel
export interface SectionCatalogItem {
  type: string;
  label: string;
  category: string;
}

export const sectionCatalog: SectionCatalogItem[] = [
  { type: 'hero-centered', label: 'Hero - Ortalanmış', category: 'hero' },
  { type: 'hero-split', label: 'Hero - İki Kolon', category: 'hero' },
  { type: 'hero-overlay', label: 'Hero - Overlay', category: 'hero' },
  { type: 'hero-medical', label: 'Hero - MedCare Pro', category: 'hero' },
  { type: 'hero-cafe', label: 'Hero - Cafe', category: 'hero' },
  { type: 'hero-dental', label: 'Hero - Dental', category: 'hero' },
  { type: 'hero-restaurant', label: 'Hero - Restoran', category: 'hero' },
  { type: 'hero-hotel', label: 'Hero - Otel', category: 'hero' },
  { type: 'hero-portfolio', label: 'Hero - Portfolio', category: 'hero' },
  { type: 'services-grid', label: 'Hizmetler', category: 'content' },
  { type: 'dental-services', label: 'Dental Hizmetler', category: 'dental' },
  { type: 'about-section', label: 'Hakkımızda', category: 'content' },
  { type: 'statistics-counter', label: 'İstatistikler', category: 'content' },
  { type: 'testimonials-carousel', label: 'Müşteri Yorumları', category: 'content' },
  { type: 'contact-form', label: 'İletişim Formu', category: 'contact' },
  { type: 'cta-banner', label: 'CTA Banner', category: 'cta' },
  { type: 'faq-accordion', label: 'SSS', category: 'content' },
  { type: 'image-gallery', label: 'Görsel Galeri', category: 'content' },
  { type: 'pricing-table', label: 'Fiyatlandırma', category: 'content' },
  { type: 'appointment-booking', label: 'Randevu Formu', category: 'contact' },
  { type: 'menu-showcase', label: 'Menü Vitrini', category: 'cafe' },
  { type: 'cafe-story', label: 'Cafe Hikayesi', category: 'cafe' },
  { type: 'cafe-features', label: 'Cafe Özellikleri', category: 'cafe' },
  { type: 'cafe-gallery', label: 'Cafe Galeri', category: 'cafe' },
  { type: 'dental-tips', label: 'Sağlık İpuçları', category: 'dental' },
  { type: 'dental-booking', label: 'Adımlı Randevu', category: 'dental' },
  { type: 'chef-showcase', label: 'Şef Tanıtım', category: 'restaurant' },
  { type: 'restaurant-menu', label: 'Restoran Menü', category: 'restaurant' },
  { type: 'room-showcase', label: 'Oda Vitrini', category: 'hotel' },
  { type: 'hotel-amenities', label: 'Otel Olanakları', category: 'hotel' },
  { type: 'project-showcase', label: 'Proje Vitrini', category: 'portfolio' },
  { type: 'skills-grid', label: 'Yetenek Kartları', category: 'portfolio' },
  { type: 'AddableVideo', label: 'YouTube Video', category: 'content' },
];
