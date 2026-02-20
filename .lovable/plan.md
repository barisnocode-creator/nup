
## Amaç

Kullanıcı 3 şey istiyor:

1. Blog kartlarına Pixabay'dan otomatik görsel gelsin (şu an boş görünüyor)
2. Blog kartları 3:2 oranda olsun (zaten var, görsel gelince düzelecek)
3. "Devamını Oku" tıklanınca ayrı sekmede açılsın (yeni tab)

---

## Mevcut Durum

- `BlogSection.tsx`: Kartlarda `post1Image` boşsa kitap ikonu gösteriyor → görsel yok
- Kart tıklama: `window.location.href` kullanıyor → aynı sekmede açılıyor
- `PublicBlogPage.tsx`: `navigate()` kullanıyor → aynı sekmede açılıyor

---

## Çözüm

### 1. Pixabay Otomatik Görsel Yükleme — `BlogSection.tsx`

Blog section ilk açıldığında boş görselli postlar için otomatik Pixabay araması yapılacak.

Strateji:
- `useEffect` ile boş image alanlarını kontrol et
- Her boş görsel için `search-pixabay` edge function'ına çağrı yap (sektöre uygun sorgu: "blog article professional" veya post başlığından türetilmiş)
- Gelen görsel URL'lerini local state'te sakla (props'a yazılmaz, anlık gösterim için)
- Editörde kullanıcı manuel görsel ekleyebilir (PixabayImagePicker zaten var)

Arama sorgusu mantığı:
- Post başlığı varsa → başlıktan anahtar kelimeler çıkar
- Kategori bazlı → "Genel: blog professional article", "İpuçları: tips advice guide", "Rehber: guide tutorial steps", "Başarı: success achievement results"

### 2. Ayrı Sekme Açma — `BlogSection.tsx` ve `PublicBlogPage.tsx`

`BlogSection.tsx`:
```typescript
// Eski (aynı sekme):
window.location.href = `/site/${sub}/blog/${post.slug}`;

// Yeni (yeni sekme):
window.open(`/site/${sub}/blog/${post.slug}`, '_blank');
```

`PublicBlogPage.tsx`:
```typescript
// Eski:
onClick={() => navigate(`/site/${subdomain}/blog/${post.slug}`)}

// Yeni:
onClick={() => window.open(`/site/${subdomain}/blog/${post.slug}`, '_blank')}
```

---

## Değiştirilecek Dosyalar

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/components/sections/addable/BlogSection.tsx` | Pixabay otomatik görsel + yeni sekme açma |
| 2 | `src/pages/PublicBlogPage.tsx` | Kart tıklama → yeni sekme |

---

## BlogSection Otomatik Görsel Mantığı (Detay)

```typescript
const [autoImages, setAutoImages] = useState<Record<string, string>>({});

useEffect(() => {
  const fetchMissing = async () => {
    for (const post of posts) {
      if (!post.image && !autoImages[post.slug]) {
        const query = getCategoryQuery(post.category, post.title);
        const { data } = await supabase.functions.invoke('search-pixabay', {
          body: { query, perPage: 3 }
        });
        if (data?.images?.[0]) {
          setAutoImages(prev => ({
            ...prev,
            [post.slug]: data.images[0].largeImageURL
          }));
        }
      }
    }
  };
  fetchMissing();
}, []); // sadece bir kez

// Görsel gösterimde:
const displayImage = post.image || autoImages[post.slug] || '';
```

Kategori → sorgu eşlemesi:
- `Genel` → `professional blog article modern office`
- `İpuçları` → `tips advice professional guide book`
- `Rehber` → `guide tutorial steps learning education`
- `Başarı` → `success achievement business growth`
- Diğer → `professional article blog content`

---

## Görsel Akış

```text
BlogSection render
       │
       ▼
post.image boş mu?
  Evet → Pixabay'dan arka planda çek (useEffect)
          → autoImages state güncelle
          → Kart görsel göster
  Hayır → Direkt göster
       │
       ▼
"Devamını Oku" tıkla
       │
       isEditing=true → state değiş (editörde aynı)
       isEditing=false → window.open('...', '_blank') → YENİ SEKME
```
