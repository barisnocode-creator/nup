import type { ProjectData } from '../contentMapper';

export const compatibleSectors: string[] = []; // all sectors

const faqMap: Record<string, Array<{ question: string; answer: string }>> = {
  lawyer: [
    { question: 'İlk danışma ücretli mi?', answer: 'İlk hukuki danışmamız tamamen ücretsizdir. Dava değerlendirmesi için randevu alabilirsiniz.' },
    { question: 'Hangi hukuk alanlarında hizmet veriyorsunuz?', answer: 'Ceza hukuku, aile hukuku, iş hukuku ve ticaret hukuku başta olmak üzere birçok alanda profesyonel hizmet sunuyoruz.' },
    { question: 'Dava süreci ne kadar sürer?', answer: 'Davanın türüne ve karmaşıklığına göre değişmektedir. İlk görüşmede tahmini süre hakkında bilgi verilir.' },
    { question: 'Avukatlık ücreti nasıl belirlenir?', answer: 'Ücretler, davanın niteliğine ve Türkiye Barolar Birliği\'nin asgari ücret tarifesine göre belirlenmektedir.' },
    { question: 'Vekillik belgesi nasıl düzenleniyor?', answer: 'Noterde düzenlenen vekaletname ile avukatınız sizi temsil edebilir. Ofisimiz bu süreçte size yardımcı olur.' },
  ],
  doctor: [
    { question: 'Randevu nasıl alabilirim?', answer: 'Web sitemiz üzerinden online randevu veya telefonla randevu alabilirsiniz.' },
    { question: 'Sigorta kabul ediyor musunuz?', answer: 'Tüm özel sağlık sigortaları ve SGK anlaşmalarımız mevcuttur. Detay için bizi arayın.' },
    { question: 'İlk muayene ücreti var mı?', answer: 'İlk muayenemiz ücretsizdir. Teşhis ve tedavi planlaması için sizi bekliyoruz.' },
    { question: 'Acil durumda ne yapmalıyım?', answer: 'Acil durumlar için 7/24 hizmetinizdeyiz. Kliniğimizi arayarak yönlendirileceksiniz.' },
  ],
  dentist: [
    { question: 'Ağrısız tedavi mümkün mü?', answer: 'Evet, modern anestezi yöntemleriyle tamamen ağrısız tedavi uyguluyoruz.' },
    { question: 'Randevu ne kadar sürmektedir?', answer: 'İşlem türüne göre 30 dakika ile 2 saat arasında değişmektedir.' },
    { question: 'Çocuklar için tedavi yapıyor musunuz?', answer: 'Evet, çocuk diş hekimliği alanında uzman doktorlarımız mevcuttur.' },
    { question: 'Sigorta ile tedavi yapılıyor mu?', answer: 'SGK ve tüm özel sağlık sigorta şirketleriyle anlaşmamız mevcuttur.' },
  ],
  hotel: [
    { question: 'Check-in ve check-out saatleri nedir?', answer: 'Check-in saat 14:00, check-out saat 12:00\'dir. Erken giriş ve geç çıkış talepleri müsaitliğe göre değerlendirilir.' },
    { question: 'Ücretsiz iptal politikası var mı?', answer: 'Giriş tarihinden 48 saat öncesine kadar ücretsiz iptal yapabilirsiniz.' },
    { question: 'Evcil hayvan kabul ediyor musunuz?', answer: 'Evet, belirli odalarda evcil hayvan kabul ediyoruz. Ek ücret uygulanabilir.' },
    { question: 'Havalimanı transferi var mı?', answer: 'Ücretsiz havalimanı transfer hizmeti sunmaktayız. Rezervasyon sırasında talep ediniz.' },
  ],
  restaurant: [
    { question: 'Rezervasyon zorunlu mu?', answer: 'Hafta sonları ve özel günler için rezervasyon önerilmektedir. Online veya telefonla rezervasyon yaptırabilirsiniz.' },
    { question: 'Vejetaryen/vegan seçeneğiniz var mı?', answer: 'Evet, menümüzde vejetaryen ve vegan seçenekler mevcuttur.' },
    { question: 'Özel etkinlik organizasyonu yapıyor musunuz?', answer: 'Doğum günü, iş yemeği ve özel kutlamalar için özel mekan ve menü seçenekleri sunuyoruz.' },
    { question: 'Çocuk sandalyesi var mı?', answer: 'Evet, ailelere özel çocuk sandalyesi ve çocuk menümüz mevcuttur.' },
  ],
  cafe: [
    { question: 'Çalışma saatleriniz nedir?', answer: 'Hafta içi 07:00-22:00, hafta sonu 08:00-23:00 saatleri arasında hizmet vermekteyiz.' },
    { question: 'Wi-Fi var mı?', answer: 'Evet, ücretsiz yüksek hızlı Wi-Fi hizmetimiz mevcuttur.' },
    { question: 'Vegan seçenekler sunuyor musunuz?', answer: 'Menümüzde birçok vegan ve glutensiz seçenek bulunmaktadır.' },
    { question: 'Online sipariş verebilir miyim?', answer: 'Evet, uygulamamız üzerinden sipariş verebilir veya paket servis talep edebilirsiniz.' },
  ],
  gym: [
    { question: 'Deneme dersi alabilir miyim?', answer: 'Evet, yeni üyelerimize 1 ders ücretsiz deneme fırsatı sunuyoruz.' },
    { question: 'Üyelik paketleri nelerdir?', answer: 'Aylık, 3 aylık ve yıllık paketlerimiz mevcuttur. Detaylar için bize ulaşın.' },
    { question: 'Kişisel antrenör çalışması var mı?', answer: 'Evet, uzman kişisel antrenörlerimizle birebir çalışma imkânı sunuyoruz.' },
    { question: 'Duş ve soyunma odanız var mı?', answer: 'Evet, tesisimizde duş kabinleri ve kilitli soyunma dolapları mevcuttur.' },
  ],
  beauty_salon: [
    { question: 'Randevu almak zorunda mıyım?', answer: 'Randevu almanızı öneririz ancak uygunluk durumuna göre randevusuz da hizmet verebiliyoruz.' },
    { question: 'Kullandığınız ürünler güvenli mi?', answer: 'Yalnızca sertifikalı, dermatoloji onaylı ürünler kullanmaktayız.' },
    { question: 'Gelin paketi sunuyor musunuz?', answer: 'Evet, düğün günü için özel gelin paketi ve ekip hizmetleri sunuyoruz.' },
    { question: 'Erkek müşteriler de hizmet alabilir mi?', answer: 'Evet, erkeklere özel saç ve cilt bakım hizmetlerimiz mevcuttur.' },
  ],
  veterinary: [
    { question: 'Acil hasta kabul ediyor musunuz?', answer: 'Evet, acil vakalar için 7/24 hizmetinizdeyiz.' },
    { question: 'Hangi hayvanlara bakım yapıyorsunuz?', answer: 'Köpek, kedi, kuş ve küçük evcil hayvanlar başta olmak üzere birçok türe hizmet veriyoruz.' },
    { question: 'Aşı takvimini takip edebilir misiniz?', answer: 'Evet, dijital sistemimiz sayesinde aşı hatırlatmaları ve sağlık takvimi tutuyoruz.' },
    { question: 'Grooming hizmeti var mı?', answer: 'Evet, tıraş, banyo ve tırnak kesimi dahil profesyonel grooming hizmetimiz mevcuttur.' },
  ],
  pharmacy: [
    { question: 'Reçetesiz ilaç satışı yapıyor musunuz?', answer: 'Evet, OTC (reçetesiz) ilaçlar için eczacılarımız size yardımcı olacaktır.' },
    { question: 'Nöbet tutma saatleriniz var mı?', answer: 'Bölgemizin nöbet çizelgesine göre nöbet hizmetimiz devam etmektedir.' },
    { question: 'İlaç danışmanlığı hizmeti var mı?', answer: 'Uzman eczacılarımız, ilaç kullanımı ve etkileşimleri konusunda ücretsiz danışmanlık sunmaktadır.' },
    { question: 'Online sipariş alıyor musunuz?', answer: 'E-reçete ile ilaçlarınızı önceden hazırlatabilir, teslim alabilirsiniz.' },
  ],
};

