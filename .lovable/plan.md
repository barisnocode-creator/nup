
# Randevu Sistemi - Kapsamli UI/UX Iyilestirmesi

Mevcut randevu panelini Cal.com ilhamli modern, animasyonlu ve surukle-birak destekli bir sisteme donusturecegiz.

---

## 1. Cal.com Tarzi Modern UI Tasarimi

### Genel Bakis Kartlari (Overview Cards)
- Mevcut duz kartlar yerine glassmorphism efektli, gradient arka planli ve hover'da hafif yukari kayma animasyonlu kartlar
- Her kartta kucuk bir trend gostergesi (ornegin son 7 gune gore artis/azalis oku)
- Framer Motion ile staggered fade-in animasyonu (kartlar sirayla belirsin)

### Takvim Gorunum Degistirici
- Mevcut kucuk butonlar yerine daha buyuk, yumusak koselikli segment control tarzi gorsel degistirici
- Aktif gorunumde gradient arka plan ve yumusak gecis animasyonu

### Randevu Kartlari (AppointmentCard)
- Sol kenarda durum rengine gore dikey cizgi (confirmed=yesil, pending=turuncu, cancelled=kirmizi)
- Hover'da scale(1.02) ve hafif golge artisi
- Avatar/baslangic harfi icin gradient renkli daire
- Durum degistirme butonlarina tooltip eklenmesi
- Acilir detay bolumu icin akici animasyon (framer-motion layout)

### Renk ve Tipografi
- Mevcut amber/emerald renk semasi korunacak ama daha rafine tonlar
- Font boyutlari ve araliklar Cal.com tarzinda daha ferah

---

## 2. Framer Motion Animasyonlari

### Sayfa Gecisleri
- Tab degistirmede fade + slide animasyonu
- Liste ogelerinde staggered animasyon (her kart 50ms arayla belirsin)

### Takvim Animasyonlari
- Ay/hafta gecislerinde yatay slide animasyonu (ileri giderken saga, geri giderken sola kayma)
- Gune tiklandiginda gunluk gorunume genis acilma efekti

### Mikro Animasyonlar
- Durum degistirmede (onayla/iptal) basarili aksiyonda hafif pulse efekti
- Yeni randevu olusturuldigunda kart icin bounce-in animasyonu
- Bos durum ikonlarinda yumusak float animasyonu

---

## 3. Drag & Drop Takvim

### Haftalik ve Gunluk Gorunumde Surukleme
- `@hello-pangea/dnd` kutuphanesi (zaten projede yuklu) ile randevulari zaman dilimleri arasinda surukleyerek tasima
- Surukleme sirasinda orijinal konumda hayalet kart, hedefte mavi vurgulu alan
- Biraktiginda veritabaninda `start_time`, `end_time` ve gerekirse `appointment_date` guncellenmesi

### Gorsel Geri Bildirim
- Suruklenebilir kartlarda sol ust kosede grip ikonu (6 nokta)
- Suruklerken kartin hafif dondurulmesi ve opaklik azalmasi
- Gecerli birakma alanlari yesil, gecersiz alanlar (kapali slotlar) kirmizi kenarlma

---

## 4. Diger Iyilestirmeler

### Aylık Gorunumde Mini Onizleme
- Gune hover'da kucuk popup ile o gunun randevularinin ozet listesi

### Bos Durum (Empty State) Tasarimi
- Randevu yokken guzel bir illustrasyon ve "Ilk randevunuzu olusturun" aksiyonu

### Toolbar Iyilestirmesi
- Arama alaninda live autocomplete efekti
- "Bugun" butonuna vurgu animasyonu (pulse)

---

## Teknik Detaylar

### Degisecek Dosyalar
1. `src/components/dashboard/appointments/AppointmentsPanel.tsx` - Ana layout, overview kartlari, tab gecis animasyonlari
2. `src/components/dashboard/appointments/AppointmentCard.tsx` - Kart tasarimi, hover/animasyon, durum gostergesi
3. `src/components/dashboard/appointments/MonthlyView.tsx` - Hover popup, animasyonlu gun gecisleri
4. `src/components/dashboard/appointments/WeeklyView.tsx` - Drag & drop entegrasyonu, modernize grid
5. `src/components/dashboard/appointments/DailyView.tsx` - Drag & drop entegrasyonu, animasyonlar
6. `src/components/dashboard/appointments/AgendaView.tsx` - Staggered liste animasyonlari
7. `src/components/dashboard/appointments/CalendarToolbar.tsx` - Modern segment control, animasyonlar
8. `src/components/dashboard/appointments/CreateAppointmentModal.tsx` - Modal animasyonu

### Kullanilacak Kutuphaneler (hepsi zaten yuklu)
- `framer-motion` - Tum animasyonlar icin
- `@hello-pangea/dnd` - Drag & drop islevi icin
- Mevcut shadcn/ui bilesenleri - Tooltip, Popover eklentileri

### Veritabani Degisikligi
- Drag & drop icin mevcut `manage-appointments` edge function yeterli (start_time/end_time/appointment_date guncelleme)
- Yeni tablo veya kolon gerekmez
