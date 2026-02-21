

# Vercel Deployment'i Kaldir, Lovable Uzerinden Yayinla

## Ozet

Yayinlama akisindan Vercel entegrasyonunu kaldirip, siteleri dogrudan Lovable platformu uzerinden yayinlayacagiz. Siteler `https://expert-page-gen.lovable.app/site/{subdomain}` adresinden erislebilir olacak.

## Yapilacak Degisiklikler

### 1. PublishModal.tsx -- Vercel cagrisini kaldir

`handlePublish` fonksiyonunda `deploy-to-vercel` edge function cagrisi kaldirilacak. Yerine sadece veritabani guncellenmesi yapilacak:

- `is_published = true`
- `published_at = now()`
- `subdomain = secilen_subdomain`

`handleUpdate` fonksiyonunda da ayni sekilde Vercel cagrisi kaldirilip sadece `published_at` guncellenecek.

`buildPublicUrl` fonksiyonu sadece Lovable URL'si dondurecek:
```
https://expert-page-gen.lovable.app/site/{subdomain}
```

### 2. EditorToolbar.tsx -- Degisiklik yok

Toolbar zaten genel "Yayinla/Guncelle" butonlari kullaniyor, Vercel'e bagli degil.

### 3. Etkilenen Dosyalar

| Dosya | Degisiklik |
|---|---|
| `src/components/website-preview/PublishModal.tsx` | `deploy-to-vercel` cagrisi kaldirilacak, dogrudan DB update yapilacak |

## Teknik Detaylar

### handlePublish (yeni akis)

```text
1. Subdomain'i projects tablosuna kaydet
2. is_published = true, published_at = now() olarak guncelle
3. URL'yi "https://expert-page-gen.lovable.app/site/{subdomain}" olarak goster
4. Basari mesaji goster
```

### handleUpdate (yeni akis)

```text
1. published_at = now() olarak guncelle
2. Basari mesaji goster
```

### buildPublicUrl (sadece Lovable)

```text
Vercel ve custom domain kontrolleri kaldirilacak.
Sadece: https://expert-page-gen.lovable.app/site/{subdomain}
```

## Kaldirilan Bagimliliklar

- `deploy-to-vercel` edge function artik cagrilmayacak (kod silinmeyecek, sadece kullanilmayacak)
- `vercel_url` alani artik okunmayacak/yazilmayacak

