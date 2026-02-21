

# Editorde Icerik Kalitesi, Gorsel Boyutlandirma ve Sticky Header Iyilestirmeleri

## Mevcut Sorunlar

### 1. Header scroll davranisi
SiteHeader `sticky top-14` ile konumlandiriliyor (EditorToolbar 56px yuksekliginde). Ancak EditorCanvas icinde scroll olan konteyner `overflow-auto` ile calistigindan, `sticky` dogrudan calismayabilir. Ayrica template'de bos bolumler olunca header "havada" kaliyor — header her zaman tarayici tavaninda (toolbar hemen altinda) sabit kalmali.

### 2. Gorsel boyutlandirma sorunu
Template hero ve galeri gorsellerinde `object-cover` kullaniliyor ancak bazi bilesenler (CafeGallery, ImageGallery) resim boyutlarini kontrol etmiyor. Unsplash URL'lerinde `w=600&q=80` parametreleri var ama render sirasinda farkli boyutlarda goruntuleniyor.

### 3. Site adi ve navigasyon
SiteHeader'a `siteName` geciliyor ancak bu deger bazen bos geliyor veya "Site" fallback'i gorunuyor. `projectName` her zaman EditorCanvas'tan gecirilmeli.

---

## Yapilacak Degisiklikler

### Adim 1: SiteHeader — `sticky` davranisini duzelt

**Dosya:** `src/components/sections/addable/SiteHeader.tsx`

- `sticky top-14` yerine `sticky top-0` kullanilacak (cunku header zaten EditorCanvas scroll konteynerinin icinde)
- EditorCanvas icindeki scroll konteyner `position: relative` oldugu icin sticky bu konteyner icinde calisacak
- Bos bolum olsa bile header her zaman gorunur alanda kalacak

### Adim 2: EditorCanvas — Header icin scroll konteyner duzeltmesi

**Dosya:** `src/components/editor/EditorCanvas.tsx`

- SiteHeader'in `sticky` calismasi icin EditorCanvas'taki ust `div` (`flex-1 overflow-auto`) yapisi korunacak
- Header'a `projectName`, `phone` (contactSection'dan) ve diger bilgiler gecirilecek
- Ic konteyner (`min-h-screen mx-auto`) icinde header'in `sticky top-0 z-40` ile tavana yapismasini saglayacak duzenleme

### Adim 3: Hero bilsenleri — `min-h-[calc(100vh-7rem)]` duzeltmesi

**Dosyalar:** `HeroCafe.tsx`, `HeroRestaurant.tsx`, `HeroHotel.tsx`, `HeroMedical.tsx`, `HeroPortfolio.tsx`, `HeroDental.tsx`

- Hero bilsenlerinin yuksekligi `min-h-[calc(100vh-7rem)]` kullaniliyor. Toolbar (56px) + SiteHeader (56px) = 112px = 7rem. Bu dogru.
- Ancak bazi hero bilsenlerinde bu deger eksik veya farkli. Tutarlilik saglanacak.

### Adim 4: Gorsel boyutlandirma

**Dosyalar:** `CafeGallery.tsx`, `ImageGallery.tsx`, `ChefShowcase.tsx`, `RoomShowcase.tsx`, `ProjectShowcase.tsx`

- Tum gorsel konteynerleri `aspect-ratio` veya sabit yukseklik (`h-64`, `h-80`) ile kontrol edilecek
- `object-cover` sinifi tum gorsel etiketlerine eklenecek (eksik olanlara)
- Unsplash URL parametreleri `w=800&q=80` olarak standardize edilecek

### Adim 5: SiteHeader'a daha fazla veri gecisi

**Dosya:** `src/components/editor/EditorCanvas.tsx`

- Header section props'una `phone` ve `ctaLabel` bilgileri de eklenecek
- `sections` prop'u zaten geciliyor, header bundan nav ogelerini otomatik olusturuyor
- `siteName` bos geldiginde `projectName` fallback'i zaten mevcut, bu pekistirilecek

### Adim 6: Bos alan sorunu — minimum icerik yuksekligi

**Dosya:** `src/components/editor/EditorCanvas.tsx`

- Ic konteyner `min-h-screen` zaten var
- Bos bolumler filtrelendikten sonra sayfa kisa kalirsa footer'in sayfanin altina itilmesini saglayacak `flex flex-col` + `flex-grow` yapisi eklenecek
- Bu sayede header tavanda, footer tabanda kalir ve aradaki bosluk dogal sekilde dolar

---

## Degistirilecek Dosyalar

| Dosya | Degisiklik |
|---|---|
| `src/components/sections/addable/SiteHeader.tsx` | `sticky top-0` (canvas icinde calismasi icin), z-index duzeltmesi |
| `src/components/editor/EditorCanvas.tsx` | Header/Footer icin layout duzeltmesi, `flex flex-col` + `min-h-screen`, phone/ctaLabel prop gecisi |
| `src/components/sections/HeroCafe.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/HeroRestaurant.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/HeroHotel.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/HeroMedical.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/HeroPortfolio.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/HeroDental.tsx` | min-h tutarliligi kontrolu |
| `src/components/sections/CafeGallery.tsx` | Gorsel aspect-ratio + object-cover kontrolu |
| `src/components/sections/ImageGallery.tsx` | Gorsel boyut standardizasyonu |
| `src/components/sections/RoomShowcase.tsx` | Gorsel boyut standardizasyonu |
| `src/components/sections/ProjectShowcase.tsx` | Gorsel boyut standardizasyonu |
| `src/components/sections/ChefShowcase.tsx` | Gorsel boyut standardizasyonu |

---

## Teknik Detaylar

### Sticky Header Cozumu
```
EditorCanvas (overflow-auto, relative)
  |-- ic konteyner (min-h-screen, flex flex-col)
       |-- SiteHeader (sticky top-0 z-40)   <- scroll ederken tavanda kalir
       |-- sections (flex-1)                  <- icerik alani
       |-- SiteFooter                         <- her zaman en altta
```

### Gorsel Standardizasyonu
- Hero gorselleri: `w-full h-full object-cover` (konteyner min-h ile kontrol)
- Galeri gorselleri: `aspect-[4/3] object-cover rounded-lg`
- Kart gorselleri: `h-48 sm:h-56 object-cover`
- Avatar/profil gorselleri: `aspect-square object-cover rounded-full`

---

## Beklenen Sonuc

- Site header (site adi + navigasyon) aşagı kaydirirken her zaman tarayicinin ustunde sabit kalir
- Bos bolumler oldugunda header "havada" kalmaz, tavana yapismis sekilde durur
- Tum gorseller dogru boyutta ve oranda gorunur
- Footer her zaman sayfanin en altinda yer alir
- Template ve icerik secimi kullanicinin sektor/meslek bilgisine gore otomatik yapilir (zaten mevcut — generate-website edge function'daki `selectTemplate` + `sectorProfiles`)
