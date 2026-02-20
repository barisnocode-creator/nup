
## Avukat Sektörü — 5 Template Tam Test & Düzeltme Planı

Tüm kod incelendikten sonra avukat sektörüyle 5 şablonda tespit edilen sorunlar ve kapsamlı düzeltme planı aşağıdadır.

---

### Mevcut Durum Analizi

`lawyer` sektör profili `sectorProfiles.ts`'de tanımlı:
- `ctaText`: "Ücretsiz Danışma"
- `sectionLabels.services`: "Uzmanlık Alanlarımız"
- `sectionLabels.team`: "Avukatlarımız"
- `sectionLabels.appointment`: "Randevu Al"

Ancak aşağıdaki spesifik sorunlar bulunuyor:

---

### Şablon Bazlı Sorun Tespiti

#### ① Specialty Cafe → Avukat

**Hero (HeroCafe):**
- `primaryButtonText: ''` → mapper `profile.ctaText = "Ücretsiz Danışma"` yazıyor ✓
- `secondaryButtonText: ''` → mapper `profile.sectionLabels.services = "Uzmanlık Alanlarımız"` yazıyor ✓
- Sorun: `badge: 'Specialty Coffee'` → avukat için "Hukuk Bürosu" olmalı, mapper sadece businessName varsa override ediyor
- `infoItems: ['Single Origin', 'Organic', 'Est. 2018']` → avukat için anlamsız, "Güvenilir", "Deneyimli", "Uzman" olmalı

**CafeFeatures (features):**
- `mapServicesSection` `features` array key'ini buluyor ve override ediyor ✓
- Ama icon emojiler hâlâ ☕ 🌿 🎨 🏠 → avukat için ⚖️ 📋 🤝 🏛️ olmalı

**MenuShowcase:**
- `sectorCompatibility` listesinde cafe/restaurant icin kısıtlı ama `mapServicesSection` `items` key'ini kontrol ediyor
- Bu section avukat için `ServicesGrid`'e replace edilmeli — ama `sectorCompatibility`'de `MenuShowcase` yalnızca `restaurant, food, cafe...` → avukat icin kaldırılıyor veya ServicesGrid'e dönüşüyor ✓

**CafeStory:**
- `mapAboutSection` çalışıyor, title/description override edilebiliyor ✓
- Ama `subtitle: 'Hikayemiz'` → avukat için de uygun, sorun yok

**CafeGallery:**
- `sectorCompatibility['CafeGallery']` listede sadece cafe/restaurant — avukat için kaldırılıyor ✓

**AppointmentBooking:**
- `mapAppointmentSection` çalışıyor: title="Ücretsiz Danışma", submit="Danışma Talep Et" ✓

**CTABanner:**
- `mapCtaSection` → businessName yoksa title kalıyor "İlk Kahveniz Bizden" ← **HATA**: avukat için tamamen yanlış
- `buttonText: 'Hemen Gelin'` → mapper `profile.ctaText = "Ücretsiz Danışma"` yazıyor ✓
- Ama `title` ve `description` avukat için anlamsız kalıyor

---

#### ② Dental Clinic → Avukat

**HeroDental:**
- `buttonText: 'Randevu Alın'` → `mapHeroSection` `buttonText !== undefined` koşulu ile `"Ücretsiz Danışma"` yazıyor ✓
- `badge: 'Diş Kliniği'` → mapper businessName varsa override ediyor, yoksa "Diş Kliniği" kalıyor ← **SORUN**

**DentalServices:**
- `sectorCompatibility` listesinde `['dentist', 'dental', 'doctor'...]` — avukat bu listede yok → `ServicesGrid`'e replace ediliyor ✓
- Replace sonucu `mapServicesSection` çalışıyor, avukat hizmetleri geliyor ✓

**DentalTips:**
- `sectorCompatibility` listesinde sadece sağlık sektörleri — avukat için kaldırılıyor ✓

**DentalBooking:**
- `sectorCompatibility`'de sağlık sektörleri → avukat için `AppointmentBooking`'e replace ediliyor ✓
- Replace props: `sectionTitle: 'Randevu'` ← **SORUN**: avukat için "Ücretsiz Danışma" olmalı
- Replace sonrası `mapAppointmentSection` çalışmıyor çünkü replace ile gelen props doğrudan kullanılıyor

**AboutSection:**
- `mapAboutSection` çalışıyor ✓

**CTABanner:**
- `title: 'Sağlıklı Gülüşünüze Bugün Başlayın'` → avukat için yanlış ← **HATA**
- `buttonText: 'Randevu Al'` → mapper `"Ücretsiz Danışma"` yazıyor ✓

---

#### ③ Restaurant Elegant → Avukat

**HeroRestaurant:**
- `primaryButtonText: ''` → mapper `"Ücretsiz Danışma"` yazıyor ✓
- `secondaryButtonText: ''` → mapper `"Uzmanlık Alanlarımız"` yazıyor ✓
- Bileşende `??` ile boş string korunuyor ✓
- `badge: '★ Fine Dining'` → avukat için yanlış ← **SORUN**

