

## Randevu Alma UI/UX Birlestirme: Sik Gorunum + Gercek Sistem Entegrasyonu

### Sorun

Sistemde iki ayri randevu bileseni var:

1. **`AppointmentBooking`** — Backend'e baglanir, gercek slot'lari gosterir, form validation yapar. Gorunumu is gorur ama "adimli" degil.
2. **`DentalBooking`** — Gorsel olarak sik (3 adimli step indicator, animasyonlu gecisler) ama tamamen statik. Backend'e hicbir sekilde baglanmiyor, sabit saatler gosteriyor.

### Cozum

`DentalBooking`'i tamamen yeniden yazarak `AppointmentBooking`'in backend mantgini (slot sorgulama, form fields, anti-spam, consent, submit) premium bir 3 adimli UI icine yerlestirmek.

### Yeni DentalBooking Akisi

```text
Adim 1: Tarih Sec          Adim 2: Saat Sec          Adim 3: Bilgilerin
+------------------+       +------------------+       +------------------+
| [< Hafta ileri >]|       | Musait Saatler   |       | Ad Soyad *       |
| Pzt Sal Car Per..|       | 09:00  09:30     |       | E-posta *        |
| [17] [18] [19]...|       | 10:00  10:30     |       | Telefon          |
|                  |       | 14:00  14:30     |       | Not              |
| Secili: 19 Ocak  |       | (30 dk slotlar)  |       | [x] KVKK Onayi  |
+------------------+       +------------------+       +------------------+
     Step 1/3                   Step 2/3                   Step 3/3
```

### Teknik Detaylar

**`src/components/sections/DentalBooking.tsx` — Tamamen Yeniden Yazim**

Mevcut `AppointmentBooking`'den alinacak backend mantiklari:
- `window.__PROJECT_ID__` ve `window.__SUPABASE_URL__` uzerinden proje tanimlamasi
- `book-appointment` edge function'a GET istegi ile musait slot'lari sorgulama
- Haftalik paralel slot kontrolu (`checkedWeeks` + `weekOffset`)
- Musait olmayan gunleri otomatik devre disi birakma (`unavailableDates`)
- Dinamik form alanlari (`formFields`) — backend'den gelen custom field'lar
- KVKK onayi (consent) kontrolu
- Honeypot anti-spam koruması
- Form yuklenme zamani kontrolu (3 saniye alt sinir)
- POST istegi ile randevu olusturma

DentalBooking'e ozel premium UI ozellikleri:
- **3 adimli step indicator** — Tarih > Saat > Bilgiler (pill seklinde, ikonlu, animasyonlu gecis)
- **DateStrip** — Yatay haftalik takvim seridi (7 gun gorunumu, saga/sola kaydir)
- **Slot grid** — 2 veya 3 sutunlu kart gorunumunde saat secimi (secilenin scale + shadow animasyonu)
- **Form alanlari** — Glassmorphism kartlar icinde, input focus animasyonlari
- **Basarili gonderim** — Konfeti/check animasyonu ile onay ekrani
- **Skeleton loading** — Slot'lar yuklenirken animasyonlu placeholder'lar
- **Editorde onizleme** — `isEditing` modunda statik demo gorunumu (backend sorgusu yapmaz)

**Mevcut `AppointmentBooking` etkilenmez** — O ayri bir section olarak kalmaya devam eder. Kullanicilar iki farkli gorunumden birini secebilir.

### Animasyon Detaylari (Framer Motion)

- Step gecisleri: `AnimatePresence mode="wait"` ile sola/saga kayma
- Step indicator: aktif adim `scale-110` + `shadow-lg` + `bg-primary`
- Tarih secimi: secilen gun `scale-105` + `shadow-lg` spring animasyonu
- Slot secimi: secilen saat `bg-primary` + `scale-[1.02]` gecisi
- Form alanlari: `initial={{ opacity: 0, y: 20 }}` ile alt'tan yukari fade-in
- Basari ekrani: `CheckCircle2` ikonu `scale(0) -> scale(1)` spring bounce

### Dosya Degisiklikleri

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/sections/DentalBooking.tsx` | Tamamen yeniden yazim — backend entegrasyonu + premium UI |

### Onemli Notlar

- `AppointmentBooking` section'i aynen kalir (farkli bir UI alternatifi olarak)
- `DentalBooking` artik gercek randevu sistemiyle calisir
- Editor modunda (`isEditing=true`) backend sorgusu yapilmaz, statik demo gosterilir
- Tema renkleri (`bg-primary`, `text-primary-foreground` vb.) kullanilir — her temada uyumlu gorunur
- `font-heading-dynamic` ve `font-body-dynamic` siniflari kullanilir

