/**
 * Schema-driven template definitions.
 * Each template is pure data — no components, no renderers.
 * Templates resolve to SiteSection[] arrays at creation time.
 */

import templatePreviewCafe from '@/assets/template-preview-cafe.jpg';
import templatePreviewDental from '@/assets/template-preview-dental.jpg';
import templatePreviewRestaurant from '@/assets/template-preview-restaurant.jpg';
import templatePreviewHotel from '@/assets/template-preview-hotel.jpg';
import templatePreviewEngineer from '@/assets/template-preview-engineer.jpg';

export interface TemplateSectionDef {
  type: string;
  variant?: string;
  defaultProps: Record<string, any>;
  required?: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  industry: string;
  category: string;
  description: string;
  preview: string;
  themePresetKey: string;
  sections: TemplateSectionDef[];
  supportedIndustries: string[];
}

// ─── Specialty Cafe Template (pencil.dev inspired) ───────────────

export const specialtyCafe: TemplateDefinition = {
  id: 'specialty-cafe',
  name: 'Specialty Cafe',
  industry: 'food',
  category: 'Yeme & İçme',
  description: 'Haight Ashbury tarzı, sıcak terracotta tonlarında specialty cafe tasarımı',
  preview: templatePreviewCafe,
  themePresetKey: 'specialty-cafe',
  supportedIndustries: ['food', 'cafe', 'coffee', 'restaurant', 'bakery', 'bar', 'bistro', 'patisserie', 'retail'],
  sections: [
    {
      type: 'HeroCafe',
      required: true,
      defaultProps: {
        badge: '',
        title: '',
        description: '',
        primaryButtonText: '',
        primaryButtonLink: '#menu',
        secondaryButtonText: '',
        secondaryButtonLink: '#appointment',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        floatingBadge: '4.9★',
        floatingBadgeSubtext: '',
        infoItems: [],
      },
    },
    {
      type: 'CafeFeatures',
      defaultProps: {
        subtitle: '',
        title: '',
        features: [
          { icon: '☕', title: '', description: '' },
          { icon: '🌿', title: '', description: '' },
          { icon: '🎨', title: '', description: '' },
          { icon: '🏠', title: '', description: '' },
        ],
      },
    },
    {
      type: 'MenuShowcase',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
        items: [],
      },
    },
    {
      type: 'CafeStory',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
        features: '',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
        buttonText: '',
        buttonLink: '#about',
      },
    },
    {
      type: 'CafeGallery',
      defaultProps: {
        subtitle: '',
        title: '',
        images: [
          { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80', alt: 'İç Mekan' },
          { src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80', alt: 'Kahve' },
          { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', alt: 'Latte Art' },
          { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', alt: 'Ambiyans' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Randevu / Rezervasyon',
        sectionSubtitle: 'Hemen Başlayın',
        sectionDescription: 'Birkaç adımda kolayca işleminizi tamamlayın.',
        submitButtonText: 'Gönder',
        successMessage: 'Talebiniz alındı!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sorularınız veya önerileriniz için bize yazın.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#contact',
      },
    },
  ],
};

// ─── Dental Clinic Template ──────────────────────────────────────

export const dentalClinic: TemplateDefinition = {
  id: 'dental-clinic',
  name: 'Dental Clinic',
  industry: 'health',
  category: 'Sağlık',
  description: 'Modern, sky-blue tonlarında diş kliniği tasarımı. Animasyonlu hero, hizmet kartları ve adımlı randevu formu.',
  preview: templatePreviewDental,
  themePresetKey: 'dental-clinic',
  supportedIndustries: ['doctor', 'dentist', 'dental', 'clinic', 'health', 'hospital', 'medical', 'veterinary', 'physiotherapy', 'optometry'],
  sections: [
    {
      type: 'HeroDental',
      required: true,
      defaultProps: {
        badge: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#appointment',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
      },
    },
    {
      type: 'DentalServices',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
        services: [
          { icon: 'Smile', title: '', description: '' },
          { icon: 'Sparkles', title: '', description: '' },
          { icon: 'ScanLine', title: '', description: '' },
          { icon: 'Shield', title: '', description: '' },
        ],
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
      },
    },
    {
      type: 'DentalTips',
      defaultProps: {
        subtitle: '',
        title: '',
        tips: [
          { icon: 'Droplets', title: '', content: '' },
          { icon: 'Clock', title: '', content: '' },
          { icon: 'Apple', title: '', content: '' },
          { icon: 'ShieldCheck', title: '', content: '' },
        ],
      },
    },
    {
      type: 'DentalBooking',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sorularınız için bize yazın, en kısa sürede dönüş yapalım.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#appointment',
      },
    },
  ],
};

// ─── Restaurant Template ─────────────────────────────────────────

export const restaurantElegant: TemplateDefinition = {
  id: 'restaurant-elegant',
  name: 'Restaurant Elegant',
  industry: 'food',
  category: 'Yeme & İçme',
  description: 'Altın vurgulu, koyu tonlarda zarif restoran tasarımı. Preline Agency esinlenmesi.',
  preview: templatePreviewRestaurant,
  themePresetKey: 'restaurant-elegant',
  supportedIndustries: ['restaurant', 'food', 'bistro', 'bar', 'fine-dining', 'steakhouse', 'seafood'],
  sections: [
    {
      type: 'HeroRestaurant',
      required: true,
      defaultProps: {
        badge: '',
        title: '',
        description: '',
        primaryButtonText: '',
        primaryButtonLink: '#reservation',
        secondaryButtonText: '',
        secondaryButtonLink: '#menu',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
        infoItems: [],
      },
    },
    {
      type: 'CafeFeatures',
      defaultProps: {
        subtitle: '',
        title: '',
        features: [
          { icon: '🍷', title: '', description: '' },
          { icon: '🌿', title: '', description: '' },
          { icon: '👨‍🍳', title: '', description: '' },
          { icon: '🎵', title: '', description: '' },
        ],
      },
    },
    {
      type: 'RestaurantMenu',
      defaultProps: {
        subtitle: '',
        title: '',
      },
    },
    {
      type: 'ChefShowcase',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80',
      },
    },
    {
      type: 'CafeGallery',
      defaultProps: {
        subtitle: '',
        title: '',
        images: [
          { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', alt: 'Restoran iç mekan' },
          { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', alt: 'Yemek sunumu' },
          { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&q=80', alt: 'Bar alanı' },
          { src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80', alt: 'Teras' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Randevu / Rezervasyon',
        sectionSubtitle: 'Hemen Başlayın',
        sectionDescription: 'Birkaç adımda kolayca işleminizi tamamlayın.',
        submitButtonText: 'Gönder',
        successMessage: 'Talebiniz alındı!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Özel etkinlikler ve sorularınız için bize yazın.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#reservation',
      },
    },
  ],
};

// ─── Hotel Template ──────────────────────────────────────────────

export const hotelLuxury: TemplateDefinition = {
  id: 'hotel-luxury',
  name: 'Hotel Luxury',
  industry: 'hospitality',
  category: 'Konaklama',
  description: 'Lacivert ve altın tonlarında lüks otel tasarımı. Preline Agency profesyonel stili.',
  preview: templatePreviewHotel,
  themePresetKey: 'hotel-luxury',
  supportedIndustries: ['hotel', 'resort', 'hostel', 'accommodation', 'motel', 'boutique-hotel', 'apart'],
  sections: [
    {
      type: 'HeroHotel',
      required: true,
      defaultProps: {
        badge: '',
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#rooms',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      },
    },
    {
      type: 'RoomShowcase',
      defaultProps: {
        subtitle: '',
        title: '',
      },
    },
    {
      type: 'HotelAmenities',
      defaultProps: {
        subtitle: '',
        title: '',
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: '',
        images: [
          { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', alt: 'Lobi' },
          { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80', alt: 'Havuz' },
          { src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', alt: 'Restoran' },
          { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', alt: 'Spa' },
        ],
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        sectionTitle: '',
        stats: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: '',
        items: [
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
        ],
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Grup rezervasyonları ve özel istekleriniz için bize yazın.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#rooms',
      },
    },
  ],
};

// ─── Engineer/Freelancer Template ────────────────────────────────

export const engineerPortfolio: TemplateDefinition = {
  id: 'engineer-portfolio',
  name: 'Engineer Portfolio',
  industry: 'technology',
  category: 'Portfolyo',
  description: 'Siyah arka plan, mavi vurgulu modern mühendis/freelancer portfolyo tasarımı.',
  preview: templatePreviewEngineer,
  themePresetKey: 'engineer-portfolio',
  supportedIndustries: ['developer', 'engineer', 'freelancer', 'designer', 'creative', 'technology', 'consultant', 'architect'],
  sections: [
    {
      type: 'HeroPortfolio',
      required: true,
      defaultProps: {
        name: '',
        title: '',
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        buttonText: '',
        buttonLink: '#projects',
      },
    },
    {
      type: 'SkillsGrid',
      defaultProps: {
        subtitle: '',
        title: '',
      },
    },
    {
      type: 'ProjectShowcase',
      defaultProps: {
        subtitle: '',
        title: '',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        sectionTitle: '',
        stats: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Referanslar',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bir Proje mi Var?',
        sectionDescription: 'Projenizi konuşmak için bana yazın.',
        submitButtonText: 'Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#contact',
      },
    },
  ],
};

// ─── MedCare Pro Template ────────────────────────────────────────

import templatePreviewMedcare from '@/assets/template-preview-dental.jpg';

export const medcarePro: TemplateDefinition = {
  id: 'medcare-pro',
  name: 'MedCare Pro',
  industry: 'health',
  category: 'Sağlık & Profesyonel',
  description: 'GitHub\'ın en popüler sağlık şablonlarından ilham alan, tam animasyonlu, istatistik rozetli profesyonel klinik tasarımı.',
  preview: templatePreviewMedcare,
  themePresetKey: 'medcare-pro',
  supportedIndustries: [
    'doctor', 'dentist', 'clinic', 'hospital', 'medical', 'veterinary',
    'health', 'physiotherapy', 'optometry', 'pharmacy',
    'lawyer', 'attorney', 'legal',
    'beauty_salon', 'spa', 'gym', 'fitness',
    'consultant', 'accountant', 'insurance', 'realtor',
    'other', 'retail', 'service', 'education', 'technology',
  ],
  sections: [
    {
      type: 'HeroMedical',
      required: true,
      defaultProps: {
        badge: '',
        title: '',
        description: '',
        primaryButtonText: '',
        primaryButtonLink: '#appointment',
        secondaryButtonText: '',
        secondaryButtonLink: '#services',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        floatingBadge: '',
        stat1Value: '',
        stat1Label: '',
        stat2Value: '',
        stat2Label: '',
        stat3Value: '',
        stat3Label: '',
        features: [],
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        subtitle: '',
        title: '',
        description: '',
        services: [
          { icon: 'Stethoscope', title: '', description: '' },
          { icon: 'Heart', title: '', description: '' },
          { icon: 'Shield', title: '', description: '' },
          { icon: 'Zap', title: '', description: '' },
          { icon: 'FileText', title: '', description: '' },
          { icon: 'Users', title: '', description: '' },
        ],
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        title: '',
        subtitle: '',
        stat1Value: '',
        stat1Label: '',
        stat2Value: '',
        stat2Label: '',
        stat3Value: '',
        stat3Label: '',
        stat4Value: '',
        stat4Label: '',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: '',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
          { name: '', role: '', content: '', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: '',
        items: [
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Online Randevu',
        sectionSubtitle: 'Hemen Başlayın',
        sectionDescription: 'Birkaç adımda kolayca randevunuzu oluşturun.',
        submitButtonText: 'Randevu Al',
        successMessage: 'Randevunuz başarıyla oluşturuldu!',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '#appointment',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sorularınız için bize yazın, en kısa sürede dönüş yapalım.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
  ],
};

// ─── All Definitions ─────────────────────────────────────────────

export const allDefinitions: TemplateDefinition[] = [
  medcarePro,
  specialtyCafe,
  dentalClinic,
  restaurantElegant,
  hotelLuxury,
  engineerPortfolio,
];
