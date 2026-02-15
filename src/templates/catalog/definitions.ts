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
  preview: '',  // will be set from asset imports in catalog/index.ts
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

export const corporateServices: TemplateDefinition = {
  id: 'corporate-services',
  name: 'Kurumsal Hizmet',
  industry: 'corporate',
  category: 'Kurumsal',
  description: 'Danışmanlık, hukuk ve finans firmaları için profesyonel tasarım',
  preview: '',
  themePresetKey: 'gith2',
  supportedIndustries: ['lawyer', 'finance', 'consulting', 'accounting', 'insurance', 'corporate'],
  sections: [
    {
      type: 'HeroOverlay',
      required: true,
      defaultProps: {
        title: 'Güvenilir Çözüm Ortağınız',
        subtitle: 'Profesyonel Hizmet',
        description: 'Deneyimli ekibimizle işinizi büyütün.',
        primaryButtonText: 'Randevu Al',
        primaryButtonLink: '#appointment',
        secondaryButtonText: 'Hizmetlerimiz',
        secondaryButtonLink: '#services',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '15+', stat1Label: 'Yıl Deneyim',
        stat2Value: '1000+', stat2Label: 'Başarılı Proje',
        stat3Value: '50+', stat3Label: 'Uzman Kadro',
        stat4Value: '%99', stat4Label: 'Müşteri Memnuniyeti',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Hizmetlerimiz',
        sectionSubtitle: 'Uzmanlık Alanlarımız',
        sectionDescription: 'Kapsamlı hizmet yelpazemizle yanınızdayız.',
        services: [
          { icon: '📋', title: 'Danışmanlık', description: 'Stratejik danışmanlık hizmeti.' },
          { icon: '⚖️', title: 'Hukuki Destek', description: 'Her alanda hukuki danışmanlık.' },
          { icon: '📊', title: 'Analiz', description: 'Detaylı piyasa analizi.' },
        ],
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hakkımızda',
        subtitle: 'Biz Kimiz',
        description: 'Sektörde lider konumumuzla müşterilerimize değer katıyoruz.',
        features: 'Deneyimli Ekip\nGeniş Portföy\nGlobal Ağ',
        imagePosition: 'left',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müşterilerimizin Görüşleri',
        sectionSubtitle: 'Referanslar',
        testimonials: [
          { name: 'Mehmet Demir', role: 'CEO', content: 'Profesyonel ve güvenilir bir iş ortağı.', avatar: '' },
          { name: 'Zeynep Ak', role: 'Yönetici', content: 'Sonuç odaklı yaklaşımları ile fark yaratıyorlar.', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: 'Sıkça Sorulan Sorular',
        sectionSubtitle: 'SSS',
        items: [
          { question: 'Hangi hizmetleri sunuyorsunuz?', answer: 'Geniş yelpazede danışmanlık hizmetleri sunuyoruz.' },
          { question: 'İlk görüşme ücretsiz mi?', answer: 'Evet, ilk görüşmemiz ücretsizdir.' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Randevu Alın',
        sectionSubtitle: 'Görüşme',
        sectionDescription: 'Ücretsiz ilk görüşme için randevu alın.',
        submitButtonText: 'Randevu Oluştur',
        successMessage: 'Randevunuz oluşturuldu!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Detaylı bilgi için bizimle iletişime geçin.',
        submitButtonText: 'Gönder',
      },
    },
  ],
};

export const medicalClinic: TemplateDefinition = {
  id: 'medical-clinic',
  name: 'Sağlık Kliniği',
  industry: 'healthcare',
  category: 'Sağlık',
  description: 'Doktor, diş hekimi ve klinikler için güven veren tasarım',
  preview: '',
  themePresetKey: 'temp1',
  supportedIndustries: ['doctor', 'dentist', 'pharmacist', 'clinic', 'hospital', 'healthcare'],
  sections: [
    {
      type: 'HeroSplit',
      required: true,
      defaultProps: {
        title: 'Sağlığınız Bizim Önceliğimiz',
        subtitle: 'Uzman Sağlık Hizmeti',
        description: 'Modern tıp anlayışıyla, uzman kadromuzla yanınızdayız.',
        primaryButtonText: 'Randevu Al',
        primaryButtonLink: '#appointment',
        secondaryButtonText: 'Hizmetlerimiz',
        secondaryButtonLink: '#services',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '20+', stat1Label: 'Yıl Deneyim',
        stat2Value: '10000+', stat2Label: 'Hasta',
        stat3Value: '15+', stat3Label: 'Uzman Doktor',
        stat4Value: '%99', stat4Label: 'Başarı Oranı',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Tedavi Hizmetlerimiz',
        sectionSubtitle: 'Uzmanlık Alanları',
        sectionDescription: 'Modern ekipmanlarla kapsamlı tedavi hizmetleri.',
        services: [
          { icon: '🦷', title: 'Genel Tedavi', description: 'Kapsamlı sağlık hizmeti.' },
          { icon: '💉', title: 'Estetik', description: 'Modern estetik uygulamalar.' },
          { icon: '🔬', title: 'Teşhis', description: 'İleri teknoloji ile doğru teşhis.' },
        ],
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Kliniğimiz',
        subtitle: 'Hakkımızda',
        description: 'Hasta odaklı yaklaşımımızla sağlığınıza değer katıyoruz.',
        features: 'Modern Ekipman\nSteril Ortam\nDeneyimli Kadro\nHasta Memnuniyeti',
        imagePosition: 'right',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Hasta Yorumları',
        sectionSubtitle: 'Deneyimler',
        testimonials: [
          { name: 'Ali Yılmaz', role: 'Hasta', content: 'Çok ilgili ve profesyonel bir ekip.', avatar: '' },
          { name: 'Fatma Kara', role: 'Hasta', content: 'Tedavi sürecim çok rahat geçti.', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Online Randevu',
        sectionSubtitle: 'Randevu',
        sectionDescription: 'Hızlı ve kolay online randevu sistemi.',
        submitButtonText: 'Randevu Al',
        successMessage: 'Randevunuz başarıyla oluşturuldu!',
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: 'Sıkça Sorulan Sorular',
        sectionSubtitle: 'SSS',
        items: [
          { question: 'Randevu nasıl alabilirim?', answer: 'Online randevu sistemimiz üzerinden kolayca randevu alabilirsiniz.' },
          { question: 'Hangi sigortalarla çalışıyorsunuz?', answer: 'Tüm özel sigortalar ve SGK ile anlaşmalıyız.' },
        ],
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sorularınız için bizimle iletişime geçin.',
        submitButtonText: 'Mesaj Gönder',
      },
    },
  ],
};

export const creativeAgency: TemplateDefinition = {
  id: 'creative-agency',
  name: 'Kreatif Ajans',
  industry: 'creative',
  category: 'Kreatif & Dijital',
  description: 'Dijital ajanslar, tasarım stüdyoları için cesur tasarım',
  preview: '',
  themePresetKey: 'temp2',
  supportedIndustries: ['creative', 'design', 'marketing', 'agency', 'technology', 'software'],
  sections: [
    {
      type: 'HeroCentered',
      required: true,
      defaultProps: {
        title: 'Fikirlerinizi Hayata Geçiriyoruz',
        subtitle: 'Dijital Ajans',
        description: 'Yaratıcı çözümlerle markanızı geleceğe taşıyoruz.',
        primaryButtonText: 'Projelerimiz',
        primaryButtonLink: '#gallery',
        secondaryButtonText: 'İletişim',
        secondaryButtonLink: '#contact',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Hizmetlerimiz',
        sectionSubtitle: 'Ne Yapıyoruz',
        sectionDescription: 'Dijital dünyada markanızı öne çıkarıyoruz.',
        services: [
          { icon: '🎨', title: 'Web Tasarım', description: 'Modern ve etkileyici web siteleri.' },
          { icon: '📱', title: 'Mobil Uygulama', description: 'Kullanıcı dostu mobil çözümler.' },
          { icon: '📈', title: 'Dijital Pazarlama', description: 'Sonuç odaklı pazarlama stratejileri.' },
        ],
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        title: 'Portfolyo',
        subtitle: 'Çalışmalarımız',
        columns: '3',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hakkımızda',
        subtitle: 'Biz Kimiz',
        description: 'Tutkulu bir ekip olarak dijital dünyada iz bırakıyoruz.',
        features: 'Yaratıcı Ekip\nModern Teknoloji\nSonuç Odaklı',
        imagePosition: 'left',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '200+', stat1Label: 'Tamamlanan Proje',
        stat2Value: '50+', stat2Label: 'Mutlu Müşteri',
        stat3Value: '10+', stat3Label: 'Ödül',
        stat4Value: '8+', stat4Label: 'Yıl Deneyim',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müşterilerimiz',
        sectionSubtitle: 'Geri Bildirimler',
        testimonials: [
          { name: 'Can Öztürk', role: 'Startup CEO', content: 'Muhteşem bir iş çıkardılar!', avatar: '' },
          { name: 'Selin Ay', role: 'Marka Yöneticisi', content: 'Yaratıcı ve profesyonel bir ekip.', avatar: '' },
        ],
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Projenizi Konuşalım',
        description: 'Bir sonraki büyük fikriniz için buradayız.',
        buttonText: 'İletişime Geç',
        buttonLink: '#contact',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Yazın',
        sectionDescription: 'Projeniz hakkında konuşalım.',
        submitButtonText: 'Gönder',
      },
    },
  ],
};

export const restaurantCafe: TemplateDefinition = {
  id: 'restaurant-cafe',
  name: 'Restoran & Kafe',
  industry: 'food',
  category: 'Yeme & İçme',
  description: 'Restoranlar, kafeler ve yeme-içme mekanları için sıcak tasarım',
  preview: '',
  themePresetKey: 'temp3',
  supportedIndustries: ['food', 'restaurant', 'cafe', 'bakery', 'catering'],
  sections: [
    {
      type: 'HeroOverlay',
      required: true,
      defaultProps: {
        title: 'Lezzet Dünyasına Hoş Geldiniz',
        subtitle: 'Gurme Deneyim',
        description: 'Taze malzemeler, özel tarifler ve unutulmaz lezzetler.',
        primaryButtonText: 'Menümüz',
        primaryButtonLink: '#services',
        secondaryButtonText: 'Rezervasyon',
        secondaryButtonLink: '#appointment',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Menümüz',
        sectionSubtitle: 'Lezzetler',
        sectionDescription: 'Şefimizin özel tarifleriyle hazırlanan seçenekler.',
        services: [
          { icon: '🥗', title: 'Başlangıçlar', description: 'Taze ve lezzetli başlangıç tabakları.' },
          { icon: '🥩', title: 'Ana Yemekler', description: 'Özenle hazırlanan ana yemekler.' },
          { icon: '🍰', title: 'Tatlılar', description: 'El yapımı özel tatlılar.' },
        ],
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        title: 'Galeri',
        subtitle: 'Mekanımız & Lezzetlerimiz',
        columns: '3',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hikayemiz',
        subtitle: 'Hakkımızda',
        description: 'Yıllardır sevgiyle hazırlanan lezzetler.',
        features: 'Taze Malzeme\nÖzel Tarifler\nSıcak Atmosfer',
        imagePosition: 'right',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Misafirlerimiz Ne Diyor?',
        sectionSubtitle: 'Yorumlar',
        testimonials: [
          { name: 'Deniz Ak', role: 'Misafir', content: 'Muhteşem lezzetler ve harika ambiyans!', avatar: '' },
          { name: 'Burak Şen', role: 'Misafir', content: 'Her ziyarette aynı kaliteyi buluyorum.', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Rezervasyon',
        sectionSubtitle: 'Masa Ayırtın',
        sectionDescription: 'Online olarak kolayca masa ayırtın.',
        submitButtonText: 'Rezervasyon Yap',
        successMessage: 'Rezervasyonunuz alınmıştır!',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Özel etkinlikler ve sorularınız için.',
        submitButtonText: 'Gönder',
      },
    },
  ],
};

export const videoStudio: TemplateDefinition = {
  id: 'video-studio',
  name: 'Video Stüdyo',
  industry: 'media',
  category: 'Medya & Prodüksiyon',
  description: 'Video prodüksiyon, fotoğraf stüdyoları için sinematik tasarım',
  preview: '',
  themePresetKey: 'temp4-video-studio',
  supportedIndustries: ['video', 'photography', 'film', 'media', 'production'],
  sections: [
    {
      type: 'HeroCentered',
      required: true,
      defaultProps: {
        title: 'Hikayenizi Görselleştirin',
        subtitle: 'Prodüksiyon Stüdyo',
        description: 'Profesyonel video ve fotoğraf prodüksiyon hizmetleri.',
        primaryButtonText: 'Portfolyo',
        primaryButtonLink: '#gallery',
        secondaryButtonText: 'İletişim',
        secondaryButtonLink: '#contact',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Hizmetlerimiz',
        sectionSubtitle: 'Prodüksiyon',
        sectionDescription: 'Profesyonel ekipman ve deneyimli ekip.',
        services: [
          { icon: '🎬', title: 'Video Prodüksiyon', description: 'Kurumsal ve reklam videoları.' },
          { icon: '📸', title: 'Fotoğraf', description: 'Ürün ve portre fotoğrafçılığı.' },
          { icon: '✂️', title: 'Post Prodüksiyon', description: 'Renk düzeltme ve kurgu.' },
        ],
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        title: 'Portfolyo',
        subtitle: 'Son Çalışmalarımız',
        columns: '3',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Stüdyomuz',
        subtitle: 'Hakkımızda',
        description: 'Yaratıcı vizyonunuzu en üst kalitede hayata geçiriyoruz.',
        features: 'Profesyonel Ekipman\nDeneyimli Ekip\nHızlı Teslimat',
        imagePosition: 'left',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '300+', stat1Label: 'Tamamlanan Proje',
        stat2Value: '100+', stat2Label: 'Mutlu Müşteri',
        stat3Value: '5', stat3Label: 'Ödül',
        stat4Value: '7/24', stat4Label: 'Destek',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müşterilerimiz',
        sectionSubtitle: 'Geri Bildirimler',
        testimonials: [
          { name: 'Emre Koç', role: 'Marka Müdürü', content: 'Mükemmel prodüksiyon kalitesi.', avatar: '' },
          { name: 'Aylin Demir', role: 'Girişimci', content: 'Vizyonumuzu tam olarak yansıttılar.', avatar: '' },
        ],
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Projenizi Başlatalım',
        description: 'Ücretsiz keşif görüşmesi için bize ulaşın.',
        buttonText: 'İletişime Geç',
        buttonLink: '#contact',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Projeniz hakkında konuşalım.',
        submitButtonText: 'Gönder',
      },
    },
  ],
};

export const modernSaas: TemplateDefinition = {
  id: 'modern-saas',
  name: 'Modern SaaS',
  industry: 'technology',
  category: 'Teknoloji',
  description: 'SaaS, teknoloji ve yazılım şirketleri için modern tasarım',
  preview: '',
  themePresetKey: 'gith1',
  supportedIndustries: ['technology', 'software', 'saas', 'startup', 'app'],
  sections: [
    {
      type: 'HeroCentered',
      required: true,
      defaultProps: {
        title: 'İşinizi Dijitale Taşıyın',
        subtitle: 'Teknoloji Çözümleri',
        description: 'Modern teknoloji ile iş süreçlerinizi hızlandırın.',
        primaryButtonText: 'Ücretsiz Deneyin',
        primaryButtonLink: '#contact',
        secondaryButtonText: 'Özellikler',
        secondaryButtonLink: '#services',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Özellikler',
        sectionSubtitle: 'Neler Sunuyoruz',
        sectionDescription: 'İşinizi büyütecek güçlü araçlar.',
        services: [
          { icon: '⚡', title: 'Hızlı Kurulum', description: 'Dakikalar içinde başlayın.' },
          { icon: '🔒', title: 'Güvenlik', description: 'Verileriniz güvende.' },
          { icon: '📊', title: 'Analitik', description: 'Detaylı raporlar ve analizler.' },
        ],
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        stat1Value: '10K+', stat1Label: 'Aktif Kullanıcı',
        stat2Value: '%99.9', stat2Label: 'Uptime',
        stat3Value: '50+', stat3Label: 'Entegrasyon',
        stat4Value: '24/7', stat4Label: 'Destek',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Neden Biz?',
        subtitle: 'Hakkımızda',
        description: 'Teknoloji ile iş süreçlerinizi kolaylaştırıyoruz.',
        features: 'Kolay Kullanım\nÖlçeklenebilir\nGüvenli Altyapı',
        imagePosition: 'right',
      },
    },
    {
      type: 'PricingTable',
      defaultProps: {
        sectionTitle: 'Fiyatlandırma',
        sectionSubtitle: 'Planlar',
        plan1Name: 'Başlangıç', plan1Price: '₺99', plan1Period: '/ay',
        plan1Features: 'Temel özellikler\n5 kullanıcı\nE-posta desteği',
        plan1ButtonText: 'Başla',
        plan2Name: 'Profesyonel', plan2Price: '₺299', plan2Period: '/ay',
        plan2Features: 'Tüm özellikler\nSınırsız kullanıcı\nÖncelikli destek',
        plan2ButtonText: 'Başla', plan2Highlighted: true,
        plan3Name: 'Kurumsal', plan3Price: 'İletişim', plan3Period: '',
        plan3Features: 'Özel çözümler\nAdanmış destek\nSLA garantisi',
        plan3ButtonText: 'İletişim',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Kullanıcılarımız',
        sectionSubtitle: 'Geri Bildirimler',
        testimonials: [
          { name: 'Oğuz Han', role: 'CTO', content: 'İş süreçlerimizi tamamen dönüştürdü.', avatar: '' },
          { name: 'Sena Yıldız', role: 'Product Manager', content: 'Harika bir ürün ve süper destek.', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: 'Sıkça Sorulan Sorular',
        sectionSubtitle: 'SSS',
        items: [
          { question: 'Ücretsiz deneme var mı?', answer: '14 gün ücretsiz deneme sunuyoruz.' },
          { question: 'Verilerim güvende mi?', answer: 'Evet, ISO 27001 sertifikalıyız.' },
        ],
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Hemen Ücretsiz Deneyin',
        description: '14 gün boyunca tüm özellikleri ücretsiz kullanın.',
        buttonText: 'Ücretsiz Başla',
        buttonLink: '#contact',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sorularınız için yazın.',
        submitButtonText: 'Gönder',
      },
    },
  ],
};

export const retailBoutique: TemplateDefinition = {
  id: 'retail-boutique',
  name: 'Butik Mağaza',
  industry: 'retail',
  category: 'Perakende',
  description: 'Butikler, mağazalar ve perakende işletmeler için şık tasarım',
  preview: '',
  themePresetKey: 'temp3',
  supportedIndustries: ['retail', 'boutique', 'fashion', 'jewelry', 'shop', 'store'],
  sections: [
    {
      type: 'HeroOverlay',
      required: true,
      defaultProps: {
        title: 'Tarzınızı Keşfedin',
        subtitle: 'Özel Koleksiyon',
        description: 'Sezonun en trend parçaları burada.',
        primaryButtonText: 'Koleksiyon',
        primaryButtonLink: '#gallery',
        secondaryButtonText: 'Mağazamız',
        secondaryButtonLink: '#about',
      },
    },
    {
      type: 'ServicesGrid',
      defaultProps: {
        sectionTitle: 'Koleksiyonlarımız',
        sectionSubtitle: 'Kategoriler',
        sectionDescription: 'Her tarza uygun seçenekler.',
        services: [
          { icon: '👗', title: 'Kadın', description: 'Şık ve modern kadın koleksiyonu.' },
          { icon: '👔', title: 'Erkek', description: 'Kaliteli erkek giyim.' },
          { icon: '💍', title: 'Aksesuar', description: 'Tamamlayıcı aksesuarlar.' },
        ],
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        title: 'Galeri',
        subtitle: 'Sezon Koleksiyonu',
        columns: '3',
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        title: 'Hikayemiz',
        subtitle: 'Hakkımızda',
        description: 'Kaliteli ürünler ve kişiye özel hizmet.',
        features: 'Özel Tasarım\nKaliteli Kumaş\nKişiye Özel Hizmet',
        imagePosition: 'right',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müşterilerimiz',
        sectionSubtitle: 'Yorumlar',
        testimonials: [
          { name: 'Pınar Ak', role: 'Müşteri', content: 'Harika ürünler ve ilgili personel!', avatar: '' },
          { name: 'Cem Yıldırım', role: 'Müşteri', content: 'Kalite ve şıklık bir arada.', avatar: '' },
        ],
      },
    },
    {
      type: 'CTABanner',
      defaultProps: {
        title: 'Yeni Sezon Koleksiyonu',
        description: 'Özel indirimler için mağazamızı ziyaret edin.',
        buttonText: 'Keşfet',
        buttonLink: '#gallery',
      },
    },
    {
      type: 'ContactForm',
      defaultProps: {
        sectionTitle: 'İletişim',
        sectionSubtitle: 'Bize Ulaşın',
        sectionDescription: 'Sipariş ve sorularınız için.',
        submitButtonText: 'Gönder',
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

// ─── All Definitions ─────────────────────────────────────────────

export const allDefinitions: TemplateDefinition[] = [
  wellnessStudio,
  corporateServices,
  medicalClinic,
  creativeAgency,
  restaurantCafe,
  videoStudio,
  modernSaas,
  retailBoutique,
  lawyerFirm,
];
