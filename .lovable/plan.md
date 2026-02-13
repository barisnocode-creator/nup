

# Randevu Talep Formu Sistemi

## Mevcut Durum

Simdi randevu formu sabit 4 alandan olusuyor: Ad (zorunlu), E-posta (zorunlu), Telefon (opsiyonel), Not (opsiyonel). Hizmet saglayicisi bu alanlari ozellestiremez, yeni alan ekleyemez, sira degistiremez. Gizlilik onayi ve spam korunmasi yok.

## Yeni Veri Yapisi

### appointment_settings tablosuna yeni JSONB sutunu: `form_fields`

```text
form_fields yapisi:
[
  { "id": "client_name", "type": "text", "label": "Adiniz", "required": true, "system": true, "order": 0 },
  { "id": "client_email", "type": "email", "label": "E-posta", "required": true, "system": true, "order": 1 },
  { "id": "client_phone", "type": "tel", "label": "Telefon", "required": false, "system": false, "order": 2 },
  { "id": "subject", "type": "text", "label": "Konu", "required": false, "system": false, "order": 3 },
  { "id": "client_note", "type": "textarea", "label": "Not", "required": false, "system": false, "order": 4 }
]
```

Her alan icin:
- `id`: Benzersiz anahtar (veritabanina kaydedilirken kullanilir)
- `type`: text, email, tel, textarea, select, checkbox
- `label`: Kullaniciya gosterilecek etiket
- `required`: Zorunlu mu
- `system`: true ise silinemez (client_name ve client_email)
- `order`: Siralama
- `placeholder`: Opsiyonel yer tutucu metin
- `options`: select tipi icin secenek listesi (ornek: ["Bireysel", "Kurumsal"])

### appointments tablosuna yeni JSONB sutunu: `form_data`

Musterinin doldurdugu tum form verilerini saklar. Sabit alanlar (client_name, client_email, client_phone, client_note) mevcut sutunlarda kalir, ozel alanlar `form_data` JSONB'ye yazilir.

```text
form_data ornegi:
{
  "subject": "Dis beyazlatma",
  "pre_session_notes": "Onceki tedavim var",
  "custom_field_1": "Deger"
}
```

### Gizlilik onayi: `consent_text` ve `consent_required`

`appointment_settings` tablosuna 2 alan daha:
- `consent_text` (text, nullable): "Kisisel verilerinizin islenmesini kabul ediyorum" gibi
- `consent_required` (boolean, default true): Onay kutusu zorunlu mu

### Anti-spam: Honeypot + zaman kontrolu

Captcha yerine iki katmanli koruma:
1. **Honeypot alani**: Gorunmez bir input, botlar doldurursa istek reddedilir
2. **Zaman kontrolu**: Form acilma suresi 3 saniyeden kisa ise (bot hizi) reddedilir

## Sektor Bazli Varsayilan Form Alanlari

`auto_provision_appointment_settings` trigger'i guncellenecek. Her sektor icin farkli varsayilan form alanlari olusturulacak:

```text
health (doktor/psikolog):
  + "Sikayet / Belirti" (textarea, zorunlu)
  + "Onceki tedavi var mi?" (select: Evet/Hayir)

service (danismanlik):
  + "Konu" (text)
  + "Sirket Adi" (text)

food (restoran):
  + "Kisi Sayisi" (select: 1-2, 3-4, 5-6, 7+)
  + "Ozel Istek" (textarea)

creative (tasarim):
  + "Proje Turu" (select: Logo, Web, Sosyal Medya, Diger)
  + "Brifing Notu" (textarea)

technology:
  + "Konu" (text)

other (varsayilan):
  + "Konu" (text)
  + "Not" (textarea)
```

## Dosya Degisiklikleri

### 1. Veritabani (Migration)

- `appointment_settings` tablosuna `form_fields` (JSONB), `consent_text` (text), `consent_required` (boolean) ekle
- `appointments` tablosuna `form_data` (JSONB), `consent_given` (boolean) ekle
- `auto_provision_appointment_settings` trigger fonksiyonunu guncelle (sektor bazli form_fields)

### 2. book-appointment Edge Function

- POST handler'a `form_data`, `consent_given`, `honeypot`, `form_loaded_at` alanlari ekle
- Honeypot dolu ise 200 OK dondur (botu yaniltma)
- `form_loaded_at` ile suanki zaman farki < 3sn ise reddet
- `consent_required=true` ise `consent_given` kontrolu yap
- `form_fields` uzerinden zorunlu alan validasyonu yap (required=true olan alanlar bos mu?)
- Ozel alan verilerini `form_data` JSONB'ye kaydet

### 3. manage-appointments Edge Function

- PUT'a `form_fields`, `consent_text`, `consent_required` alanlari ekle
- GET appointments ciktisina `form_data` dahil et

### 4. AppointmentBooking.tsx (ChaiBuilder bloku)

- Tarih+saat secildikten sonra formu goster
- Slot sorgulamayla birlikte `form_fields` verisini de cek (GET response'a ekle)
- `form_fields` dizisini `order` sirasina gore render et
- Her alan tipine uygun input bileseni olustur (text, email, tel, textarea, select)
- Honeypot alani ekle (CSS ile gizli)
- Form yuklenme zamanini kaydet (hidden field)
- `consent_required` ise checkbox goster, isaretlenmeden gonderimi engelle

### 5. AppointmentsPanel.tsx (Dashboard)

- Yeni **Form Alanlari** sekmesi ekle
- Mevcut alanlari listele (surukleme ile siralama - hello-pangea/dnd zaten yuklu)
- Yeni alan ekleme formu: Label, Tip, Zorunlu, Placeholder, Secenekler
- Sistem alanlarini (client_name, client_email) silinemez olarak goster
- Gizlilik metni duzenleyicisi
- Randevu detayinda `form_data` icerigini goster

### 6. deploy-to-netlify (Yayinlanan site)

- `renderAppointmentBooking` fonksiyonunu guncelle
- Dinamik form alanlarini render et
- Honeypot + zaman kontrolu JavaScript'i ekle
- Gizlilik onay kutusunu ekle

## Uygulama Sirasi

1. Migration: Yeni sutunlar + trigger guncelleme
2. book-appointment: Form validasyonu + anti-spam + form_data kaydi
3. manage-appointments: Form alanlari CRUD + consent ayarlari
4. AppointmentBooking.tsx: Dinamik form render + honeypot + consent
5. AppointmentsPanel.tsx: Form alanlari yonetim sekmesi + randevu detayinda form_data
6. deploy-to-netlify: Yayinlanan sitede dinamik form + anti-spam

## Teknik Notlar

- `system: true` alanlari (client_name, client_email) silinemez ve tipi degistirilemez
- form_fields NULL ise eski sabit form render edilir (geriye uyumluluk)
- Surukleme ile siralama icin `@hello-pangea/dnd` kullanilir (proje bagimliliginda mevcut)
- Select tipi alanlar icin `options` dizisi kullanilir
- Tum form verileri sanitize edilir (max 500 karakter per alan, HTML strip)

