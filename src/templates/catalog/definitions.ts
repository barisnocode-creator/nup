/**
 * Schema-driven template definitions.
 * Each template is pure data — no components, no renderers.
 * Templates resolve to SiteSection[] arrays at creation time.
 */

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
  preview: '',
  themePresetKey: 'specialty-cafe',
  supportedIndustries: ['food', 'cafe', 'coffee', 'restaurant', 'bakery', 'bar', 'bistro', 'patisserie', 'retail'],
  sections: [
    {
      type: 'HeroCafe',
      required: true,
      defaultProps: {
        badge: 'Specialty Coffee',
        title: 'Where Every Cup Tells a Story',
        description: 'A specialty cafe in the heart of Haight Ashbury, San Francisco. Hand-crafted beverages and artisanal pastries made with love.',
        primaryButtonText: 'Menümüzü Keşfedin',
        primaryButtonLink: '#menu',
        secondaryButtonText: 'Rezervasyon',
        secondaryButtonLink: '#appointment',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        floatingBadge: '4.9★',
        floatingBadgeSubtext: '2,400+ Değerlendirme',
        infoItems: ['Single Origin', 'Organic', 'Est. 2018'],
      },
    },
    {
      type: 'CafeFeatures',
      defaultProps: {
        subtitle: 'Neden Biz',
        title: 'Özenle Hazırlanır',
        features: [
          { icon: '☕', title: 'Single Origin', description: 'Dünyanın dört bir yanından etik kaynaklı çekirdekler' },
          { icon: '🌿', title: 'Organik', description: 'Tüm malzemelerimiz %100 organik ve taze' },
          { icon: '🎨', title: 'Latte Art', description: 'Her fincan baristalarımız tarafından sanat eseri olarak hazırlanır' },
          { icon: '🏠', title: 'Sıcak Mekan', description: 'Çalışmak, okumak veya dinlenmek için sıcak bir atmosfer' },
        ],
      },
    },
    {
      type: 'MenuShowcase',
      defaultProps: {
        subtitle: 'Menümüz',
        title: 'Özel Seçkiler',
        description: 'En sevilen içecek ve lezzetlerimiz',
        items: [
          { name: 'Espresso', description: 'Zengin, dolgun ve yoğun', price: '₺45', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80', category: 'Kahve' },
          { name: 'Cappuccino', description: 'Mükemmel buharlanmış süt ve espresso', price: '₺55', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', category: 'Kahve' },
          { name: 'Matcha Latte', description: 'Tören kalitesinde matcha', price: '₺65', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80', category: 'Specialty' },
          { name: 'Croissant', description: 'Taze pişirilmiş, tereyağlı katmanlar', price: '₺40', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80', category: 'Pastane' },
          { name: 'Pour Over', description: 'Tek kökenli, el ile demleme', price: '₺70', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', category: 'Kahve' },
          { name: 'Ekşi Mayalı Tost', description: 'Avokado ve mikro yeşillikler ile', price: '₺75', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', category: 'Yemek' },
        ],
      },
    },
    {
      type: 'CafeStory',
      defaultProps: {
        subtitle: 'Hikayemiz',
        title: 'Tutkuyla Başladı',
        description: 'Kahve tutkumuz bir hayalle başladı — herkesin kendini evinde hissedeceği, kaliteli kahvenin ve sıcak sohbetlerin buluştuğu bir mekan yaratmak. Bugün bu hayali yaşıyoruz.',
        features: 'El Yapımı Demleme\nYerel Çiftçilerden\nSürdürülebilir Üretim\nTopluluk Odaklı',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
        buttonText: 'Daha Fazla',
        buttonLink: '#about',
      },
    },
    {
      type: 'CafeGallery',
      defaultProps: {
        subtitle: 'Galeri',
        title: 'Mekanımız',
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
        sectionTitle: 'Müşterilerimiz Ne Diyor?',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: 'Zeynep Arslan', role: 'Düzenli Müşteri', content: 'Şehrin en iyi specialty kahvesi burada. Atmosfer harika, barista\'lar çok ilgili.', avatar: '' },
          { name: 'Can Yılmaz', role: 'Kahve Tutkunu', content: 'Pour over\'ları muhteşem. Her ziyarette yeni bir tat keşfediyorum.', avatar: '' },
          { name: 'Elif Demir', role: 'Freelancer', content: 'Çalışmak için mükemmel bir mekan. WiFi hızlı, ortam sakin ve kahve süper.', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Rezervasyon',
        sectionSubtitle: 'Masa Ayırın',
        sectionDescription: 'Özel anlarınız için masa ayırtın.',
        submitButtonText: 'Rezervasyon Yap',
        successMessage: 'Rezervasyonunuz alındı!',
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
        title: 'İlk Kahveniz Bizden',
        description: 'Yeni misafirlerimize özel — ilk specialty kahveniz hediye!',
        buttonText: 'Hemen Gelin',
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
  preview: '',
  themePresetKey: 'dental-clinic',
  supportedIndustries: ['doctor', 'dentist', 'dental', 'clinic', 'health', 'hospital', 'medical', 'veterinary', 'physiotherapy', 'optometry'],
  sections: [
    {
      type: 'HeroDental',
      required: true,
      defaultProps: {
        badge: 'Diş Kliniği',
        title: 'Sağlıklı Gülüşler İçin Profesyonel Bakım',
        description: 'Uzman diş hekimlerimiz ve modern teknolojimizle, ailenizin ağız ve diş sağlığını güvenle emanet edebilirsiniz.',
        buttonText: 'Randevu Alın',
        buttonLink: '#appointment',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
      },
    },
    {
      type: 'DentalServices',
      defaultProps: {
        subtitle: 'Uzman Bakım',
        title: 'Hizmetlerimiz',
        description: 'Modern ekipman ve deneyimli kadromuzla kapsamlı diş sağlığı hizmetleri sunuyoruz.',
        services: [
          { icon: 'Smile', title: 'Estetik Diş Hekimliği', description: 'Gülüş tasarımı, beyazlatma ve veneer uygulamalarıyla hayalinizdeki gülüşe kavuşun.' },
          { icon: 'Sparkles', title: 'Diş Temizliği', description: 'Profesyonel diş taşı temizliği ve parlatma ile ağız sağlığınızı koruyun.' },
          { icon: 'ScanLine', title: 'Dijital Röntgen', description: '3D görüntüleme teknolojisi ile hassas tanı ve tedavi planlaması.' },
          { icon: 'Shield', title: 'İmplant Tedavisi', description: 'Kayıp dişlerinizi doğal görünümlü, dayanıklı implantlarla tamamlayın.' },
        ],
      },
    },
    {
      type: 'AboutSection',
      defaultProps: {
        sectionTitle: 'Hakkımızda',
        sectionSubtitle: 'Bizi Tanıyın',
        description: '20 yılı aşkın deneyimimizle, en son teknolojiyi kullanarak hastalarımıza konforlu ve güvenilir tedavi sunuyoruz. Uzman kadromuz, her hastaya özel tedavi planları oluşturur.',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
      },
    },
    {
      type: 'DentalTips',
      defaultProps: {
        subtitle: 'Bilmeniz Gerekenler',
        title: 'Ağız Sağlığı İpuçları',
        tips: [
          { icon: 'Droplets', title: 'Doğru Fırçalama', content: 'Günde en az 2 kez, 2 dakika boyunca yumuşak kıllı fırçayla 45 derece açıyla fırçalayın.' },
          { icon: 'Clock', title: 'Düzenli Kontrol', content: 'Altı ayda bir diş hekiminizi ziyaret edin. Erken teşhis tedavi süresini azaltır.' },
          { icon: 'Apple', title: 'Sağlıklı Beslenme', content: 'Şekerli ve asitli yiyeceklerden kaçının. Kalsiyum zengin besinler diş sağlığını destekler.' },
          { icon: 'ShieldCheck', title: 'Koruyucu Tedaviler', content: 'Fissür örtücü ve flor uygulamaları ile dişlerinizi çürüklere karşı koruyun.' },
        ],
      },
    },
    {
      type: 'DentalBooking',
      defaultProps: {
        subtitle: 'Hemen Başlayın',
        title: 'Online Randevu',
        description: 'Birkaç adımda kolayca randevunuzu oluşturun.',
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Hastalarımız Ne Diyor?',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: 'Ayşe Yıldız', role: 'Hasta', content: 'İmplant tedavim mükemmel sonuçlandı. Doktorlar çok ilgili ve profesyonel.', avatar: '' },
          { name: 'Mehmet Kaya', role: 'Hasta', content: 'Diş beyazlatma sonucundan çok memnunum. Kliniğin hijyen standartları üst düzey.', avatar: '' },
          { name: 'Fatma Demir', role: 'Hasta', content: 'Çocuğumun diş korkusunu yendiler. Çok sabırlı ve şefkatli bir ekip.', avatar: '' },
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
        title: 'Sağlıklı Gülüşünüze Bugün Başlayın',
        description: 'İlk muayeneniz ücretsiz! Hemen randevu alın.',
        buttonText: 'Randevu Al',
        buttonLink: '#appointment',
      },
    },
  ],
};

// ─── All Definitions ─────────────────────────────────────────────

export const allDefinitions: TemplateDefinition[] = [
  specialtyCafe,
  dentalClinic,
];
