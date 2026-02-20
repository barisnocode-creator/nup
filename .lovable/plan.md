
## Amaç

Blog yazılarına tıklanınca **ayrı bir URL sayfasına** gitmesini sağlamak. Şu an blog detayı aynı sayfada (component state ile) açılıyor. Kullanıcı `/site/{subdomain}/blog/{slug}` gibi gerçek URL rotalarında açılmasını istiyor.

---

## Mevcut Durum vs Hedef

**Şu an:**
```
/site/benim-sitem  →  Blog listesi + tıklayınca aynı sayfada state değişiyor
```

**Hedef:**
```
/site/benim-sitem           →  Ana sayfa (blog kartları görünür)
/site/benim-sitem/blog      →  Blog listesi sayfası (tüm yazılar)
/site/benim-sitem/blog/slug →  Blog detay sayfası (ayrı URL, SEO uyumlu)
```

---

## Mimari Değişiklikler

### 1. `src/App.tsx` — Yeni Rotalar

```
/site/:subdomain                 →  PublicWebsite (mevcut)
/site/:subdomain/blog            →  PublicBlogPage (YENİ)
/site/:subdomain/blog/:slug      →  PublicBlogPostPage (YENİ)
```

### 2. `src/pages/PublicBlogPage.tsx` — YENİ DOSYA

Subdomain'e göre projeyi Supabase'den çeker → `site_sections` içindeki `AddableBlog` section'ını bulur → 4 blog kartını listeler.

Her kart tıklanınca → `useNavigate('/site/${subdomain}/blog/${slug}')` ile gerçek URL navigasyonu.

### 3. `src/pages/PublicBlogPostPage.tsx` — YENİ DOSYA

`/site/:subdomain/blog/:slug` parametrelerini alır → Supabase'den projeyi çeker → blog verilerini bulur → `BlogPostDetailSection` bileşenini render eder.

"Geri Dön" → `/site/${subdomain}/blog` veya `/site/${subdomain}` gider.

### 4. `src/components/sections/addable/BlogSection.tsx` — GÜNCELLE

Kart tıklama: `setActiveBlogSlug(post.slug)` → `window.location.href` veya `useNavigate` ile URL tabanlı navigasyon.

Eğer `isEditing` modundaysa (editörde önizleme) → eski davranış (state based) korunur.
Eğer public siteyse → URL navigasyonu kullanılır.

Bunu anlamak için `isEditing` prop'u zaten mevcut — bunu kullanacağız:
- `isEditing = true` → state tabanlı (editörde çalışır)
- `isEditing = false` → URL navigasyonu (public sitede çalışır)

### 5. `src/components/sections/addable/BlogPostDetailSection.tsx` — GÜNCELLE

`onBack` çağrısı yerine, public sitede URL tabanlı "Geri" navigasyonu. "İlgili Yazılar" kartları da tıklanınca URL'e gider.

---

## Navigasyon Akışı (Public Site)

```
/site/benim-sitem
    │
    │  [Ana sayfada Blog bölümü görünür]
    │  "Devamını Oku" butonuna tıkla
    ▼
/site/benim-sitem/blog/sektor-son-gelismeler
    │
    │  [Full blog detay sayfası]
    │  Başlık, içerik, paylaşım butonları
    │  "Bloga Dön" butonu
    ▼
/site/benim-sitem
```

---

## Editör vs Public Site Davranışı

| Ortam | Blog Kartı Tıklama | Detay Görünümü |
|---|---|---|
| Editörde (`isEditing=true`) | State değişir (mevcut) | Aynı sayfada açılır |
| Public sitede (`isEditing=false`) | URL navigasyonu | Yeni sayfa `/blog/slug` |

Bu sayede editör önizlemesi bozulmaz, public sitede gerçek URL routing çalışır.

---

## SEO Avantajı

Her blog yazısının kendi URL'i olacak:
- `/site/benim-sitem/blog/sektor-son-gelismeler` — Google bu sayfayı ayrı indeksler
- Her sayfada canonical URL, og:url, meta title doğru set edilir
- Sitemap'te bu URL'ler zaten oluşturuluyor

---

## Değiştirilecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/App.tsx` | 2 yeni rota ekle: `/site/:subdomain/blog` ve `/site/:subdomain/blog/:slug` |
| 2 | `src/pages/PublicBlogPage.tsx` | YENİ — blog listesi sayfası |
| 3 | `src/pages/PublicBlogPostPage.tsx` | YENİ — blog detay sayfası |
| 4 | `src/components/sections/addable/BlogSection.tsx` | `isEditing=false` durumunda URL navigasyonu |
| 5 | `src/components/sections/addable/BlogPostDetailSection.tsx` | Geri/ilgili yazı linkleri URL tabanlı |

---

## `PublicBlogPostPage.tsx` Mantığı (Özet)

```typescript
// URL: /site/:subdomain/blog/:slug
const { subdomain, slug } = useParams();

// Supabase'den projeyi çek
const { data } = await supabase
  .from('public_projects')
  .select('site_sections, name, ...')
  .eq('subdomain', subdomain)
  .single();

// AddableBlog section'ını bul
const blogSection = data.site_sections.find(s => s.type === 'AddableBlog');

// Slug'a göre postu bul
const posts = extractPostsFromProps(blogSection.props);
const post = posts.find(p => p.slug === slug);

// Render
return <BlogPostDetailSection post={post} ... />;
```

---

## `BlogSection.tsx` Navigasyon Mantığı

```typescript
// Public sitede (isEditing=false):
const handleCardClick = (slug: string) => {
  if (isEditing) {
    setActiveBlogSlug(slug); // editörde state bazlı
  } else {
    // Subdomain'i URL'den al
    const pathParts = window.location.pathname.split('/');
    const subdomain = pathParts[2]; // /site/{subdomain}/...
    window.location.href = `/site/${subdomain}/blog/${slug}`;
  }
};
```
