import type { SectionComponentProps } from './types';
import { HeroCentered } from './HeroCentered';
import { HeroSplit } from './HeroSplit';
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

type SectionComponent = React.ComponentType<SectionComponentProps>;

export const sectionRegistry: Record<string, SectionComponent> = {
  'HeroCentered': HeroCentered,
  'hero-centered': HeroCentered,
  'HeroSplit': HeroSplit,
  'hero-split': HeroSplit,
  'HeroOverlay': HeroOverlay,
  'hero-overlay': HeroOverlay,
  'HeroCafe': HeroCafe,
  'hero-cafe': HeroCafe,
  'ServicesGrid': ServicesGrid,
  'services-grid': ServicesGrid,
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
  { type: 'hero-cafe', label: 'Hero - Cafe', category: 'hero' },
  { type: 'services-grid', label: 'Hizmetler', category: 'content' },
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
];
