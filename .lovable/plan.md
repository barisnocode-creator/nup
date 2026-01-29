

# Durable.co Benzeri Editör ve Genişletilmiş Landing Page

## Genel Bakış

Bu plan, web sitesi düzenleme arayüzünü Durable.co'dan ilham alarak tamamen yeniden yapılandırır. Mevcut çok sayfalı yapıyı tek bir uzun, detaylı landing page'e dönüştürür ve görsel yoğun bloklar ekler.

## Yapılacak Değişiklikler

### 1. Durable.co Benzeri Editör Toolbar

Ekran görüntüsündeki gibi üst araç çubuğu:

| Menü | İşlev |
|------|-------|
| Home ikonu | Dashboard'a dön |
| Customize | Renk, font, tema ayarları (kilitli özellik) |
| Pages | Sayfa yönetimi (ileride) |
| + Add | Blok/bölüm ekleme (kilitli) |
| Help | Yardım/rehber |
| [Sayfa Seçici] | Home, About, Services arasında geçiş |
| Preview | Önizleme modu |
| Publish | Yayınlama |

### 2. Tek Sayfa Landing Page Yapısı

Tüm içeriği tek bir uzun sayfada göster:

```text
┌────────────────────────────────────────┐
│          HEADER (Navigation)           │
├────────────────────────────────────────┤
│                                        │
│          HERO SECTION                  │
│     (Tam ekran, görsel + overlay)      │
│                                        │
├────────────────────────────────────────┤
│         STATISTICS BAR                 │
│   (4 metrik: Yıl, Müşteri, vb.)       │
├────────────────────────────────────────┤
│                                        │
│         ABOUT SECTION                  │
│   (Hikaye + 2 sütunlu görsel+metin)    │
│                                        │
├────────────────────────────────────────┤
│                                        │
│        SERVICES SECTION                │
│   (6-8 servis kartı + ikonlar)         │
│                                        │
├────────────────────────────────────────┤
│                                        │
│       PROCESS / HOW IT WORKS           │
│    (4 adım timeline görünümü)          │
│                                        │
├────────────────────────────────────────┤
│                                        │
│         GALLERY / IMAGES               │
│     (Pixabay'den 4-6 görsel grid)      │
│                                        │
├────────────────────────────────────────┤
│                                        │
│       VALUES / WHY CHOOSE US           │
│    (Değerler kartları)                 │
│                                        │
├────────────────────────────────────────┤
│                                        │
│           TESTIMONIALS                 │
│     (Müşteri yorumları placeholder)    │
│                                        │
├────────────────────────────────────────┤
│                                        │
│            FAQ SECTION                 │
│      (Accordion SSS)                   │
│                                        │
├────────────────────────────────────────┤
│                                        │
│         CONTACT SECTION                │
│  (İletişim formu + bilgiler + harita)  │
│                                        │
├────────────────────────────────────────┤
│                                        │
│            CTA SECTION                 │
│      (Son çağrı aksiyonu)              │
│                                        │
├────────────────────────────────────────┤
│             FOOTER                     │
└────────────────────────────────────────┘
```

### 3. Tıklanabilir Düzenleme Sistemi

Durable.co'daki gibi element seçimi:

- Hover'da element çerçevesi görünür (mavi border)
- Tıklandığında düzenleme modu aktif
- Metin alanları için inline editing
- Görsel alanları için değiştirme butonu
- Sürükle-bırak ile bölüm sıralaması (kilitli özellik)

### 4. Yeni Bileşenler

| Bileşen | Açıklama |
|---------|----------|
| `EditorToolbar` | Üst düzenleme araç çubuğu |
| `EditableSection` | Tıklanabilir bölüm wrapper |
| `ImageGallerySection` | Pixabay görsel galerisi |
| `TestimonialsSection` | Müşteri yorumları |
| `CTASection` | Call-to-action bölümü |
| `FullPageTemplate` | Tek sayfa template |

### 5. Görsel İyileştirmeler

