
## Hedef URL Yapısı

```
/site/aysu-psikoloji              →  Ana sayfa (blog bölümü preview gösterir)
/site/aysu-psikoloji/blog         →  Blog listesi sayfası (tüm yazılar)
/site/aysu-psikoloji/blog/slug-1  →  Blog yazısı detay sayfası
```

---

## Sorunlar ve Çözümler

### Sorun 1: Ana sayfada "Devamını Oku" → Direkt detay sayfasına gidiyor

**Çözüm:** `BlogSection.tsx`'de her kart tıklaması, blog listesi `/site/{sub}/blog` sayfasına gitsin. Alternatif olarak kartlara tıklayınca detaya git, ama bölüm başlığına veya ek bir butona "Tüm Blogları Gör →" ekle.

En mantıklı UX: Ana sayfadaki "Devamını Oku" butonu → `/site/{sub}/blog/{slug}` (detaya direkt git). Bölüm başlığına ek olarak **"Tüm Yazıları Gör"** linki ekle → `/site/{sub}/blog`. Böylece kullanıcı hem direkt okuyabilir hem de blog liste sayfasını keşfedebilir.

### Sorun 2: Blog detay sayfasında "Geri" butonu ana sayfaya gidiyor

**Çözüm:** `PublicBlogPostPage.tsx`'de `onBack` fonksiyonu `/site/${subdomain}` yerine `/site/${subdomain}/blog` adresine gitsin.

### Sorun 3: Blog görselleri editörde değiştirilemiyor

**Çözüm:** `BlogSection.tsx`'e `isEditing` modunda her kart üzerine bir **görsel değiştir** butonu ekle. Tıklayınca küçük bir Pixabay arama modalı açılsın (mevcut `PixabayImagePicker` bileşeni zaten var), seçilen görsel `onUpdate` ile props'a kaydedilsin.

---

## Değiştirilecek Dosyalar (4 adet)

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/components/sections/addable/BlogSection.tsx` | "Tüm Yazıları Gör" butonu + editörde görsel değiştirme |
| 2 | `src/pages/PublicBlogPage.tsx` | Kart tıklama → aynı sekmede detaya git (window.open yerine navigate) |
| 3 | `src/pages/PublicBlogPostPage.tsx` | "Geri" butonu → `/site/${subdomain}/blog` |
| 4 | `src/components/sections/addable/BlogPostDetailSection.tsx` | "Bloga Dön" metni ve `onBack` → blog listesine yönlendir |

---

## Detaylı Değişiklikler

### 1. `BlogSection.tsx` — "Tüm Yazıları Gör" + Görsel Değiştirme

**"Tüm Yazıları Gör" butonu** — bölüm başlığının altına eklenir, sadece `isEditing=false` durumunda URL'e bağlanır:

```tsx
{/* Bölüm başlığı altına */}
{!isEditing && (
  <a
    href={`/site/${subdomain}/blog`}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors mt-4"
  >
    Tüm Yazıları Gör
    <ArrowRight className="w-4 h-4" />
  </a>
)}
```

Subdomain'i URL'den alır: `const subdomain = window.location.pathname.split('/')[2];`

**Görsel değiştirme** — `isEditing=true` modunda, her kart üzerinde hover'da "Görsel Değiştir" butonu görünür. Tıklayınca `PixabayImagePicker` bileşeni açılır, seçilen görsel `onUpdate({ post1Image: url })` ile kaydedilir:

```tsx
{isEditing && (
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
    <button
      onClick={(e) => { e.stopPropagation(); setEditingImageSlug(post.slug); }}
      className="px-3 py-2 bg-white rounded-lg text-xs font-semibold text-gray-800 shadow-lg flex items-center gap-1.5"
    >
      <ImageIcon className="w-3.5 h-3.5" />
      Görsel Değiştir
    </button>
  </div>
)}
```

`PixabayImagePicker` modal state yönetimi:
```tsx
const [editingImageSlug, setEditingImageSlug] = useState<string | null>(null);

// Görsel seçince:
const handleImageSelect = (url: string) => {
  const index = posts.findIndex(p => p.slug === editingImageSlug) + 1;
  onUpdate?.({ [`post${index}Image`]: url });
  setEditingImageSlug(null);
};
```

### 2. `PublicBlogPage.tsx` — Aynı Sekmede Aç

Şu an: `window.open(url, '_blank')` — yeni sekme açıyor.
Yeni: `navigate(url)` — aynı sekmede blog sayfası içinde kalır, tarayıcı geçmişi çalışır.

Blog listesi kendi bağımsız sayfası olduğu için aynı sekmede açmak daha doğru UX.

### 3. `PublicBlogPostPage.tsx` — Geri Dön Düzeltme

```tsx
// Eski:
onBack={() => navigate(`/site/${subdomain}`)}

// Yeni:
onBack={() => navigate(`/site/${subdomain}/blog`)}
```

### 4. `BlogPostDetailSection.tsx` — "Bloga Dön" Metni

"Geri" yerine "Bloga Dön" metni zaten var. `onBack` bağlantısını `PublicBlogPostPage`'den alıyor, orası düzeltilince otomatik çalışır. Breadcrumb'daki "Blog" tıklaması da güncellenir:

```tsx
// Breadcrumb'da Blog linki:
<span
  className="hover:text-foreground cursor-pointer"
  onClick={() => {
    // subdomain varsa blog listesine git, yoksa onBack
    if (subdomain) {
      window.location.href = `/site/${subdomain}/blog`;
    } else {
      onBack();
    }
  }}
>
  Blog
</span>
```

---

## Görsel Akış (Sonuç)

```
Ana Sayfa (/site/aysu-psikoloji)
  │
  ├── Blog bölümü: 4 kart gösterilir
  │     ├── "Devamını Oku" → /site/aysu-psikoloji/blog/slug-1 (aynı sekme)
  │     └── "Tüm Yazıları Gör →" butonu → /site/aysu-psikoloji/blog
  │
Blog Listesi (/site/aysu-psikoloji/blog)
  │   Kendi başlığı, tüm yazılar grid'de
  │     └── Kart tıkla → /site/aysu-psikoloji/blog/slug-1 (aynı sekme, navigate)
  │
Blog Detayı (/site/aysu-psikoloji/blog/slug-1)
      └── "Bloga Dön" → /site/aysu-psikoloji/blog (geri)
      └── Breadcrumb: Ana Sayfa > Blog > Yazı Başlığı
      └── İlgili Yazılar → /site/aysu-psikoloji/blog/slug-2
```

---

## Editörde Görsel Değiştirme Akışı

```
Editörde blog bölümüne gel
  │
  └── Kart üzerine hover yap
        └── "Görsel Değiştir" butonu belirir
              └── Tıkla → Pixabay arama modalı açılır
                    └── Görsel seç → props'a kaydedilir → kart güncellenir
```
