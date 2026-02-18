
## Template Sadakatini Koruma ve Kalan Fazlarin Tamamlanmasi

### Temel Sorun

Mevcut `src/components/sections/` altindaki yeni bilesenler (ornegin `HeroCentered`, `ServicesGrid`, `HeroOverlay`) basitlesilmis, jenerik versiyonlar. Ancak eski template'lerdeki zengin bilesenler cok daha detayli:

- **Pilates**: `HeroFullscreen` (glassmorphic form overlay, parallax bg, gradient katmanlari), `FeatureCards` (IntersectionObserver ile staggered fade-in, hover:scale-110 gorsel efekti), `TourGallery` (sonsuz yatay scroll animasyonu `@keyframes scrollGallery`)
- **Lawyer**: `HeroLawyer` (framer-motion ile sirali fade+slide animasyonlari, parallax `backgroundAttachment: fixed`, scroll indicator bounce), `ValuesGrid` (framer-motion `whileInView`, `lawyer-value-card` hover-lift efekti)
- **Natural**: `NaturalHero` (rounded-[2.5rem] containerlar, serif tipografi, sosyal medya ikonlari), `NaturalArticleGrid` (category-tagged gradient overlay kartlar, `natural-card-hover`, `natural-floating-button`)

Bu zenginlikler yeni section bilesenlerine tasinmali.

### Cozum: Template-Aware Section Bilesenleri

Her template icin ayri bilesen yazmak yerine, mevcut section bilesenlerini **template_id bazli varyantlarla** zenginlestirecegiz. Ancak bu karmasikligi onlemek icin daha iyi bir yaklasim: **template-spesifik CSS ve animasyonlari yeni bilesenlere tasimak**.

### Faz A: Section Bilesenlerini Zenginlestirme

**1. HeroCentered.tsx - Pilates kalitesine yukseltme**
- IntersectionObserver ile fade-in animasyonu ekle
- Glassmorphic blur efekti ve gradient katmanlari ekle
- `animate-fade-in` CSS class'ini kullan

**2. HeroOverlay.tsx - Lawyer kalitesine yukseltme**
- `framer-motion` ile sirali text animasyonlari (delay 0.2, 0.4, 0.6, 0.8)
- Parallax `backgroundAttachment: fixed` efekti
- Scroll indicator bounce animasyonu
- Tracking-wider uppercase subtitle stili

**3. ServicesGrid.tsx - FeatureCards kalitesine yukseltme**
- IntersectionObserver ile staggered fade-in (her kart 200ms gecikme)
- Gorsel hover efekti (scale-110, 700ms transition)
- Gradient overlay alt kisimda
- `aspect-[4/5]` gorsel orani

**4. StatisticsCounter.tsx - Sayi sayma animasyonu**
- IntersectionObserver tetiklemeli counter animasyonu
- Staggered giris efekti

