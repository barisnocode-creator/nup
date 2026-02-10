import { GeneratedContent } from '@/types/generated-website';
import type { ChaiBlock } from '@chaibuilder/sdk/types';
import {
  templateToPreset,
  modernProfessionalPreset,
  boldAgencyPreset,
  elegantMinimalPreset,
  corporateBluePreset,
  minimalDarkPreset,
  modernSaasPreset,
  videoStudioPreset,
  vibrantCreativePreset,
} from '../themes/presets';

// Unique ID generator
const generateBlockId = () => `block_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Resolves the best available image URL from multiple fallback keys.
 * - URL images (http/https) are always accepted regardless of size
 * - Base64 images over 200KB are skipped to prevent DB bloat
 */
function resolveImage(images: Record<string, any> | undefined, ...keys: string[]): string {
  if (!images) return '';
  for (const key of keys) {
    const val = images[key];
    if (typeof val === 'string' && val.length > 0) {
      // URL-based images are always safe (small string, actual data served by CDN)
      if (val.startsWith('http://') || val.startsWith('https://')) {
        return val;
      }
      // Skip extremely large base64 data (>200KB) to prevent DB bloat
      if (val.startsWith('data:') && val.length > 200000) continue;
      return val;
    }
  }
  return '';
}

/**
 * Maps user color preferences to a ChaiBuilder theme preset.
 */
export function getThemeFromColorPreferences(
  colorTone?: string,
  colorMode?: string
): any {
  const tone = colorTone || 'neutral';
  const mode = colorMode || 'light';

  if (tone === 'warm' && mode === 'light') return modernProfessionalPreset;
  if (tone === 'warm' && mode === 'dark') return videoStudioPreset;
  if (tone === 'warm' && mode === 'neutral') return vibrantCreativePreset;
  if (tone === 'cool' && mode === 'light') return corporateBluePreset;
  if (tone === 'cool' && mode === 'dark') return modernSaasPreset;
  if (tone === 'cool' && mode === 'neutral') return corporateBluePreset;
  if (tone === 'neutral' && mode === 'light') return elegantMinimalPreset;
  if (tone === 'neutral' && mode === 'dark') return minimalDarkPreset;
  if (tone === 'neutral' && mode === 'neutral') return boldAgencyPreset;

  return modernProfessionalPreset;
}

/**
 * Converts existing generated_content data to ChaiBuilder blocks format.
 * IMPORTANT: Property names MUST match the block schema definitions exactly.
 */
export function convertGeneratedContentToChaiBlocks(
  content: GeneratedContent,
  templateId?: string
): ChaiBlock[] {
  const blocks: ChaiBlock[] = [];
  const { pages, images, metadata } = content;

  // 1. Hero Section
  if (pages?.home?.hero) {
    const hero = pages.home.hero;
    const heroImage = resolveImage(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
    blocks.push({
      _id: generateBlockId(),
      _type: 'HeroCentered',
      title: hero.title || metadata?.siteName || 'Welcome',
      subtitle: hero.subtitle || metadata?.tagline || '',
      description: hero.description || '',
      primaryButtonText: 'İletişime Geç',
      primaryButtonLink: '#contact',
      secondaryButtonText: 'Hizmetlerimiz',
      secondaryButtonLink: '#services',
      backgroundImage: heroImage,
    });
  }

  // 2. Statistics Section
  if (pages?.home?.statistics && pages.home.statistics.length > 0) {
    const stats = pages.home.statistics;
    blocks.push({
      _id: generateBlockId(),
      _type: 'StatisticsCounter',
      title: '',
      subtitle: '',
      stat1Value: stats[0]?.value || '',
      stat1Label: stats[0]?.label || '',
      stat2Value: stats[1]?.value || '',
      stat2Label: stats[1]?.label || '',
      stat3Value: stats[2]?.value || '',
      stat3Label: stats[2]?.label || '',
      stat4Value: stats[3]?.value || '',
      stat4Label: stats[3]?.label || '',
    });
  }

  // 3. About Section
  if (pages?.about?.story || pages?.home?.welcome) {
    const aboutTitle = pages?.about?.story?.title || pages?.home?.welcome?.title || 'Hakkımızda';
    const aboutContent = pages?.about?.story?.content || pages?.home?.welcome?.content || '';
    const featureNames = pages?.about?.values?.slice(0, 4).map(v => v.title) || ['Kalite', 'Güven', 'Deneyim'];
    const aboutImage = resolveImage(images, 'aboutImage', 'heroAbout', 'aboutTeam');

    blocks.push({
      _id: generateBlockId(),
      _type: 'AboutSection',
      title: aboutTitle,
      subtitle: 'Biz Kimiz?',
      description: aboutContent,
      features: featureNames.join('\n'),
      image: aboutImage,
      imagePosition: 'right',
    });
  }

  // 4. Services Section
  if (pages?.services?.servicesList || pages?.home?.highlights) {
    const servicesList = pages?.services?.servicesList || pages?.home?.highlights || [];
    blocks.push({
      _id: generateBlockId(),
      _type: 'ServicesGrid',
      sectionTitle: pages?.services?.hero?.title || 'Hizmetlerimiz',
      sectionSubtitle: 'Neler Yapıyoruz',
      sectionDescription: pages?.services?.intro?.content || 'Size en iyi hizmeti sunmak için buradayız.',
      services: servicesList.slice(0, 6).map(service => ({
        icon: service.icon || '⭐',
        image: (service as any).image || '',
        title: service.title,
        description: service.description,
      })),
    });
  }

  // 5. Testimonials Section
  blocks.push({
    _id: generateBlockId(),
    _type: 'TestimonialsCarousel',
    sectionTitle: 'Müşterilerimiz Ne Diyor?',
    sectionSubtitle: 'Referanslar',
    testimonials: [
      { name: 'Ahmet Yılmaz', role: 'Müşteri', content: 'Harika bir hizmet aldım. Kesinlikle tavsiye ederim.', avatar: '' },
      { name: 'Ayşe Kaya', role: 'Müşteri', content: 'Profesyonel yaklaşım ve kaliteli sonuçlar.', avatar: '' },
      { name: 'Mehmet Demir', role: 'Müşteri', content: 'Beklentilerimi fazlasıyla karşıladılar.', avatar: '' },
    ],
  });

  // 6. Image Gallery
  const galleryImages = images?.galleryImages as string[] | undefined;
  if (galleryImages && galleryImages.length > 0) {
    // Filter out oversized base64 images but allow URLs
    const safeGallery = galleryImages.map(img => {
      if (typeof img !== 'string') return '';
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      if (img.startsWith('data:') && img.length > 200000) return '';
      return img || '';
    });
    blocks.push({
      _id: generateBlockId(),
      _type: 'ImageGallery',
      title: 'Galeri',
      subtitle: 'Çalışmalarımız',
      columns: '3',
      image1: safeGallery[0] || '',
      image2: safeGallery[1] || '',
      image3: safeGallery[2] || '',
      image4: safeGallery[3] || '',
      image5: safeGallery[4] || '',
      image6: safeGallery[5] || '',
    });
  }

  // 7. FAQ Section
  if (pages?.services?.faq && pages.services.faq.length > 0) {
    blocks.push({
      _id: generateBlockId(),
      _type: 'FAQAccordion',
      sectionTitle: 'Sıkça Sorulan Sorular',
      sectionSubtitle: 'SSS',
      items: pages.services.faq.map(faq => ({
        question: faq.question,
        answer: faq.answer,
      })),
    });
  }

  // 8. Contact Section
  if (pages?.contact?.info) {
    const contact = pages.contact;
    blocks.push({
      _id: generateBlockId(),
      _type: 'ContactForm',
      sectionTitle: contact.form?.title || 'Bize Ulaşın',
      sectionSubtitle: 'İletişim',
      sectionDescription: contact.form?.subtitle || 'Sorularınız için bizimle iletişime geçin.',
      address: contact.info.address || '',
      phone: contact.info.phone || '',
      email: contact.info.email || '',
      submitButtonText: 'Mesaj Gönder',
    });
  }

  // 9. CTA Section
  const ctaImage = resolveImage(images, 'ctaImage', 'heroHome');
  blocks.push({
    _id: generateBlockId(),
    _type: 'CTABanner',
    title: 'Hemen Başlayalım',
    description: 'Sizinle çalışmak için sabırsızlanıyoruz. Hemen iletişime geçin.',
    buttonText: 'İletişime Geç',
    buttonLink: '#contact',
    secondaryButtonText: 'Daha Fazla Bilgi',
    secondaryButtonLink: '#about',
    backgroundImage: ctaImage,
  });

  return blocks;
}

/**
 * Checks if existing chai_blocks are missing image data that could be filled from generated_content.
 */
export function blocksNeedImageRefresh(blocks: any[], content: GeneratedContent): boolean {
  if (!blocks || blocks.length === 0 || !content?.images) return false;
  
  const images = content.images;
  // Check if there are URL-based images or small base64 images available
  const hasAvailableImages = Object.values(images).some(
    v => typeof v === 'string' && v.length > 0 && (
      v.startsWith('http://') || v.startsWith('https://') || v.length < 200000
    )
  );
  if (!hasAvailableImages) return false;

  // Check if hero block is missing backgroundImage
  const heroBlock = blocks.find(b => b._type === 'HeroCentered' || b._type === 'HeroSplit' || b._type === 'HeroOverlay');
  if (heroBlock && !heroBlock.backgroundImage && !heroBlock.image) {
    const heroImage = resolveImage(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
    if (heroImage) return true;
  }

  // Check if about block is missing image
  const aboutBlock = blocks.find(b => b._type === 'AboutSection');
  if (aboutBlock && !aboutBlock.image) {
    const aboutImage = resolveImage(images, 'aboutImage', 'heroAbout', 'aboutTeam');
    if (aboutImage) return true;
  }

  return false;
}

/**
 * Patches existing blocks with image data from generated_content without regenerating all blocks.
 */
export function patchBlocksWithImages(blocks: any[], content: GeneratedContent): any[] {
  if (!content?.images) return blocks;
  const images = content.images;

  return blocks.map(block => {
    switch (block._type) {
      case 'HeroCentered':
      case 'HeroSplit':
      case 'HeroOverlay': {
        const imgKey = block._type === 'HeroSplit' ? 'image' : 'backgroundImage';
        if (!block[imgKey]) {
          const heroImage = resolveImage(images, 'heroHome', 'heroAbout', 'heroSplit', 'heroServices');
          if (heroImage) return { ...block, [imgKey]: heroImage };
        }
        return block;
      }
      case 'AboutSection': {
        if (!block.image) {
          const aboutImage = resolveImage(images, 'aboutImage', 'heroAbout', 'aboutTeam');
          if (aboutImage) return { ...block, image: aboutImage };
        }
        return block;
      }
      case 'ImageGallery': {
        const galleryImages = images.galleryImages as string[] | undefined;
        if (galleryImages && galleryImages.length > 0) {
          const patches: Record<string, string> = {};
          for (let i = 0; i < Math.min(6, galleryImages.length); i++) {
            const key = `image${i + 1}`;
            if (!block[key] && galleryImages[i]) {
              const img = galleryImages[i];
              if (typeof img === 'string') {
                if (img.startsWith('http://') || img.startsWith('https://')) {
                  patches[key] = img;
                } else if (img.length < 200000) {
                  patches[key] = img;
                }
              }
            }
          }
          if (Object.keys(patches).length > 0) return { ...block, ...patches };
        }
        return block;
      }
      default:
        return block;
    }
  });
}

/**
 * Gets the appropriate theme preset based on template ID
 */
export function getThemeForTemplate(templateId?: string): any {
  if (!templateId) return modernProfessionalPreset;
  return templateToPreset[templateId] || modernProfessionalPreset;
}
