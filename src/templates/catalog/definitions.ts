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

// ─── Restaurant Template ─────────────────────────────────────────

export const restaurantElegant: TemplateDefinition = {
  id: 'restaurant-elegant',
  name: 'Restaurant Elegant',
  industry: 'food',
  category: 'Yeme & İçme',
  description: 'Altın vurgulu, koyu tonlarda zarif restoran tasarımı. Preline Agency esinlenmesi.',
  preview: '',
  themePresetKey: 'restaurant-elegant',
  supportedIndustries: ['restaurant', 'food', 'bistro', 'bar', 'fine-dining', 'steakhouse', 'seafood'],
  sections: [
    {
      type: 'HeroRestaurant',
      required: true,
      defaultProps: {
        badge: '★ Fine Dining',
        title: 'Lezzetin Sanatla Buluştuğu Yer',
        description: 'Şefimizin özenle hazırladığı menümüzle unutulmaz bir gastronomi deneyimi yaşayın.',
        primaryButtonText: 'Rezervasyon',
        primaryButtonLink: '#reservation',
        secondaryButtonText: 'Menü',
        secondaryButtonLink: '#menu',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
        infoItems: ['Fine Dining', 'Est. 2015', 'Michelin Guide'],
      },
    },
    {
      type: 'CafeFeatures',
      defaultProps: {
        subtitle: 'Neden Biz',
        title: 'Farkımız',
        features: [
          { icon: '🍷', title: 'Özel Şarap Listesi', description: 'Dünya çapında seçilmiş 200+ etiket' },
          { icon: '🌿', title: 'Taze Malzemeler', description: 'Yerel çiftliklerden günlük tedarik' },
          { icon: '👨‍🍳', title: 'Ödüllü Şef', description: 'Uluslararası deneyimli mutfak ekibi' },
          { icon: '🎵', title: 'Canlı Müzik', description: 'Her cuma ve cumartesi akşamı' },
        ],
      },
    },
    {
      type: 'RestaurantMenu',
      defaultProps: {
        subtitle: 'Menümüz',
        title: 'Lezzetli Seçimler',
      },
    },
    {
      type: 'ChefShowcase',
      defaultProps: {
        subtitle: 'Baş Şefimiz',
        title: 'Chef Ahmet Yılmaz',
        description: '15 yıllık deneyimiyle dünya mutfaklarını harmanlayan şefimiz, her tabağı bir sanat eserine dönüştürür.',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80',
      },
    },
    {
      type: 'CafeGallery',
      defaultProps: {
        subtitle: 'Galeri',
        title: 'Atmosferimiz',
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
        sectionTitle: 'Misafirlerimiz Ne Diyor?',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: 'Selin Korkmaz', role: 'Gurme Blogger', content: 'İstanbul\'un en iyi fine dining deneyimlerinden biri. Servis ve sunum mükemmel.', avatar: '' },
          { name: 'Emre Aksoy', role: 'İş İnsanı', content: 'İş yemeklerimiz için vazgeçilmez adresimiz. Özel oda seçeneği çok kullanışlı.', avatar: '' },
          { name: 'Deniz Yıldırım', role: 'Şarap Tutkunu', content: 'Şarap listesi olağanüstü. Sommelye önerileri her seferinde isabetli.', avatar: '' },
        ],
      },
    },
    {
      type: 'AppointmentBooking',
      defaultProps: {
        sectionTitle: 'Rezervasyon',
        sectionSubtitle: 'Masa Ayırın',
        sectionDescription: 'Özel bir akşam yemeği için masa ayırtın.',
        submitButtonText: 'Rezervasyon Yap',
        successMessage: 'Rezervasyonunuz alındı!',
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
        title: 'Unutulmaz Bir Akşam Yemeği Sizi Bekliyor',
        description: 'Özel günlerinize özel menüler hazırlıyoruz.',
        buttonText: 'Rezervasyon Yap',
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
  preview: '',
  themePresetKey: 'hotel-luxury',
  supportedIndustries: ['hotel', 'resort', 'hostel', 'accommodation', 'motel', 'boutique-hotel', 'apart'],
  sections: [
    {
      type: 'HeroHotel',
      required: true,
      defaultProps: {
        badge: '★★★★★',
        title: 'Lüksün ve Konforun Buluştuğu Yer',
        description: 'Eşsiz manzara ve birinci sınıf hizmetlerle unutulmaz bir konaklama deneyimi.',
        buttonText: 'Oda Ara',
        buttonLink: '#rooms',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      },
    },
    {
      type: 'RoomShowcase',
      defaultProps: {
        subtitle: 'Odalarımız',
        title: 'Konfor ve Zarafet',
      },
    },
    {
      type: 'HotelAmenities',
      defaultProps: {
        subtitle: 'Olanaklar',
        title: 'Premium Hizmetler',
      },
    },
    {
      type: 'ImageGallery',
      defaultProps: {
        sectionTitle: 'Galeri',
        sectionSubtitle: 'Otelimizden Kareler',
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
        sectionTitle: 'Rakamlarla Biz',
        stats: [
          { value: '25+', label: 'Yıllık Deneyim' },
          { value: '150K+', label: 'Mutlu Misafir' },
          { value: '200+', label: 'Oda Kapasitesi' },
          { value: '4.8', label: 'Puan Ortalaması' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Misafirlerimiz Ne Diyor?',
        sectionSubtitle: 'Değerlendirmeler',
        testimonials: [
          { name: 'Maria Schmidt', role: 'İş Seyahati', content: 'Harika bir konaklama deneyimi. Personel çok ilgili ve oda kusursuzdu.', avatar: '' },
          { name: 'James Wilson', role: 'Tatilci', content: 'Spa hizmetleri mükemmel. Havuz alanı çok güzel tasarlanmış.', avatar: '' },
          { name: 'Ayşe Kara', role: 'Balayı', content: 'Balayımız için mükemmel bir seçimdi. Manzara nefes kesiciydi.', avatar: '' },
        ],
      },
    },
    {
      type: 'FAQAccordion',
      defaultProps: {
        sectionTitle: 'Sıkça Sorulan Sorular',
        items: [
          { question: 'Check-in ve check-out saatleri nedir?', answer: 'Check-in saat 14:00, check-out saat 12:00\'dir. Erken giriş ve geç çıkış talepleri müsaitliğe göre değerlendirilir.' },
          { question: 'Ücretsiz iptal politikası var mı?', answer: 'Giriş tarihinden 48 saat öncesine kadar ücretsiz iptal yapabilirsiniz.' },
          { question: 'Evcil hayvan kabul ediyor musunuz?', answer: 'Evet, belirli odalarda evcil hayvan kabul ediyoruz. Ek ücret uygulanabilir.' },
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
        title: 'Hayalinizdeki Tatil Sizi Bekliyor',
        description: 'Erken rezervasyon fırsatlarından yararlanın.',
        buttonText: 'Hemen Rezervasyon Yap',
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
  preview: '',
  themePresetKey: 'engineer-portfolio',
  supportedIndustries: ['developer', 'engineer', 'freelancer', 'designer', 'creative', 'technology', 'consultant', 'architect'],
  sections: [
    {
      type: 'HeroPortfolio',
      required: true,
      defaultProps: {
        name: 'Ahmet Yılmaz',
        title: 'Full Stack Developer',
        bio: 'React, Node.js ve cloud teknolojileri konusunda 8+ yıl deneyim. Ölçeklenebilir, kullanıcı odaklı ürünler geliştiriyorum.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        buttonText: 'Projelerimi Gör',
        buttonLink: '#projects',
      },
    },
    {
      type: 'SkillsGrid',
      defaultProps: {
        subtitle: 'Yetenekler',
        title: 'Teknik Beceriler',
      },
    },
    {
      type: 'ProjectShowcase',
      defaultProps: {
        subtitle: 'Projeler',
        title: 'Son Çalışmalarım',
      },
    },
    {
      type: 'StatisticsCounter',
      defaultProps: {
        sectionTitle: 'Rakamlarla',
        stats: [
          { value: '50+', label: 'Tamamlanan Proje' },
          { value: '30+', label: 'Mutlu Müşteri' },
          { value: '8+', label: 'Yıl Deneyim' },
          { value: '15+', label: 'Açık Kaynak Katkı' },
        ],
      },
    },
    {
      type: 'TestimonialsCarousel',
      defaultProps: {
        sectionTitle: 'Müşterilerim Ne Diyor?',
        sectionSubtitle: 'Referanslar',
        testimonials: [
          { name: 'Startup CEO', role: 'TechCo', content: 'Projemizi zamanında ve bütçe dahilinde teslim etti. Kod kalitesi mükemmel.', avatar: '' },
          { name: 'Ürün Müdürü', role: 'BigCorp', content: 'Teknik bilgisi ve iletişim yeteneği çok güçlü. Kesinlikle tavsiye ederim.', avatar: '' },
          { name: 'Girişimci', role: 'StartupX', content: 'MVP\'mizi 6 haftada çıkardı. Kullanıcı deneyimi odaklı yaklaşımı çok değerli.', avatar: '' },
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
        title: 'Birlikte Harika Şeyler Yapalım',
        description: 'Yeni projelere her zaman açığım. Hemen iletişime geçin.',
        buttonText: 'İletişime Geç',
        buttonLink: '#contact',
      },
    },
  ],
};

// ─── All Definitions ─────────────────────────────────────────────

export const allDefinitions: TemplateDefinition[] = [
  specialtyCafe,
  dentalClinic,
  restaurantElegant,
  hotelLuxury,
  engineerPortfolio,
];
