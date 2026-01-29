

# Durable.co Tarzı Sağ Sidebar Editor Planı

## Hedef

Ekran görüntülerindeki gibi, bir görsele veya düzenlenebilir elemana tıklandığında sağdan açılan bir editing panel oluşturmak.

## Mevcut Durum Analizi

Şu anda editör yapısı:
- `EditorToolbar`: Üst toolbar (Customize, Pages, Add, Preview, Publish)
- `EditableSection`: Hover'da mavi border + section badge gösteriyor
- `EditableField`: Inline text editing yapıyor
- Görseller için özel bir edit paneli YOK

## Durable.co Referans Özellikleri

Ekran görüntülerinden görülen özellikler:

| Bileşen | Özellik |
|---------|---------|
| Panel Header | "< Image" başlığı + Done butonu |
| Image Preview | Küçük thumbnail gösterim |
| Regenerate/Change | AI ile yeni görsel veya mevcut değiştirme |
| Alt Text | SEO için açıklama alanı |
| Image Position | Horizontal/Vertical slider'lar |
| Carousel Nav | 1/3, oklar ile geçiş |

## Teknik Uygulama

### Yeni Bileşenler

**1. ImageEditorSidebar.tsx**
Görsele tıklandığında açılan ana sidebar:
```
- Slide-in animasyonla sağdan açılır
- Width: 320px (kompakt ama kullanışlı)
- Top: 56px (toolbar altında)
- Z-index: 40 (overlay değil, yan panel)
```

**2. EditableImage.tsx**
Tıklanabilir görsel wrapper:
```
- Görsel üzerinde hover'da edit ikonları
- Tıklandığında sidebar'ı açar
- Seçili durumda mavi border
```

### Sidebar İçeriği

```text
+------------------------+
| < Image         Done   |
+------------------------+
| [Thumbnail Preview]    |
| +--------------------+ |
| |                    | |
| |      (image)       | |
| |                    | |
| +--------------------+ |
|                        |
| [Regenerate] [Change]  |
+------------------------+
| Alt text               |
| +--------------------+ |
| | dentist treatment  | |
| +--------------------+ |
| (SEO description)      |
+------------------------+
| Image position         |
| Horizontal  ----o----  |
| Vertical    ---o-----  |
+------------------------+
```

### State Yönetimi

Project.tsx'e eklenecek state:
```typescript
const [selectedImage, setSelectedImage] = useState<{
  type: 'hero' | 'about' | 'gallery' | 'cta';
  index?: number;
  imagePath: string;
  currentUrl: string;
} | null>(null);
```

### Props Akışı

```text
Project.tsx
    │
    ├── selectedImage state
    ├── setSelectedImage callback
    │
    ▼
WebsitePreview
    │
    ├── onImageSelect callback
    │
    ▼
Template (temp1)
    │
    ├── onImageSelect geçir
    │
    ▼
HeroSplitSection / ImageGallerySection
    │
    └── EditableImage wrapper kullan
```

### Görsel Değiştirme Seçenekleri

**Regenerate**: AI ile yeni görsel oluştur
```typescript
// generate-images edge function'ı çağır
// Belirli bir slot için yeni görsel üret
```

**Change**: Manuel seçim
- Galeri modal açılır
- Pixabay'dan arama yapılabilir
- Kullanıcı seçer

**Position Sliders**: object-position CSS
```typescript
// Horizontal: object-position-x (0-100%)
// Vertical: object-position-y (0-100%)
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/ImageEditorSidebar.tsx` | YENİ - Ana sidebar bileşeni |
| `src/components/website-preview/EditableImage.tsx` | YENİ - Tıklanabilir görsel wrapper |
| `src/pages/Project.tsx` | selectedImage state + sidebar render |
| `src/components/website-preview/WebsitePreview.tsx` | onImageSelect prop ekle |
| `src/templates/types.ts` | onImageSelect type ekle |
| `src/templates/temp1/index.tsx` | onImageSelect'i geçir |
| `src/templates/temp1/sections/HeroSplitSection.tsx` | EditableImage kullan |
| `src/templates/temp1/sections/ImageGallerySection.tsx` | EditableImage kullan |
| `src/templates/temp1/sections/AboutInlineSection.tsx` | EditableImage kullan |
| `src/templates/temp1/sections/CTASection.tsx` | EditableImage kullan |

## ImageEditorSidebar Tasarımı

```typescript
interface ImageEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: {
    type: string;
    index?: number;
    imagePath: string;
    currentUrl: string;
    altText?: string;
  } | null;
  onRegenerate: () => void;
  onChangeImage: (newUrl: string) => void;
  onUpdateAltText: (text: string) => void;
  onUpdatePosition: (x: number, y: number) => void;
  isRegenerating?: boolean;
}
```

## Animasyon

Sheet bileşeni kullanarak sağdan slide-in:
```css
/* Overlay YOK - sadece panel kayar */
transform: translateX(100%) -> translateX(0)
transition: 300ms ease-out
```

## Beklenen Sonuç

- Görsele tıklandığında sağdan 320px genişliğinde panel açılır
- Panel içinde thumbnail, Regenerate/Change butonları, alt text ve position slider'ları
- Done butonuyla kapatılır
- Website preview hala görünür (overlay değil yan panel)
- Durable.co'daki gibi temiz ve kullanışlı UX

