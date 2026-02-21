/**
 * Sector-specific default content profiles.
 * When a user picks ANY template, content is sourced from their sector profile
 * so a doctor always sees medical content even in a cafe-styled template.
 */

export interface SectorProfile {
  sector: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  services: Array<{ name: string; description: string; icon?: string }>;
  aboutTitle: string;
  aboutDescription: string;
  sectionLabels: {
    services: string;
    team: string;
    gallery: string;
    appointment: string;
  };
  stats?: Array<{ value: string; label: string }>;
  floatingBadge?: string;
  statCardValue?: string;
  statCardLabel?: string;
  features?: string[];
}

export const sectorProfiles: Record<string, SectorProfile> = {
  doctor: {
    sector: 'doctor',
    heroTitle: 'Sağlığınız İçin Profesyonel Bakım',
    heroSubtitle: 'Uzman Hekim Kadromuzla Yanınızdayız',
    heroDescription: 'Deneyimli kadromuz ve modern tıbbi altyapımızla, sağlığınız için en iyi hizmeti sunuyoruz. Randevunuzu hemen alın.',
    ctaText: 'Randevu Al',
    services: [
      { name: 'Genel Muayene', description: 'Kapsamlı sağlık kontrolü ve erken teşhis ile sağlığınızı koruyun.' },
      { name: 'Laboratuvar Testleri', description: 'Kan tahlili, hormon paneli ve daha fazlası için gelişmiş laboratuvar hizmetleri.' },
      { name: 'Aşılama Hizmetleri', description: 'Çocuk ve yetişkin aşı takvimine uygun, güvenli aşılama hizmeti.' },
      { name: 'Kronik Hastalık Takibi', description: 'Diyabet, tansiyon ve kronik hastalıklarınız için düzenli takip ve tedavi.' },
    ],
    aboutTitle: 'Hakkımızda',
    aboutDescription: 'Yılların deneyimi ve hasta odaklı yaklaşımımızla, ailenizin sağlığını güvence altına alıyoruz. Modern kliniğimizde, son teknoloji cihazlarla hizmet veriyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Doktorlarımız', gallery: 'Kliniğimiz', appointment: 'Randevu Al' },
    stats: [
      { value: '10.000+', label: 'Mutlu Hasta' },
      { value: '%98', label: 'Memnuniyet' },
      { value: '15+', label: 'Yıl Deneyim' },
    ],
    floatingBadge: 'Ücretsiz İlk Muayene',
    statCardValue: '4.9/5',
    statCardLabel: 'Hasta Puanı',
    features: ['Modern Ekipman', 'Uzman Kadro', '7/24 Destek'],
  },
  dentist: {
    sector: 'dentist',
    heroTitle: 'Sağlıklı Gülüşler İçin Uzman Bakım',
    heroSubtitle: 'Diş Sağlığınız Güvende',
    heroDescription: 'Estetik ve koruyucu diş hekimliği alanında uzman kadromuzla, gülüşünüzü güzelleştiriyoruz.',
    ctaText: 'Randevu Al',
    services: [
      { name: 'İmplant Tedavisi', description: 'Eksik dişleriniz için kalıcı ve doğal görünümlü implant çözümleri.' },
      { name: 'Diş Beyazlatma', description: 'Profesyonel beyazlatma ile parlak ve beyaz bir gülümseme.' },
      { name: 'Ortodonti', description: 'Şeffaf plak ve tel tedavisiyle düzgün diş dizilimi.' },
      { name: 'Kanal Tedavisi', description: 'Ağrısız ve güvenli kanal tedavisi ile dişlerinizi kurtarın.' },
    ],
    aboutTitle: 'Kliniğimiz Hakkında',
    aboutDescription: 'Son teknoloji cihazlar ve sterilizasyon standartlarıyla, ağrısız diş tedavisi deneyimi sunuyoruz.',
    sectionLabels: { services: 'Tedavilerimiz', team: 'Diş Hekimlerimiz', gallery: 'Kliniğimiz', appointment: 'Randevu Al' },
    stats: [
      { value: '8.000+', label: 'Tedavi Edilen Hasta' },
      { value: '%99', label: 'Memnuniyet' },
      { value: '10+', label: 'Yıl Deneyim' },
    ],
    floatingBadge: 'Ağrısız Tedavi',
    statCardValue: '4.9/5',
    statCardLabel: 'Hasta Puanı',
    features: ['Steril Ortam', 'Uzman Hekim', 'Ağrısız Tedavi'],
  },
  pharmacy: {
    sector: 'pharmacy',
    heroTitle: 'Sağlık Danışmanınız',
    heroSubtitle: 'Güvenilir Eczane Hizmeti',
    heroDescription: 'İlaç danışmanlığı, eczacılık hizmetleri ve sağlık ürünlerinde uzman ekibimizle yanınızdayız.',
    ctaText: 'Bize Ulaşın',
    services: [
      { name: 'Reçeteli İlaçlar', description: 'Tüm reçeteli ilaçlarınızı hızlı ve güvenle temin edin.' },
      { name: 'Dermokozmetik', description: 'Cilt bakım ürünleri ve dermokozmetik danışmanlık hizmeti.' },
      { name: 'Kan Şekeri Ölçümü', description: 'Ücretsiz tansiyon ve kan şekeri ölçüm hizmeti.' },
      { name: 'Bitkisel Ürünler', description: 'Doğal ve bitkisel sağlık ürünleri ile alternatif çözümler.' },
    ],
    aboutTitle: 'Eczanemiz',
    aboutDescription: 'Uzman eczacılarımız, sağlığınız için doğru ilacı ve kullanım bilgisini size sunmak için burada.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Eczacılarımız', gallery: 'Eczanemiz', appointment: 'Bize Ulaşın' },
    stats: [
      { value: '5.000+', label: 'Mutlu Müşteri' },
      { value: '%100', label: 'Güvenilirlik' },
      { value: '20+', label: 'Yıl Deneyim' },
    ],
    statCardValue: '4.8/5',
    statCardLabel: 'Müşteri Puanı',
    features: ['Uzman Eczacı', 'Geniş Ürün Yelpazesi', 'Danışmanlık'],
  },
  restaurant: {
    sector: 'restaurant',
    heroTitle: 'Lezzetin Sanatı',
    heroSubtitle: 'Unutulmaz Bir Yemek Deneyimi',
    heroDescription: 'Taze malzemeler ve ustaca hazırlanan tariflerle, damak zevkinize hitap eden eşsiz lezzetler sunuyoruz.',
    ctaText: 'Rezervasyon Yap',
    services: [
      { name: 'Kahvaltı Menüsü', description: 'Serpme ve açık büfe kahvaltı seçenekleriyle güne enerjik başlayın.' },
      { name: 'Ana Yemekler', description: 'Şefimizin özel tarifleriyle hazırlanan birbirinden lezzetli ana yemekler.' },
      { name: 'Tatlılar', description: 'Ev yapımı tatlılar ve mevsimsel özel desertler.' },
      { name: 'İçecekler', description: 'Özel kokteyllerden taze sıkılmış meyve sularına geniş içecek menümüz.' },
    ],
    aboutTitle: 'Hikayemiz',
    aboutDescription: 'Yılların birikimi ve tutkuyla, geleneksel tatları modern dokunuşlarla buluşturuyoruz.',
    sectionLabels: { services: 'Menümüz', team: 'Şeflerimiz', gallery: 'Mekanımız', appointment: 'Rezervasyon' },
    stats: [
      { value: '500+', label: 'Günlük Misafir' },
      { value: '150+', label: 'Menü Çeşidi' },
      { value: '12+', label: 'Yıl Deneyim' },
    ],
    floatingBadge: 'Rezervasyon Açık',
    statCardValue: '4.8/5',
    statCardLabel: 'Misafir Puanı',
    features: ['Taze Malzeme', 'Usta Şefler', 'Özel Menü'],
  },
  cafe: {
    sector: 'cafe',
    heroTitle: 'Özenle Hazırlanan Kahve',
    heroSubtitle: 'Her Yudumda Bir Hikaye',
    heroDescription: 'Özel harmanlanmış kahvelerimiz ve ev yapımı lezzetlerimizle, kendinize bir mola verin.',
    ctaText: 'Bizi Ziyaret Edin',
    services: [
      { name: 'Filtre Kahve', description: 'Tek kökenli, taze kavrulmuş çekirdeklerden hazırlanan filtre kahve.' },
      { name: 'Espresso Bar', description: 'Latte, cappuccino, flat white ve daha fazlası.' },
      { name: 'Ev Yapımı Pastalar', description: 'Her gün taze pişirilen kek, cheesecake ve kurabiyeler.' },
      { name: 'Soğuk İçecekler', description: 'Ice latte, cold brew ve mevsimsel smoothie\'ler.' },
    ],
    aboutTitle: 'Biz Kimiz',
    aboutDescription: 'Kahve tutkumuzla yola çıkarak, şehrin en özel kahve deneyimini sunmak için buradayız.',
    sectionLabels: { services: 'Menümüz', team: 'Baristalarımız', gallery: 'Mekanımız', appointment: 'İletişim' },
    stats: [
      { value: '300+', label: 'Günlük Fincan' },
      { value: '50+', label: 'Kahve Çeşidi' },
      { value: '8+', label: 'Yıl Deneyim' },
    ],
    statCardValue: '4.9/5',
    statCardLabel: 'Müşteri Puanı',
    features: ['Single Origin', 'Organik', 'El Yapımı'],
  },
  hotel: {
    sector: 'hotel',
    heroTitle: 'Lüksün ve Konforun Adresi',
    heroSubtitle: 'Unutulmaz Bir Konaklama Deneyimi',
    heroDescription: 'Şehrin kalbinde, üstün konfor ve kusursuz hizmet anlayışıyla misafirlerimizi ağırlıyoruz.',
    ctaText: 'Rezervasyon Yap',
    services: [
      { name: 'Deluxe Oda', description: 'Şehir manzaralı, geniş ve modern döşenmiş lüks odalar.' },
      { name: 'Spa & Wellness', description: 'Masaj, sauna ve fitness merkezi ile kendinizi şımartın.' },
      { name: 'Restoran & Bar', description: 'Açık büfe kahvaltı ve à la carte akşam yemeği.' },
      { name: 'Toplantı Salonu', description: 'İş toplantıları ve etkinlikler için donanımlı salonlar.' },
    ],
    aboutTitle: 'Otelimiz Hakkında',
    aboutDescription: 'Misafirperverlik geleneğimizi modern konforla birleştirerek, unutulmaz bir konaklama deneyimi sunuyoruz.',
    sectionLabels: { services: 'Odalarımız', team: 'Ekibimiz', gallery: 'Otelimiz', appointment: 'Rezervasyon' },
    stats: [
      { value: '120+', label: 'Lüks Oda' },
      { value: '%98', label: 'Doluluk Oranı' },
      { value: '25+', label: 'Yıl Deneyim' },
    ],
    floatingBadge: 'Erken Rezervasyon İndirimi',
    statCardValue: '4.9/5',
    statCardLabel: 'Misafir Puanı',
    features: ['5 Yıldız Hizmet', 'Spa & Wellness', 'Eşsiz Manzara'],
  },
  lawyer: {
    sector: 'lawyer',
    heroTitle: 'Hukuki Güvenceniz',
    heroSubtitle: 'Deneyimli Avukat Kadrosu',
    heroDescription: 'Her türlü hukuki süreçte, haklarınızı korumak ve en iyi sonuca ulaşmak için yanınızdayız.',
    ctaText: 'Ücretsiz Danışma',
    services: [
      { name: 'Ceza Hukuku', description: 'Ceza davalarında uzman savunma ve hukuki danışmanlık.' },
      { name: 'İş Hukuku', description: 'İşçi ve işveren uyuşmazlıklarında profesyonel çözümler.' },
      { name: 'Aile Hukuku', description: 'Boşanma, velayet ve nafaka davalarında deneyimli temsil.' },
      { name: 'Ticaret Hukuku', description: 'Şirket kuruluşu, sözleşme hazırlığı ve ticari davalar.' },
    ],
    aboutTitle: 'Büromuz Hakkında',
    aboutDescription: 'Güçlü hukuki bilgi birikimi ve müvekkil odaklı yaklaşımımızla, adalet yolunda birlikte yürüyoruz.',
    sectionLabels: { services: 'Uzmanlık Alanlarımız', team: 'Avukatlarımız', gallery: 'Büromuz', appointment: 'Randevu Al' },
    stats: [
      { value: '2.000+', label: 'Çözülen Dava' },
      { value: '%95', label: 'Başarı Oranı' },
      { value: '20+', label: 'Yıl Deneyim' },
    ],
    floatingBadge: 'Ücretsiz İlk Danışma',
    statCardValue: '4.9/5',
    statCardLabel: 'Müvekkil Puanı',
    features: ['Deneyimli Avukatlar', 'Gizlilik Güvencesi', 'Hızlı Çözüm'],
  },
  beauty_salon: {
    sector: 'beauty_salon',
    heroTitle: 'Güzelliğinize Değer Katıyoruz',
    heroSubtitle: 'Profesyonel Bakım ve Stil',
    heroDescription: 'Uzman ekibimiz ve kaliteli ürünlerimizle, en iyi halinizisiniz öne çıkarıyoruz.',
    ctaText: 'Randevu Al',
    services: [
      { name: 'Saç Bakımı & Kesim', description: 'Trend kesimler ve profesyonel saç bakım uygulamaları.' },
      { name: 'Cilt Bakımı', description: 'Cilt tipinize özel bakım protokolleri ve anti-aging tedaviler.' },
      { name: 'Manikür & Pedikür', description: 'Kalıcı oje, jel tırnak ve bakım hizmetleri.' },
      { name: 'Makyaj', description: 'Gelin makyajı, özel gün makyajı ve profesyonel styling.' },
    ],
    aboutTitle: 'Salonumuz',
    aboutDescription: 'Modern ve şık salonumuzda, kendinizi özel hissetmeniz için profesyonel bakım sunuyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Uzmanlarımız', gallery: 'Çalışmalarımız', appointment: 'Randevu Al' },
    stats: [
      { value: '3.000+', label: 'Mutlu Müşteri' },
      { value: '%97', label: 'Memnuniyet' },
      { value: '10+', label: 'Yıl Deneyim' },
    ],
    statCardValue: '4.8/5',
    statCardLabel: 'Müşteri Puanı',
    features: ['Premium Ürünler', 'Uzman Ekip', 'Kişisel Bakım'],
  },
  gym: {
    sector: 'gym',
    heroTitle: 'Sağlıklı Yaşam Merkezi',
    heroSubtitle: 'Hedeflerinize Birlikte Ulaşalım',
    heroDescription: 'Modern ekipmanlar ve uzman eğitmenlerle, fitness hedeflerinize ulaşmanız için buradayız.',
    ctaText: 'Ücretsiz Deneme',
    services: [
      { name: 'Kişisel Antrenman', description: 'Birebir çalışma programıyla hedeflerinize hızlı ulaşın.' },
      { name: 'Grup Dersleri', description: 'Yoga, pilates, spinning ve fonksiyonel antrenman dersleri.' },
      { name: 'Beslenme Danışmanlığı', description: 'Kişiye özel beslenme programları ve diyet takibi.' },
      { name: 'Kardio & Ağırlık', description: 'Son model cihazlarla donatılmış kardio ve ağırlık alanları.' },
    ],
    aboutTitle: 'Hakkımızda',
    aboutDescription: 'Sağlıklı bir yaşam tarzını benimsemeniz için gereken tüm imkânları tek çatı altında sunuyoruz.',
    sectionLabels: { services: 'Programlarımız', team: 'Eğitmenlerimiz', gallery: 'Salonumuz', appointment: 'Ücretsiz Deneme' },
    stats: [
      { value: '1.000+', label: 'Aktif Üye' },
      { value: '50+', label: 'Grup Dersi' },
      { value: '15+', label: 'Uzman Eğitmen' },
    ],
    floatingBadge: 'Ücretsiz Deneme',
    statCardValue: '4.7/5',
    statCardLabel: 'Üye Puanı',
    features: ['Modern Ekipman', 'Uzman Eğitmen', 'Kişisel Program'],
  },
  veterinary: {
    sector: 'veterinary',
    heroTitle: 'Dostlarınız İçin En İyisi',
    heroSubtitle: 'Uzman Veteriner Bakımı',
    heroDescription: 'Sevimli dostlarınızın sağlığı ve mutluluğu için, şefkatli ve profesyonel veteriner hizmeti sunuyoruz.',
    ctaText: 'Randevu Al',
    services: [
      { name: 'Genel Muayene', description: 'Kapsamlı sağlık kontrolü ve koruyucu bakım hizmetleri.' },
      { name: 'Aşılama', description: 'Kedi, köpek ve diğer evcil hayvanlar için aşı takibi.' },
      { name: 'Cerrahi Operasyonlar', description: 'Kısırlaştırma, ortopedi ve yumuşak doku cerrahisi.' },
      { name: 'Diş Bakımı', description: 'Evcil hayvanlar için diş temizliği ve ağız sağlığı bakımı.' },
    ],
    aboutTitle: 'Kliniğimiz',
    aboutDescription: 'Hayvan sevgisi ve mesleki tecrübemizle, evcil dostlarınıza en kaliteli sağlık hizmetini veriyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Veterinerlerimiz', gallery: 'Kliniğimiz', appointment: 'Randevu Al' },
    stats: [
      { value: '5.000+', label: 'Tedavi Edilen Dost' },
      { value: '%98', label: 'Memnuniyet' },
      { value: '12+', label: 'Yıl Deneyim' },
    ],
    statCardValue: '4.9/5',
    statCardLabel: 'Hasta Sahibi Puanı',
    features: ['Uzman Veteriner', 'Steril Ortam', '7/24 Acil'],
  },
  engineer: {
    sector: 'engineer',
    heroTitle: 'Yazılım ve Teknoloji Çözümleri',
    heroSubtitle: 'Modern Projeler, Güçlü Altyapı',
    heroDescription: 'Full-stack geliştirme, sistem mimarisi ve bulut çözümleri alanında uzman ekibimizle projenizi hayata geçiriyoruz.',
    ctaText: 'Proje Görüşelim',
    services: [
      { name: 'Web Geliştirme', description: 'Modern framework\'lerle hızlı ve ölçeklenebilir web uygulamaları.' },
      { name: 'Mobil Uygulama', description: 'iOS ve Android için native ve cross-platform mobil çözümler.' },
      { name: 'API & Backend', description: 'RESTful API tasarımı, mikro servis mimarisi ve bulut entegrasyonu.' },
      { name: 'DevOps & Bulut', description: 'CI/CD pipeline, container yönetimi ve bulut altyapısı kurulumu.' },
    ],
    aboutTitle: 'Hakkımızda',
    aboutDescription: 'Teknoloji tutkusuyla, işletmenizin dijital dönüşümüne öncülük ediyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Ekibimiz', gallery: 'Projelerimiz', appointment: 'İletişime Geç' },
    stats: [
      { value: '200+', label: 'Tamamlanan Proje' },
      { value: '50+', label: 'Mutlu Müşteri' },
      { value: '10+', label: 'Yıl Deneyim' },
    ],
    statCardValue: '5.0/5',
    statCardLabel: 'Müşteri Puanı',
    features: ['Full-Stack Geliştirme', 'Modern Teknoloji', 'Hızlı Teslimat'],
  },
  designer: {
    sector: 'designer',
    heroTitle: 'Yaratıcı Tasarım Çözümleri',
    heroSubtitle: 'Markanızı Görselleştiriyoruz',
    heroDescription: 'Marka kimliği, UI/UX ve dijital içerik tasarımı alanlarında yenilikçi çözümler sunuyoruz.',
    ctaText: 'Proje Görüşelim',
    services: [
      { name: 'Marka Kimliği', description: 'Logo, renk paleti ve marka rehberi tasarımı.' },
      { name: 'UI/UX Tasarım', description: 'Kullanıcı odaklı arayüz ve deneyim tasarımı.' },
      { name: 'Baskı Tasarımı', description: 'Broşür, katalog ve kurumsal materyaller.' },
      { name: 'Sosyal Medya', description: 'Sosyal medya görselleri ve içerik tasarımı.' },
    ],
    aboutTitle: 'Tasarım Felsefemiz',
    aboutDescription: 'Estetik ve işlevselliği bir arada sunan, markanızı öne çıkaran tasarımlar üretiyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Tasarımcılarımız', gallery: 'Portfolyo', appointment: 'Teklif Al' },
  },
  consulting: {
    sector: 'consulting',
    heroTitle: 'Stratejik İş Danışmanlığı',
    heroSubtitle: 'Büyümeniz İçin Doğru Yol Haritası',
    heroDescription: 'İş geliştirme, süreç optimizasyonu ve stratejik planlama alanlarında uzman danışmanlık hizmetleri.',
    ctaText: 'Ücretsiz Analiz',
    services: [
      { name: 'Strateji Geliştirme', description: 'Büyüme hedeflerinize ulaşmak için özelleştirilmiş strateji planları.' },
      { name: 'Süreç Optimizasyonu', description: 'İş süreçlerinizi analiz ederek verimliliği artırıyoruz.' },
      { name: 'Finansal Danışmanlık', description: 'Yatırım planlaması ve finansal analiz hizmetleri.' },
      { name: 'Dijital Dönüşüm', description: 'Şirketinizi dijital çağa hazırlayan kapsamlı dönüşüm projesi.' },
    ],
    aboutTitle: 'Biz Kimiz',
    aboutDescription: 'Deneyimli danışman kadromuzla, işletmenizin potansiyelini maksimuma taşıyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Danışmanlarımız', gallery: 'Başarı Hikayelerimiz', appointment: 'Randevu Al' },
  },
  real_estate: {
    sector: 'real_estate',
    heroTitle: 'Gayrimenkul Danışmanlığı',
    heroSubtitle: 'Hayalinizdeki Mülkü Buluyoruz',
    heroDescription: 'Konut, ticari ve endüstriyel gayrimenkul alım-satım süreçlerinde uzman rehberlik.',
    ctaText: 'Ücretsiz Değerleme',
    services: [
      { name: 'Konut Satışı', description: 'Daire, villa ve müstakil ev alım-satım danışmanlığı.' },
      { name: 'Ticari Mülk', description: 'Ofis, dükkan ve ticari alan kiralama ve satış hizmetleri.' },
      { name: 'Kira Yönetimi', description: 'Mülkünüzün kiraya verilmesi ve yönetimi.' },
      { name: 'Ekspertiz', description: 'Profesyonel mülk değerleme ve piyasa analizi.' },
    ],
    aboutTitle: 'Ajansımız Hakkında',
    aboutDescription: 'Yılların sektör tecrübesiyle, gayrimenkul alım-satım süreçlerinizi güvenle yönetiyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Danışmanlarımız', gallery: 'Portföyümüz', appointment: 'Randevu Al' },
  },
  education: {
    sector: 'education',
    heroTitle: 'Kaliteli Eğitim, Parlak Gelecek',
    heroSubtitle: 'Potansiyelinizi Keşfedin',
    heroDescription: 'Alanında uzman öğretmenler ve modern eğitim yöntemleriyle, başarıya giden yolda yanınızdayız.',
    ctaText: 'Kayıt Ol',
    services: [
      { name: 'Bireysel Ders', description: 'Öğrenciye özel birebir ders programları.' },
      { name: 'Grup Dersleri', description: 'Verimli ve eğlenceli grup eğitim ortamı.' },
      { name: 'Online Eğitim', description: 'Dilediğiniz yerden canlı ve kayıtlı dersler.' },
      { name: 'Sınav Hazırlık', description: 'YKS, KPSS ve yabancı dil sınavlarına hazırlık.' },
    ],
    aboutTitle: 'Kurumumuz',
    aboutDescription: 'Öğrenci odaklı yaklaşımımız ve deneyimli kadromuzla, her öğrencinin başarısına katkı sağlıyoruz.',
    sectionLabels: { services: 'Programlarımız', team: 'Öğretmenlerimiz', gallery: 'Ortamımız', appointment: 'Kayıt Ol' },
  },
  event: {
    sector: 'event',
    heroTitle: 'Unutulmaz Etkinlikler',
    heroSubtitle: 'Her Anı Özel Kılıyoruz',
    heroDescription: 'Düğün, kurumsal etkinlik ve özel organizasyonlarda kusursuz planlama ve uygulama.',
    ctaText: 'Teklif Al',
    services: [
      { name: 'Düğün Organizasyonu', description: 'Hayalinizdeki düğünü planlama ve koordinasyon.' },
      { name: 'Kurumsal Etkinlik', description: 'Toplantı, seminer ve şirket etkinlikleri.' },
      { name: 'Kişisel Kutlamalar', description: 'Doğum günü, nişan ve vaftiz organizasyonları.' },
      { name: 'Dekorasyon', description: 'Mekan dekorasyonu ve tema tasarımı.' },
    ],
    aboutTitle: 'Ajansımız',
    aboutDescription: 'Her etkinliği özel bir anıya dönüştürmek için tutkuyla çalışıyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Ekibimiz', gallery: 'Etkinliklerimiz', appointment: 'Teklif Al' },
  },
  photography: {
    sector: 'photography',
    heroTitle: 'Anlarınızı Ölümsüzleştiriyoruz',
    heroSubtitle: 'Profesyonel Fotoğrafçılık Hizmetleri',
    heroDescription: 'Düğün, kurumsal ve ürün fotoğrafçılığında yüksek kalite ve yaratıcı perspektif.',
    ctaText: 'Teklif Al',
    services: [
      { name: 'Düğün Fotoğrafçılığı', description: 'Özel gününüzün her anını sanatsal bir bakışla kayıt altına alıyoruz.' },
      { name: 'Ürün Fotoğrafçılığı', description: 'E-ticaret ve katalog için profesyonel ürün çekimleri.' },
      { name: 'Portre & Kurumsal', description: 'Kişisel ve kurumsal profil fotoğrafları.' },
      { name: 'Video Prodüksiyon', description: 'Düğün filmi, tanıtım videosu ve sosyal medya içerikleri.' },
    ],
    aboutTitle: 'Stüdyomuz',
    aboutDescription: 'Işık, kompozisyon ve duygunun buluştuğu noktada, yaşananları sanata dönüştürüyoruz.',
    sectionLabels: { services: 'Hizmetlerimiz', team: 'Fotoğrafçılarımız', gallery: 'Portfolyo', appointment: 'Teklif Al' },
  },
};

