// Chaibuilder Custom Blocks Registry
// This file registers all custom blocks for the Chai Builder editor

// Hero blocks
import './hero/HeroSplit';
import './hero/HeroCentered';
import './hero/HeroOverlay';
import './hero/NaturalHero';

// About blocks
import './about/AboutSection';
import './about/NaturalIntro';

// Services blocks
import './services/ServicesGrid';

// Statistics blocks
import './statistics/StatisticsCounter';

// Gallery blocks
import './gallery/ImageGallery';
import './gallery/NaturalArticleGrid';

// Pricing blocks
import './pricing/PricingTable';

// Testimonials blocks
import './testimonials/TestimonialsCarousel';

// Contact blocks
import './contact/ContactForm';

// CTA blocks
import './cta/CTABanner';
import './cta/NaturalNewsletter';

// FAQ blocks
import './faq/FAQAccordion';

// Appointment blocks
import './appointment/AppointmentBooking';

// Export all blocks
export * from './hero';
export * from './about';
export * from './services';
export * from './statistics';
export * from './gallery';
export * from './pricing';
export * from './testimonials';
export * from './contact';
export * from './cta';
export * from './faq';
export * from './appointment';

// Registration function (called on import)
export function registerCustomBlocks() {
  console.log('[ChaiBuilder] Custom blocks registered');
}
