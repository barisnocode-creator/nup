
# Her Elemana Tikla ve Duzenle: Inline Editing + Otomatik Panel Acma

## Mevcut Durum

ChaiBuilder SDK'nin blok mimarisi zaten canvas'ta blok secimi destekliyor:
- Bir bolume tiklandiginda SDK o bloku secer ve sag panelde ozellikleri gosterir
- Ancak bloklarin **monolitik** yapisi nedeniyle, tum bolum (ornegin hero, hizmetler) tek bir blok olarak seciliyor
- Masaustunde bu iyi calisir cunku sag panel her zaman gorunur
- **Mobilde** ise kullanici blok sectikten sonra manuel olarak "Ozellikler" panelini acmak zorunda

## Sorunlar

1. **Mobilde**: Blok secildiginde "Ozellikler" paneli otomatik acilmiyor, kullanici alt barda butona basmak zorunda
2. **Inline Editing yok**: Metin elemanlarina (baslik, aciklama, buton metni) tiklandiginda dogrudan duzenleme yapilabilmeli
3. **Gorsel duzenleme**: Gorsellere tiklandiginda gorsel secici acilabilmeli

## Cozum

### 1. Tum Bloklara `inlineEditProps` Ekleme

ChaiBuilder SDK, blok konfigurasyonunda `inlineEditProps` destekliyor. Bu ozellik, hangi string prop'larin dogrudan canvas uzerinde duzenlenebilecegini belirtiyor. SDK, bu prop'lari iceren elemanlari `contentEditable` yapar.

Her bloga uygun metin prop'lari icin `inlineEditProps` eklenecek:

| Blok | Inline Editable Props |
|------|----------------------|
| HeroSplit | title, subtitle, description, buttonText |
| HeroCentered | title, subtitle, description, primaryButtonText, secondaryButtonText |
| HeroOverlay | title, subtitle, description, buttonText |
| AboutSection | title, subtitle, description |
| ServicesGrid | sectionTitle, sectionSubtitle, sectionDescription |
| StatisticsCounter | title, subtitle |
| ImageGallery | title, subtitle |
| PricingTable | title, subtitle |
| TestimonialsCarousel | sectionTitle, sectionSubtitle |
| ContactForm | sectionTitle, sectionSubtitle, sectionDescription |
| CTABanner | title, description, buttonText, secondaryButtonText |
| FAQAccordion | sectionTitle, sectionSubtitle |

### 2. Mobilde Blok Secildiginde Otomatik Panel Acma

`MobileEditorLayout.tsx` icerisinde canvas'a bir click listener eklenerek, `data-block-id` iceren bir eleman tiklandiginda otomatik olarak "Ozellikler" (props) paneli acilacak. Boylece:

- Kullanici herhangi bir bolume tiklar
- Blok secilir VE sag taraftan "Ozellikler" paneli otomatik kayarak acilir
- Kullanici hemen baslik, metin, gorsel URL, buton metni gibi tum alanlari gorup duzenleyebilir

### 3. Canvas Click Handler Mantigi

```text
Kullanici Canvas'a tiklar
      |
      v
data-block-id var mi?
      |
     Evet --> activePanel = "props" (Ozellikler paneli acilir)
      |
    Hayir --> Panel kapanir (bos alana tiklandi)
```

## Teknik Detaylar

### Degistirilecek Dosyalar

**1. `src/components/chai-builder/blocks/hero/HeroSplit.tsx`**
- `registerChaiBlock` cagirisina `inlineEditProps: ['title', 'subtitle', 'description', 'buttonText']` ekleme

**2. `src/components/chai-builder/blocks/hero/HeroCentered.tsx`**
- `inlineEditProps: ['title', 'subtitle', 'description', 'primaryButtonText', 'secondaryButtonText']` ekleme

**3. `src/components/chai-builder/blocks/hero/HeroOverlay.tsx`**
- `inlineEditProps: ['title', 'subtitle', 'description', 'buttonText']` ekleme

**4. `src/components/chai-builder/blocks/about/AboutSection.tsx`**
- `inlineEditProps: ['title', 'subtitle', 'description']` ekleme

**5. `src/components/chai-builder/blocks/services/ServicesGrid.tsx`**
- `inlineEditProps: ['sectionTitle', 'sectionSubtitle', 'sectionDescription']` ekleme

**6. `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx`**
- `inlineEditProps: ['title', 'subtitle']` ekleme

**7. `src/components/chai-builder/blocks/gallery/ImageGallery.tsx`**
- `inlineEditProps: ['title', 'subtitle']` ekleme

**8. `src/components/chai-builder/blocks/pricing/PricingTable.tsx`**
- `inlineEditProps: ['title', 'subtitle']` ekleme

**9. `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx`**
- `inlineEditProps: ['sectionTitle', 'sectionSubtitle']` ekleme

**10. `src/components/chai-builder/blocks/contact/ContactForm.tsx`**
- `inlineEditProps: ['sectionTitle', 'sectionSubtitle', 'sectionDescription']` ekleme

**11. `src/components/chai-builder/blocks/cta/CTABanner.tsx`**
- `inlineEditProps: ['title', 'description', 'buttonText', 'secondaryButtonText']` ekleme

**12. `src/components/chai-builder/blocks/faq/FAQAccordion.tsx`**
- `inlineEditProps: ['sectionTitle', 'sectionSubtitle']` ekleme

**13. `src/components/chai-builder/MobileEditorLayout.tsx`**
- Canvas div'ine click handler ekleme
- Tiklanilan elemanin `data-block-id` icerisip icermedigini kontrol etme
- Blok secildiyse `setActivePanel('props')` cagirarak Ozellikler panelini otomatik acma
- Bos alana tiklandiginda paneli kapatma
- Kucuk bir gecikme (setTimeout 150ms) ekleyerek SDK'nin kendi secim islemini tamamlamasini bekleme

### Uygulama Ozeti

Her blok dosyasindaki degisiklik cok kucuk: `registerChaiBlock` cagirisindaki config objesine sadece bir satir eklenmesi yeterli. Mobil layout degisikligi ise canvas wrapper'ina bir onClick handler eklemekten ibaret.

Bu degisiklikler sayesinde:
- Masaustunde metne cift tiklandiginda dogrudan duzenlenebilir (inline editing)
- Tek tiklamayla blok secilir ve sag panelde tum ozellikler gorunur
- Mobilde blok tiklandiginda otomatik olarak ozellikler paneli acilir
- Gorseller, butonlar, metinler - hepsi sag panelden duzenlenebilir
