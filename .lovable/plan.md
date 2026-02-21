
# Vercel Deployment Entegrasyonu -- Tek Render Sistemi ile

## Mevcut Durum

Suanki `deploy-to-vercel` fonksiyonu sadece veritabaninda `is_published = true` isaretliyor. Gercek bir Vercel deploy'u yapmiyor. Siteler `expert-page-gen.lovable.app/site/{subdomain}` uzerinden sunuluyor.

## Sorun

- Kullanici kendi alan adini bagladiginda, DNS Lovable'in domainini gosteriyor ama Vercel'de barindirilmiyor
- `verify-domain` fonksiyonu Vercel'e domain kaydetmeye calisiyor ama ortada bir Vercel projesi yok (cunku deploy edilmiyor)
- Ozel domain akisi tam calismiyor

## Cozum: Vercel'e Redirect Projesi Deploy Etme

Her kullanici sitesi icin Vercel'e **kucuk bir redirect/rewrite projesi** deploy edilecek. Bu proje icerigi kendisi uretmeyecek, sadece tum trafigi ana React uygulamasina yonlendirecek.

```text
kullanici.com --> Vercel Projesi --> Rewrite --> expert-page-gen.lovable.app/site/{subdomain}
                                                          |
                                                   PublicWebsite.tsx
                                                          |
                                                   SectionRenderer (ayni bilesenler)
```

Bu sayede:
- Tek Render Sistemi korunur (editor = canli site)
- Her sitenin kendi Vercel projesi olur (custom domain destegi)
- SSL Vercel tarafindan otomatik saglanir
- Icerik her zaman guncel (rewrite ile ana app'ten cekilir)

---

## Degisiklik Plani

### Adim 1: deploy-to-vercel Edge Function -- Vercel Rewrite Deploy

**Dosya:** `supabase/functions/deploy-to-vercel/index.ts`

Fonksiyon su islemleri yapacak:

1. Kullaniciyi dogrula, proje sahipligini kontrol et
2. Veritabaninda `is_published = true`, `published_at = now()` olarak guncelle
3. Vercel API'sine `vercel.json` + bos `index.html` deploy et:
   - `vercel.json` icinde rewrite kurali: `/**` --> `https://expert-page-gen.lovable.app/site/{subdomain}/**`
4. Vercel proje ID'sini ve URL'yi veritabanina kaydet (`vercel_project_id`, `vercel_url`)
5. Eger proje daha once deploy edildiyse, mevcut Vercel projesine yeni deployment yap (tekrar olusturma)

Vercel'e gonderilecek dosyalar (sadece 2 dosya):

```text
vercel.json:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "https://expert-page-gen.lovable.app/site/{subdomain}/$1" }
  ]
}

index.html:
<!-- Bos, rewrite uzerinden yuklenir -->
```

### Adim 2: PublishModal.tsx -- Vercel URL Gosterimi

**Dosya:** `src/components/website-preview/PublishModal.tsx`

- Vercel'den donen URL'yi (`deployData.url`) gosterecek
- "Guncelle" butonu tekrar Vercel deploy tetikleyecek (rewrite guncelleme)
- Custom domain varsa o URL gosterilecek

### Adim 3: Custom Domain Akisi -- Vercel Entegrasyonu

Custom domain akisi zaten `verify-domain` fonksiyonunda mevcut. Vercel projesi deploy edildikten sonra:

1. Kullanici domain ekler (`add-custom-domain`)
2. DNS dogrulamasi yapar (`verify-domain`)
3. `verify-domain` dogrulama basarili olunca Vercel'e domain kaydeder (`registerVercelDomain`)
4. Vercel SSL otomatik saglar

Bu akis **zaten kodda mevcut**, sadece `vercel_project_id` dolu olmasi gerekiyor (Adim 1 bunu sagliyor).

---

## Teknik Detaylar

### Vercel Deployment API Kullanimi

Vercel v13 Deployments API ile dosya deploy etme:

```text
POST https://api.vercel.com/v13/deployments
{
  "name": "site-{subdomain}",
  "files": [
    { "file": "vercel.json", "data": "base64..." },
    { "file": "index.html", "data": "base64..." }
  ],
  "projectSettings": {
    "framework": null
  },
  "target": "production"
}
```

### Mevcut Secrets (Hazir)

- `VERCEL_API_TOKEN` -- Zaten mevcut
- `VERCEL_TEAM_ID` -- Zaten mevcut

### Veritabani Guncellemeleri

`projects` tablosundaki mevcut sutunlar kullanilacak:
- `vercel_project_id` -- Vercel proje ID'si
- `vercel_url` -- Vercel deployment URL'si  
- `vercel_custom_domain` -- Vercel'deki custom domain

Yeni sutun veya tablo gerekmiyor.

---

## Etkilenen Dosyalar

| Dosya | Degisiklik |
|---|---|
| `supabase/functions/deploy-to-vercel/index.ts` | Vercel rewrite deploy mantigi ekle (~80 satir) |
| `src/components/website-preview/PublishModal.tsx` | Vercel URL gosterimini guncelle |

---

## Avantajlar

- **Tek Render Sistemi korunur**: Icerik hala ayni React bilesenleriyle render edilir
- **Custom domain Vercel uzerinden**: SSL ve domain yonetimi Vercel'in guclu altyapisiyla
- **Hafif deploy**: Her siteye sadece 2 dosya (vercel.json + index.html) deploy edilir
- **Anlik guncelleme**: Rewrite sayesinde editordeki degisiklikler hemen yansir
- **Mevcut kod uyumu**: `verify-domain` fonksiyonu zaten Vercel domain entegrasyonuna sahip

## Risk

| Risk | Cozum |
|---|---|
| Rewrite latency | Vercel CDN edge'de rewrite yapar, ek gecikme minimal (~10ms) |
| SEO | Rewrite 308 degil, proxy gibi calisir -- arama motorlari icin sorun yok |
| Vercel rate limit | Her deploy sadece 2 dosya, API limiti dahilinde |
