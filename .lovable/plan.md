
# Editor ve Yayinlanan Site Renk Uyumsuzlugu Duzeltmesi

## Sorunun Koku

Editorde gorulen site ile yayinlanan site arasinda renk farki var. Bunun nedeni 3 farkli render sistemi olmasi:

1. **Editor**: ChaiBuilder SDK tema renklerini CSS degiskenleri ile uyguluyor (dogru gorunuyor)
2. **Yayinlanan site (Netlify)**: `deploy-to-netlify` edge function'i bloklari HTML'e cevirirken sabit `text-indigo-600`, `bg-gray-50` gibi renkler kullaniyor - tema renklerini TAMAMEN yok sayiyor
3. **Uygulama ici onizleme**: `PublicWebsite.tsx` sayfasi `RenderChaiBlocks` bilesenine tema verisini gecirmiyor

## Cozum

### 1. deploy-to-netlify Edge Function - Tema Renklerini HTML'e Uygulama (EN KRITIK)

`blocksToHtml()` fonksiyonu simdi sadece 4 CSS degiskeni kullanyor:
```
primaryColor, fontFamily, bodyBg, bodyText
```

Bunu genisletip tum ChaiBuilder tema renklerini CSS degiskenlerine donusturecegiz. Boylece Tailwind CDN yerine tema bazli CSS degiskenleri ile calisacak.

Degisiklikler:
- `blocksToHtml()` icinde `chai_theme.colors` objesinden tum renkleri (primary, secondary, muted, accent, background, foreground, border, card vb.) CSS degiskenlerine donustur
- Blok renderer fonksiyonlarindaki sabit renkleri (`text-indigo-600` -> `text-[var(--primary)]`, `bg-gray-50` -> `bg-[var(--muted)]`) CSS degiskenleriyle degistir
- Her blok tipi icin (HeroCentered, ServicesGrid, ContactForm, AboutSection vb.) sabit renk referanslarini kaldir
- HTML sablonunun `<style>` bolumune tema renklerini CSS custom properties olarak ekle

### 2. PublicWebsite.tsx - Tema Verisini Gecirme

`RenderChaiBlocks` bilesenine `chai_theme` verisini gecir. Ayrica tema CSS degiskenlerini sayfaya enjekte et:

- `project.chai_theme` verisinden CSS degiskenlerini olustur
- Bunlari bir `<style>` etiketi veya inline style ile `:root` seviyesinde uygula
- Boylece uygulama ici onizleme de editorle ayni renklerde gorunur

### 3. Blok Renderer Guncellemeleri (deploy-to-netlify icinde)

Her blok renderer fonksiyonundaki sabit renkler:

| Eski (Sabit) | Yeni (Tema Bazli) |
|---|---|
| `text-indigo-600` | CSS degiskeni `color: var(--primary)` |
| `bg-gray-50` | CSS degiskeni `background: var(--muted)` |
| `bg-white` | CSS degiskeni `background: var(--background)` |
| `text-gray-600` | CSS degiskeni `color: var(--muted-foreground)` |
| `text-gray-900` | CSS degiskeni `color: var(--foreground)` |
| `bg-indigo-600` | CSS degiskeni `background: var(--primary)` |
| `border-gray-300` | CSS degiskeni `border-color: var(--border)` |

Bu degisiklik tum 10 blok tipini etkiler: HeroCentered, StatisticsCounter, AboutSection, ServicesGrid, TestimonialsCarousel, ImageGallery, FAQAccordion, ContactForm, CTABanner, PricingTable.

## Dosya Degisiklikleri

| Dosya | Degisiklik |
|---|---|
| `supabase/functions/deploy-to-netlify/index.ts` | Tum blok renderer'larda sabit renkleri CSS degiskenleriyle degistir, `blocksToHtml` fonksiyonunda tema renklerini CSS custom properties olarak cikart |
| `src/pages/PublicWebsite.tsx` | `chai_theme` verisini CSS degiskenleri olarak sayfaya enjekte et |

## Sonuc

Bu degisiklikten sonra:
- Editorde gordugunuz renkler = Yayinlanan sitedeki renkler = Uygulama ici onizlemedeki renkler
- Kullanici hangi tema presetini secerse secsin (turuncu, mavi, yesil, koyu vb.) yayinlanan site ayni renkleri kullanir
- "2 farkli site" sorunu tamamen ortadan kalkar
