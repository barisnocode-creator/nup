

# Tek Render Sistemi -- Vercel HTML Uretimini Kaldirma Plani

## Mevcut Sorun

Sistemde iki ayri render motoru var:

1. **Editor/Preview (React)**: `SectionRenderer.tsx` + 50+ React bilesen -- animasyonlar, tema degiskenleri, Tailwind CSS
2. **Yayinlanan Site (Vercel)**: `deploy-to-vercel/index.ts` icerisinde 1338 satirlik elle yazilmis HTML string uretici -- animasyon yok, font/renk kaymasi, her yeni section icin ayri renderer yazmak gerekiyor

Sonuc: Editor'de gorunen ile yayinlanan site hicbir zaman birebir ayni degil.

---

## Cozum: Tek Render Sistemi

Yayinlanan siteler icin ayri HTML uretmeyi tamamen birakiyoruz. Yerine, **ayni React uygulamasi** uzerinden tum siteler sunulacak.

```text
SUAN (yanlis):
klinik.vercel.app  -->  Statik HTML (farkli gorunum, animasyon yok)

OLMASI GEREKEN:
expert-page-gen.lovable.app/site/klinik  -->  PublicWebsite.tsx
                                                    |
                                              SectionRenderer (ayni bilesenler)
                                                    |
                                        Editor ile birebir ayni gorunum
```

**Kritik avantaj**: `PublicWebsite.tsx` zaten var ve calisiyor! `/site/:subdomain` rotasi uzerinden `SectionRenderer` ile ayni React bilesenlerini kullaniyor. Tek yapmamiz gereken, Vercel deploy islemini basitlestirmek.

---

## Degisiklik Plani

### Adim 1: deploy-to-vercel Edge Function -- Basitlestirme

**Dosya:** `supabase/functions/deploy-to-vercel/index.ts`

1338 satirlik HTML renderer tamamen kaldirilacak. Yerine sadece su islemleri yapacak:

- Projeyi `is_published = true` olarak isaretler
- `subdomain` kaydeder
- `published_at` tarihini gunceller
- Vercel deploy **yapmaz** (HTML uretmez)
- Mevcut `vercel_project_id` varsa Vercel'deki siteyi redirect'e cevirir (ana uygulamaya yonlendirir)

