import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

// Map legacy block _type to section type
const typeMap: Record<string, string> = {
  HeroCentered: 'hero-centered',
  HeroSplit: 'hero-split',
  HeroOverlay: 'hero-overlay',
  ServicesGrid: 'services-grid',
  AboutSection: 'about-section',
  StatisticsCounter: 'statistics-counter',
  TestimonialsCarousel: 'testimonials-carousel',
  ContactForm: 'contact-form',
  CTABanner: 'cta-banner',
  FAQAccordion: 'faq-accordion',
  ImageGallery: 'image-gallery',
  PricingTable: 'pricing-table',
  AppointmentBooking: 'appointment-booking',
  NaturalHeader: 'natural-header',
  NaturalHero: 'natural-hero',
  NaturalIntro: 'natural-intro',
  NaturalArticleGrid: 'natural-article-grid',
  NaturalNewsletter: 'natural-newsletter',
  NaturalFooter: 'natural-footer',
};

// Internal legacy props to exclude
const internalProps = new Set([
  '_id', '_type', '_position', '_name', 'styles', 'blockProps',
  'inBuilder', 'containerClassName',
]);

function convertBlock(block: any, index: number): SiteSection {
  const blockType = block._type || block.type || 'unknown';
  const sectionType = typeMap[blockType] || blockType;

  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(block)) {
    if (!internalProps.has(key)) {
      props[key] = val;
    }
  }

  return {
    id: block._id || `section_${index}_${Date.now()}`,
    type: sectionType,
    locked: index === 0, // First section (usually hero) is locked
    props,
  };
}

function convertTheme(chaiTheme: any): SiteTheme {
  if (!chaiTheme) return {};

  const colors: Record<string, any> = {};
  if (chaiTheme.colors) {
    for (const [key, val] of Object.entries(chaiTheme.colors)) {
      // Legacy format stores colors as [light, dark] arrays
      colors[key] = Array.isArray(val) ? val[0] : val;
    }
  }

  return {
    colors,
    fonts: chaiTheme.fontFamily ? {
      heading: chaiTheme.fontFamily.heading,
      body: chaiTheme.fontFamily.body,
    } : undefined,
    borderRadius: chaiTheme.borderRadius,
  };
}

export function useMigrateSections() {
  const migrate = useCallback(async (
    projectId: string,
    chaiBlocks: any[] | null,
    chaiTheme: any | null,
  ): Promise<{ sections: SiteSection[]; theme: SiteTheme } | null> => {
    if (!chaiBlocks || !Array.isArray(chaiBlocks) || chaiBlocks.length === 0) {
      return null;
    }

    const sections = chaiBlocks.map((block, i) => convertBlock(block, i));
    const theme = convertTheme(chaiTheme);

    // Save to database
    const { error } = await supabase
      .from('projects')
      .update({
        site_sections: sections as any,
        site_theme: theme as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (error) {
      console.error('[Migration] Failed to save:', error);
      return null;
    }

    console.log(`[Migration] Converted ${sections.length} blocks to sections`);
    return { sections, theme };
  }, []);

  return { migrate };
}
