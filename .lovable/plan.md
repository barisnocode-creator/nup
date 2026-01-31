

# Studio'ya Favicon Oluşturma Özelliği Ekleme

## Genel Bakış

Studio'ya yeni bir görsel tipi olarak **Favicon** eklenecek. Kullanıcılar favicon için optimize edilmiş küçük ikonlar oluşturabilecek ve bunları doğrudan web sitelerine uygulayabilecek.

---

## Kullanıcı Deneyimi

```text
+------------------------------------------------------------------+
|  [Logo] [Favicon*] [Sosyal] [Poster] [Yaratıcı]                  |
+------------------------------------------------------------------+
                      |
                      v
+------------------------------------------------------------------+
|  Favicon için prompt alanı                                        |
|  "Modern minimalist F harfi ikonu"                                |
|                                [Oluştur]                          |
+------------------------------------------------------------------+
                      |
                      v
+------------------------------------------------------------------+
|  32x32 önizleme   |   64x64 önizleme   |   256x256 önizleme      |
|  [Browser tab]    |   [Toolbar]        |   [Yüksek çözünürlük]   |
+------------------------------------------------------------------+
```

---

## Teknik Değişiklikler

### 1. ImageType Güncellemesi

**Dosya:** `src/pages/Studio.tsx`

```typescript
// Önceki
export type ImageType = 'logo' | 'social' | 'poster' | 'creative';

// Sonrası
export type ImageType = 'logo' | 'favicon' | 'social' | 'poster' | 'creative';
```

---

### 2. ImageTypeCards Güncellemesi

**Dosya:** `src/components/studio/ImageTypeCards.tsx`

Yeni favicon kartı ekleme:

```typescript
const imageTypes = [
  {
    type: 'logo' as ImageType,
    icon: Star,
    title: 'Logo',
    subtitle: 'Oluştur',
    description: 'Profesyonel işletme logosu',
  },
  {
    type: 'favicon' as ImageType,
    icon: AppWindow,  // lucide-react'tan
    title: 'Favicon',
    subtitle: 'Oluştur',
    description: 'Browser sekmesi ikonu',
  },
  // ... diğer tipler
];
```

---

### 3. Edge Function Güncellemesi

**Dosya:** `supabase/functions/studio-generate-image/index.ts`

#### a) GenerateRequest güncelleme:
```typescript
interface GenerateRequest {
  type: 'logo' | 'favicon' | 'social' | 'poster' | 'creative';
  // ...
}
```

#### b) buildImagePrompt'a favicon case ekleme:
```typescript
case 'favicon':
  return `Minimal favicon icon design, 32x32 pixel optimized, simple recognizable symbol, single color or very limited palette, clean edges, works at small sizes. ${prompt}. Suitable for browser tab, app icon.`;
```

#### c) getImageDimensions'a favicon ekleme:
```typescript
case 'favicon':
  return { width: 256, height: 256 };  // Büyük oluştur, küçültme istemci tarafında
```

---

### 4. ImagePreview Güncellemesi

**Dosya:** `src/components/studio/ImagePreview.tsx`

Favicon tipi için özel önizleme:

```tsx
{image?.type === 'favicon' && image.image_url && (
  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 rounded overflow-hidden border">
        <img src={image.image_url} alt="32px" className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground">32px</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded overflow-hidden border">
        <img src={image.image_url} alt="64px" className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground">64px</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 h-32 rounded-lg overflow-hidden border">
        <img src={image.image_url} alt="256px" className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground">256px</span>
    </div>
  </div>
)}
```

---

### 5. ApplyToWebsiteModal Akıllı Varsayılan

**Dosya:** `src/components/studio/ApplyToWebsiteModal.tsx`

Favicon tipi seçildiğinde otomatik olarak favicon hedefini seç:

```typescript
useEffect(() => {
  // Görsel tipine göre akıllı varsayılan hedef
  if (imageType === 'favicon') {
    setSelectedTarget('favicon');
  } else if (imageType === 'logo') {
    setSelectedTarget('logo');
  } else if (imageType === 'social') {
    setSelectedTarget('ogImage');
  }
}, [imageType]);
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/pages/Studio.tsx` | ImageType'a `favicon` ekle |
| `src/components/studio/ImageTypeCards.tsx` | Favicon kartı ekle |
| `supabase/functions/studio-generate-image/index.ts` | Favicon prompt ve boyut desteği |
| `src/components/studio/ImagePreview.tsx` | Favicon için çoklu boyut önizleme |
| `src/components/studio/ApplyToWebsiteModal.tsx` | Akıllı hedef varsayılan seçimi |

---

## Favicon Tasarım İpuçları

Kullanıcılara gösterilecek:
- Basit ve tanınabilir sembol kullan
- Tek renk veya çok sınırlı palet
- Karmaşık detaylardan kaçın
- Metin kullanacaksan tek harf tercih et

