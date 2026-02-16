/**
 * Schema-driven template definitions.
 * Each template is pure data — no components, no renderers.
 * Templates resolve to ChaiBlock[] arrays at creation time via convertTemplateToBlocks().
 */

export interface TemplateSectionDef {
  type: string;           // existing block _type: 'HeroCentered', 'ServicesGrid', etc.
  variant?: string;       // maps to _type directly (e.g. 'split' -> 'HeroSplit')
  defaultProps: Record<string, any>;
  required?: boolean;     // e.g. hero cannot be removed by user
}

export interface TemplateDefinition {
  id: string;
  name: string;
  industry: string;
  category: string;
  description: string;
  preview: string;                // static image path for gallery
  themePresetKey: string;         // key in templateToPreset from presets.ts
  sections: TemplateSectionDef[];
  supportedIndustries: string[];
}

// ─── Template Definitions ────────────────────────────────────────

export const wellnessStudio: TemplateDefinition = {
  id: 'wellness-studio',
  name: 'Wellness Studio',
  industry: 'wellness',
  category: 'Sağlık & Wellness',
  description: 'Pilates, yoga ve wellness stüdyoları için sıcak, zarif tasarım',
  preview: '',
  themePresetKey: 'pilates1',
  supportedIndustries: ['pilates', 'yoga', 'fitness', 'wellness', 'spa', 'gym'],
  sections: [
    {
      type: 'HeroCentered',
      required: true,
      defaultProps: {
        title: 'Bedeninizi ve Zihninizi Dönüştürün',
        subtitle: 'Wellness Studio',
        description: 'Uzman eğitmenlerimiz eşliğinde kendinize özel bir yolculuğa çıkın.',
        primaryButtonText: 'Randevu Al',
        primaryButtonLink: '#appointment',
        secondaryButtonText: 'Hizmetlerimiz',
        secondaryButtonLink: '#services',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '10+', stat1Label: 'Yıl Deneyim',
        stat2Value: '500+', stat2Label: 'Mutlu Üye',
        stat3Value: '20+', stat3Label: 'Uzman Eğitmen',
        stat4Value: '%98', stat4Label: 'Memnuniyet',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hakkımızda',
        subtitle: 'Bizi Tanıyın',
        description: 'Sağlıklı yaşam yolculuğunuzda yanınızdayız.',
        features: 'Kişiye Özel Program\nUzman Kadro\nModern Ekipman',
        imagePosition: 'right',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Hizmetlerimiz',
        sectionSubtitle: 'Neler Sunuyoruz',
        sectionDescription: 'Sağlık ve wellness alanında kapsamlı hizmetler.',
        services: [
          { icon: '🧘', title: 'Pilates', description: 'Birebir ve grup dersleri.' },
          { icon: '🧠', title: 'Yoga', description: 'Zihin-beden uyumu.' },
          { icon: '💪', title: 'Fitness', description: 'Kişiye özel antrenman.' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Üyelerimiz Ne Diyor?',
        sectionSubtitle: 'Referanslar',
        testimonials: [
          { name: 'Elif Yıldız', role: 'Üye', content: 'Harika bir deneyim, kendimi çok daha iyi hissediyorum.', avatar: '' },
          { name: 'Ahmet Kaya', role: 'Üye', content: 'Profesyonel kadro ve temiz ortam.', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Randevu Alın',
        sectionSubtitle: 'Randevu',
        sectionDescription: 'Size en uygun tarih ve saati seçin.',
        submitButtonText: 'Randevu Oluştur',
        successMessage: 'Randevunuz başarıyla oluşturuldu!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'Bize Ulaşın',
        sectionSubtitle: 'İletişim',
        sectionDescription: 'Sorularınız için bizimle iletişime geçin.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Hemen Başlayalım',
        description: 'İlk dersiniz bizden. Hemen randevu alın.',
        buttonText: 'Randevu Al',
        buttonLink: '#appointment',
      },
    },
  ],
};

export const lawyerFirm: TemplateDefinition = {
  id: 'lawyer-firm',
  name: 'Hukuk Bürosu',
  industry: 'legal',
  category: 'Hukuk & Danışmanlık',
  description: 'Avukatlar ve hukuk büroları için profesyonel siyah-beyaz tasarım',
  preview: '',
  themePresetKey: 'lawyer-firm',
  supportedIndustries: ['lawyer', 'legal', 'law', 'attorney', 'consulting', 'finance', 'corporate'],
  sections: [
    {
      type: 'HeroOverlay',
      required: true,
      defaultProps: {
        title: 'Adalet ve Güvenin Adresi',
        subtitle: 'Hukuk Bürosu',
        description: 'Deneyimli avukat kadromuz ile haklarınızı en iyi şekilde savunuyoruz.',
        primaryButtonText: 'İletişime Geçin',
        primaryButtonLink: '#contact',
        secondaryButtonText: 'Uygulama Alanları',
        secondaryButtonLink: '#services',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '30+', stat1Label: 'Yıl Deneyim',
        stat2Value: '500+', stat2Label: 'Başarılı Dava',
        stat3Value: '50+', stat3Label: 'Uzman Avukat',
        stat4Value: '%100', stat4Label: 'Müvekkil Memnuniyeti',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hakkımızda',
        subtitle: 'Bizi Tanıyın',
        description: '30 yılı aşkın deneyimimiz ile hukuki süreçlerinizde güvenilir çözüm ortağınızız.',
        features: 'Deneyimli Kadro\nSonuç Odaklı\nGizlilik İlkesi\nEtik Yaklaşım',
        imagePosition: 'right',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Uygulama Alanları',
        sectionSubtitle: 'Uzmanlık',
        sectionDescription: 'Geniş yelpazede hukuki danışmanlık ve dava takip hizmeti.',
        services: [
          { icon: '🏢', title: 'Şirketler Hukuku', description: 'Kuruluş, birleşme ve ticari sözleşmeler.' },
          { icon: '⚖️', title: 'Dava & Uyuşmazlık', description: 'Hukuk davaları, tahkim ve arabuluculuk.' },
          { icon: '🏠', title: 'Gayrimenkul Hukuku', description: 'Alım-satım, kira ve imar işlemleri.' },
          { icon: '👥', title: 'İş Hukuku', description: 'İşçi-işveren uyuşmazlıkları.' },
          { icon: '💡', title: 'Fikri Mülkiyet', description: 'Patent, marka tescili ve telif hakları.' },
          { icon: '📋', title: 'Miras Hukuku', description: 'Vasiyetname ve miras paylaşımı.' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müvekkillerimiz Ne Diyor?',
        sectionSubtitle: 'Referanslar',
        testimonials: [
          { name: 'Mehmet Demir', role: 'CEO', content: 'Profesyonel ve güvenilir bir hukuk bürosu.', avatar: '' },
          { name: 'Ayşe Koç', role: 'Girişimci', content: 'Haklarımızı en iyi şekilde korudular.', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: 'Sıkça Sorulan Sorular',
        sectionSubtitle: 'SSS',
        items: [
          { question: 'İlk görüşme ücretsiz mi?', answer: 'Evet, ilk danışma görüşmemiz ücretsizdir.' },
          { question: 'Hangi alanlarda hizmet veriyorsunuz?', answer: 'Şirketler, iş, gayrimenkul, fikri mülkiyet ve miras hukuku başta olmak üzere geniş alanda hizmet veriyoruz.' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Randevu Alın',
        sectionSubtitle: 'Görüşme',
        sectionDescription: 'Ücretsiz ilk danışma görüşmeniz için randevu alın.',
        submitButtonText: 'Randevu Oluştur',
        successMessage: 'Randevunuz oluşturuldu!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Hukuki danışmanlık için bizimle iletişime geçin.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Hukuki Desteğe mi İhtiyacınız Var?',
        description: 'Deneyimli ekibimiz ile ilk görüşme ücretsizdir.',
        buttonText: 'Ücretsiz Danışma',
        buttonLink: '#contact',
      },
    },
  ],
};

export const naturalLifestyle: TemplateDefinition = {
  id: 'natural',
  name: 'Natural',
  industry: 'lifestyle',
  category: 'Yaşam & Blog',
  description: 'Sıcak tonlarda, modern ve doğal hissiyatlı yaşam tarzı blog şablonu',
  preview: '',
  themePresetKey: 'natural',
  supportedIndustries: ['blog', 'lifestyle', 'magazine', 'personal', 'creative', 'photography', 'art'],
  sections: [
    {
      type: 'NaturalHeader',
      required: true,
      defaultProps: {
        siteName: 'Perspective',
        buttonText: 'Join Now',
      },
    },
    {
      type: 'NaturalHero',
      required: true,
      defaultProps: {
        title: "Journey Through Life's Spectrum",
        description: "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery. Where Words Illuminate Paths of Meaning and Thoughts Unravel the Mysteries of Life's Spectrum.",
        buttonText: 'Join Now',
        image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80',
      },
    },
    {
      type: 'NaturalIntro',
      defaultProps: {
        title: 'Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.',
        description: 'We believe in the power of thoughtful storytelling. Our platform brings together diverse voices and perspectives to create meaningful conversations about life, wellness, creativity, and personal growth.',
      },
    },
    {
      type: 'NaturalArticleGrid',
      defaultProps: {
        sectionTitle: 'Featured Articles',
        article1Title: 'Whispers of Wisdom', article1Image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80', article1Category: 'Financing', article1Date: 'Oct 16, 2024',
        article2Title: 'Ink-Stained Insights', article2Image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', article2Category: 'Lifestyle', article2Date: 'Oct 14, 2024',
        article3Title: 'Musings in Grayscale', article3Image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', article3Category: 'Community', article3Date: 'Oct 12, 2024',
        article4Title: 'Finding Balance in a Digital World', article4Image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80', article4Category: 'Wellness', article4Date: 'Oct 10, 2024',
        article5Title: 'The Art of Slow Travel', article5Image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', article5Category: 'Travel', article5Date: 'Oct 8, 2024',
        article6Title: 'Minimalist Living', article6Image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', article6Category: 'Creativity', article6Date: 'Oct 6, 2024',
      },
    },
    {
      type: 'NaturalNewsletter',
      defaultProps: {
        title: 'Stay inspired.',
        description: 'Subscribe to receive our latest articles and insights directly in your inbox.',
        buttonText: 'Subscribe',
      },
    },
    {
      type: 'NaturalFooter',
      required: true,
      defaultProps: {
        siteName: 'Perspective',
      },
    },
  ],
};

// ─── All Definitions ─────────────────────────────────────────────

export const allDefinitions: TemplateDefinition[] = [
  wellnessStudio,
  lawyerFirm,
  naturalLifestyle,
];
