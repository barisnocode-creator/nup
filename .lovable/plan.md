
# Editör İçerik, Tema ve Görsel Sorunları Kapsamlı Düzeltme Planı

## Tespit Edilen Sorunlar

### Sorun 1: Görseller Bloklara Aktarılmıyor
**Kök Neden:** İki ayrı zamanlama ve veri akışı sorunu var:

1. `generate-website` fonksiyonu Pixabay'den görsel çeker ama ardından `generate-images` fonksiyonu bu görselleri base64 AI görselleriyle **tamamen üzerine yazar** (satır 298-300: `images: images` - spread değil, komple değiştirme). Pixabay görselleri (galleryImages, aboutImage, ctaImage, heroSplit vb.) kayboluyor.

2. `convertGeneratedContentToChaiBlocks` fonksiyonu görselleri bloklara aktarırken `images?.heroHome` gibi anahtarlar kullanıyor. Veritabanındaki images sadece `heroHome`, `heroAbout`, `heroServices` içeriyor (generate-images tarafından) ama bunlar **5MB+ base64 string** - bu kadar büyük veri `chai_blocks` JSON sütununa eklendiğinde sorun çıkıyor.

3. Mevcut veritabanındaki blokların hiçbirinde görsel verisi yok (`backgroundImage`, `image`, `image1`-`image6` hepsi boş).

### Sorun 2: Renk Teması Uygulanmıyor
**Kök Neden:** ChaiBuilder SDK, tema renklerini canvas iframe'i içindeki CSS değişkenlerine dönüştürüyor. Ancak `tailwind.chaibuilder.config.ts` dosyası tamamen boş - SDK'nın oluşturduğu CSS değişkenlerini (`--background`, `--primary` vb.) Tailwind sınıflarına (`bg-background`, `text-primary`) bağlayan yapılandırma eksik. Bu nedenle bloklar doğru tema renklerini kullanamıyor.

### Sorun 3: Yazı Boyutları ve Renkleri Seçilemiyor
**Kök Neden:** Blok şemaları yalnızca içerik alanlarını (başlık, açıklama vb.) sunuyor. Bireysel metin elemanları için boyut, renk veya ağırlık gibi stil özellikleri şemalarda tanımlanmamış. Kullanıcı sağ panelden sadece metni değiştirebiliyor, stilini değiştiremiyor.

### Sorun 4: Template Değişikliği Uygulanmıyor
**Kök Neden:** Eski template sistemi (`ChangeTemplateModal`) hâlâ `generated_content` ve eski template bileşenlerini hedefliyor. ChaiBuilder'a geçişle birlikte template değişikliği, blokların yeniden oluşturulması ve temanın değiştirilmesi anlamına gelmeli - ancak bu bağlantı kurulmamış.

---

## Çözüm Planı

### Adım 1: Görsellerin Bloklara Doğru Aktarılması
**Dosya:** `src/components/chai-builder/utils/convertToChaiBlocks.ts`

- Base64 görseller çok büyük olduğu için, dönüştürme sırasında görsellerin URL formatında olup olmadığını kontrol et
- Base64 görselleri doğrudan blok prop'larına aktar (SDK canvas'ta render edebilir)
- `images?.heroHome` yanı sıra `images?.heroSplit` gibi alternatif anahtarları da kontrol et
- Galeri görselleri için `images?.galleryImages` dizisini `image1`-`image6` prop'larına map'le
- About görseli için `images?.aboutImage || images?.heroAbout` fallback zinciri kullan

### Adım 2: generate-images Fonksiyonunun Pixabay Verilerini Koruması
**Dosya:** `supabase/functions/generate-images/index.ts`

Satır 298-300'deki mevcut kod:
```
images,  // Tamamen üzerine yazar!
```
Düzeltme:
```
images: { ...generatedContent.images, ...images }  // Mevcut görselleri koru, sadece yenilerini ekle
```
Bu sayede Pixabay'den gelen `galleryImages`, `aboutImage`, `ctaImage`, `heroSplit` gibi görseller korunacak.