- Her bölüme Pixabay görseli
- Servis kartlarında ikon + görsel
- About bölümünde 2 sütunlu layout (görsel + metin)
- Gallery bölümü (4-6 grid görsel)
- Hero bölümü tam ekran split layout (metin sol, görsel sağ - ekran görüntüsündeki gibi)

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `src/components/website-preview/EditorToolbar.tsx` | Yeni - Durable benzeri toolbar |
| `src/components/website-preview/EditableSection.tsx` | Yeni - Hover/click seçim |
| `src/templates/temp1/index.tsx` | Güncelle - Tek sayfa modu |
| `src/templates/temp1/pages/FullLandingPage.tsx` | Yeni - Tüm blokları içeren sayfa |
| `src/templates/temp1/sections/HeroSplitSection.tsx` | Yeni - Sol metin, sağ görsel hero |
| `src/templates/temp1/sections/AboutSection.tsx` | Yeni - Inline about bloğu |
| `src/templates/temp1/sections/ServicesGridSection.tsx` | Yeni - Servisler grid |
| `src/templates/temp1/sections/ImageGallerySection.tsx` | Yeni - Görsel galeri |
| `src/templates/temp1/sections/TestimonialsSection.tsx` | Yeni - Yorumlar |
| `src/templates/temp1/sections/FAQSection.tsx` | Yeni - SSS accordion |
| `src/templates/temp1/sections/ContactInlineSection.tsx` | Yeni - İletişim bloğu |
| `src/templates/temp1/sections/CTASection.tsx` | Yeni - Son CTA |
| `src/types/generated-website.ts` | Güncelle - Yeni veri tipleri |
| `supabase/functions/generate-website/index.ts` | Güncelle - Daha fazla görsel + içerik |
| `supabase/functions/fetch-images/index.ts` | Güncelle - Sektör bazlı daha fazla görsel |

## Teknik Detaylar

### EditorToolbar Yapısı

```typescript
interface EditorToolbarProps {
  projectName: string;
  currentSection: string;
  onNavigate: (section: string) => void;
  onCustomize: () => void;
  onAddSection: () => void;
  onPublish: () => void;
  onPreview: () => void;
}
```

### EditableSection Wrapper

```typescript
interface EditableSectionProps {
  children: React.ReactNode;
  sectionId: string;
  sectionName: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}
```

Her section hover'da:
- Mavi çerçeve
- Sol üstte section adı badge
- Sağ üstte edit/delete/move butonları

### Genişletilmiş Görsel Veri Yapısı

```typescript
interface GeneratedImages {
  heroHome?: string;
  heroSplit?: string;          // Yeni: Hero sağ taraf
  aboutImage?: string;         // Yeni: About bölümü
  servicesImages?: string[];   // Yeni: Her servis için
  galleryImages?: string[];    // Yeni: Galeri bölümü (4-6 adet)
  teamImage?: string;          // Yeni: Ekip bölümü
  ctaImage?: string;           // Yeni: CTA arka plan
}
```

### Pixabay Görsel Çekme Güncelleme

Sektöre göre daha fazla görsel:

```typescript
const sectorSearchTerms: Record<string, Record<string, string>> = {
  service: {
    heroSplit: "professional office business meeting",
    aboutImage: "business team collaboration",
    galleryImages: "professional workspace office",
    // ...
  },
  retail: {
    heroSplit: "modern store interior shopping",
    aboutImage: "retail business team",
    galleryImages: "store products display",
    // ...
  },
  // Diğer sektörler...
};
```

## Kullanıcı Deneyimi

### Düzenleme Akışı

1. Kullanıcı sayfada scroll yapar
2. Mouse ile bir bölümün üzerine gelir
3. Bölüm çerçevelenir, toolbar görünür
4. Tıklar → inline düzenleme aktif
5. Değişiklik yapar → otomatik kayıt
6. Kilitli özellik → Upgrade modal

### Görsel Yoğunluk

Eski template: ~3-4 görsel
Yeni template: ~10-15 görsel (hero, about, services x 6, gallery x 4, CTA)

## Beklenen Sonuç

- Profesyonel, Durable.co benzeri editör deneyimi
- Tek sayfa, scroll-bazlı uzun landing page
- Görsel yoğun, etkileyici tasarım
- Tıkla-düzenle mantığı ile kolay kullanım
- Her sektöre uygun, dinamik içerik ve görseller

