

# Bildirim ve Hatirlatma Sistemi

## Mevcut Durum

Projede bildirim altyapisi bulunmuyor. Randevu durumu degistiginde (olusturma, onay, iptal) hicbir bildirim gonderilmiyor. `profiles` tablosunda `email_notifications` tercihi var ama fonksiyonel degil. Sidebar'da bildirim ikonu yok. E-posta gonderim servisi entegre degil.

## Sistem Mimarisi

### Veritabani Tablolari

**1. `notifications` tablosu** - Uygulama ici bildirimler icin

```text
notifications:
  id (uuid, PK, default gen_random_uuid())
  user_id (uuid, NOT NULL)         -- Bildirimi alan kullanici
  project_id (uuid, NOT NULL)      -- Ilgili proje
  appointment_id (uuid, nullable)  -- Ilgili randevu (varsa)
  type (text, NOT NULL)            -- 'new_appointment', 'confirmed', 'cancelled', 'reminder_24h', 'reminder_2h'
  title (text, NOT NULL)           -- Baslik
  body (text, NOT NULL)            -- Icerik
  is_read (boolean, default false)
  channel (text, default 'in_app') -- 'in_app', 'email', 'sms' (gelecek)
  created_at (timestamptz, default now())
```

RLS: `auth.uid() = user_id` (SELECT, UPDATE, DELETE)

**2. `notification_templates` tablosu** - Ozellestirilabilir sablonlar

```text
notification_templates:
  id (uuid, PK, default gen_random_uuid())
  project_id (uuid, NOT NULL)
  user_id (uuid, NOT NULL)
  event_type (text, NOT NULL)      -- 'new_appointment', 'confirmed', 'cancelled', 'reminder_24h', 'reminder_2h'
  target (text, NOT NULL)          -- 'provider' veya 'client'
  subject (text, NOT NULL)         -- E-posta konusu
  body_template (text, NOT NULL)   -- Sablon icerigi (degiskenler: {{client_name}}, {{date}}, {{time}}, {{status}})
  is_enabled (boolean, default true)
  channel (text, default 'email')  -- 'email', 'in_app', 'sms'
  created_at (timestamptz)
  updated_at (timestamptz)
```

RLS: `auth.uid() = user_id` (tum islemler)

**3. `notification_logs` tablosu** - Gonderim takibi

```text
notification_logs:
  id (uuid, PK)
  notification_id (uuid, nullable)   -- in-app bildirimi varsa
  project_id (uuid, NOT NULL)
  appointment_id (uuid, nullable)
  event_type (text, NOT NULL)
  channel (text, NOT NULL)           -- 'email', 'in_app', 'sms'
  recipient_email (text, nullable)
  recipient_type (text, NOT NULL)    -- 'provider' veya 'client'
  status (text, default 'sent')      -- 'sent', 'failed', 'pending'
  error_message (text, nullable)
  created_at (timestamptz)
```

RLS: `user_owns_project(project_id)` (SELECT only)

**4. `appointment_settings` tablosuna yeni alanlar**

```text
+ reminder_24h_enabled (boolean, default true)
+ reminder_2h_enabled (boolean, default true)
+ notification_email_enabled (boolean, default true)
```

### Bildirim Tetikleme Olaylari

```text
Olay                    | Alici              | Kanal
------------------------|--------------------|-----------
Yeni randevu talebi     | Provider (in-app)  | in_app + email
Randevu onaylandi       | Client (email)     | email
                        | Provider (in-app)  | in_app
Randevu iptal edildi    | Client (email)     | email
                        | Provider (in-app)  | in_app
24 saat hatirlatma      | Client (email)     | email
                        | Provider (in-app)  | in_app
2 saat hatirlatma       | Client (email)     | email
                        | Provider (in-app)  | in_app
```

### Sablon Degiskenleri

Sablonlarda kullanilabilecek degiskenler:

