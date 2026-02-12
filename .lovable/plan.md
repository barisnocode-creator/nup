

# Mobil ve Tablet Responsive Duzenleme

## Sorun
Mobil ekranlarda "Yayinla" (Publish) butonu ve diger UI elemanlari duzgun gorunmuyor. Tum uygulama genelinde mobil (375-414px) ve tablet (768-1024px) icin GitHub/modern platform standartlarinda responsive duzenleme yapilacak.

## Yapilacak Degisiklikler

### 1. EditorToolbar.tsx - Mobil Toolbar Duzeltmesi (EN KRITIK)
- Toolbar yuksekligini mobilde `h-12` (simdi h-14) yaparak yer kazandir
- Sol taraftaki butonlari mobilde daha kompakt yap (`gap-0.5` yerine `gap-1`)
- "Publish" butonundaki metni mobilde kisalt veya sadece ikon goster
- Preview butonunu mobilde sadece ikon olarak goster (zaten `hidden sm:inline` var ama Publish icin yok)
- Toolbar icerigini `overflow-x-auto` ile tasma durumunda kaydirabilir yap

### 2. PublishModal.tsx - Mobil Dialog Duzeltmesi
- Dialog genisligini mobilde `max-w-[95vw] sm:max-w-md` yap
- Ikon boyutunu mobilde `w-12 h-12` (simdi w-16 h-16)
- Baslik boyutunu `text-xl sm:text-2xl`
- Butonlari mobilde dikey yigila (`flex-col sm:flex-row`)
- URL gosterim alaninda `break-all` ve daha kucuk font
- `.openlucius.app` etiketini mobilde alt satira al

### 3. CreateWebsiteWizard.tsx - Wizard Mobil
- Dialog genisligini `max-w-[95vw] sm:max-w-lg`
- Chat alanini mobilde `h-[300px] sm:h-[400px]`
- Alt buton alanini mobilde daha kompakt padding

### 4. DashboardLayout.tsx - Ana Yerlesim
- Main padding: `p-4 sm:p-6 lg:p-8` (simdi `p-6 lg:p-8`)
- Header yuksekligi: `h-12 sm:h-14`
- Sign Out butonunda mobilde sadece ikon

### 5. Dashboard.tsx - Ana Sayfa
- Baslik: `text-2xl sm:text-3xl md:text-4xl` (simdi `text-3xl md:text-4xl`)
- Kart grid: `grid-cols-1 sm:grid-cols-2` (simdi `md:grid-cols-2`)
- New Website butonu mobilde `size="sm"`
- Empty state kartini `max-w-full sm:max-w-2xl mx-auto`

### 6. Hero.tsx - Landing Hero
- Baslik: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` (simdi `text-4xl md:text-5xl lg:text-6xl`)
- Alt baslik: `text-base sm:text-lg md:text-xl`
- CTA input alani mobilde dikey (`flex-col`)
- Trust badges: `gap-3 sm:gap-6`

### 7. Header.tsx - Landing Header
- Header yuksekligi: `h-14` (zaten 16, mobilde biraz fazla)
- Logo font: `text-lg sm:text-xl`
- Butonlari mobilde `size="sm"`

### 8. CTASection.tsx - CTA Bolumu
- Baslik: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- Input alani mobilde dikey yigilma

### 9. Analytics.tsx - Analitik Sayfasi
- Header butonlarini mobilde `flex-wrap gap-2`
- "Back to Editor" butonunda mobilde sadece ikon
- Stats grid: `grid-cols-2 sm:grid-cols-2 lg:grid-cols-4` (mobilde 2x2)
- Chart yuksekligi: `h-[200px] sm:h-[300px]`
- Baslik: `text-2xl sm:text-3xl`

### 10. Settings.tsx - Ayarlar Sayfasi
- Container padding: `p-4 sm:p-6`
- Baslik: `text-2xl sm:text-3xl`

### 11. HowItWorks.tsx - Adimlar
- Grid: `grid-cols-1 sm:grid-cols-3` (simdi `md:grid-cols-3`)
- Ikon boyutu mobilde biraz kucuk

### 12. Footer.tsx - Alt Bilgi
- Padding: `py-8 sm:py-12`
- Mobilde `flex-col` ortalama (zaten var)

### 13. GettingStartedChecklist.tsx - Checklist
- Item padding: `p-2 sm:p-3`

### 14. WebsitePreviewCard.tsx - Kart
- Onizleme yuksekligi: `h-36 sm:h-48`
- Globe ikon boyutu: `w-12 h-12 sm:w-16 sm:h-16`

## Teknik Yaklasim
- Sadece Tailwind responsive prefix'leri (`sm:`, `md:`, `lg:`) kullanilacak
- Hicbir yeni bagimlili eklenmeyecek
- Mevcut `useIsMobile()` hook'u (768px esik) ile uyumlu
- Tum degisiklikler mevcut stil yapisini bozmadan uygulanacak

