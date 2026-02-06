import { GeneratedContent } from '@/types/generated-website';
import { ChaiBlock } from '@chaibuilder/sdk';
import { templateToPreset, modernProfessionalPreset } from '../themes/presets';

// Unique ID generator
const generateBlockId = () => `block_${Math.random().toString(36).substr(2, 9)}`;

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

  // 1. Hero Section (HeroCentered uses: title, subtitle, description, primaryButtonText, etc.)
  if (pages?.home?.hero) {
    const hero = pages.home.hero;
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
      backgroundImage: images?.heroHome || images?.heroAbout || '',
    });
  }

  // 2. Statistics Section (StatisticsCounter uses individual stat1Value, stat1Label, etc.)
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

  // 3. About Section (AboutSection uses: title, subtitle, description, features as newline string, image, imagePosition)
  if (pages?.about?.story || pages?.home?.welcome) {
    const aboutTitle = pages?.about?.story?.title || pages?.home?.welcome?.title || 'Hakkımızda';
    const aboutContent = pages?.about?.story?.content || pages?.home?.welcome?.content || '';
    const featureNames = pages?.about?.values?.slice(0, 4).map(v => v.title) || ['Kalite', 'Güven', 'Deneyim'];
    
    blocks.push({
      _id: generateBlockId(),
      _type: 'AboutSection',
      title: aboutTitle,
      subtitle: 'Biz Kimiz?',
      description: aboutContent,
      features: featureNames.join('\n'),
      image: images?.aboutImage || '',
      imagePosition: 'right',
    });
  }

  // 4. Services Section (ServicesGrid uses: sectionTitle, sectionSubtitle, sectionDescription, services array)
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
        title: service.title,
        description: service.description,
      })),
    });
  }

  // 5. Testimonials Section (TestimonialsCarousel uses: sectionTitle, sectionSubtitle, testimonials array)
  blocks.push({
    _id: generateBlockId(),
    _type: 'TestimonialsCarousel',
    sectionTitle: 'Müşterilerimiz Ne Diyor?',
    sectionSubtitle: 'Referanslar',
    testimonials: [
      {
        name: 'Ahmet Yılmaz',
        role: 'Müşteri',
        content: 'Harika bir hizmet aldım. Kesinlikle tavsiye ederim.',
        avatar: '',
      },
      {
        name: 'Ayşe Kaya',
        role: 'Müşteri',
        content: 'Profesyonel yaklaşım ve kaliteli sonuçlar.',
        avatar: '',
      },
      {
        name: 'Mehmet Demir',
        role: 'Müşteri',
        content: 'Beklentilerimi fazlasıyla karşıladılar.',
        avatar: '',
      },
    ],
  });

  // 6. Image Gallery (ImageGallery uses individual image1-image6 props, title, subtitle, columns)
  if (images?.galleryImages && images.galleryImages.length > 0) {
    const gallery = images.galleryImages;
    blocks.push({
      _id: generateBlockId(),
      _type: 'ImageGallery',
      title: 'Galeri',
      subtitle: 'Çalışmalarımız',
      columns: '3',
      image1: gallery[0] || '',
      image2: gallery[1] || '',
      image3: gallery[2] || '',
      image4: gallery[3] || '',
      image5: gallery[4] || '',
      image6: gallery[5] || '',
    });
  }

  // 7. FAQ Section (FAQAccordion uses: sectionTitle, sectionSubtitle, items array)
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

  // 8. Contact Section (ContactForm uses: sectionTitle, sectionSubtitle, sectionDescription, email, phone, address, submitButtonText)
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

  // 9. CTA Section (CTABanner uses: title, description, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink)
  blocks.push({
    _id: generateBlockId(),
    _type: 'CTABanner',
    title: 'Hemen Başlayalım',
    description: 'Sizinle çalışmak için sabırsızlanıyoruz. Hemen iletişime geçin.',
    buttonText: 'İletişime Geç',
    buttonLink: '#contact',
    secondaryButtonText: 'Daha Fazla Bilgi',
    secondaryButtonLink: '#about',
  });

  return blocks;
}

/**
 * Gets the appropriate theme preset based on template ID
 */
export function getThemeForTemplate(templateId?: string): any {
  if (!templateId) return modernProfessionalPreset;
  return templateToPreset[templateId] || modernProfessionalPreset;
}
