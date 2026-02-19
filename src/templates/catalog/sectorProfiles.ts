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
  'aesthetic_surgery': 'doctor',
  'plastic_surgery': 'doctor',
  'estetik': 'doctor',
  'cerrahi': 'doctor',
  'health': 'doctor',
  'medical': 'doctor',
  'clinic': 'doctor',
  'hospital': 'doctor',
  'dental': 'dentist',
  'dis': 'dentist',
  'food': 'restaurant',
  'bistro': 'restaurant',
  'fine_dining': 'restaurant',
  'coffee': 'cafe',
  'resort': 'hotel',
  'accommodation': 'hotel',
  'attorney': 'lawyer',
  'hukuk': 'lawyer',
  'spa': 'beauty_salon',
  'kuafor': 'beauty_salon',
  'fitness': 'gym',
  'pilates': 'gym',
  'yoga': 'gym',
  'pet': 'veterinary',
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
