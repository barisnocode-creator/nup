

# Sosyal Medya Görseli Boyut Seçenekleri

## Genel Bakış

Studio sayfasına sosyal medya görsel boyutu seçenekleri eklenecek. Kullanıcı "Sosyal" kategorisi seçtiğinde popüler sosyal medya platformları için optimize edilmiş boyut seçenekleri görüntülenecek.

---

## Desteklenecek Boyutlar

| Platform | En-Boy Oranı | Piksel Boyutu | Kullanım Alanı |
|----------|--------------|---------------|----------------|
| Instagram Kare | 1:1 | 1080x1080 | Feed postu |
| Facebook Yatay | 1.91:1 | 1200x628 | Link paylaşımı |
| Instagram/TikTok Story | 9:16 | 1080x1920 | Hikaye, Reels |
| Twitter/X Yatay | 16:9 | 1200x675 | Tweet görseli |
| Pinterest Dikey | 2:3 | 1000x1500 | Pin görseli |

---

## Kullanıcı Deneyimi Akışı

```text
+--------------------------------------------------+
|  [Logo] [Sosyal*] [Poster] [Yaratıcı]            |
+--------------------------------------------------+
                      |
                      v
+--------------------------------------------------+
|  Boyut Seçin:                                     |
|  +----------+ +----------+ +----------+           |
|  |   1:1    | |  1.91:1  | |   9:16   |          |
|  | Instagram| | Facebook | |  Story   |          |
|  |  [Icon]  | |  [Icon]  | |  [Icon]  |          |
|  +----------+ +----------+ +----------+           |
+--------------------------------------------------+
```

- Boyut seçici SADECE "social" tipi seçildiğinde görünür
- Varsayılan seçim: Instagram 1:1
- ImagePreview bileşeni seçilen boyuta göre aspect ratio'yu ayarlar

---

## Teknik Değişiklikler

### 1. Yeni Bileşen: `AspectRatioSelector.tsx`

**Dosya:** `src/components/studio/AspectRatioSelector.tsx`

Sosyal medya boyut seçeneklerini gösteren toggle group bileşeni:

```typescript
export type AspectRatioOption = 'instagram-square' | 'facebook-landscape' | 'story' | 'twitter' | 'pinterest';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatioOption;
  onSelectRatio: (ratio: AspectRatioOption) => void;
}

const aspectRatios = [
  { id: 'instagram-square', label: '1:1', name: 'Instagram', width: 1080, height: 1080 },
  { id: 'facebook-landscape', label: '1.91:1', name: 'Facebook', width: 1200, height: 628 },
  { id: 'story', label: '9:16', name: 'Story', width: 1080, height: 1920 },
  { id: 'twitter', label: '16:9', name: 'Twitter/X', width: 1200, height: 675 },
  { id: 'pinterest', label: '2:3', name: 'Pinterest', width: 1000, height: 1500 },
];
```

Bileşen özellikleri:
- ToggleGroup kullanarak tek seçimli butonlar
- Her seçenek için platform ikonu ve boyut etiketi
- Seçili durumu görsel olarak belirtme

---

### 2. Studio.tsx Güncellemesi

**Değişiklikler:**

1. Yeni state ekle:
   ```typescript
   const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioOption>('instagram-square');
   ```

2. AspectRatioSelector'ı import et ve ImageTypeCards altına ekle (sadece social seçiliyken görünür):
   ```tsx
   {selectedType === 'social' && (
     <AspectRatioSelector
       selectedRatio={selectedAspectRatio}
       onSelectRatio={setSelectedAspectRatio}
     />
   )}
   ```

3. `handleGenerate` fonksiyonuna aspect ratio bilgisini ekle:
   ```typescript
   const { data, error } = await supabase.functions.invoke('studio-generate-image', {
     body: {
       type: selectedType,
       prompt,
       imageId: imageRecord.id,
       aspectRatio: selectedType === 'social' ? selectedAspectRatio : undefined,
     }
   });
   ```

4. Metadata'ya aspect ratio kaydet:
   ```typescript
   metadata: { 
     style: 'modern',
     aspectRatio: selectedType === 'social' ? selectedAspectRatio : undefined 
   }
   ```

---

### 3. Edge Function Güncellemesi

**Dosya:** `supabase/functions/studio-generate-image/index.ts`

1. Request interface'ine aspect ratio ekle:
   ```typescript
   interface GenerateRequest {
     // ... mevcut alanlar
     aspectRatio?: 'instagram-square' | 'facebook-landscape' | 'story' | 'twitter' | 'pinterest';
   }
   ```

2. `getImageDimensions` fonksiyonunu güncelle:
   ```typescript
   function getImageDimensions(type: string, aspectRatio?: string): { width: number; height: number } {
     if (type === 'social' && aspectRatio) {
       switch (aspectRatio) {
         case 'instagram-square': return { width: 1080, height: 1080 };
         case 'facebook-landscape': return { width: 1200, height: 628 };
         case 'story': return { width: 1080, height: 1920 };
         case 'twitter': return { width: 1200, height: 675 };
         case 'pinterest': return { width: 1000, height: 1500 };
       }
     }
     // Mevcut default logic...
   }
   ```

3. `buildImagePrompt` fonksiyonunu güncelle (aspect ratio bilgisini prompt'a ekle):
   ```typescript
   case 'social':
     const ratioLabel = aspectRatio ? aspectRatioLabels[aspectRatio] : '1:1';
     return `Social media post graphic, ${ratioLabel} aspect ratio, modern design...`;
   ```

---

### 4. ImagePreview Güncellemesi

**Dosya:** `src/components/studio/ImagePreview.tsx`

Aspect ratio'ya göre preview alanının boyutunu dinamik olarak ayarla:

```typescript
// Metadata'dan aspect ratio'yu oku
const aspectRatioClass = useMemo(() => {
  const ratio = image?.metadata?.aspectRatio;
  switch (ratio) {
    case 'story': return 'aspect-[9/16] max-w-xs';
    case 'facebook-landscape': return 'aspect-[1.91/1] max-w-2xl';
    case 'twitter': return 'aspect-[16/9] max-w-2xl';
    case 'pinterest': return 'aspect-[2/3] max-w-sm';
    default: return 'aspect-square max-w-lg';
  }
}, [image?.metadata?.aspectRatio]);
```

---

## Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|-------|------------|
| `src/components/studio/AspectRatioSelector.tsx` | Yeni dosya oluştur |
| `src/pages/Studio.tsx` | State ve AspectRatioSelector entegrasyonu |
| `supabase/functions/studio-generate-image/index.ts` | Aspect ratio desteği |
| `src/components/studio/ImagePreview.tsx` | Dinamik preview boyutu |

---

## Görsel Tasarım

AspectRatioSelector bileşeni için tasarım:

- Yatay scroll ile mobilde kullanılabilir
- Her seçenek için:
  - Oran önizleme ikonu (kare, yatay, dikey şekiller)
  - Platform adı (Instagram, Facebook, vb.)
  - Boyut etiketi (1:1, 1.91:1, vb.)
- Seçili durumda primary renk ve border vurgusu

