
# Netlify Entegrasyonu - Publish Akışı

## Genel Bakış

Kullanıcı "Yayınla" dediğinde ChaiBuilder bloklarından statik HTML üretilip Netlify API üzerinden deploy edilecek. GitHub repo'ya gerek olmadan doğrudan Netlify Deploy API kullanılacak.

## Adımlar

### 1. Netlify API Token Ekleme
- Netlify hesabından bir Personal Access Token oluşturulacak (https://app.netlify.com/user/applications#personal-access-tokens)
- Bu token, proje secret'larına `NETLIFY_API_TOKEN` olarak eklenecek

### 2. Edge Function: `deploy-to-netlify` Oluşturma
Yeni bir edge function oluşturulacak. Gorevi:
- Proje ID'sine gore veritabanindan `chai_blocks` ve `chai_theme` verisini cekme
- ChaiBuilder bloklarini statik HTML sayfasina donusturme (inline CSS + HTML)
- Netlify Deploy API'sine (`POST https://api.netlify.com/api/v1/sites/{site_id}/deploys`) ile deploy etme
- Eger site henuz Netlify'da yoksa once `POST /api/v1/sites` ile olusturma
- Netlify site ID'sini veritabaninda saklama

### 3. Veritabani Guncellemesi
`projects` tablosuna yeni sutunlar eklenmesi:
- `netlify_site_id` (text, nullable) - Netlify'daki site ID'si
- `netlify_url` (text, nullable) - Netlify'dan alinan canli URL
- `netlify_custom_domain` (text, nullable) - Netlify uzerinden baglanan ozel domain

### 4. PublishModal Guncelleme
Publish butonuna basildiginda:
1. Mevcut subdomain kaydi yapilir (geriye uyumluluk)
2. Ardindan `deploy-to-netlify` edge function cagirilir
3. Basarili deploy sonrasi Netlify URL'si gosterilir
4. Kullaniciya hem `/site/subdomain` hem de `xxx.netlify.app` URL'leri sunulur

### 5. Statik HTML Uretimi
Edge function icinde ChaiBuilder bloklari su sekilde HTML'e cevrilecek:
- Blok verileri JSON olarak parse edilir
- Her blok tipi icin HTML sablonu uretilir
- Tailwind CSS, CDN uzerinden eklenir (`<link>` tag)
- Tek bir `index.html` dosyasi olusturulur
- Bu dosya Netlify'a zip olarak gonderilir

### 6. Custom Domain (Opsiyonel Sonraki Adim)
Netlify API uzerinden custom domain baglama:
- `PUT /api/v1/sites/{site_id}` ile `custom_domain` alani ayarlanir
- DNS kayitlari Netlify'in IP'lerine yonlendirilir (mevcut 185.158.133.1 yerine Netlify'inkiler)

## Teknik Detaylar

**Yeni dosyalar:**
- `supabase/functions/deploy-to-netlify/index.ts` - Ana deploy edge function'i

**Degistirilecek dosyalar:**
- `src/components/website-preview/PublishModal.tsx` - Netlify deploy cagrisinin eklenmesi
- `src/components/chai-builder/DesktopEditorLayout.tsx` - Toolbar'daki Publish butonunun guncellenmesi

**Gerekli secret:**
- `NETLIFY_API_TOKEN` - Netlify Personal Access Token

**Netlify API Endpointleri:**
- `POST /api/v1/sites` - Yeni site olusturma
- `POST /api/v1/sites/{site_id}/deploys` - Deploy gonderme (zip dosyasi)
- `PUT /api/v1/sites/{site_id}` - Site ayarlari (custom domain vb.)

## Onemli Notlar
- Netlify Free plan'da 100 site/hesap limiti var, cok kullanicili bir platformda bu limit hizla dolabilir. Netlify Pro veya Team plan gerekebilir.
- Statik HTML export'u ChaiBuilder bloklarinin tam gorsel karsiligidir; interaktif ozellikler (form gonderme vb.) ayrica handle edilmelidir.
- Mevcut `/site/:subdomain` rotasi geriye uyumluluk icin korunacak.