Fonksiyon ~50 satira dusecek (1338'den).

### Adim 2: PublicWebsite.tsx -- Custom Domain Destegi

**Dosya:** `src/pages/PublicWebsite.tsx`

Mevcut hali sadece URL parametresinden (`/site/:subdomain`) subdomain okuyor. Ek olarak:

- `window.location.hostname` kontrol edilecek
- Eger hostname bilinen bir platform domaini degilse (lovable.app degil), `custom_domains` tablosundan proje aranacak
- Boylece `klinik.com` gibi ozel alan adlari da ayni React bilesenleriyle render edilecek

```text
Akis:
1. hostname = "klinik.com" mi?
2. Evet --> custom_domains tablosunda ara --> project_id bul
3. public_projects'ten site_sections + site_theme cek
4. SectionRenderer ile render et (editor ile birebir ayni)
```

### Adim 3: App.tsx -- Custom Domain Routing

**Dosya:** `src/App.tsx`

Ana routing'e bir "domain resolver" eklenir:

- Sayfa yuklendiginde `window.location.hostname` kontrol edilir
- Eger hostname platform domaini degilse (lovable.app veya localhost degilse), otomatik olarak `PublicWebsite` bilesenine yonlendirilir
- Normal kullanici rotalarini (dashboard, editor vs.) etkilemez

### Adim 4: PublishModal.tsx -- URL Gosterimini Guncelle

**Dosya:** `src/components/website-preview/PublishModal.tsx`

- Vercel URL yerine platform URL'si gosterilecek: `expert-page-gen.lovable.app/site/{subdomain}`
- Guncelleme butonu artik Vercel'e deploy yapmak yerine sadece `is_published` ve `published_at`'i guncelleyecek (degisiklikler aninda canli olacak cunku ayni DB'den okuyor)
- Custom domain bagli ise o URL gosterilecek

### Adim 5: public_projects View -- custom_domain ile Arama

Veritabaninda `public_projects` gorunumune `custom_domain` alani zaten mevcut. `PublicWebsite.tsx`'ten hostname ile sorgulama yapilabilecek.

### Adim 6: EditorToolbar -- Guncelle Butonu Basitlestirme

**Dosya:** `src/components/website-preview/EditorToolbar.tsx` (veya ilgili toolbar)

"Guncelle" butonu artik Vercel deploy tetiklemeyecek. Site zaten DB'den canli okunuyor, editordeki degisiklikler kaydedildiginde otomatik olarak canli siteye yansiyacak. "Guncelle" butonu sadece `published_at` tarihini guncelleyecek.

---

## Kaldirilacak Kod

| Dosya/Bolum | Satir Sayisi | Aciklama |
|---|---|---|
| `deploy-to-vercel` HTML renderers | ~1100 satir | 80+ section renderer fonksiyonu |
| `deploy-to-vercel` Vercel API cagrilari | ~100 satir | base64 encoding, deployment API |
| Toplam kaldirilacak | **~1200 satir** | |

---

## Ozel Alan Adi (Custom Domain) Akisi

```text
SUAN:
kullanici.com --> CNAME --> Vercel project --> Statik HTML

YENI:
kullanici.com --> CNAME --> expert-page-gen.lovable.app
                                    |
                        App.tsx hostname kontrol eder
                                    |
                        PublicWebsite yukler (React)
                                    |
                        SectionRenderer (editor ile ayni)
```

Custom domain DNS kayitlari:
- A kaydi: Lovable'in IP'sine (185.158.133.1)
- CNAME: expert-page-gen.lovable.app

**Not**: Lovable altyapisi zaten custom domain destekliyor. `verify-domain` ve `add-custom-domain` fonksiyonlari DNS dogrulamasini yapiyor. Domain dogrulandiktan sonra, Lovable platformu o domain'i bu projeye yonlendirecek.

---

## Etkilenen Dosyalar

| Dosya | Degisiklik | Karmasiklik |
|---|---|---|
| `supabase/functions/deploy-to-vercel/index.ts` | 1338 satir --> ~50 satir (HTML renderer kaldir) | Yuksek |
| `src/pages/PublicWebsite.tsx` | Custom domain hostname cozumlemesi ekle | Orta |
| `src/App.tsx` | Domain-based routing ekle | Orta |
| `src/components/website-preview/PublishModal.tsx` | URL gosterimini guncelle, Vercel deploy kaldir | Orta |
| `src/components/website-preview/EditorToolbar.tsx` | Guncelle butonunu basitlestir | Dusuk |
| `src/components/website-preview/DomainSettingsModal.tsx` | DNS talimatlari guncelle (Lovable IP) | Dusuk |

---

## Avantajlar

- **Birebir parity**: Editor = yayinlanan site (ayni React bilesenleri)
- **Animasyonlar calisiyor**: Framer Motion, IntersectionObserver, parallax -- hepsi yayinda
- **1200+ satir kod kaldirilir**: Bakim yuku azalir
- **Yeni section = 1 yere yaz**: Her yeni bolum otomatik olarak yayinda da calisiyor
- **Anlik guncelleme**: Editorde kaydet = canli sitede gorunur (Vercel deploy beklemeye gerek yok)
- **Font/renk tutarliligi**: CSS variables ayni sekilde calisiyor

## Riskler ve Cozumleri

| Risk | Cozum |
|---|---|
| SEO -- SPA'da sayfa kaynagi bos gorunebilir | `<meta>` tag'lari ve Open Graph bilgileri `document.head`'e enjekte ediliyor (mevcut kodda zaten var) |
| Performans -- Ana app buyuyebilir | PublicWebsite zaten lazy-loaded, ek yuk minimal |
| Mevcut Vercel URL'leri bozulur | Vercel projelerini kaldiramayiz ama yeni yayinlamalarda kullanilmayacak. Eski URL'ler icin redirect middleware eklenebilir |

---

## Teknik Detaylar

### PublicWebsite.tsx -- Hostname Cozumleme Mantigi

```text
function resolveProject():
  1. URL'de /site/:subdomain varsa --> subdomain ile ara (mevcut mantik)
  2. Yoksa hostname kontrol et
     - hostname lovable.app veya localhost ise --> 404
     - baska bir hostname ise:
       a. public_projects'te custom_domain = hostname ile ara
       b. Bulunamazsa 404
       c. Bulunursa --> site_sections + site_theme ile render et
```

### deploy-to-vercel Yeni Hali (ozet)

```text
Deno.serve(async (req) => {
  // Auth kontrol
  // Projeyi getir
  // is_published = true, published_at = now() olarak guncelle
  // { success: true, url: "expert-page-gen.lovable.app/site/{subdomain}" } don
})
```