### Adım 3: Renk Temasının Doğru Uygulanması
**Dosya:** `tailwind.chaibuilder.config.ts`

Tailwind yapılandırmasına CSS değişkenlerini bağlayan renk tanımları eklenecek:
```typescript
theme: {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
      secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
      muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
      accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
      destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
      popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
    },
    borderRadius: {
      DEFAULT: "var(--radius)",
    },
    fontFamily: {
      sans: "var(--font-body, Inter, sans-serif)",
      display: "var(--font-heading, Inter, sans-serif)",
    }
  }
}
```

### Adım 4: Blok Şemalarına Stil Kontrolleri Eklenmesi
**Dosyalar:** Tüm blok dosyaları (`src/components/chai-builder/blocks/*/`)

Her blok şemasına temel stil kontrolleri eklenecek:
- `titleSize`: Başlık boyutu (sm, md, lg, xl, 2xl seçenekleri)
- `textAlign`: Metin hizalama (left, center, right)
- `backgroundColor`: Arka plan rengi seçimi (default, primary, secondary, muted, card)

Örnek (HeroCentered):
```typescript
titleSize: builderProp({
  type: "string",
  title: "Başlık Boyutu",
  default: "2xl",
  enum: ["lg", "xl", "2xl", "3xl"],
}),
textAlign: builderProp({
  type: "string",
  title: "Metin Hizalama",
  default: "center",
  enum: ["left", "center", "right"],
}),
```

### Adım 5: Mevcut Projelerin Bloklarını Yeniden Oluşturma
**Dosya:** `src/pages/Project.tsx`

- Editör yüklenirken, blokların görsel verisi eksikse (backgroundImage/image boşsa) ve `generated_content.images` doluysa, blokları otomatik olarak yeniden oluştur
- Bu "yeniden dönüştürme" işlemi, güncel `generated_content` verisiyle `convertGeneratedContentToChaiBlocks` fonksiyonunu tekrar çağırır ve sonucu veritabanına kaydeder

### Adım 6: Template Değişikliğinin ChaiBuilder ile Uyumlu Hale Getirilmesi
**Dosya:** `src/pages/Project.tsx` ve `src/components/website-preview/ChangeTemplateModal.tsx`

- Template değiştiğinde, yeni template'e karşılık gelen tema presetini uygula (`templateToPreset` mapping'i zaten mevcut)
- `chai_theme` güncellendiğinde SDK otomatik olarak renkleri yeniler (yeni tema kaydedilir, sayfa yeniden yüklenir)

---

## Değiştirilecek Dosyalar

1. `src/components/chai-builder/utils/convertToChaiBlocks.ts` - Görsel mapping düzeltmesi
2. `supabase/functions/generate-images/index.ts` - Pixabay verilerini koruma
3. `tailwind.chaibuilder.config.ts` - CSS değişken bağlantıları
4. `src/components/chai-builder/blocks/hero/HeroCentered.tsx` - Stil kontrolleri
5. `src/components/chai-builder/blocks/hero/HeroSplit.tsx` - Stil kontrolleri
6. `src/components/chai-builder/blocks/hero/HeroOverlay.tsx` - Stil kontrolleri
7. `src/components/chai-builder/blocks/about/AboutSection.tsx` - Stil kontrolleri
8. `src/components/chai-builder/blocks/services/ServicesGrid.tsx` - Stil kontrolleri
9. `src/components/chai-builder/blocks/contact/ContactForm.tsx` - Stil kontrolleri
10. `src/components/chai-builder/blocks/gallery/ImageGallery.tsx` - Stil kontrolleri
11. `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` - Stil kontrolleri
12. `src/components/chai-builder/blocks/cta/CTABanner.tsx` - Stil kontrolleri
13. `src/components/chai-builder/blocks/faq/FAQAccordion.tsx` - Stil kontrolleri
14. `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx` - Stil kontrolleri
15. `src/components/chai-builder/blocks/pricing/PricingTable.tsx` - Stil kontrolleri
16. `src/pages/Project.tsx` - Blok yeniden oluşturma mantığı
