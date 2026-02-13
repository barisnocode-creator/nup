/**
 * Converts a TemplateDefinition into ChaiBlock[] arrays.
 * Optionally merges AI-generated content into the block props.
 * This is a pure additive module — does not modify any existing conversion logic.
 */

import type { ChaiBlock } from '@chaibuilder/sdk/types';
import type { TemplateDefinition } from '@/templates/catalog/definitions';
import type { GeneratedContent } from '@/types/generated-website';

const generateBlockId = () => `block_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Extract AI-generated content overrides for a given block type.
 * Returns a partial props object that merges on top of defaultProps.
 */
function extractContentForBlockType(
  blockType: string,
  content?: GeneratedContent
): Record<string, any> {
  if (!content) return {};

  const { pages, images, metadata } = content;
  const overrides: Record<string, any> = {};

  switch (blockType) {
    case 'HeroCentered':
    case 'HeroSplit':
    case 'HeroOverlay': {
      const hero = pages?.home?.hero;
      if (hero) {
        if (hero.title) overrides.title = hero.title;
        if (hero.subtitle) overrides.subtitle = hero.subtitle;
        if (hero.description) overrides.description = hero.description;
      }
      if (metadata?.siteName && !hero?.title) overrides.title = metadata.siteName;
      // Resolve hero image
      const heroImg = resolveImageSafe(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
      if (heroImg) {
        overrides[blockType === 'HeroSplit' ? 'image' : 'backgroundImage'] = heroImg;
      }
      break;
    }
    case 'AboutSection': {
      const story = pages?.about?.story || pages?.home?.welcome;
      if (story) {
        if (story.title) overrides.title = story.title;
        if (story.content) overrides.description = story.content;
      }
      const vals = pages?.about?.values?.slice(0, 4).map(v => v.title);
      if (vals?.length) overrides.features = vals.join('\n');
      const aboutImg = resolveImageSafe(images, 'aboutImage', 'heroAbout', 'aboutTeam');
      if (aboutImg) overrides.image = aboutImg;
      break;
    }
    case 'ServicesGrid': {
      const list = pages?.services?.servicesList || pages?.home?.highlights;
      if (list?.length) {
        overrides.services = list.slice(0, 6).map(s => ({
          icon: s.icon || '⭐',
          title: s.title,
          description: s.description,
          image: (s as any).image || '',
        }));
      }
      if (pages?.services?.hero?.title) overrides.sectionTitle = pages.services.hero.title;
      if (pages?.services?.intro?.content) overrides.sectionDescription = pages.services.intro.content;
      break;
    }
    case 'StatisticsCounter': {
      const stats = pages?.home?.statistics;
      if (stats?.length) {
        for (let i = 0; i < Math.min(4, stats.length); i++) {
          overrides[`stat${i + 1}Value`] = stats[i].value || '';
          overrides[`stat${i + 1}Label`] = stats[i].label || '';
        }
      }
      break;
    }
    case 'ContactForm': {
      const contact = pages?.contact;
      if (contact?.info) {
        if (contact.info.address) overrides.address = contact.info.address;
        if (contact.info.phone) overrides.phone = contact.info.phone;
        if (contact.info.email) overrides.email = contact.info.email;
      }
      if (contact?.form?.title) overrides.sectionTitle = contact.form.title;
      if (contact?.form?.subtitle) overrides.sectionDescription = contact.form.subtitle;
      break;
    }
    case 'FAQAccordion': {
      const faq = pages?.services?.faq;
      if (faq?.length) {
        overrides.items = faq.map(f => ({ question: f.question, answer: f.answer }));
      }
      break;
    }
    case 'ImageGallery': {
      const gallery = images?.galleryImages as string[] | undefined;
      if (gallery?.length) {
        for (let i = 0; i < Math.min(6, gallery.length); i++) {
          const img = gallery[i];
          if (typeof img === 'string' && img.length > 0) {
            if (img.startsWith('http') || img.length < 200000) {
              overrides[`image${i + 1}`] = img;
            }
          }
        }
      }
      break;
    }
    // TestimonialsCarousel, PricingTable, CTABanner, AppointmentBooking
    // keep defaults — AI content doesn't generate these reliably
  }

  return overrides;
}

/** Safe image resolver — skips large base64, accepts URLs */
function resolveImageSafe(images: Record<string, any> | undefined, ...keys: string[]): string {
  if (!images) return '';
  for (const key of keys) {
    const val = images[key];
    if (typeof val === 'string' && val.length > 0) {
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      if (val.startsWith('data:') && val.length > 200000) continue;
      return val;
    }
  }
  return '';
}

/**
 * Convert a TemplateDefinition into an array of ChaiBlocks.
 * If AI-generated content is provided, it merges on top of default props.
 */
export function convertTemplateToBlocks(
  definition: TemplateDefinition,
  content?: GeneratedContent
): ChaiBlock[] {
  const blocks = definition.sections.map(section => ({
    _id: generateBlockId(),
    _type: section.type,
    ...section.defaultProps,
    ...extractContentForBlockType(section.type, content),
  }));
  
  return validateLayoutSchema(blocks, definition);
}

// ─── Registered block types (must match ChaiBuilder block registrations) ───
const REGISTERED_BLOCK_TYPES = new Set([
  'HeroCentered', 'HeroSplit', 'HeroOverlay',
  'AboutSection', 'ServicesGrid', 'StatisticsCounter',
  'ContactForm', 'FAQAccordion', 'ImageGallery',
  'TestimonialsCarousel', 'PricingTable', 'CTABanner',
  'AppointmentBooking',
]);

const MAX_SECTIONS = 12;
const MAX_PROPS_SIZE_BYTES = 50 * 1024; // 50KB

/**
 * Validates the generated layout schema for safety:
 * - All block types must be registered
 * - All block IDs must be unique
 * - Required sections must be present
 * - Maximum section count enforced
 * - Props size limit enforced
 */
export function validateLayoutSchema(
  blocks: ChaiBlock[],
  definition?: TemplateDefinition
): ChaiBlock[] {
  // Filter out unknown block types
  const validBlocks = blocks.filter(block => {
    if (!REGISTERED_BLOCK_TYPES.has(block._type)) {
      console.warn(`[validateLayoutSchema] Unknown block type "${block._type}" removed`);
      return false;
    }
    return true;
  });

  // Enforce max sections
  const trimmedBlocks = validBlocks.slice(0, MAX_SECTIONS);

  // Ensure unique IDs
  const seenIds = new Set<string>();
  for (const block of trimmedBlocks) {
    if (seenIds.has(block._id)) {
      block._id = generateBlockId();
    }
    seenIds.add(block._id);
  }

  // Check required sections from definition
  if (definition) {
    const existingTypes = new Set(trimmedBlocks.map(b => b._type));
    for (const section of definition.sections) {
      if (section.required && !existingTypes.has(section.type)) {
        console.warn(`[validateLayoutSchema] Required section "${section.type}" missing, adding with defaults`);
        trimmedBlocks.unshift({
          _id: generateBlockId(),
          _type: section.type,
          ...section.defaultProps,
        } as ChaiBlock);
      }
    }
  }

  // Check total props size
  const totalSize = new TextEncoder().encode(JSON.stringify(trimmedBlocks)).length;
  if (totalSize > MAX_PROPS_SIZE_BYTES) {
    console.warn(`[validateLayoutSchema] Layout size ${totalSize} exceeds ${MAX_PROPS_SIZE_BYTES} bytes`);
  }

  return trimmedBlocks;
}
