

# nuppel.com "Website Not Found" Sorunu - Cozum

## Sorunun Koku

`App.tsx` dosyasindaki `PLATFORM_HOSTNAMES` listesi, hangi domain'lerin ana platform (landing page, dashboard, vs.) olarak sunulacagini belirliyor. Bu listede sadece Lovable domainleri var:

```text
localhost, lovable.app, lovable.dev, webcontainer.io, lovableproject.com
```

`nuppel.com` bu listede olmadigi icin uygulama onu bir musteri custom domain'i sanip `PublicWebsite` bilesenine yonlendiriyor. Orada da veritabaninda `nuppel.com`'a bagli bir proje bulamadiginda "Website Not Found" gosteriyor.

## Cozum

### Adim 1: App.tsx'teki PLATFORM_HOSTNAMES listesine nuppel.com ekle

`PLATFORM_HOSTNAMES` dizisine `nuppel.com` eklenecek. Boylece `nuppel.com` ve `www.nuppel.com` uzerinden giris yapildiginda normal platform rotalari (Landing, Dashboard, vb.) calisacak.

### Adim 2: PublicWebsite.tsx'teki PLATFORM_HOSTNAMES listesine de nuppel.com ekle

Ayni liste `PublicWebsite.tsx` icerisinde de tekrarlaniyor. Tutarlilik icin oraya da eklenmeli.

## Teknik Detay

Degisecek dosyalar:
- `src/App.tsx` - PLATFORM_HOSTNAMES dizisine `'nuppel.com'` eklenmesi (satir 29-35)
- `src/pages/PublicWebsite.tsx` - Ayni diziye `'nuppel.com'` eklenmesi (satir 36-42)

Bu degisiklikten sonra:
- `nuppel.com` → Landing page (ana sayfa) gorunecek
- `nuppel.com/dashboard` → Dashboard acilacak
- `musteri-domain.com` → Eskisi gibi musteri sitesini gosterecek

## Gelecek Icin Oneri

Platform domain listesini tek bir dosyada tanimlamak (ornegin `src/config/domains.ts`) ve her iki dosyadan import etmek daha temiz olur. Boylece yeni domain eklerken tek yerde guncelleme yeterli olur.

