

# Randevu Sistemi - Otomatik Provizyon ve Entegrasyon

## Genel Bakis

Her yeni olusturulan web sitesine otomatik olarak gomulu bir randevu alma modulu eklenecek. Doktor, psikolog, fitness egitmeni, ogretmen gibi hizmet saglayicilari icin musterilerinden randevu toplayabilecekleri bir sistem.

## Veritabani Mimarisi

3 yeni tablo olusturulacak:

### 1. appointment_settings (Proje bazli ayarlar)

| Sutun | Tip | Aciklama |
|-------|-----|----------|
| id | uuid | PK |
| project_id | uuid | FK -> projects |
| user_id | uuid | Sahiplik (RLS) |
| is_enabled | boolean | Randevu sistemi acik/kapali |
| timezone | text | Ornek: "Europe/Istanbul" |
| slot_duration_minutes | integer | Varsayilan: 30 |
| buffer_minutes | integer | Randevular arasi bosluk: 0 |
| working_days | jsonb | [1,2,3,4,5] (Pazartesi-Cuma) |
| working_hours_start | text | "09:00" |
| working_hours_end | text | "18:00" |
| lunch_break_start | text | "12:00" (nullable) |
| lunch_break_end | text | "13:00" (nullable) |
| max_advance_days | integer | Kac gun ileriye randevu alinabilir: 30 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 2. appointments (Alinan randevular)

| Sutun | Tip | Aciklama |
|-------|-----|----------|
| id | uuid | PK |
| project_id | uuid | FK -> projects |
| client_name | text | Musteri adi |
| client_email | text | Musteri e-posta |
| client_phone | text | Musteri telefon (nullable) |
| client_note | text | Musteri notu (nullable) |
| appointment_date | date | Randevu tarihi |
| start_time | text | "14:00" |
| end_time | text | "14:30" |
| status | text | "pending", "confirmed", "cancelled" |
| timezone | text | Olusturulma anindaki timezone |
| created_at | timestamptz | |

### 3. blocked_slots (Tatil/kapalı gunler)

| Sutun | Tip | Aciklama |
|-------|-----|----------|
| id | uuid | PK |
| project_id | uuid | FK -> projects |
| user_id | uuid | Sahiplik (RLS) |
| blocked_date | date | Kapatilan tarih |
| reason | text | "Tatil", "Ozel gun" vb. (nullable) |
| created_at | timestamptz | |

## Sektor Bazli Varsayilan Ayarlar

Proje olusturulurken `profession` alanina gore otomatik varsayilanlar:

```text
service (danismanlik):  Pzt-Cum, 09:00-18:00, 60dk slot
food (restoran):        Pzt-Paz, 10:00-22:00, 120dk slot (rezervasyon)
creative (tasarim):     Pzt-Cum, 10:00-19:00, 45dk slot
technology (yazilim):   Pzt-Cum, 09:00-18:00, 30dk slot
retail (magaza):        Pzt-Cmt, 09:00-20:00, 30dk slot
other:                  Pzt-Cum, 09:00-18:00, 30dk slot
```

## Cakisma Onleme Modeli

Yeni randevu olusturulurken bir Edge Function su kontrolleri yapar:

1. Secilen tarih `blocked_slots` tablosunda mi? -> Reddet
2. Secilen gun `working_days` dizisinde mi? -> Reddet
3. Secilen saat `working_hours_start` - `working_hours_end` araliginda mi? -> Reddet
4. Oglen arasi ile cakisiyor mu? -> Reddet
5. Ayni `project_id` + `appointment_date` + zaman araliginda baska randevu var mi? (status != 'cancelled') -> Reddet (SQL overlap kontrolu)
6. Tarih `max_advance_days` sinirini asiyor mu? -> Reddet

Cakisma SQL kontrolu:
```text
WHERE project_id = X
  AND appointment_date = Y
  AND status != 'cancelled'
  AND (start_time < new_end_time AND end_time > new_start_time)
```

## Dosya Degisiklikleri

