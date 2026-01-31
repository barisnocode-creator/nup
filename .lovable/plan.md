
# ImagePreview Hook Hatası Düzeltmesi

## Problem

`ImagePreview.tsx` dosyasında **React Hooks kuralları ihlali** var. `useMemo` hook'u koşullu return ifadelerinden **sonra** çağrılıyor, bu da "Rendered more hooks than during the previous render" hatasına neden oluyor.

```
Hata: Error: Rendered more hooks than during the previous render
at ImagePreview (ImagePreview.tsx:197:30)
```

### Mevcut Kod Akışı (Yanlış)

```
1. useState hooks (satır 42-43) ✓
2. if (!image && !isGenerating) → return (satır 54-67)
3. if (isGenerating || image?.status === 'generating') → return (satır 71-83)
4. if (image?.status === 'failed') → return (satır 86-104)
5. useMemo() ← HATA: hooks conditional render sonrası çağrılamaz!
```

Bu durumda, eğer ilk render'da bileşen boş state'de ise, hiç `useMemo` çağrılmaz. Sonra görsel oluşturulduğunda, bileşen son duruma gelir ve `useMemo` çağrılır - bu da hook sayısı uyumsuzluğuna neden olur.

---

## Çözüm

Tüm hooks'ları bileşenin en üstüne taşıyacağız (koşullu return ifadelerinden önce).

### Değişiklik Yapılacak Dosya

`src/components/studio/ImagePreview.tsx`

### Kod Değişikliği

```typescript
export function ImagePreview({ 
  image, 
  isGenerating, 
  onRegenerate, 
  onEdit,
  onApplyToWebsite 
}: ImagePreviewProps) {
  // TÜM HOOKS EN ÜSTTE OLMALI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');

  // useMemo hook'u conditional return'lerden ÖNCE çağrılmalı
  const aspectRatioClass = useMemo(() => {
    const ratio = (image?.metadata as Record<string, unknown>)?.aspectRatio;
    switch (ratio) {
      case 'story': return 'aspect-[9/16] max-w-xs';
      case 'facebook-landscape': return 'aspect-[1.91/1] max-w-2xl';
      case 'twitter': return 'aspect-video max-w-2xl';
      case 'pinterest': return 'aspect-[2/3] max-w-sm';
      case 'instagram-square': return 'aspect-square max-w-lg';
      default: return 'aspect-square max-w-lg';
    }
  }, [image?.metadata]);

  // isFavicon da hooks sonrası hesaplanabilir
  const isFavicon = image?.type === 'favicon';

  const handleEditSubmit = () => {
    if (editInstruction.trim()) {
      onEdit(editInstruction.trim());
      setEditDialogOpen(false);
      setEditInstruction('');
    }
  };

  // Şimdi conditional return'ler güvenle kullanılabilir
  // Empty state
  if (!image && !isGenerating) {
    return (
      <Card className="border-dashed">
        // ... empty state JSX
      </Card>
    );
  }

  // Generating state
  if (isGenerating || image?.status === 'generating') {
    return (
      <Card>
        // ... generating state JSX
      </Card>
    );
  }

  // Failed state
  if (image?.status === 'failed') {
    return (
      <Card className="border-destructive">
        // ... failed state JSX
      </Card>
    );
  }

  // Success state with image
  return (
    <>
      <Card>
        // ... success state JSX (aspectRatioClass ve isFavicon kullanılır)
      </Card>
      <Dialog>...</Dialog>
    </>
  );
}
```

---

## Değişiklik Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/components/studio/ImagePreview.tsx` | `useMemo` hook'unu conditional return'lerden önceye taşı |

---

## Test Adımları

1. Değişikliği uygula
2. Studio'ya git
3. Favicon kategorisini seç
4. Bir prompt gir ve oluştur
5. Görsel başarıyla oluşturulmalı ve farklı boyutlarda gösterilmeli
6. "Web Sitesine Uygula" ile projeye uygula
7. Veritabanında favicon kaydını kontrol et
