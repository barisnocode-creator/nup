
# Mobil ve Tablet Yerlesim Duzeltmesi

## Sorun
Mobil (375-414px) ve tablet (768-1024px) gorunumlerinde icerik ortalanma, bosluk ve olculer GitHub gibi platformlardaki standartlara uygun degil. Kartlar, header, sidebar ve icerik alanlari icin ideal responsive olculer uygulanmali.

## Referans Olculer (GitHub/Modern Platform Standartlari)

```text
Mobil (< 768px):
  - Container padding: 16px (px-4)
  - Kart grid: tek sutun (grid-cols-1)
  - Baslik: 24-28px (text-2xl)
  - Icerik genisligi: %100 ekran - 32px padding
  - Header yuksekligi: 48-56px
  - Alt bosluk: 16-24px

Tablet (768-1024px):
  - Container padding: 24-32px (px-6 / px-8)
  - Kart grid: 2 sutun (md:grid-cols-2)
  - Baslik: 28-32px (md:text-3xl)
  - Icerik genisligi: max-w-3xl (ortalanmis)
  - Sidebar: gizli, Sheet ile acilir
  - Header yuksekligi: 56px

Masaustu (> 1024px):
  - Container padding: 32-48px
  - max-w-6xl ortalanmis icerik
  - Sidebar: gorunur, 256px
```

## Yapilacak Degisiklikler

### 1. DashboardLayout.tsx - Ana Yerlesim
- Mobilde main padding'i `p-4` (simdi p-6), tablette `md:p-6`, masaustunde `lg:p-8`
- Header yuksekligi mobilde `h-12`, tablette `h-14`
- Right panel tablet eşigini `xl:block` olarak koru (zaten oyle)
- Header icindeki butonlara `text-xs sm:text-sm` responsive metin boyutu

### 2. DashboardSidebar.tsx - Yan Menu
- Mobilde Sheet ile aciliyor (sidebar.tsx bunu zaten hallediyor)
- Sidebar genisligi mobilede 18rem (standart, iyi)
- Logo alani ve nav item'lara mobil icin daha kompakt padding
- Upgrade kartinda mobil icin daha kucuk font ve padding

### 3. Dashboard.tsx - Ana Sayfa
- Karsilama basligini `text-2xl sm:text-3xl md:text-4xl` yap
- Kart grid'i `grid-cols-1 sm:grid-cols-2` yap (mobilde tek sutun)
- Empty state kartini `max-w-full sm:max-w-2xl mx-auto` ortalanmis yap
- Mobil checklist bolumune ust bosluk ayari
- Projects section basligini ve butonunu mobilde daha kompakt

### 4. WebsitePreviewCard.tsx - Proje Kartlari
- Onizleme alanini mobilde `h-36` (simdi h-48), tablette `sm:h-48`
- Globe ikonunu mobilde `w-12 h-12` (simdi w-16 h-16)
- Kart footer'da butonlari mobilde `size="sm"`

### 5. Hero.tsx (Landing) - Mobil Optimizasyon
- Baslik boyutunu `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` yap
- Alt metin `text-base sm:text-lg md:text-xl`
- Input CTA alanini mobilde tam genislik, dikey yigilan
- Trust badges'i mobilde `gap-3` (simdi gap-6)

### 6. Header.tsx (Landing) - Mobil Header
- Header yuksekligi `h-14 sm:h-16`
- Logo font boyutu `text-lg sm:text-xl`
- Auth butonlarinda mobilde `size="sm"`

### 7. Features.tsx - Ozellik Kartlari
- Grid'i `grid-cols-1 md:grid-cols-2` (mobilde tek sutun - zaten oyle)
- Kart ici padding'i `p-4 sm:p-6 md:p-8`
- Alt text boyutlari responsive

### 8. HowItWorks.tsx - Adimlar
- Grid'i `grid-cols-1 sm:grid-cols-3` yap
- Adim ikonunu mobilde biraz kucult
- Section basligini responsive

### 9. Analytics.tsx - Analitik Sayfasi
- Header'daki butonlari mobilde `flex-wrap` ve `gap-2`
- Stats grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Chart yuksekligini mobilde `h-[200px] sm:h-[300px]`
- Alt grid'leri `grid-cols-1 sm:grid-cols-2`

### 10. Settings.tsx - Ayarlar Sayfasi
- Container padding `p-4 sm:p-6`
- Tab trigger'lari mobilde sadece ikon goster (zaten hidden sm:inline var, iyi)

### 11. CreateWebsiteWizard.tsx - Wizard Modali
- Dialog genisligini mobilde `max-w-[95vw] sm:max-w-lg` yap
- Chat alani yuksekligini mobilde `h-[350px] sm:h-[400px]`
- Input alani mobilde daha kompakt

### 12. Footer.tsx - Alt Bilgi
- Mobilde flex-col ortalama (zaten oyle)
- Padding'i `py-8 sm:py-12`

### 13. CTASection.tsx - CTA Bolumu
- Baslik boyutunu `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- Input CTA alanini mobilde tek sutun

### 14. GettingStartedChecklist.tsx
- Item padding'i `p-2 sm:p-3`
- Metin boyutlarini mobile uyumlu tut

## Teknik Detaylar

- Tum degisiklikler Tailwind responsive prefix'leri (`sm:`, `md:`, `lg:`, `xl:`) ile yapilacak
- `useIsMobile()` hook'u 768px esigini kullaniyor, bu GitHub standartlariyla uyumlu
- Sidebar zaten mobilde Sheet olarak aciliyor (sidebar.tsx icinde)
- Container genislikleri `container mx-auto` ile GitHub tarzinda ortalanacak
- Kartlarda `max-w` ve `mx-auto` ile ortalama saglanacak
- Tum font boyutlari mobilde bir kademe kucuk olacak