```text
{{client_name}}       - Musteri adi
{{client_email}}      - Musteri e-postasi
{{client_phone}}      - Musteri telefonu
{{date}}              - Randevu tarihi (formatli)
{{time}}              - Randevu saati
{{end_time}}          - Bitis saati
{{status}}            - Durum (Turkce)
{{project_name}}      - Isletme adi
{{provider_name}}     - Hizmet saglayici adi
```

### Varsayilan Sablonlar (auto_provision ile)

Proje olusturuldiginda varsayilan sablonlar eklenir:

```text
new_appointment / client:
  Konu: "Randevu Talebiniz Alindi - {{project_name}}"
  Icerik: "Sayin {{client_name}}, {{date}} tarihinde saat {{time}} icin randevu talebiniz alinmistir. Onay durumu size bildirilecektir."

confirmed / client:
  Konu: "Randevunuz Onaylandi - {{project_name}}"
  Icerik: "Sayin {{client_name}}, {{date}} tarihinde saat {{time}}-{{end_time}} arasindaki randevunuz onaylanmistir."

cancelled / client:
  Konu: "Randevunuz Iptal Edildi - {{project_name}}"
  Icerik: "Sayin {{client_name}}, {{date}} tarihindeki randevunuz iptal edilmistir. Yeni randevu icin web sitemizi ziyaret edin."

reminder_24h / client:
  Konu: "Randevu Hatirlatmasi - Yarin {{time}}"
  Icerik: "Sayin {{client_name}}, yarin saat {{time}} icin {{project_name}} ile randevunuzu hatirlatiriz."

reminder_2h / client:
  Konu: "Randevu Hatirlatmasi - Bugun {{time}}"
  Icerik: "Sayin {{client_name}}, bugun saat {{time}} icin {{project_name}} ile randevunuzu hatirlatiriz."
```

## Edge Function'lar

### 1. `send-notification` (Yeni)

Merkezi bildirim gonderim fonksiyonu. Diger fonksiyonlar tarafindan cagirilir.

