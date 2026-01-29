
# Editor Sorunlarını Düzeltme: Hero Görsel Tıklama ve Section Kontrolleri

## Tespit Edilen Sorunlar

### Sorun 1: Hero Görseline Tıklayınca Sidebar Açılmıyor
`HeroOverlay.tsx`'de `EditableImage` bileşeni `onSelect` handler'ını düzgün çağırıyor ama:
- `EditableSection` wrapper'ı hover overlay ekliyor ve bu overlay tıklamaları yakalıyor olabilir
- `EditableSection` içindeki overlay `pointer-events-none` değil
- Hero görseli absolute positioned ve overlay'in altında kalıyor

### Sorun 2: Section Kontrol Butonları (Yukarı/Aşağı/Edit/Sil) Çalışmıyor
- `EditableSection.tsx`'de butonlar tanımlı ama prop'lar `FullLandingPage.tsx`'den geçirilmiyor
- Move butonları sadece `handleLockedAction` çağırıyor, gerçek hareket fonksiyonu yok
- Edit butonu section için EditorSidebar açmalı ama şu an `onEdit` prop'u bağlanmamış

## Çözüm Planı

### 1. EditableSection.tsx Düzeltmeleri
- Hover overlay'e `pointer-events-none` ekle (child elementlerin tıklanabilir kalması için)
- Move butonlarını gerçek `onMoveUp`/`onMoveDown` handler'larına bağla
- Edit butonunun `onEdit` çağırmasını sağla

```typescript
// Mevcut (hatalı):
<Button onClick={() => !isFirst ? handleLockedAction('Move') : undefined}>

// Düzeltilmiş:
<Button onClick={() => onMoveUp?.()}>
```

### 2. FullLandingPage.tsx Güncellemesi
Section'lar için `onEdit`, `onMoveUp`, `onMoveDown`, `onDelete` prop'larını ekle:

```typescript
<EditableSection
  sectionId="hero"
  sectionName="Hero"
  isEditable={isEditable}
  onEdit={() => onEditorSelect?.({
    type: 'section',
    title: 'Hero',
    sectionId: 'hero',
    fields: [
      { label: 'Headline', fieldPath: 'pages.home.hero.title', value: title, type: 'text' },
      { label: 'Subtitle', fieldPath: 'pages.home.hero.subtitle', value: subtitle, type: 'text' },
      { label: 'Description', fieldPath: 'pages.home.hero.description', value: description, type: 'textarea' },
    ]
  })}
  onMoveUp={onMoveSection ? () => onMoveSection('hero', 'up') : undefined}
  onMoveDown={onMoveSection ? () => onMoveSection('hero', 'down') : undefined}
  onDelete={onDeleteSection ? () => onDeleteSection('hero') : undefined}
  onLockedFeature={onLockedFeature}
  isFirst
>
```

### 3. Project.tsx'e Section Yönetimi Ekleme
Section sıralama ve silme için handler'lar:

```typescript
const [sectionOrder, setSectionOrder] = useState<string[]>([
  'hero', 'statistics', 'about', 'services', 'process', 'gallery', 'testimonials', 'faq', 'contact', 'cta'
]);

const handleMoveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
  setSectionOrder(prev => {
    const index = prev.indexOf(sectionId);
    if (index === -1) return prev;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= prev.length) return prev;
    const newOrder = [...prev];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    return newOrder;
  });
  toast({ title: 'Section moved', description: `${sectionId} moved ${direction}.` });
}, [toast]);

const handleDeleteSection = useCallback((sectionId: string) => {
  // Bazı section'lar silinemez
  const protectedSections = ['hero'];
  if (protectedSections.includes(sectionId)) {
    toast({ title: 'Cannot delete', description: 'Hero section cannot be deleted.', variant: 'destructive' });
    return;
  }
  setSectionOrder(prev => prev.filter(s => s !== sectionId));
  toast({ title: 'Section deleted', description: `${sectionId} has been removed.` });
}, [toast]);
```

### 4. EditableImage Tıklama Sorunu Düzeltmesi
`EditableSection` içindeki overlay'in tıklamaları engellemesini önle:

```typescript
// EditableSection.tsx - Overlay'e pointer-events-none ekle
{isHovered && (
  <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-lg" />
)}

// Butonlar container'ı pointer-events-auto olmalı
<div className="absolute -top-3 right-4 z-20 flex items-center gap-1 animate-fade-in pointer-events-auto">
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/EditableSection.tsx` | - Overlay'e `pointer-events-none` ekle, - Butonları gerçek handler'lara bağla, - z-index düzenle |
| `src/templates/temp1/pages/FullLandingPage.tsx` | - `onEdit`, `onMoveUp`, `onMoveDown`, `onDelete` prop'larını tüm section'lara ekle, - Yeni prop'ları interface'e ekle |
| `src/pages/Project.tsx` | - `sectionOrder` state ekle, - `handleMoveSection` ve `handleDeleteSection` handler'ları ekle, - Handler'ları `WebsitePreview`'a geçir |
| `src/components/website-preview/WebsitePreview.tsx` | - Yeni prop'ları al ve template'e geçir |
| `src/templates/temp1/index.tsx` | - Yeni prop'ları al ve `FullLandingPage`'e geçir |
| `src/templates/types.ts` | - Template props'a yeni handler'lar ekle |

## Teknik Detaylar

### EditableSection Düzeltilmiş Yapı
```typescript
return (
  <div
    className={cn('relative group transition-all duration-200', ...)}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    data-section-id={sectionId}
  >
    {/* Section Label - pointer-events-auto */}
    {isHovered && (
      <div className="absolute -top-3 left-4 z-30 animate-fade-in pointer-events-auto">
        <Badge>...</Badge>
      </div>
    )}

    {/* Action Buttons - pointer-events-auto */}
    {isHovered && (
      <div className="absolute -top-3 right-4 z-30 flex items-center gap-1 animate-fade-in pointer-events-auto">
        <Button onClick={onMoveUp} disabled={isFirst}>...</Button>
        <Button onClick={onMoveDown} disabled={isLast}>...</Button>
        <Button onClick={onEdit}>...</Button>
        <Button onClick={onDelete}>...</Button>
      </div>
    )}

    {/* Section Content - children can handle their own clicks */}
    <div className="transition-opacity duration-200">
      {children}
    </div>

    {/* Hover Border - pointer-events-none */}
    {isHovered && (
      <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-lg" />
    )}
  </div>
);
```

### Prop Akışı
```
Project.tsx
  └── handleMoveSection, handleDeleteSection
       └── WebsitePreview
            └── HealthcareModernTemplate
                 └── FullLandingPage
                      └── EditableSection (onMoveUp, onMoveDown, onEdit, onDelete)
```

## Beklenen Sonuçlar

1. Hero görseline tıklandığında EditorSidebar açılacak
2. Section hover'da görünen yukarı/aşağı okları section'ları hareket ettirecek
3. Edit (kalem) butonu section EditorSidebar'ını açacak
4. Çöp kutusu butonu section'ı silecek (korumalı section'lar hariç)
5. Tüm section kontrolları düzgün çalışacak
