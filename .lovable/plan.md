
# Netlify Custom Domain Baglama Ozelligi

## Mevcut Durum

Netlify deploy basariyla calisiyor. Test deploy sonucu:
- Site ID: `1dca021b-82a4-4161-872d-c55a42853fa9`  
- URL: `https://openlucius-bar-yakut-hukuk-brosu.netlify.app`

Mevcut custom domain sistemi kendi DNS dogrulama mekanizmasini kullaniyor (TXT kaydi + A kaydi 185.158.133.1). Bu sistemi Netlify altyapisina gecirmemiz gerekiyor.

## Plan

### 1. verify-domain Edge Function Guncelleme

Mevcut `verify-domain` fonksiyonuna Netlify entegrasyonu eklenecek:
- Domain dogrulandiktan sonra, projenin `netlify_site_id` degeri varsa Netlify API uzerinden custom domain ayarlanacak
- `PUT https://api.netlify.com/api/v1/sites/{site_id}` ile `custom_domain` alani set edilecek

### 2. DNS Talimatlari Guncelleme

Netlify custom domain icin DNS kayitlari degisecek:
- Mevcut: A kaydi -> `185.158.133.1`
- Yeni: Netlify load balancer IP'si -> `75.2.60.5` (Netlify'in standart IP'si)
- TXT dogrulama kaydi ayni kalacak (`_lovable` prefix)

`get_domain_dns_instructions` RPC fonksiyonu guncellenerek Netlify IP'leri gosterilecek.

### 3. DomainSettingsModal ve DomainTab UI Guncelleme

- Dogrulama basarili oldugunda Netlify uzerinden SSL otomatik olarak saglanacagina dair bilgi mesaji eklenecek
- DNS talimatlari bolumunde Netlify IP'leri gosterilecek

### 4. Deploy Sonrasi Custom Domain Senkronizasyonu

`deploy-to-netlify` fonksiyonunda, eger projede dogrulanmis bir custom domain varsa, deploy sirasinda otomatik olarak Netlify'a set edilecek.

## Teknik Detaylar

**Degistirilecek dosyalar:**

1. `supabase/functions/verify-domain/index.ts`
   - Dogrulama basarili oldugunda Netlify API'ye custom domain ekleme
   - `PUT /api/v1/sites/{site_id}` cagrisi

2. `supabase/functions/deploy-to-netlify/index.ts`
   - Deploy sonrasi, projede dogrulanmis custom domain varsa Netlify'a baglama

3. `get_domain_dns_instructions` RPC fonksiyonu (SQL migration)
   - A kaydi IP'sini `185.158.133.1` -> `75.2.60.5` olarak degistirme

4. `src/components/website-preview/DomainSettingsModal.tsx`
   - DNS talimatlarinda Netlify IP'lerini gosterme

5. `src/components/website-dashboard/DomainTab.tsx`
   - DNS talimatlarinda Netlify IP'lerini gosterme
   - Netlify SSL durumunu gosterme

**Netlify API Endpointleri:**
- `PUT /api/v1/sites/{site_id}` - Site'a custom domain atama (`custom_domain` alani)
- Netlify, custom domain eklendiginde otomatik olarak Let's Encrypt SSL sertifikasi saglıyor

**Onemli Not:**
- Netlify free plan'da site basina 1 custom domain destekleniyor
- SSL sertifikasi Netlify tarafindan otomatik saglanir (Let's Encrypt)
- DNS propagasyonu 24-72 saat surebilir
