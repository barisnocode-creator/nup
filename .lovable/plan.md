
# Esnek Musaitlik ve Calisma Saatleri Yapilandirma Sistemi

## Mevcut Durum

Simdi `appointment_settings` tablosu tum gunler icin **tek bir calisma saati** tutuyor:
- `working_hours_start` / `working_hours_end` (tek deger)
- `lunch_break_start` / `lunch_break_end` (tek deger)
- `working_days` (hangi gunler acik)

Bu yapi **gun bazli farkli saat dilimlerini** desteklemiyor. Ornegin "Pazartesi 09-18, Cumartesi 10-14" yapilamiyor.

## Yeni Veri Yapisi

### Veritabani Degisikligi: `day_schedules` JSONB Sutunu

`appointment_settings` tablosuna yeni bir `day_schedules` JSONB sutunu eklenecek. Mevcut `working_hours_start/end` ve `lunch_break_start/end` alanlari geriye uyumluluk icin korunacak, yeni alan varsa oncelikli kullanilacak.

```text
day_schedules yapisi:
{
  "1": { "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}] },
  "2": { "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}] },
  "3": { "enabled": true, "start": "09:00", "end": "18:00", "breaks": [] },
  "4": { "enabled": true, "start": "10:00", "end": "16:00", "breaks": [{"start": "12:30", "end": "13:00"}] },
  "5": { "enabled": true, "start": "09:00", "end": "17:00", "breaks": [] },
  "6": { "enabled": true, "start": "10:00", "end": "14:00", "breaks": [] },
  "0": { "enabled": false, "start": "", "end": "", "breaks": [] }
}
```

Anahtar = haftanin gunu (0=Pazar, 6=Cumartesi). Her gun icin:
- `enabled`: O gun acik mi
- `start` / `end`: Calisma saatleri
- `breaks`: Birden fazla mola destegi (sadece ogle degil, cay molasi vb. de eklenebilir)

### Geriye Uyumluluk

- `day_schedules` NULL ise eski alanlar (`working_hours_start/end`, `working_days`, `lunch_break_start/end`) kullanilir
- `day_schedules` dolduruldugunda yeni sistem devreye girer
- Mevcut projeler etkilenmez

## Slot Yeniden Hesaplama Mantigi

`book-appointment` edge function guncellenecek:

```text
1. day_schedules varsa:
   - Istenen gun icin schedule'u al (orn: day_schedules["3"])
   - enabled=false ise slot dondurme
   - start/end saatlerinden slotlari uret
   - breaks dizisindeki her mola araligini atla
2. day_schedules yoksa:
   - Mevcut mantik aynen calisir (working_hours_start/end + lunch)
3. Gecmis saat kontrolu:
   - Bugunun tarihiyse, gecmis slotlari otomatik cikar
```

## Istisna Gunu Yonetimi (blocked_slots Genisletme)

`blocked_slots` tablosuna yeni alanlar eklenerek tam gun kapatma yerine **saat araligi kapatma** da desteklenecek:

- `block_start_time` (text, nullable): NULL ise tam gun kapali
- `block_end_time` (text, nullable): NULL ise tam gun kapali
- `block_type` (text, default 'full_day'): 'full_day', 'time_range', 'vacation'

Boylece:
- Tam gun kapatma: `blocked_date = '2026-03-15', block_type = 'full_day'`
- Saat araligi kapatma: `blocked_date = '2026-03-15', block_start_time = '14:00', block_end_time = '16:00'`
- Tatil: `blocked_date = '2026-03-15', block_type = 'vacation', reason = 'Yillik izin'`

## Timezone Normalizasyonu

- Tum saatler `appointment_settings.timezone` alanina gore saklanir (varsayilan: Europe/Istanbul)
- Edge function'da slot uretimi ve gecmis saat kontrolu icin sunucu zamani yerine `timezone` degeri kullanilir
- Musteri tarafinda tarayici timezone'u gosterilir ama backend'e gonderilirken proje timezone'una cevirilir

## UI Degisiklikleri (AppointmentsPanel.tsx - Ayarlar Sekmesi)

Mevcut basit form yerine zengin bir gun bazli yapilandirma ekrani:

### Genel Ayarlar Karti
- Randevu sistemi acik/kapali (switch)
- Randevu suresi secimi (15/30/45/60/90/120 dk - select)
- Tampon sure (0/5/10/15 dk - select)
- Timezone secimi (select)
- Maksimum ileri gun (input)

### Gun Bazli Program Karti
7 gunun her biri icin bir satir:
```text
[Pazartesi]  [Acik/Kapali Toggle]  [09:00] - [18:00]  [+ Mola Ekle]
  Molalar: [12:00-13:00] [x]
[Sali]       [Acik/Kapali Toggle]  [09:00] - [18:00]  [+ Mola Ekle]
[Cumartesi]  [Acik/Kapali Toggle]  [10:00] - [14:00]  [+ Mola Ekle]
[Pazar]      [Kapali]
```

### Kapali Gunler Karti (Gelistirilmis)
- Tarih secici (calendar picker)
- Kapatma tipi: Tam gun / Saat araligi / Tatil
- Saat araligi secildiginde baslangic-bitis saati girdileri
- Sebep alani
- Mevcut kapali gunler listesi (badge ile tip gosterimi)

## Dosya Degisiklikleri

| Dosya | Degisiklik |
|---|---|
| Migration SQL | `appointment_settings` tablosuna `day_schedules` JSONB sutunu ekle; `blocked_slots` tablosuna `block_start_time`, `block_end_time`, `block_type` sutunlari ekle; auto-provision trigger'i guncelle (day_schedules ile varsayilan program olustur) |
| `supabase/functions/book-appointment/index.ts` | Slot uretim mantigi: `day_schedules` varsa gun bazli program kullan, gecmis saat filtreleme ekle, saat araligi bloklama destegi |
| `supabase/functions/manage-appointments/index.ts` | PUT'a `day_schedules` alanini ekle, POST'a `block_start_time/end_time/block_type` destegi |
| `src/components/dashboard/AppointmentsPanel.tsx` | Ayarlar sekmesini tamamen yeniden tasarla: gun bazli program editoru, mola ekleme/cikarma, gelistirilmis kapatma formu |

## Gelecekte Multi-Staff Destegi Icin Hazirlik

Mevcut yapi `appointment_settings` -> `project_id` ile baglidir. Gelecekte:
- `staff_id` sutunu eklenebilir (nullable, NULL = genel ayar)
- `day_schedules` zaten kisi bazli farkli programlari destekler
- `appointments` tablosuna `staff_id` eklenerek hangi personele atandigi izlenebilir
- Simdilik sutunlar eklenmez ama yapi buna uygun tasarlandi
