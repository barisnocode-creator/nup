
# Editör Gerçek Zamanlı Güncelleme ve Pixabay Entegrasyonu Planı

## Tespit Edilen Sorunlar

### 1. Style Tab Değişiklikleri Kaydedilmiyor
EditorSidebar'daki "Style" sekmesindeki font boyutu, metin hizalaması ve metin rengi değişiklikleri sadece local React state'inde tutuluyor. Bu değerler:
- `generated_content`'e kaydedilmiyor
- Template bileşenlerine iletilmiyor
- Dolayısıyla anında görsel değişiklik olmuyor

### 2. Image Pozisyon Güncellemesi
Image pozisyonu `handleUpdateImagePosition` ile `generated_content.imagePositions` altına kaydediliyor ama template'lerin `EditableImage` bileşenleri bu değeri okumak için doğru yapılandırılmış mı kontrol edilmeli.

### 3. Regenerate Butonu (SORUN YOK)
`handleImageRegenerate` fonksiyonu zaten `fetch-image-options` edge function'ını çağırıyor ve bu Pixabay'den görsel çekiyor. Bu kısım doğru çalışıyor.

---

## Çözüm Planı

### Aşama 1: Section Style Settings Altyapısı

`GeneratedContent` tipine section-bazlı stil ayarları ekle:

```typescript
// src/types/generated-website.ts
export interface SectionStyle {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: 'primary' | 'secondary' | 'muted';
}

export interface GeneratedContent {
  // ... mevcut alanlar ...
  
  sectionStyles?: {
    [sectionId: string]: SectionStyle;
  };
}
```

### Aşama 2: EditorSidebar - Style Callback Ekleme

EditorSidebar'a yeni prop'lar ekle:

```typescript
interface EditorSidebarProps {
  // ... mevcut prop'lar ...
  
  // Style değişikliği için callback
  onStyleChange?: (sectionId: string, style: SectionStyle) => void;
  currentSectionStyle?: SectionStyle;
}
```

Style tab'daki değişiklikleri anında parent'a bildir:

```typescript
const handleFontSizeChange = (value: string) => {
  setFontSize(value);
  if (onStyleChange && selection?.sectionId) {
    onStyleChange(selection.sectionId, {
      fontSize: value as SectionStyle['fontSize'],
      textAlign,
      textColor,
    });
  }
};
```

### Aşama 3: Project.tsx - Style Handler Ekleme

```typescript
const handleSectionStyleChange = useCallback((sectionId: string, style: SectionStyle) => {
  if (!project?.generated_content) return;

  const updatedContent = {
    ...project.generated_content,
    sectionStyles: {
      ...project.generated_content.sectionStyles,
      [sectionId]: style,
    },
  };
  
  setProject(prev => prev ? {
    ...prev,
    generated_content: updatedContent,
  } : null);
  
  setHasUnsavedChanges(true);
  debouncedSave(updatedContent);
}, [project, debouncedSave]);
```

### Aşama 4: Template Bileşenlerini Güncelle

Her section bileşeni `sectionStyles` prop'unu alsın ve uygulasın:

```typescript
// Örnek: HeroSection
const getTextSizeClass = (size?: string) => {
  const sizeMap = {
    sm: 'text-3xl md:text-4xl',
    base: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl',
    '2xl': 'text-7xl md:text-8xl',
  };
  return sizeMap[size] || sizeMap.base;
};

const style = sectionStyles?.hero;

<h1 className={cn(
  getTextSizeClass(style?.fontSize),
  style?.textAlign === 'left' && 'text-left',
  style?.textAlign === 'right' && 'text-right',
  style?.textColor === 'muted' && 'text-muted-foreground',
)}>
  {title}
</h1>
```

### Aşama 5: Image Position Doğrulaması

EditableImage'ın pozisyon değerlerini okuyup uyguladığını doğrula ve template'lerin `imagePositions` değerini section'lara ilettiğini kontrol et:

```typescript
// FullLandingPage içinde
const heroPosition = content.imagePositions?.heroHome;

<EditableImage
  src={heroImage}
  positionX={heroPosition?.x ?? 50}
  positionY={heroPosition?.y ?? 50}
  ...
/>
```

---

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/types/generated-website.ts` | `SectionStyle` interface ve `sectionStyles` alanı ekle |
| `src/components/website-preview/EditorSidebar.tsx` | `onStyleChange` callback, gerçek zamanlı stil güncellemeleri |
| `src/pages/Project.tsx` | `handleSectionStyleChange` handler, EditorSidebar'a prop geçişi |
| `src/templates/temp1/sections/*.tsx` | Section bileşenlerinde style prop desteği |
| `src/templates/temp2/sections/*.tsx` | Section bileşenlerinde style prop desteği |
| `src/templates/temp3/sections/*.tsx` | Section bileşenlerinde style prop desteği |
| `src/templates/types.ts` | TemplateProps'a sectionStyles ekle |

---

## Regenerate Butonu (Mevcut Durum - Doğru Çalışıyor)

Mevcut implementasyon zaten Pixabay kullanıyor:

1. Kullanıcı "Benzer" veya "Değiştir" butonuna tıklıyor
2. `handleImageRegenerate` veya `handleImageChange` çağrılıyor
3. `fetch-image-options` edge function Pixabay'den görsel çekiyor
4. Seçenekler EditorSidebar'da gösteriliyor

AI görsel üretimi kullanılmıyor, Pixabay tabanlı stok görsel sistemi zaten aktif.

---

## Özet

Bu plan implementasyon sonrası:
- Font boyutu, metin hizalaması, metin rengi değişiklikleri anında template'e yansıyacak
- Horizontal/vertical görsel pozisyonu gerçek zamanlı güncellenecek
- Tüm değişiklikler otomatik kaydedilecek
- Regenerate butonu Pixabay'den konuya uygun görseller çekmeye devam edecek (zaten çalışıyor)