**RestaurantMenu:**
- `sectorCompatibility`'de restaurant/food → avukat için `ServicesGrid`'e replace ediliyor ✓

**ChefShowcase:**
- `sectorCompatibility`'de yalnızca restaurant/food → avukat için kaldırılıyor ✓

**CafeFeatures:**
- Feature emojiler hâlâ restoran temalı ← **SORUN** (mapper icon'ları override etmiyor)

**AppointmentBooking:**
- `mapAppointmentSection` çalışıyor ✓

**CTABanner:**
- `title: 'Unutulmaz Bir Akşam Yemeği Sizi Bekliyor'` → avukat için tamamen yanlış ← **HATA**
- `description: 'Özel günlerinize özel menüler...'` → avukat için yanlış ← **HATA**

---

#### ④ Hotel Luxury → Avukat

**HeroHotel:**
- `buttonText: 'Oda Ara'` → `mapHeroSection` override ediyor: `"Ücretsiz Danışma"` ✓
- Ama bileşen içinde `p.buttonText || 'Oda Ara'` kullanıyor — mapper boş yazsa da `||` sebebiyle fallback devreye girmez (mapper doğru yazdığı için bu OK)
- Tarih giriş/çıkış alanları her sektörde görünüyor ← **SORUN**: avukat için date picker anlamsız

**RoomShowcase:**
- `sectorCompatibility`'de yalnızca hotel/resort → avukat için kaldırılıyor ✓

**HotelAmenities:**
- `sectorCompatibility`'de yalnızca hotel → kaldırılıyor ✓

**CTABanner:**
- `title: 'Hayalinizdeki Tatil Sizi Bekliyor'` → avukat için yanlış ← **HATA**
- `buttonText: 'Hemen Rezervasyon Yap'` → mapper `"Ücretsiz Danışma"` yazıyor ✓

**FAQAccordion:**
- Otel soruları (check-in, evcil hayvan) → avukat için yanlış ← **SORUN**

---

#### ⑤ Engineer Portfolio → Avukat

**HeroPortfolio:**
- `name: 'Ahmet Yılmaz'` → `mapHeroSection` businessName override ediyor ✓
- `title: 'Full Stack Developer'` → avukat için yanlış, `generatedContent.metadata.profession` varsa override oluyor
- `bio` → `mapAboutSection` override ediyor ✓
- `buttonText: 'Projelerimi Gör'` → mapper `"Ücretsiz Danışma"` yazıyor ✓

**SkillsGrid:**
- `sectorCompatibility`'de developer/engineer → avukat için kaldırılıyor ✓

**ProjectShowcase:**
- Aynı şekilde kaldırılıyor ✓

**CTABanner:**
- `title: 'Birlikte Harika Şeyler Yapalım'` → avukat için anlamsız ← **SORUN**

---

### Düzeltme Planı — 3 Katman

#### Katman A — CTABanner Başlık/Açıklama Sektör Mapping

**Dosya:** `src/templates/catalog/mappers/mapCtaSection.ts`

Şu an sadece `businessName` varsa title override ediliyor. Sektör profilinden başlık ve açıklama da gelmeli:

```ts
const ctaTitleMap: Record<string, string> = {
  doctor: 'Sağlığınız İçin Profesyonel Bakım',
  dentist: 'Sağlıklı Gülüşünüze Bugün Başlayın',
  lawyer: 'Hukuki Güvenceniz İçin Buradayız',
  restaurant: 'Unutulmaz Bir Yemek Deneyimi',
  cafe: 'Özenle Hazırlanan Kahveniz Sizi Bekliyor',
  hotel: 'Hayalinizdeki Konaklama',
  beauty_salon: 'Güzelliğinize Değer Katıyoruz',
  gym: 'Hedeflerinize Birlikte Ulaşalım',
  veterinary: 'Dostlarınız İçin En İyisi',
  pharmacy: 'Sağlığınızda Güvenilir Ortağınız',
};

const ctaDescMap: Record<string, string> = {
  lawyer: 'İlk danışmanız ücretsiz. Haklarınızı korumak için hemen iletişime geçin.',
  doctor: 'İlk muayeneniz ücretsiz. Randevunuzu hemen alın.',
  dentist: 'İlk muayeneniz ücretsiz! Hemen randevu alın.',
  // ...
};
```

#### Katman B — HeroHotel için Sektör Özel Arayüz

**Dosya:** `src/components/sections/HeroHotel.tsx`

HeroHotel'in tarih seçici alanı otel dışı sektörlerde (avukat vb.) tamamen anlamsız. İki seçenek var:
- **Basit çözüm**: `props.sector` prop'u ekle, otel dışıysa standart buton göster
- **Pratik çözüm**: HeroHotel zaten avukat sektörü için kullanılmayacak çünkü avukat için `supportedIndustries: ['hotel', 'resort'...]` ile kısıtlı. Ama kullanıcı manuel olarak HeroHotel'i ekleyebilir.

Şimdilik bu hero bileşenine ek bir özel kontrol eklemeyeceğiz çünkü `hotelLuxury` template'i avukat sektöründe `HeroHotel`'i kullanacak (şablon değişmiyor, sadece içerik adapte oluyor). Bunun yerine:

HeroHotel'e opsiyonel `searchMode: true/false` prop ekle:
```ts
// Eğer buttonText override edildiyse (avukat, doktor gibi sektörler) 
// date picker yerine CTA butonu göster
const showSearchBar = !p.buttonText || p.buttonText === 'Oda Ara' || p.buttonText === '';
```

#### Katman C — Şablon Badge ve İnfoItems Sektör Adaptasyonu

**Dosya:** `src/templates/catalog/mappers/mapHeroSection.ts`

`badge` prop için sektör bazlı varsayılan ekle. Eğer businessName yoksa bile sektöre uygun badge göster:

```ts
const badgeMap: Record<string, string> = {
  doctor: 'Uzman Klinik',
  dentist: 'Diş Kliniği',
  lawyer: 'Hukuk Bürosu',
  restaurant: '★ Fine Dining',
  cafe: 'Specialty Coffee',
  hotel: '★★★★★',
  beauty_salon: 'Güzellik Merkezi',
  gym: 'Fitness & Wellness',
  veterinary: 'Veteriner Kliniği',
  pharmacy: 'Eczane',
};

// infoItems için sektöre özel liste
const infoItemsMap: Record<string, string[]> = {
  lawyer: ['Deneyimli Avukatlar', 'Ücretsiz İlk Danışma', 'Gizlilik Güvencesi'],
  doctor: ['Uzman Hekim', 'Modern Ekipman', 'Randevulu Sistem'],
  // ...
};
```

#### Katman D — FAQAccordion Sektör Bazlı Sorular

**Dosya:** `src/templates/catalog/mappers/` → yeni `mapFaqSection.ts`

Hotel template'indeki otel soruları avukat için tamamen yanlış. `FAQAccordion` için sektör bazlı soru-cevap setleri:

```ts
const faqMap: Record<string, Array<{question: string; answer: string}>> = {
  lawyer: [
    { question: 'İlk danışma ücretli mi?', answer: 'İlk görüşmemiz tamamen ücretsizdir.' },
    { question: 'Hangi dava türlerinde hizmet veriyorsunuz?', answer: 'Ceza hukuku, aile hukuku, iş hukuku ve ticaret hukuku...' },
    { question: 'Dava süreleri ne kadar?', answer: 'Davanın türüne ve karmaşıklığına göre değişmektedir.' },
  ],
  hotel: [ /* mevcut */ ],
  // ...
};
```

Ardından `mappers/index.ts`'e register et:
```ts
register(['FAQAccordion'], mapFaqSection, []);
```

---

### Değişecek Dosyalar Özeti

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/templates/catalog/mappers/mapCtaSection.ts` | ctaTitleMap + ctaDescMap sektör bazlı |
| 2 | `src/components/sections/HeroHotel.tsx` | buttonText override edilmişse date picker gizle, CTA butonu göster |
| 3 | `src/templates/catalog/mappers/mapHeroSection.ts` | badgeMap + infoItemsMap ekle |
| 4 | `src/templates/catalog/mappers/mapFaqSection.ts` | Yeni dosya: sektöre göre FAQ soruları |
| 5 | `src/templates/catalog/mappers/index.ts` | FAQAccordion'ı mapFaqSection ile register et |
| 6 | `src/templates/catalog/definitions.ts` | FAQAccordion items'ı nötr hale getir (mapper dolduracak) |

---

### Test Kontrol Listesi (Her Şablon için)

Avukat sektörü seçilip her şablon uygulandığında aşağıdakiler kontrol edilecek:

- Hero buton metni: "Ücretsiz Danışma" ✓
- Hero badge: "Hukuk Bürosu" veya büro adı ✓
- Hero infoItems: Avukata uygun etiketler ✓
- Hizmetler bölümü: "Uzmanlık Alanlarımız" başlığı, hukuk hizmetleri ✓
- Randevu/form başlığı: "Ücretsiz Danışma" ✓
- Submit butonu: "Danışma Talep Et" ✓
- Referanslar: "Müvekkillerimiz Ne Diyor?" ✓
- CTABanner başlık/açıklama: Avukata uygun ✓
- FAQAccordion soruları: Hukuk soruları ✓
- HeroHotel date picker: Gizli, CTA butonu görünür ✓
- Sektörle uyumsuz bölümler (MenuShowcase, RoomShowcase vb.): Kaldırılmış ✓

---

### Beklenen Sonuç

Bu 6 dosya değişikliğinden sonra avukat sektörü hangi şablonu seçerse seçsin:
- Hero, CTA, FAQ ve iletişim bölümleri avukata özel içerikle gelecek
- Otel date picker, restoran menüsü, cafe galeri gibi uyumsuz içerikler otomatik temizlenecek
- Kullanıcı minimal manuel düzenlemeyle profesyonel bir avukat sitesine ulaşacak
