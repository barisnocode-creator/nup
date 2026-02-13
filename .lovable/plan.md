

# Prompt 3: Mobil Duyarlilik Iyilestirmeleri ve Animasyon Optimizasyonu

## Ozet

Template galerisi overlay'i ve onizleme banner'i su anda sadece masaustu icin optimize edilmis durumda. Bu prompt'ta her iki bileseni mobil ve tablet ekranlar icin uyumlu hale getirecek, animasyonlari performans acisindan iyilestirecek ve dokunmatik etkilesimi gelistirecegiz.

## Degisiklikler

### 1. TemplateGalleryOverlay.tsx - Mobil Uyumluluk

**Sorunlar:**
- Kartlar sabit 280px genislikte, mobilde ekrani tasiriyor
- Header padding'leri mobilde buyuk
- Yatay scroll alani mobilde yeterli alan birakmiyar
- Canli template render (1200px scaled) mobilde gereksiz agir

**Cozumler:**

- Kart genisligini responsive yap: mobilde ~200px, tablette ~240px, masaustunde 280px
- Mobilde canli render yerine statik preview gorseli kullan (performans icin)
- Header padding'lerini responsive yap: `px-4 md:px-6`
- Kartlar arasi boslugu responsive yap: `gap-3 md:gap-5`
- Touch scroll icin `-webkit-overflow-scrolling: touch` ekle
- Kart hover overlay'ini mobilde `opacity-100` yap (hover olmadigi icin her zaman gorunsun, kucuk bir "Onizle" butonu)
- Mobilde scroll snap ekle: `scroll-snap-type: x mandatory`, her kart `scroll-snap-align: start`

**Mobil kart davranisi:**
- Hover yerine, her kartın altindaki bilgi alanina kucuk bir "Onizle" butonu eklenir
- "Kullanilan" badge'i boyutu kucultulur

### 2. TemplatePreviewBanner.tsx - Mobil Uyumluluk

**Sorunlar:**
- Banner icerigi `flex items-center justify-between` ile tek satira sikistiriliyor
- Mobilde ikon + metin + 2 buton sığmıyor
- Font boyutlari ve padding'ler buyuk

**Cozumler:**

- Mobilde layout'u dikey yap: ust satir ikon + template adi, alt satir butonlar
- `flex-wrap` ile tasmayi onle
- Buton boyutlarini mobilde kucult
- Eye ikonu mobilde gizle, sadece metin goster
- `py-2 md:py-3` ve `px-3 md:px-4` responsive padding

### 3. Animasyon Optimizasyonlari

**Overlay giris/cikis:**
- Mevcut: `x: '-100%' -> '0%'` (tum sayfa kaydirma, mobilde agir olabilir)
- Iyilestirme: `will-change: transform` ekle, mobilde `opacity` ile birlikte kullan
- `transition` suresini mobilde biraz kisalt (250ms)

**Kart hover:**
- `group-hover:scale-[1.02]` yerine `transform: translateY(-2px)` kullan (daha hafif)
- `will-change: transform, box-shadow` ekle

**Banner:**
- Banner'a giris animasyonu ekle: yukaridan asagi `translateY(-100%) -> 0` ile 200ms

### 4. Safe Area ve Touch Destegi

- Overlay: `padding-top: env(safe-area-inset-top)` (notch'lu telefonlar)
- Scroll alani: `padding-bottom: env(safe-area-inset-bottom)`
- Kartlara `touch-action: pan-x` ekle (yatay swipe'i kolaylastir)
- Scroll container'a `overscroll-behavior-x: contain` ekle (sayfa scroll'unu engelle)

## Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `TemplateGalleryOverlay.tsx` | Guncelle | Responsive kart boyutlari, mobil scroll snap, touch destegi, mobilde statik gorsel |
| `TemplatePreviewBanner.tsx` | Guncelle | Responsive layout, mobilde dikey yigilma, kucuk butonlar |

## Teknik Detaylar

### TemplateGalleryOverlay.tsx Degisiklikleri

```text
Responsive kart boyutlari:
- Mobil (<640px):  CARD_WIDTH = 200, canli render YOK (statik gorsel)
- Tablet (640-1024px): CARD_WIDTH = 240, canli render VAR
- Masaustu (>1024px): CARD_WIDTH = 280, canli render VAR
```

- `useIsMobile()` hook'u import edilecek (mevcut `src/hooks/use-mobile.tsx`)
- Ek olarak tablet kontrolu icin `window.innerWidth` kullanilacak
- Mobilde `TemplateCard` icinde `TemplateComponent` yerine `<img src={template.preview}>` render edilecek
- Scroll container'a `scroll-snap-type: x mandatory` ve kartlara `scroll-snap-align: start` eklenecek
- Mobilde hover overlay kaldirilacak, bunun yerine kart altina kucuk "Onizle" butonu eklenecek

### TemplatePreviewBanner.tsx Degisiklikleri

```text
Masaustu:  [Eye] Onizleniyor: Template Adi     [Iptal] [Uygula]
Mobil:     Onizleniyor: Template Adi
           [Iptal] [Uygula]
```

- `flex-col sm:flex-row` ile responsive layout
- Butonlar: `w-full sm:w-auto` ile mobilde tam genislik
- `py-2 sm:py-3` responsive padding
- Eye ikonu: `hidden sm:flex` ile mobilde gizle

