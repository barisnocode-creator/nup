

## Amaç

Blog section'ını eklenebilir bölüm olarak eklemek, 4 blog kartı göstermek, her blog gönderisinin kendi SEO-dostu detay sayfasına sahip olmasını sağlamak ve Google Sitemap desteği eklemek.

---

## Mimari Genel Bakış

```text
Eklenebilir Bölümler
       │
       ▼
"📝 Blog Köşesi" toggle → AddableBlogSection.tsx
       │
       ▼
site_sections içinde { type: 'AddableBlog' }
       │
       ├── Blog liste kartları (4 yazı)
       ├── Her kart tıklanabilir → blog detay sayfası
       │       - SEO meta tags (title, description, keywords)
       │       - Open Graph tags
       │       - Görseller (Pixabay'dan)
       │       - İçerik (başlıklar, paragraflar, backlink)
       └── Sitemap → /sitemap.xml endpoint (edge function)
```

---

## Yapılacaklar (5 Dosya + 1 Edge Function)

### 1. `src/components/sections/addable/BlogSection.tsx` — YENİ

4 blog kartı gösteren addable section. Her kart:
- Pixabay'dan alınan `featuredImage`
- Kategori rozeti, başlık, özet, tarih
- "Devamını Oku →" butonu

Props şeması:
```typescript
{
  sectionTitle: 'Blog & Haberler',
  sectionSubtitle: 'Güncel makalelerimizi keşfedin',
  post1Title, post1Category, post1Excerpt, post1Image, post1Date, post1Slug,
  post2Title, post2Category, post2Excerpt, post2Image, post2Date, post2Slug,
  post3Title, post3Category, post3Excerpt, post3Image, post3Date, post3Slug,
  post4Title, post4Category, post4Excerpt, post4Image, post4Date, post4Slug,
}
```

Tasarım: 2x2 grid (md: 2 kolon, lg: 4 kolon), aspect-[3/2] görsel, hover shadow efekti.

---

### 2. `src/components/sections/addable/BlogPostDetailSection.tsx` — YENİ

Blog gönderisi detay görünümü. Slug bazlı, SEO uyumlu:

```typescript
// Dinamik meta tag enjeksiyonu (useEffect ile)
document.title = `${post.title} | ${siteName}`;
// meta description, keywords, og:title, og:image, og:description
// canonical URL
```

İçerik yapısı:
- Hero görseli (tam genişlik)
- Breadcrumb: Ana Sayfa > Blog > Başlık
- H1 başlık + kategori + tarih
- İçerik paragrafları (H2/H3 destekli)
- **Backlink bölümü**: "Bu makaleyi beğendiyseniz paylaşın" → sosyal paylaşım linkleri (Twitter/X, LinkedIn, WhatsApp)
- İlgili Yazılar (diğer 3 karttan)

---

### 3. `src/components/sections/registry.ts` — GÜNCELLE

```typescript
import { BlogSection } from './addable/BlogSection';
// ...
'AddableBlog': BlogSection,
```

---

### 4. `src/components/editor/useEditorState.ts` — GÜNCELLE

`addableSectionConfig`'e ekle:
```typescript
blog: { 
  type: 'AddableBlog', 
  defaultProps: {
    sectionTitle: 'Blog & Haberler',
    post1Title: 'Başlık 1', post1Category: 'Genel', post1Excerpt: '...', 
    post1Image: '', post1Date: '2026-01-15', post1Slug: 'konu-1',
    post2Title: 'Başlık 2', post2Category: 'İpuçları', ...
    post3Title: 'Başlık 3', ...
    post4Title: 'Başlık 4', ...
  } 
},
```

---

### 5. `src/components/editor/CustomizePanel.tsx` — GÜNCELLE

`universalToggles` listesine ekle:
```typescript
{ key: 'blog', label: '📝 Blog Köşesi' },
```

---

### 6. `src/components/sections/SectionRenderer.tsx` — GÜNCELLE

Blog kartına tıklanınca blog detay görünümüne geçiş için:
- `AddableBlog` section tıklanınca → `BlogPostDetailSection` render edilir
- State: `{ activeBlogPost: string | null }` — null ise liste, string (slug) ise detay gösterir
- "Geri Dön" butonu ile listeye döner

---

### 7. `supabase/functions/sitemap/index.ts` — YENİ Edge Function

```typescript
// GET /sitemap/{subdomain}
// Response: application/xml
// İçerik:
// - Ana sayfa
// - Hizmetler sayfası
// - Blog post URL'leri (her kart için)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://{subdomain}.openlucius.com</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://{subdomain}.openlucius.com/blog/konu-1</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>{post1Image}</image:loc>
      <image:title>{post1Title}</image:title>
    </image:image>
  </url>
  ...
</urlset>`;
```

---

### 8. `src/pages/PublicWebsite.tsx` — GÜNCELLE

`/sitemap.xml` veya `/robots.txt` route'u için yönlendirme meta tag'ı:
```html
<!-- <head> içine dinamik olarak -->
<link rel="sitemap" type="application/xml" href="/functions/v1/sitemap/{subdomain}" />
```

---

## SEO Detayları

Blog detay sayfasında `useEffect` ile şunlar enjekte edilir:

| Meta Tag | Değer |
|---|---|
| `<title>` | `{postTitle} \| {siteName}` |
| `meta description` | Post özeti (max 160 karakter) |
| `meta keywords` | Kategori + sektör + başlık kelimeleri |
| `og:title` | Post başlığı |
| `og:description` | Özet |
| `og:image` | Pixabay'dan alınan görselin URL'i |
| `og:url` | Canonical URL |
| `meta robots` | `index, follow` |
| `link canonical` | Site URL + blog slug |

---

## Backlink Mekanizması

Blog detay sayfasında sosyal paylaşım butonları:
- **Twitter/X**: `https://twitter.com/intent/tweet?url={canonicalUrl}&text={title}`
- **LinkedIn**: `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}`  
- **WhatsApp**: `https://wa.me/?text={title}%20{canonicalUrl}`
- **Kopyala**: Clipboard API ile URL kopyalama

Bu butonlar hem backlink oluşturur hem de sosyal sinyaller sağlar.

---

## Blog Section Görsel Tasarımı

```text
┌─────────────────────────────────────────┐
│        Blog & Haberler                  │
│    Güncel makalelerimizi keşfedin       │
├──────────┬──────────┬──────────┬────────┤
│[görsel]  │[görsel]  │[görsel]  │[görsel]│
│          │          │          │        │
│ Kategori │ Kategori │ Kategori │Kategori│
│ Başlık 1 │ Başlık 2 │ Başlık 3 │Başlık 4│
│ Özet...  │ Özet...  │ Özet...  │Özet... │
│ 15 Oca   │ 20 Oca   │ 25 Oca   │ 1 Şub  │
│Devamı →  │Devamı →  │Devamı →  │Devamı→ │
└──────────┴──────────┴──────────┴────────┘
```

---

## Değiştirilecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/components/sections/addable/BlogSection.tsx` | YENİ — 4 kartlı blog listesi |
| 2 | `src/components/sections/addable/BlogPostDetailSection.tsx` | YENİ — SEO detay sayfası |
| 3 | `src/components/sections/registry.ts` | `AddableBlog` kaydı |
| 4 | `src/components/editor/useEditorState.ts` | `blog` config ekleme |
| 5 | `src/components/editor/CustomizePanel.tsx` | Blog toggle ekleme |
| 6 | `src/components/sections/SectionRenderer.tsx` | Blog detay geçiş state |
| 7 | `supabase/functions/sitemap/index.ts` | YENİ — XML sitemap edge function |

