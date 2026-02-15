
# Lead Yonetim Sistemi

## Ozet

Web sitesindeki iletisim formlarindan gelen mesajlar (lead'ler) veritabanina kaydedilecek ve dashboard'daki yeni bir "Mesajlar" sayfasinda listelenecek. Su an formlar sadece `alert()` gosteriyor -- bundan sonra gercekten veri kaydedecek.

## Yeni Ozellikler

- Ziyaretciler iletisim formunu doldurduklarinda mesajlari veritabanina kaydedilecek
- Dashboard sidebar'a "Mesajlar" (inbox ikonu) menüsü eklenecek, okunmamis mesaj sayisi badge olarak gorunecek
- Mesajlar sayfasinda: liste gorunumu, okundu/okunmadi durumu, detay goruntuleme, silme
- Yayinlanan sitelerdeki iletisim formlari gercek POST istegi yapacak

## Teknik Adimlar

### Adim 1: Veritabani -- `contact_leads` Tablosu

```text
contact_leads
  id          uuid (PK, default gen_random_uuid())
  project_id  uuid (NOT NULL)
  name        text (NOT NULL)
  email       text (NOT NULL)
  phone       text (nullable)
  subject     text (nullable)
  message     text (NOT NULL)
  is_read     boolean (default false)
  created_at  timestamptz (default now())
```

RLS politikalari:
- SELECT: Proje sahibi kendi lead'lerini gorebilir (`user_owns_project(project_id)`)
- INSERT: Herkes ekleyebilir (anonim ziyaretciler form gonderir)
- UPDATE: Proje sahibi guncelleyebilir (okundu isareti icin)
- DELETE: Proje sahibi silebilir

Realtime etkinlestirilecek (sidebar badge icin).

### Adim 2: Edge Function -- `submit-contact-form`

Yeni bir Edge Function:
- POST istegi alir: `project_id`, `name`, `email`, `phone`, `subject`, `message`
- Zod ile input validasyonu (email formati, uzunluk limitleri)
- Service role ile `contact_leads` tablosuna INSERT
- CORS headers dahil (yayinlanan sitelerden cagirilacak)
- JWT dogrulamasi yok (anonim ziyaretciler kullanacak)
- Rate limiting icin basit honeypot alani

### Adim 3: Sidebar Guncelleme

`DashboardSidebar.tsx` dosyasina:
- "Mesajlar" menu ogesi eklenmesi (Randevular'in altina, `MessageSquare` ikonu)
- Rota: `/project/:id/leads` (proje varsa) veya `/leads` (yoksa)
- Okunmamis mesaj sayisi badge olarak gosterilecek (randevu badge'iyla ayni mantik)
- Realtime subscription ile anlik guncelleme

### Adim 4: Leads Sayfasi -- `src/pages/Leads.tsx`

Yeni sayfa bileseni:
- `DashboardLayout` icinde render
- Mesaj listesi (tarih, isim, e-posta, konu, okundu durumu)
- Tiklandiginda mesaj detayi (sag tarafta veya modal)
- "Okundu olarak isaretle" ve "Sil" aksiyonlari
- Filtreleme: Tumu / Okunmamis
- Bos durum placeholder'i

### Adim 5: App.tsx Rota Ekleme

- `/project/:id/leads` --> `<Leads />` (korunmus rota)
- `/leads` --> `<Leads />` (proje olmadan erisim)

### Adim 6: Yayinlanan Sitelerdeki Formlari Guncelleme

`deploy-to-netlify` Edge Function'daki `renderContactForm` fonksiyonunda:
- `onsubmit="alert(...)"` yerine gercek `fetch()` cagrisi
- Form verileri `submit-contact-form` Edge Function'a POST edilecek
- Basarili gonderimde kullaniciya "Mesajiniz alindi" geri bildirimi
- Hata durumunda uygun mesaj

### Adim 7: Editor Icindeki Contact Form Guncelleme

`ContactForm.tsx` (ChaiBuilder bloku) bileseninde:
- `handleSubmit` fonksiyonu gercek POST istegi yapacak sekilde guncellenecek
- `inBuilder` modunda devre disi kalacak (mevcut davranis)

## Dosya Degisiklikleri Ozeti

| Dosya | Islem |
|-------|-------|
| Veritabani migrasyonu (`contact_leads` tablosu) | Yeni |
| `supabase/functions/submit-contact-form/index.ts` | Yeni |
| `src/pages/Leads.tsx` | Yeni |
| `src/components/dashboard/DashboardSidebar.tsx` | Guncelleme |
| `src/App.tsx` | Guncelleme (rota ekleme) |
| `supabase/functions/deploy-to-netlify/index.ts` | Guncelleme (form submit) |
| `src/components/chai-builder/blocks/contact/ContactForm.tsx` | Guncelleme |
| `supabase/config.toml` | Guncelleme (yeni fonksiyon JWT ayari) |
