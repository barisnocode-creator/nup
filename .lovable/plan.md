
# Analytics ve Website Bileşenleri Kapsamlı Düzeltme Planı

## Tespit Edilen Sorunlar

### 1. BlogTab - Statik Veri Kullanımı
**Mevcut Durum:** Bileşen sabit `samplePosts` dizisini kullanıyor
**Olması Gereken:** `generated_content.pages.blog.posts` verisini göstermeli

### 2. SettingsTab - Yanlış Veri Yolları
**Mevcut Durum:**
- `siteDescription`: `generatedContent?.hero?.subtitle` (yanlış)
- `favicon`: boş string (hiç okunmuyor)

**Olması Gereken:**
- `siteDescription`: `generatedContent?.metadata?.seoDescription` veya `generatedContent?.metadata?.tagline`
- `favicon`: `generatedContent?.siteSettings?.favicon`

### 3. WebsiteDashboardTab - Simüle Edilmiş "Online Users"
**Mevcut Durum:** `Math.random() * 50 + 5` ile sahte veri üretiliyor
**Çözüm:** Bu metriği kaldır veya "Son 24 saat ziyaretçi" gibi gerçek veriye dönüştür

---

## Değişiklik Detayları

### Dosya 1: `src/pages/WebsiteDashboard.tsx`

BlogTab'a `generated_content` prop'u ekle:

```typescript
<TabsContent value="blog">
  <BlogTab 
    projectId={id!} 
    generatedContent={project.generated_content} 
  />
</TabsContent>
```

---

### Dosya 2: `src/components/website-dashboard/BlogTab.tsx`

Bileşeni `generated_content.pages.blog.posts` verisini kullanacak şekilde güncelle:

```typescript
import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText, Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/generated-website';

interface BlogTabProps {
  projectId: string;
  generatedContent: any;
}

export function BlogTab({ projectId, generatedContent }: BlogTabProps) {
  // generated_content.pages.blog.posts verisini al
  const blogPosts: BlogPost[] = generatedContent?.pages?.blog?.posts || [];

  // Blog yazılarını göster (varsa)
  // Yoksa boş state göster
}
```

- AI tarafından oluşturulan blog yazılarını listele
- Kategori ve tarih bilgilerini göster
- Yazı yoksa "No blog posts yet" mesajı

---

### Dosya 3: `src/components/website-dashboard/SettingsTab.tsx`

Doğru veri yollarını kullan:

```typescript
const [settings, setSettings] = useState({
  siteName: projectName || '',
  // Düzeltilmiş yollar:
  siteDescription: generatedContent?.metadata?.tagline || 
                   generatedContent?.metadata?.seoDescription || '',
  metaTitle: generatedContent?.metadata?.siteName || projectName || '',
  metaDescription: generatedContent?.metadata?.seoDescription || '',
  // siteSettings'den oku:
  favicon: generatedContent?.siteSettings?.favicon || '',
  ogImage: generatedContent?.siteSettings?.ogImage || '',
});
```

Ayrıca kaydetme fonksiyonunu da güncelle:
```typescript
const handleSave = async () => {
  const updatedContent = {
    ...generatedContent,
    metadata: {
      ...generatedContent?.metadata,
      siteName: settings.siteName,
      tagline: settings.siteDescription,
      seoDescription: settings.metaDescription,
    },
    siteSettings: {
      ...generatedContent?.siteSettings,
      favicon: settings.favicon,
      ogImage: settings.ogImage,
    },
  };
  // ...save to database
};
```

---

### Dosya 4: `src/components/website-dashboard/WebsiteDashboardTab.tsx`

"Online Users" metriğini "Last 7 Days Views" ile değiştir:

```typescript
// Kaldır:
onlineUsers: Math.floor(Math.random() * 50) + 5,

// Değiştir (metrik kartı):
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <p className="text-3xl font-bold">{data.viewsLast7Days}</p>
        <p className="text-sm text-muted-foreground">Views (last 7 days)</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Özet Tablo

| Dosya | Değişiklik |
|-------|------------|
| `WebsiteDashboard.tsx` | BlogTab'a `generatedContent` prop'u ekle |
| `BlogTab.tsx` | Statik veriyi kaldır, `generated_content.pages.blog.posts` kullan |
| `SettingsTab.tsx` | `metadata` ve `siteSettings` yollarını düzelt |
| `WebsiteDashboardTab.tsx` | "Online Users"ı "Views (last 7 days)" ile değiştir |

---

## Teknik Notlar

### GeneratedContent Yapısı (Referans)
```typescript
{
  pages: {
    blog?: {
      hero: { title, subtitle },
      posts: BlogPost[]  // ← BlogTab bu veriyi kullanmalı
    }
  },
  metadata: {
    siteName,
    tagline,
    seoDescription  // ← SettingsTab bu veriyi kullanmalı
  },
  siteSettings?: {
    favicon,  // ← Studio'dan uygulanan favicon buraya kaydediliyor
    colors,
    fonts
  }
}
```

### Test Adımları
1. Website Dashboard'a git
2. Blog sekmesini aç - AI oluşturmuş blog yazıları görünmeli
3. Settings sekmesini aç - siteName, description ve favicon değerleri doğru gelmeli
4. Dashboard sekmesini aç - "Online Users" yerine "Views (last 7 days)" gösterilmeli
5. Değişiklikleri kaydet ve veritabanında doğru yere yazıldığını kontrol et
