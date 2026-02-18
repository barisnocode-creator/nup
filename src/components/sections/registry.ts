import type { SectionComponentProps } from './types';
import { HeroCentered } from './HeroCentered';
import { HeroSplit } from './HeroSplit';
import { HeroOverlay } from './HeroOverlay';
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
import { NaturalHeader } from './NaturalHeader';
import { NaturalHero } from './NaturalHero';
import { NaturalIntro } from './NaturalIntro';
import { NaturalArticleGrid } from './NaturalArticleGrid';
import { NaturalNewsletter } from './NaturalNewsletter';
import { NaturalFooter } from './NaturalFooter';

type SectionComponent = React.ComponentType<SectionComponentProps>;

export const sectionRegistry: Record<string, SectionComponent> = {
  'HeroCentered': HeroCentered,
  'hero-centered': HeroCentered,
  'HeroSplit': HeroSplit,
  'hero-split': HeroSplit,
  'HeroOverlay': HeroOverlay,
  'hero-overlay': HeroOverlay,
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
  'NaturalHeader': NaturalHeader,
  'natural-header': NaturalHeader,
  'NaturalHero': NaturalHero,
  'natural-hero': NaturalHero,
  'NaturalIntro': NaturalIntro,
  'natural-intro': NaturalIntro,
  'NaturalArticleGrid': NaturalArticleGrid,
  'natural-article-grid': NaturalArticleGrid,
  'NaturalNewsletter': NaturalNewsletter,
  'natural-newsletter': NaturalNewsletter,
  'NaturalFooter': NaturalFooter,
  'natural-footer': NaturalFooter,
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
  { type: 'natural-header', label: 'Natural Header', category: 'natural' },
  { type: 'natural-hero', label: 'Natural Hero', category: 'natural' },
  { type: 'natural-intro', label: 'Natural Intro', category: 'natural' },
  { type: 'natural-article-grid', label: 'Natural Makale Grid', category: 'natural' },
  { type: 'natural-newsletter', label: 'Natural Newsletter', category: 'natural' },
  { type: 'natural-footer', label: 'Natural Footer', category: 'natural' },
];