Islevler:
- Sablon degiskenlerini doldurma
- In-app bildirim olusturma (`notifications` tablosuna INSERT)
- E-posta gonderimi (Lovable AI uzerinden veya Supabase Auth'un yerlesik SMTP'si)
- Gonderim logunu kaydetme (`notification_logs`)
- Kanal tercihi kontrolu (provider'in ayarlarindan)

Cagri formati:
```text
POST /send-notification
Body: {
  project_id,
  appointment_id,
  event_type: "new_appointment" | "confirmed" | "cancelled" | "reminder_24h" | "reminder_2h",
  appointment_data: { client_name, client_email, date, time, ... }
}
```

### 2. `process-reminders` (Yeni, Cron ile zamanlanir)

Her saat calisan bir cron job:
- 24 saat ve 2 saat icinde olan randevulari bulur
- Daha once hatirlatma gonderilmemis olanlari filtreler (`notification_logs` kontrolu)
- Her biri icin `send-notification` fonksiyonunu cagirarak bildirim gonderir

Cron zamanlama: Her saat basinda (`0 * * * *`)

Bu fonksiyon pg_cron + pg_net ile zamanlanir (veritabanina SQL olarak eklenir).

### 3. Mevcut fonksiyonlara entegrasyon

**book-appointment:** POST basarili olunca `send-notification` cagirilir (`event_type: 'new_appointment'`)

**manage-appointments:** PATCH'te status degisince:
- `confirmed` -> `send-notification` (`event_type: 'confirmed'`)
- `cancelled` -> `send-notification` (`event_type: 'cancelled'`)

Bu cagrilar edge function icinden `fetch` ile dahili olarak yapilir (service role key ile).

## UI Bilesenleri

### 1. Bildirim Cani (Header'a eklenir)

`DashboardLayout.tsx` header'ina bildirim ikonu eklenir:
- Bell ikonu + okunmamis bildirim sayisi badge'i
- Tiklaninca dropdown/popover ile son bildirimleri gosterir
- "Tumunu Gor" linki -> Bildirimler sayfasi veya modal
- Bildirimi okundu olarak isaretleme
- Realtime subscription ile anlik guncelleme

Dosya: `src/components/dashboard/NotificationBell.tsx`

### 2. Bildirim Ayarlari Sekmesi

`AppointmentsPanel.tsx`'e yeni "Bildirimler" sekmesi eklenir:
- E-posta bildirimleri acik/kapali
- 24 saat hatirlatma acik/kapali
- 2 saat hatirlatma acik/kapali
- Sablon duzenleyicisi (her olay tipi icin subject + body)
- Onizleme butonu (degiskenleri ornek degerlerle gosterir)

Dosya: `src/components/dashboard/appointments/NotificationsTab.tsx`

### 3. Bildirim Loglari

Ayni sekme icinde veya ayri bir alt sekme olarak:
- Son gonderilen bildirimlerin listesi
- Tarih, alici, kanal, durum (basarili/basarisiz)
- Filtreleme: olay tipine ve kanala gore

Dosya: `src/components/dashboard/appointments/NotificationLogsTab.tsx`

## E-posta Gonderim Yontemi

E-posta gondermek icin `send-notification` edge function'i icerisinde Supabase Auth'un yerlesik sistemi yerine dogrudan bir SMTP/API kullanilmasi gerekecek. Secenekler:

**Secilen yaklasim: Lovable AI destekli e-posta gonderimi**
Bir AI modeli uzerinden e-posta icerigini olusturup, `Resend` veya benzeri bir servis ile gonderim yapilabilir. Ancak bu bir API key gerektirir.

**Alternatif (baslangic icin):** E-posta gonderimi olmadan sadece in-app bildirimlerle baslamak ve e-posta entegrasyonunu kullanici API key'i ekledikten sonra aktif etmek.

Baslangicta **in-app bildirimleri tam fonksiyonel** olarak uygulanir. E-posta icin kullanicidan Resend API key istenir veya mevcut bir connector kullanilir.

## Gelecek Genisleme Icin Hazirlik

- `channel` alani SMS ve WhatsApp icin hazir ('sms', 'whatsapp')
- `notification_templates` tablosu kanal bazli sablonlari destekler
- `notification_logs` tum kanallari takip eder
- `send-notification` fonksiyonu kanal switch/case yapisiyla genisletilebilir

## Uygulama Sirasi

1. **Migration:** `notifications`, `notification_templates`, `notification_logs` tablolari + `appointment_settings`'e yeni alanlar + varsayilan sablonlar trigger'i + Realtime acik
2. **send-notification edge function:** Merkezi bildirim gonderim fonksiyonu (in-app + e-posta altyapisi)
3. **process-reminders edge function:** Hatirlatma zamanlayicisi + pg_cron kurulumu
4. **book-appointment guncelleme:** Yeni randevu bildirimi tetiklemesi
5. **manage-appointments guncelleme:** Onay/iptal bildirimi tetiklemesi
6. **NotificationBell bileseni:** Header'a bildirim cani + dropdown + Realtime
7. **NotificationsTab bileseni:** Bildirim ayarlari + sablon duzenleyici + loglar
8. **AppointmentsPanel guncelleme:** Yeni "Bildirimler" sekmesi ekleme

## Teknik Notlar

- `notifications` tablosu Realtime yayin ile acilir (anlik bildirim gosterimi)
- Hatirlatma cron job'i, ayni randevu icin tekrar gonderim yapmamak icin `notification_logs` kontrolu yapar
- Sablonlarda `{{degisken}}` formati ile basit string replace kullanilir
- E-posta gonderimi icin bir API key (Resend vb.) gerekecek - bu kullanicidan istenecek
- Provider'in `profiles.preferences.email_notifications` tercihi kontrol edilir
- Tum bildirimler `notification_logs`'a kaydedilir (basari/basarisizlik takibi)
- SMS/WhatsApp kanallari su an icin devre disi olarak saklanir, gelecekte aktive edilir

