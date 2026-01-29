

# Pixabay Görsel Çekme Sistemi İyileştirmesi

## Mevcut Durum

| Özellik | Durum |
|---------|-------|
| Pixabay API | Zaten entegre ✅ |
| Sektör Terimleri | Eski (doctor, dentist, pharmacist) - güncellenmeli |
| AI ile görsel | Kullanılmıyor (doğru) |
| Dinamik arama | Yok - sabit terimler kullanılıyor |

## Yapılacak Değişiklikler

### 1. Sektör Bazlı Arama Terimlerini Güncelle

Yeni sektörlere uygun Pixabay arama terimleri:

| Sektör | Hero Görseli | About Görseli | Gallery Görselleri |
|--------|--------------|---------------|-------------------|
| `service` | "professional business office meeting" | "business team collaboration" | "consulting, office, handshake..." |
| `retail` | "modern store interior shopping" | "retail team customer service" | "store, products, shopping..." |
| `food` | "restaurant interior modern dining" | "chef cooking kitchen" | "food, restaurant, cafe..." |
| `creative` | "creative studio design workspace" | "designer artist working" | "art, design, photography..." |
| `technology` | "modern tech office computer" | "software developer team" | "technology, coding, startup..." |
| `other` | "professional business modern" | "team collaboration workspace" | "office, business, meeting..." |

### 2. AI Sohbetinden Gelen Bilgileri Kullan

AI sohbetinde toplanan `sector` ve `businessName` bilgilerini görsel aramada kullan:

```typescript
// Örnek: Kullanıcı "web tasarım ajansı" dedi
const searchQuery = `${sector} ${businessType} professional`;
// Sonuç: "creative web design agency professional"
```

### 3. Görsel Yerleşim Eşlemesi

Her template bölümü için hangi görsel:

| Bölüm | Pixabay Arama | Boyut |
|-------|---------------|-------|
| Hero Split | Sektör + "modern professional" | 1920x1080 |
| About | Sektör + "team collaboration" | 1200x800 |
| Gallery (6 adet) | Sektör + farklı terimler | 1200x800 |
| Services | Sektör + hizmet isimleri | 800x600 |
| CTA | Sektör + "success" | 1920x600 |
| Blog Posts | Kategori bazlı | 1200x630 |

### 4. Hız Optimizasyonu

- Tüm görseller **paralel** olarak çekilecek (Promise.all)
- AI içerik oluşturulurken görseller de çekilecek
- Toplam süre: ~2-3 saniye (mevcut 5-8 saniyeden düşüş)

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `supabase/functions/fetch-images/index.ts` | Yeni sektör terimleri + dinamik arama |
| `supabase/functions/generate-website/index.ts` | Yeni sektörlere uyum + paralel görsel çekme |

## Yeni Sektör Arama Terimleri

```typescript
const sectorSearchTerms: Record<string, Record<string, string>> = {
  service: {
    heroSplit: "professional business consulting office",
    aboutImage: "business team meeting collaboration",
    ctaImage: "success handshake professional",
  },
  retail: {
    heroSplit: "modern retail store interior shopping",
    aboutImage: "retail team customer service friendly",
    ctaImage: "happy customer shopping bags",
  },
  food: {
    heroSplit: "restaurant interior modern dining ambiance",
    aboutImage: "chef cooking kitchen professional",
    ctaImage: "delicious food presentation restaurant",
  },
  creative: {
    heroSplit: "creative design studio workspace modern",
    aboutImage: "designer artist team working creative",
    ctaImage: "creative project success celebration",
  },
  technology: {
    heroSplit: "modern tech office startup workspace",
    aboutImage: "software developer team coding",
    ctaImage: "technology innovation success",
  },
  other: {
    heroSplit: "professional modern business office",
    aboutImage: "team collaboration workspace meeting",
    ctaImage: "business success professional",
  },
};

const gallerySearchTerms: Record<string, string[]> = {
  service: [
    "business consulting meeting",
    "professional office workspace",
    "team collaboration success",
    "client presentation meeting",
    "modern office interior",
    "business handshake deal",
  ],
  retail: [
    "store interior modern display",
    "shopping customer experience",
    "retail products showcase",
    "store checkout friendly",
    "product display creative",
    "shopping bags happy customer",
  ],
  food: [
    "restaurant interior ambiance",
    "chef preparing food kitchen",
    "food presentation plate",
    "cafe coffee atmosphere",
    "dining experience restaurant",
    "fresh ingredients cooking",
  ],
  creative: [
    "design studio workspace",
    "creative team brainstorming",
    "art gallery exhibition",
    "photography studio setup",
    "creative project mockup",
    "design tools workspace",
  ],
  technology: [
    "tech startup office modern",
    "coding programming developer",
    "server room technology",
    "tech team collaboration",
    "digital innovation workspace",
    "modern computer setup",
  ],
  other: [
    "professional office modern",
    "business meeting room",
    "team success celebration",
    "workspace productivity",
    "corporate building exterior",
    "professional handshake",
  ],
};
```

## Akış Diyagramı

```text
Kullanıcı AI Sohbetini Tamamlar
          ↓
    Sektör Belirlenir
    (service/retail/food/creative/technology/other)
          ↓
    ┌─────────────────┬─────────────────┐
    ↓                 ↓                 ↓
AI İçerik        Hero Görsel       Gallery Görselleri
Oluşturma        Çekme (1)         Çekme (6)
    ↓                 ↓                 ↓
    └─────────────────┴─────────────────┘
                      ↓
              Tüm Veriler Birleştirilir
                      ↓
              Proje Kaydedilir
```

## Beklenen Sonuç

- AI görseli oluşturma **yok** - sadece Pixabay
- Sektöre uygun, profesyonel görseller
- Hızlı yükleme (paralel API çağrıları)
- Her proje için 10-15 farklı görsel

