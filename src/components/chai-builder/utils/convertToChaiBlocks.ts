 import { GeneratedContent } from '@/types/generated-website';
 import { ChaiBlock } from '@chaibuilder/sdk';
 import { templateToPreset, modernProfessionalPreset } from '../themes/presets';
 
 // Unique ID generator
 const generateBlockId = () => `block_${Math.random().toString(36).substr(2, 9)}`;
 
 /**
  * Converts existing generated_content data to ChaiBuilder blocks format
  */
 export function convertGeneratedContentToChaiBlocks(
   content: GeneratedContent,
   templateId?: string
 ): ChaiBlock[] {
   const blocks: ChaiBlock[] = [];
 
   // Get pages data
   const { pages, images, metadata } = content;
 
   // 1. Hero Section
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
 
   // 2. Statistics Section (if available)
   if (pages?.home?.statistics && pages.home.statistics.length > 0) {
     blocks.push({
       _id: generateBlockId(),
       _type: 'StatisticsCounter',
       stats: pages.home.statistics.map(stat => ({
         value: stat.value,
         label: stat.label,
         suffix: '',
       })),
       backgroundColor: 'primary',
     });
   }
 
   // 3. About Section
   if (pages?.about?.story || pages?.home?.welcome) {
     const aboutTitle = pages?.about?.story?.title || pages?.home?.welcome?.title || 'Hakkımızda';
     const aboutContent = pages?.about?.story?.content || pages?.home?.welcome?.content || '';
     
     blocks.push({
       _id: generateBlockId(),
       _type: 'AboutSection',
       title: aboutTitle,
       description: aboutContent,
       features: pages?.about?.values?.slice(0, 3).map(v => v.title) || ['Kalite', 'Güven', 'Deneyim'],
       imageUrl: images?.aboutImage || '',
       imagePosition: 'right',
     });
   }
 
   // 4. Services Section
   if (pages?.services?.servicesList || pages?.home?.highlights) {
     const servicesList = pages?.services?.servicesList || pages?.home?.highlights || [];
     
     blocks.push({
       _id: generateBlockId(),
       _type: 'ServicesGrid',
       title: pages?.services?.hero?.title || 'Hizmetlerimiz',
       subtitle: pages?.services?.intro?.content || 'Size en iyi hizmeti sunmak için buradayız.',
       services: servicesList.slice(0, 6).map(service => ({
         title: service.title,
         description: service.description,
         icon: service.icon || 'star',
       })),
       columns: 3,
     });
   }
 
   // 5. Testimonials Section (placeholder)
   blocks.push({
     _id: generateBlockId(),
     _type: 'TestimonialsCarousel',
     title: 'Müşteri Yorumları',
     subtitle: 'Müşterilerimizin memnuniyeti bizim için en önemli değer.',
     testimonials: [
       {
         name: 'Ahmet Yılmaz',
         role: 'Müşteri',
         content: 'Harika bir hizmet aldım. Kesinlikle tavsiye ederim.',
         avatar: '',
         rating: 5,
       },
       {
         name: 'Ayşe Kaya',
         role: 'Müşteri',
         content: 'Profesyonel yaklaşım ve kaliteli sonuçlar.',
         avatar: '',
         rating: 5,
       },
       {
         name: 'Mehmet Demir',
         role: 'Müşteri',
         content: 'Beklentilerimi fazlasıyla karşıladılar.',
         avatar: '',
         rating: 5,
       },
     ],
   });
 
   // 6. Image Gallery (if available)
   if (images?.galleryImages && images.galleryImages.length > 0) {
     blocks.push({
       _id: generateBlockId(),
       _type: 'ImageGallery',
       title: 'Galeri',
       subtitle: 'Çalışmalarımızdan örnekler',
       images: images.galleryImages.map((url, idx) => ({
         src: url,
         alt: `Galeri görsel ${idx + 1}`,
         caption: '',
       })),
       columns: 3,
     });
   }
 
   // 7. FAQ Section (if available)
   if (pages?.services?.faq && pages.services.faq.length > 0) {
     blocks.push({
       _id: generateBlockId(),
       _type: 'FAQAccordion',
       title: 'Sıkça Sorulan Sorular',
       subtitle: 'Merak ettiklerinize hızlı cevaplar',
       faqs: pages.services.faq.map(faq => ({
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
       title: contact.form?.title || 'Bize Ulaşın',
       subtitle: contact.form?.subtitle || 'Sorularınız için bizimle iletişime geçin.',
       address: contact.info.address || '',
       phone: contact.info.phone || '',
       email: contact.info.email || '',
       showMap: false,
     });
   }
 
   // 9. CTA Section
   blocks.push({
     _id: generateBlockId(),
     _type: 'CTABanner',
     title: 'Hemen Başlayalım',
     description: 'Sizinle çalışmak için sabırsızlanıyoruz. Hemen iletişime geçin.',
     buttonText: 'İletişime Geç',
     buttonLink: '#contact',
     variant: 'primary',
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