### Veritabani (Migration)
- `appointment_settings`, `appointments`, `blocked_slots` tablolari
- RLS politikalari: Sahip tum islemleri yapabilir, anonim kullanicilar sadece randevu olusturabilir
- `public_projects` gorunumune `appointment_settings` verisini dahil etmek icin iliskili sorgu

### Edge Functions (2 yeni)

**1. `book-appointment/index.ts`** - Herkese acik (verify_jwt=false)
- POST: Musteri randevu olusturur (cakisma kontrolu ile)
- GET: Belirli tarih icin musait slotlari dondurur (`?project_id=X&date=2025-03-15`)
- Slot uretim mantigi: working_hours baslangictan bitis saatine kadar slot_duration araliklarla slotlar olusturulur, dolu olanlar cikarilir

**2. `manage-appointments/index.ts`** - Kimlik dogrulamali
- GET: Kullanicinin projesi icin tum randevulari listeler
- PATCH: Randevu durumunu gunceller (onayla/iptal)
- PUT: Ayarlari gunceller (calisma saatleri, slot suresi vb.)
- POST /block: Belirli tarihi kapatir

### Frontend Bilesenleri

**1. `src/components/chai-builder/blocks/appointment/AppointmentBooking.tsx`**
- ChaiBuilder bloku olarak kayitli bir randevu formu
- Takvim goruntusunde musait gunleri gosterir
- Secilen gune ait musait saatleri listeler
- Ad, e-posta, telefon, not alanlari
- Otomatik olarak `convertToChaiBlocks` sirasinda siteye eklenir

**2. `src/components/dashboard/AppointmentsPanel.tsx`**
- Dashboard'da yeni bir sekme/bolum
- Gelen randevulari listeler (bekleyen, onaylanan, iptal edilen)
- Randevu onaylama/iptal etme butonlari
- Calisma saatlerini duzenleme formu
- Takvim gorunumu ile dolu/bos gun ozeti

**3. `deploy-to-netlify` guncelleme**
- Yeni `renderAppointmentBooking()` fonksiyonu eklenir
- Yayinlanan siteye JavaScript ile slot sorgulama ve form gonderme islevi gomulur
- Edge Function API cagrilari icin fetch tabanli istemci kodu

### Otomatik Provizyon Akisi

```text
Kullanici proje olusturur (CreateWebsiteWizard)
    |
    v
projects tablosuna INSERT
    |
    v
DB Trigger: profession'a gore appointment_settings INSERT
    |
    v
generate-website edge function cagirilir
    |
    v
convertToChaiBlocks: AppointmentBooking bloku otomatik eklenir
    |
    v
Editor'de randevu bolumu gorunur (duzenlenebilir)
    |
    v
Yayinlama: deploy-to-netlify icinde randevu HTML + JS render edilir
```

- Veritabani trigger'i `AFTER INSERT ON projects` tetiklenir
- Profession alanina bakilir, uygun varsayilan ayarlarla `appointment_settings` satiri olusturulur
- Kullanici isterse daha sonra dashboard'dan ayarlari duzenler veya sistemi kapatir

### Kullanici Sonradan Duzenleme Senaryolari

1. **Calisma saatlerini degistirme**: Dashboard -> Randevular -> Ayarlar -> Saat/gun duzenleme
2. **Slot suresini degistirme**: 30dk -> 60dk gibi (mevcut randevular etkilenmez)
3. **Sistemi kapatma**: `is_enabled = false` yapilir, siteye gomulu blok gizlenir
4. **Tatil ekleme**: Belirli tarihleri `blocked_slots` ile kapatma
5. **Oglen arasi ekleme/kaldirma**: Ayarlardan `lunch_break_start/end` duzenleme

## Uygulama Sirasi

1. Veritabani tablolari + RLS + trigger (migration)
2. `book-appointment` edge function (slot sorgulama + randevu olusturma)
3. `manage-appointments` edge function (yonetim API)
4. `AppointmentBooking` ChaiBuilder bloku (site icine gomulu form)
5. `convertToChaiBlocks` guncelleme (otomatik blok ekleme)
6. `deploy-to-netlify` guncelleme (yayinlanan siteye gomme)
7. Dashboard randevu yonetim paneli
8. `public_projects` gorunumu guncelleme