/**
 * Returns the sector profile for a given sector key.
 * Falls back to undefined if sector is not found.
 */
/**
 * Alias map: maps alternative sector names to canonical sectorProfiles keys.
 */
const sectorAliases: Record<string, string> = {
  // Medical
  'aesthetic_surgery': 'doctor', 'plastic_surgery': 'doctor', 'estetik': 'doctor',
  'cerrahi': 'doctor', 'health': 'doctor', 'medical': 'doctor', 'clinic': 'doctor',
  'hospital': 'doctor', 'physio': 'doctor', 'physiotherapy': 'doctor', 'psikolog': 'doctor',
  'psychology': 'doctor', 'optometrist': 'doctor', 'eye_clinic': 'doctor',
  // Dental
  'dental': 'dentist', 'dis': 'dentist',
  // Food
  'food': 'restaurant', 'bistro': 'restaurant', 'fine_dining': 'restaurant',
  'bakery': 'cafe', 'patisserie': 'cafe', 'coffee': 'cafe', 'bar': 'restaurant',
  // Hotel / accommodation
  'resort': 'hotel', 'accommodation': 'hotel', 'motel': 'hotel', 'hostel': 'hotel', 'apart': 'hotel',
  // Legal
  'attorney': 'lawyer', 'hukuk': 'lawyer', 'notary': 'lawyer', 'noter': 'lawyer',
  // Beauty
  'spa': 'beauty_salon', 'kuafor': 'beauty_salon', 'berber': 'beauty_salon',
  'nail': 'beauty_salon', 'tirnak': 'beauty_salon', 'aesthetics': 'beauty_salon',
  // Fitness
  'fitness': 'gym', 'pilates': 'gym', 'yoga': 'gym', 'crossfit': 'gym', 'martial_arts': 'gym',
  // Veterinary
  'pet': 'veterinary', 'petshop': 'veterinary',
  // Tech
  'developer': 'engineer', 'software': 'engineer', 'technology': 'engineer',
  'it': 'engineer', 'yazilim': 'engineer', 'freelancer': 'engineer',
  // Design
  'graphic': 'designer', 'creative': 'designer', 'ui_ux': 'designer', 'tasarim': 'designer',
  // Business
  'consultant': 'consulting', 'danismanlik': 'consulting', 'finance': 'consulting',
  'accounting': 'consulting', 'muhasebe': 'consulting',
  // Real estate
  'property': 'real_estate', 'emlak': 'real_estate', 'realty': 'real_estate',
  // Education
  'school': 'education', 'okul': 'education', 'kurs': 'education', 'academy': 'education',
  'language': 'education', 'dil_kursu': 'education', 'tutoring': 'education',
  // Events & Media
  'wedding': 'event', 'dugun': 'event', 'organization': 'event',
  'photo': 'photography', 'studio': 'photography', 'video': 'photography',
  // Pharmacy
  'eczane': 'pharmacy',
};

export function getSectorProfile(sector: string | undefined): SectorProfile | undefined {
  if (!sector) return undefined;
  const key = sector.toLowerCase().replace(/[\s-]/g, '_');
  // Direct match
  if (sectorProfiles[key]) return sectorProfiles[key];
  // Alias match
  const alias = sectorAliases[key];
  if (alias && sectorProfiles[alias]) return sectorProfiles[alias];
  // Partial match
  for (const [aliasKey, target] of Object.entries(sectorAliases)) {
    if (key.includes(aliasKey)) return sectorProfiles[target];
  }
  return undefined;
}