const defaultFaq = [
  { question: 'Hizmetleriniz neleri kapsıyor?', answer: 'Müşterilerimize en iyi hizmeti sunmak için geniş bir yelpazede profesyonel hizmetler sunmaktayız.' },
  { question: 'Çalışma saatleriniz nedir?', answer: 'Hafta içi 09:00-18:00, Cumartesi 09:00-14:00 saatleri arasında hizmet vermekteyiz.' },
  { question: 'İletişime nasıl geçebilirim?', answer: 'Web sitemizdeki iletişim formu, telefon veya e-posta yoluyla bize ulaşabilirsiniz.' },
  { question: 'Ücretlendirme nasıl yapılmaktadır?', answer: 'Hizmetin türü ve kapsamına göre belirlenmektedir. Detaylı bilgi için bizimle iletişime geçin.' },
];

export function mapFaqSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';

  const faqItems = faqMap[sectorKey];
  if (faqItems) {
    overrides.items = faqItems;
  } else {
    // Try partial match
    for (const [key, items] of Object.entries(faqMap)) {
      if (sectorKey.includes(key) || key.includes(sectorKey)) {
        overrides.items = items;
        break;
      }
    }
    if (!overrides.items) {
      overrides.items = defaultFaq;
    }
  }

  return { ...sectionProps, ...overrides };
}
