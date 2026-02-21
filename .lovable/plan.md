
# Custom Domain Sorunu - Analiz ve Cozum Plani

## Sorunun Koku

Custom domain (ornegin nuppel.com) uzerinden siteye erisim calismiyordu. Analiz sonucunda birden fazla sorun tespit edildi.

## Tespit Edilen Sorunlar

### 1. nuppel.com Icin Veritabani Kaydi Yok

`custom_domains` tablosunda `nuppel.com` icin hicbir kayit bulunmuyor. Veritabaninda sadece 1 custom domain kaydi var:
- `barisyakuthukukburosu.com` (status: pending, dogrulanmamis)

`PublicWebsite.tsx` hostname eslemesi yaptiginda `custom_domains_safe` tablosunda bu domain'i bulamiyor ve "Website Not Found" gosteriyor.

### 2. Vercel Kaldirildi Ama Altyapi Alternatifi Yok

Vercel kaldirildiktan sonra verify-domain edge function'i sadece veritabanini guncelliyor (status -> active). Ancak:

- Domain'in DNS'i `185.158.133.1` IP'sine yonlendiginde bu trafigin React uygulamasina (`expert-page-gen.lovable.app`) ulasmasini saglayan bir reverse proxy/CDN katmani gerekiyor
- SSL sertifikasi saglanmiyor (Vercel bunu otomatik yapiyordu)

Bu, Lovable platformunun kendi domain mekanizmasi (`185.158.133.1`) uzerinden saglanabilir.

### 3. Kod Tarafindaki Mantik Dogru Calisiyor

`PublicWebsite.tsx`'deki akis aslinda dogru:
1. `isPlatformDomain` kontrol ediyor
2. Custom domain ise `custom_domains_safe` tablosundan `verified/active` statuslu kayit ariyor
3. Bulamazsa `public_projects.custom_domain` sutunundan ariyor
4. Bulamazsa 404 gosteriyor

Mantik dogru, sorun verinin olmamasi.

## Cozum Plani

### Adim 1: nuppel.com'u Kaydet (Veritabani)

nuppel.com domain'ini `custom_domains` tablosuna ekleyecegiz. Bunun icin once hangi projeye baglanacagini belirlemek lazim.

**Kullaniciya sorulacak**: nuppel.com hangi projeye baglanacak?

### Adim 2: Custom Domain Altyapisi Icin Lovable Platform Domain Mekanizmasini Kullan

Lovable platformu custom domainler icin `185.158.133.1` IP'sini kullaniyor ve bu IP arkasinda SSL + reverse proxy altyapisi var. Sitenin bu mekanizma uzerinden sunulmasi icin:

1. Lovable proje ayarlarindan domain'i baglamak gerekiyor
2. Veya kendi hosting cozumu (Cloudflare Tunnel, nginx reverse proxy vb.) kurulmali

### Adim 3: verify-domain Edge Function'ini Kontrol Et

Dogrulama basarili oldugunda `projects.custom_domain` sutununu dogru sekilde guncelliyor. Bu deger `public_projects` view'inda gorunur ve `PublicWebsite.tsx` tarafindan kullanilir. Bu kisim dogru calisiyor.

## Teknik Detay

```text
Custom Domain Akisi (Mevcut):

Kullanici domain ekler (add-custom-domain)
    |
    v
DNS kayitlarini yapilandirir (A: 185.158.133.1, TXT: _lovable)
    |
    v
Dogrulama (verify-domain) → status: active
    |
    v
projects.custom_domain guncellenir
    |
    v
PublicWebsite.tsx hostname eslemesi yapar
    |
    v
Site render edilir
```

Eksik olan: DNS'in `185.158.133.1`'e yonlendiginde bu trafigin gercekten `expert-page-gen.lovable.app` uygulamasina ulasmasi. Bu bir hosting/altyapi kararidir ve kod degisikligi ile cozulemez.

## Onerilen Yaklasim

1. **Kisa vadede**: Siteleri subdomain uzerinden sunmaya devam edin (`/site/subdomain`). Bu zaten calisiyor.
2. **Custom domain icin**: Lovable platformunun kendi domain baglama ozelligini kullanin (Proje Ayarlari -> Domains). Bu, Lovable'in `185.158.133.1` altyapisini kullanarak SSL ve routing saglar.
3. **Alternatif**: Cloudflare gibi bir CDN/proxy arkasinda custom domain'i `expert-page-gen.lovable.app/site/{subdomain}` adresine yonlendirin.
