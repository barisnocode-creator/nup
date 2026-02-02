// Chaibuilder Custom Blocks Registry
// This file registers all custom blocks for the Chai Builder editor

// Hero blocks
import './hero/HeroSplit';
import './hero/HeroCentered';
import './hero/HeroOverlay';

// Services blocks
import './services/ServicesGrid';

// Testimonials blocks
import './testimonials/TestimonialsCarousel';

// Contact blocks
import './contact/ContactForm';

// CTA blocks
import './cta/CTABanner';

// FAQ blocks
import './faq/FAQAccordion';

// Export all blocks
export * from './hero';
export * from './services';
export * from './testimonials';
export * from './contact';
export * from './cta';
export * from './faq';

// Registration function (called on import)
export function registerCustomBlocks() {
  console.log('[ChaiBuilder] Custom blocks registered');
}
