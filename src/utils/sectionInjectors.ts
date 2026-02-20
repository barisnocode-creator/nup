/**
 * Section injectors — shared utility for both Project.tsx (first load)
 * and useEditorState.ts (applyTemplate / template change).
 * 
 * All functions are PURE (no side effects except modifying props in-place).
 */
import type { SiteSection } from '@/components/sections/types';

// ── Inject Pixabay images into section props based on section type ──
export function injectImages(sectionType: string, props: Record<string, any>, gc: any) {
  const images = gc?.images || {};
  const heroTypes = ['HeroCafe', 'HeroRestaurant', 'HeroHotel', 'HeroMedical', 'HeroOverlay',
    'HeroCentered', 'HeroSplit', 'HeroDental', 'HeroPortfolio'];
  const aboutTypes = ['AboutSection', 'CafeStory', 'ChefShowcase'];
  const galleryTypes = ['CafeGallery', 'ImageGallery'];

  if (heroTypes.includes(sectionType)) {
    const img = images.heroHome || images.heroSplit || images.heroHotel || images.heroCafe || '';
    if (img) {
      if (sectionType === 'HeroPortfolio') props.avatar = img;
      else props.image = img;
    }
  } else if (aboutTypes.includes(sectionType)) {
    const img = images.aboutImage || images.heroAbout || '';
    if (img) props.image = img;
  } else if (galleryTypes.includes(sectionType)) {
    const galleryImgs = images.galleryImages as string[] | undefined;
    if (galleryImgs && galleryImgs.length > 0) {
      const labels = ['İç Mekan', 'Atmosfer', 'Detay', 'Ekip', 'Hizmet', 'Genel'];
      props.images = galleryImgs.slice(0, 4).map((src: string, i: number) => ({
        src,
        alt: labels[i] || `Görsel ${i + 1}`,
      }));
    }
  } else if (sectionType === 'CTABanner') {
    const img = images.ctaImage || '';
    if (img) props.image = img;
  } else if (sectionType === 'MenuShowcase' || sectionType === 'ServicesGrid') {
    const servicesList = gc?.pages?.services?.servicesList || gc?.pages?.home?.highlights || [];
    if (servicesList.length > 0 && props.services) {
      props.services = props.services.map((srv: any, i: number) => ({
        ...srv,
        image: servicesList[i]?.image || srv.image || '',
        title: servicesList[i]?.title || srv.title,
        description: servicesList[i]?.description || srv.description,
      }));
    }
  } else if (sectionType === 'AddableBlog') {
    const posts = gc?.pages?.blog?.posts || [];
    for (let i = 0; i < 4; i++) {
      const k = i + 1;
      if (posts[i]) {
        if (!props[`post${k}Image`] && posts[i].featuredImage) {
          props[`post${k}Image`] = posts[i].featuredImage;
        }
        if (posts[i].title) props[`post${k}Title`] = posts[i].title;
        if (posts[i].excerpt) props[`post${k}Excerpt`] = posts[i].excerpt;
        if (posts[i].category) props[`post${k}Category`] = posts[i].category;
        if (posts[i].id) props[`post${k}Slug`] = posts[i].id;
        if (posts[i].publishedAt) props[`post${k}Date`] = posts[i].publishedAt;
        if (posts[i].content) props[`post${k}Content`] = posts[i].content;
      }
    }
  }
}

// ── Inject contact/business info into relevant sections ────────────
export function injectContactInfo(props: Record<string, any>, gc: any, formData: any) {
  const contact = gc?.pages?.contact?.info || {};
  const meta = gc?.metadata || {};
  const extracted = formData?.extractedData || {};

  const phone = contact.phone || extracted.phone || formData?.businessInfo?.phone || '';
  const email = contact.email || extracted.email || formData?.businessInfo?.email || '';
  const address = contact.address || extracted.address || '';

  // ContactForm and sections with sectionTitle
  if (props.sectionTitle !== undefined) {
    if (phone) props.phone = phone;
    if (email) props.email = email;
    if (address) props.address = address;
  }

  // SiteFooter & general
  if (props.siteName !== undefined) {
    props.siteName = meta.siteName || extracted.businessName || formData?.businessInfo?.businessName || props.siteName;
    props.tagline = meta.tagline || extracted.uniqueValue || '';
    if (phone) props.phone = phone;
    if (email) props.email = email;
    if (address) props.address = address;
  }

  // Hero stats
  const stats = gc?.pages?.home?.statistics || [];
  if (stats.length > 0 && props.stat1Value !== undefined) {
    for (let i = 0; i < Math.min(stats.length, 4); i++) {
      const k = i + 1;
      if (stats[i]?.value) props[`stat${k}Value`] = stats[i].value;
      if (stats[i]?.label) props[`stat${k}Label`] = stats[i].label;
    }
  }
}

// ── Build footer section from project data ──────────────────────
export function buildFooterSection(gc: any, formData: any): SiteSection {
  const contact = gc?.pages?.contact?.info || {};
  const meta = gc?.metadata || {};
  const extracted = formData?.extractedData || {};

  return {
    id: `AddableSiteFooter_footer_${Date.now()}`,
    type: 'AddableSiteFooter',
    props: {
      siteName: meta.siteName || extracted.businessName || formData?.businessInfo?.businessName || '',
      tagline: meta.tagline || extracted.uniqueValue || '',
      phone: contact.phone || extracted.phone || formData?.businessInfo?.phone || '',
      email: contact.email || extracted.email || formData?.businessInfo?.email || '',
      address: contact.address || extracted.address || '',
    },
  };
}