**5. TestimonialsCarousel.tsx - Zenginlestirme**
- Fade-in animasyonu
- Alinti ikonu (") dekorasyon
- Avatar gorsel destegi

**6. NaturalArticleGrid.tsx - Mevcut hali zaten iyi**
- `natural-card-hover`, `natural-floating-button`, `natural-tag-*` CSS class'larini korumak icin `natural.css` stillerini `index.css` veya ayri bir dosyaya tasi

**7. NaturalHero.tsx - Mevcut hali zaten iyi**
- Serif tipografi, rounded containerlar korunuyor

**8. ImageGallery.tsx - TourGallery kalitesinde yeniden yaz**
- Sonsuz yatay scroll animasyonu (`@keyframes scrollGallery`)
- Koyu arka plan (bg-foreground)
- Gorsel hover scale efekti
- Caption overlay

### Faz B: Template CSS Dosyalarinin Tasimmasi

Template-spesifik CSS dosyalari yeni bilesenlerin de kullanabilmesi icin tasiyalim:

| Kaynak | Hedef | Icerik |
|--------|-------|--------|
| `src/templates/lawyer/styles/lawyer.css` | `src/styles/lawyer-sections.css` | Lawyer-spesifik animasyonlar ve hover efektleri |
| `src/templates/natural/styles/natural.css` | `src/styles/natural-sections.css` | Natural tag renkleri, card-hover, floating-button |
| Yeni | `src/styles/section-animations.css` | IntersectionObserver, staggered fade-in, scroll gallery keyframes |

Bu CSS dosyalari `index.css` icerisinden import edilecek.

### Faz C: Template Katalog Guncelleme (Faz 7)

`src/templates/catalog/index.ts`:
- `import type { ChaiThemeValues } from '@chaibuilder/sdk'` kaldirilir
- `getCatalogTheme` fonksiyonu `Record<string, any>` dondurur
- `templateToPreset` import'u kaldrilir; tema preset verileri dogrudan `definitions.ts` icine taslinir veya basitlesilmis bir `siteThemePresets` dosyasi olusturulur

### Faz D: deploy-to-netlify Guncelleme (Faz 6)

`supabase/functions/deploy-to-netlify/index.ts`:
- Mevcut `renderHeroCentered(b: ChaiBlock)` vb. fonksiyonlar zaten var ve `site_sections` ile de ayni prop yapisi kullanilir
- Ana `Deno.serve` handler'inda: `site_sections` varsa kullan, yoksa `chai_blocks`'a fallback
- Yeni `sectionsToHtml(sections, theme)` fonksiyonu ekle:
  ```
  sections.map(s => {
    switch(s.type) {
      case 'hero-centered': return renderHeroCentered(s.props);
      case 'hero-overlay': return renderHeroOverlay(s.props);
      ...
    }
  }).join('')
  ```
- `renderX` fonksiyonlarindaki animasyon CSS'lerini HTML `<style>` blogu icine ekle

### Faz E: Temizlik (Faz 9)

Silinecek dosya ve klasorler:
- `src/components/chai-builder/` (tum klasor - ~25 dosya)
- `src/components/grapes-editor/` (tum klasor - ~10 dosya)
- `src/styles/chaibuilder.tailwind.css`
- `tailwind.chaibuilder.config.ts`

Kaldirilacak paketler (`package.json`):
- `@chaibuilder/sdk`
- `grapesjs`
- `grapesjs-blocks-basic`
- `grapesjs-plugin-forms`
- `grapesjs-preset-webpage`

### Faz F: Template Kaynaklarinin Korunmasi

Eski `src/templates/` klasoru silinmeyecek, referans olarak tutulacak (ya da silinecekse once tum gorsel kalite yeni bilesenlere tasinmis olmali).

### Uygulama Sirasi

1. **Faz A** - Section bilesenlerini zenginlestir (en kritik: animasyonlar, efektler)
2. **Faz B** - CSS dosyalarini tasi ve import et
3. **Faz C** - Template catalog'dan ChaiBuilder tiplerini temizle
4. **Faz D** - deploy-to-netlify'i site_sections destegi ekle
5. **Faz E** - Eski ChaiBuilder/GrapesJS dosyalarini ve paketleri sil

### Teknik Detaylar

**Animasyon Stratejisi:**
- `framer-motion` zaten yuklu, `motion.div` ile `whileInView` animasyonlari kullanilacak
- Alternatif olarak IntersectionObserver + CSS animasyonlari (daha hafif, mevcut Pilates pattern'i)
- Her iki yontem de bilesenler arasinda tutarli olacak

**CSS Sinif Oneki:**
- Natural bloklari: `natural-*` (natural-card-hover, natural-floating-button, natural-tag-*)
- Lawyer bloklari: `lawyer-*` (lawyer-value-card, lawyer-practice-card, lawyer-scroll-indicator)
- Genel animasyonlar: `section-fade-in`, `section-stagger-*`

**Props Uyumu:**
- Yeni section bilesnlerinin `SectionComponentProps` arayuzu korunur
- Eski template bilesenlerindeki zengin gorsel efektler, ayni `props` ve `style` uzerinden kontrol edilir
- Ornegin `ImageGallery` icin: `props.galleryImages`, `props.captions` vb.
