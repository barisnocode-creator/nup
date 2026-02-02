// Chaibuilder Custom Blocks Registry
// This file registers all custom blocks for the Chai Builder editor

// Hero blocks
import './hero/HeroSplit';
import './hero/HeroCentered';
import './hero/HeroOverlay';

// About blocks
import './about/AboutSection';

// Services blocks
import './services/ServicesGrid';

// Statistics blocks
import './statistics/StatisticsCounter';

// Gallery blocks
import './gallery/ImageGallery';

// Pricing blocks
import './pricing/PricingTable';

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
export * from './about';
export * from './services';
export * from './statistics';
export * from './gallery';
export * from './pricing';
export * from './testimonials';
export * from './contact';
export * from './cta';
export * from './faq';

// Registration function (called on import)
export function registerCustomBlocks() {
  console.log('[ChaiBuilder] Custom blocks registered');
}
