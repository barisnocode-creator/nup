

# Uygulama Genelinde Gorsel Duzenleme ve UI Iyilestirme

## Sorun

Ekran goruntusunde gorulen ana sorunlar:
- Wizard dialog'u acildiginda arka plan icerikle karisik gorunuyor (z-index ve overlay sorunu)
- Dashboard kartlarinda gorsel tutarsizliklar var
- Genel UI'da sik ve modern bir goruntu eksik
- Gecisler ve animasyonlar yetersiz

## Yapilacak Degisiklikler

### 1. Dialog/Modal Duzeltmeleri
- `CreateWebsiteWizard` dialog'una daha belirgin `backdrop-blur` ve koyu overlay ekle
- Dialog icerigi icin daha iyi `border-radius`, `shadow` ve padding ayarlari
- Dialog acilip kapanirken daha yumusak animasyon gecisleri

### 2. Dashboard Sayfasi (Dashboard.tsx)
- Karsilama bolumune ince gradient arka plan ekle
- Proje kartlari arasinda tutarli bosluk ve hover animasyonlari
- Bos durum kartini daha dikkat cekici hale getir (gradient border, ikon animasyonu)

### 3. WebsitePreviewCard Iyilestirmeleri
- Kart hover efektini gelistir (scale + shadow + border renk degisimi)
- Onizleme alanina daha iyi gradient ve pattern
- Status badge'lerine animasyon ekle
- Kart iceriginde daha iyi tipografi hiyerarsisi

### 4. AI Chat Step (Wizard) Gorsel Iyilestirme
- Mesaj balonlarini daha modern hale getir (daha yumusak koseleri, golge)
- Bot ikonu icin gradient arka plan
- Mesaj gecislerinde fade-in animasyonu
- Progress bar'a gradient efekti
- Input alanina focus ring ve ince golge

### 5. DashboardLayout ve Sidebar
- Sidebar gecislerini yumusatir
- Header'a ince alt golge (`shadow-sm`) ekle
- Icerik alanlari arasinda daha iyi gorsel ayrim

### 6. GettingStartedChecklist Iyilestirmeleri
- Tamamlanan adimlar icin yesil tik animasyonu
- Hover durumunda ok ikonu kaydirma animasyonu
- Progress bar'a gradient

### 7. Landing Sayfasi Gorsel Ince Ayarlar
- Hero bolumune ince arka plan deseni/gradient
- Butonlara hover animasyonlari
- Kartlara giris animasyonlari (staggered fade-in)

### 8. Analytics, Settings, Help, Studio Sayfalari
- Tum sayfalarda tutarli kart stilleri
- Sayfa basliklarinda tutarli tipografi
- Kartlara hover efektleri ve gecis animasyonlari

### 9. Genel CSS Iyilestirmeleri (index.css)
- Yeni utility siniflar: `card-hover`, `glass-panel`, `gradient-border`
- Genel gecis surelerini duzenle (tum interaktif elemanlar icin `transition-all duration-200`)
- ScrollArea icin ozel scrollbar stilleri

## Teknik Detaylar

- Tum animasyonlar Tailwind siniflarindan ve mevcut `tailwind.config.ts` keyframe'lerden turetilecek
- Framer Motion'daki `motion` bilesenleri sadece kritik giris animasyonlari icin kullanilacak
- `cn()` utility ile mevcut siniflarla uyumlu sekilde yeni stiller eklenecek
- Radix UI dialog overlay z-index degerleri dogrulanacak ve gerekirse arttirilacak
- `backdrop-blur` kullanimi performans icin dikkatli uygulanacak
- Mobil uyumluluk tum degisikliklerde korunacak

