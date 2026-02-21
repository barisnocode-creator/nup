

# Yayinlama Akisi Analizi — Vercel Olmadan Zaten Calisiyor

## Mevcut Durum

Vercel'i kaldirdiktan sonra yayinlama akisini inceledim. Iyi haber: **sistem zaten Vercel olmadan calisiyor**. Herhangi bir yeniden tasarim gerekmez.

## Nasil Calisiyor?

Yayinlama akisi tamamen **veritabani tabanli** (database-driven):

1. **Kullanici "Yayinla" butonuna basar** (PublishModal.tsx)
2. **Sadece DB guncellenir**: `projects` tablosunda `subdomain`, `is_published=true`, `published_at` alanlari set edilir
3. **Canli site otomatik sunulur**: `/site/:subdomain` rotasi uzerinden `PublicWebsite.tsx` componenti, `public_projects` view'indan veriyi ceker ve React ile render eder
4. **Custom domain** icin: `App.tsx`'deki `isCustomDomain` kontrolu, platform disindaki hostname'leri algilar ve `PublicWebsite` componentini dogrudan gosterir. Bu component `custom_domains_safe` tablosunu sorgulayarak dogru projeyi bulur.

```text
Kullanici Editoru
    |
    v
"Yayinla" butonu
    |
    v
DB Guncelle (subdomain, is_published=true)
    |
    v
Canli Site: expert-page-gen.lovable.app/site/{subdomain}
    |
    v
PublicWebsite.tsx → public_projects view → SectionRenderer
```

## Guncelleme Akisi

"Guncelle" butonu sadece `published_at` tarihini gunceller. Editorle yapilan degisiklikler (`site_sections`, `site_theme`) veritabanina kaydedildiginde canli siteye **aninda** yansiyor, cunku `PublicWebsite.tsx` her ziyarette DB'den guncel veriyi cekiyor.

## Sonuc

Hicbir kod degisikligi gerekmez. Deploy-to-vercel edge function'i zaten sadece Vercel'e deployment atiyordu; kaldirildiktan sonra yayinlama akisi daha da basitlesti. Mevcut sistem:

- Subdomain ile yayinlama: **Calisiyor** (`/site/:subdomain`)
- Custom domain ile yayinlama: **Calisiyor** (`custom_domains_safe` tablosu + hostname eslesmesi)
- Icerik guncelleme: **Calisiyor** (DB'ye kaydet = aninda canli)

Ek bir islem yapmaniza gerek yok.

