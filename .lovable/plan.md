
## Sorunun Tam Analizi

### Mevcut Mimari (Netlify'dan kalan)

Editör → React bileşenleri (gerçek görüntü)
Vercel'e giden → Elle yazılmış HTML string renderer (farklı görüntü)

`deploy-to-vercel` edge function'ı, her section tipi için ayrı ayrı yazılmış ~1400 satırlık HTML string üretici içeriyor. Bu Netlify döneminden kalan bir yaklaşım. Editörde gördüğün React bileşeni ile Vercel'e giden HTML birbirinden farklı — bu yüzden "editörde göründüğü gibi yayınlansın" isteği ortaya çıkmış.

### Teknik Kısıtlama

Edge Function ortamında (Deno) React SSR yapılamaz. React bileşenlerini doğrudan server'da render edip HTML üretmek mümkün değil.

---

## Çözüm Yaklaşımı: React App Bundle Embed

Editörde görünen ile yayınlanan site arasındaki farkı kapatmanın en temiz yolu:

**Vercel'e tek sayfa React uygulaması deploy etmek** — ama `site_sections` ve `site_theme` veritabanından doğrudan çekilerek render edilecek.

### Nasıl Çalışacak

```text
Vercel'e giden HTML:
┌─────────────────────────────────────────────────────┐
│ <!DOCTYPE html>                                     │
│ <head>                                              │
│   <script src="https://cdn.tailwindcss.com">        │
│   <link href="Google Fonts...">                     │
│ </head>                                             │
│ <body>                                              │
│   <div id="root"></div>                             │
│   <script>                                          │
│     window.__SITE_DATA__ = {                        │
│       sections: [...],   ← DB'den alınan gerçek    │
│       theme: {...},         veriler gömülü          │
│       projectName: "...",                           │
│     };                                              │
│   </script>                                         │
│   <script type="module">                            │
│     // Preact ile section'ları render et            │
│     // Editördeki aynı mantığı kullanan hafif       │
│     // bileşenler                                   │
│   </script>                                         │
│ </body>                                             │
└─────────────────────────────────────────────────────┘
```

### Uygulama Planı

**1. `deploy-to-vercel` edge function güncellenir**

- Mevcut ~1400 satırlık elle yazılmış HTML renderer **korunur** ama iyileştirilir
- `isBase64Image` kontrolü kaldırılır → base64 görseller artık `data:image/...` URL olarak gömülür (Vercel'e gönderilir)
- Tema renkleri CSS variable olarak doğru aktarılır (editörle birebir aynı)
- Font uyumu sağlanır

**2. base64 görsel sorunu çözülür**

Şu an editörde yüklenen görseller (Supabase Storage'dan public URL olarak kaydediliyorsa sorun yok) fakat kullanıcı doğrudan dosya yüklüyorsa base64 olabilir. `isBase64Image` → `""` dönüşümü görsellerin kaybolmasına neden oluyor.

Supabase Storage zaten public URL kullanıyor (`ImageUploadButton.tsx` bunu doğruluyor). O yüzden base64 kontrolleri aslında yanlış alarm veriyor — storage'dan gelen URL'ler zaten `https://` ile başlıyor.

**3. Renderer doğruluk artışı**

Mevcut renderer'da eksik olan section tipleri için fallback eklenecek. Editördeki prop isimleriyle renderer'daki prop okuma uyumu kontrol edilecek.

---

## Yapılacak Değişiklikler

### Dosya: `supabase/functions/deploy-to-vercel/index.ts`

**Değişiklik 1 — isBase64Image kaldırılır, tüm görseller render edilir**

```typescript
// ÖNCE — görseli siliyor:
const bg = isBase64Image(rawBg) ? "" : rawBg;

// SONRA — base64 de dahil her URL render edilir:
const bg = rawBg;  // Supabase Storage zaten https:// döndürüyor
```

**Değişiklik 2 — Renk formatı düzeltilir**

Tema renkleri editörde hex (`#f97316`) olarak saklanıyor. CSS'e doğrudan hex olarak yazılacak — mevcut `buildThemeCssVars` zaten bunu yapıyor ama hex→HSL dönüşümü editörde yapılıyor, Vercel'de yapılmıyor. Bu tutarsızlık giderilecek.

**Değişiklik 3 — Eksik section tipleri için renderer eklenir**

`HeroMedical`, `AboutSection`, `NaturalHero` gibi editörde kullanılan ama renderer'da `default` case'e düşen tipler için proper HTML renderer yazılacak.

**Değişiklik 4 — Supabase Storage URL geçerliliği**

`ImageUploadButton.tsx` zaten Supabase Storage'a yükleyip public URL alıyor. Yani tüm kullanıcı görselleri `https://lpgyafvuihdymgsrmswh.supabase.co/storage/v1/object/public/...` formatında. Bu URL'ler HTML'de sorunsuz çalışır — `isBase64Image` kontrolü gereksiz yere bu URL'leri siliyor olabilir (URL uzunluğu 500+ karakter olabilir, regex yanlış match yapabilir).

---

## Özet

| | Şimdi | Sonra |
|---|---|---|
| Görseller | base64 ise silinir | Tüm URL'ler render edilir |
| Renkler | Editörle farklı olabilir | Hex birebir aynı |
| Eksik section'lar | Boş veya düz metin | Proper HTML |
| Mimari | Elle yazılmış HTML | Aynı (edge function'da React SSR yok) |

Bu değişikliklerle editörde görünen ile yayınlanan site maksimum uyuma kavuşacak.
