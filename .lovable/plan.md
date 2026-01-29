

# Sidebar Değişikliklerinin Gerçek Zamanlı Yansıması ve Düzeltmeler

## Tespit Edilen Sorunlar

1. **"Edit Background" yazısı** hala ekranın ortasında görünüyor (HeroOverlay.tsx satır 95-101)
2. **Regenerate butonu** görsel için AI yerine Pixabay kullanmalı
3. **Sidebar'daki değişiklikler** web sitede gerçek zamanlı görünmüyor (özellikle image position)
4. **PIXABAY_API_KEY** mevcut - kontrol edildi ✓

---

## Yapılacak Değişiklikler

### 1. HeroOverlay.tsx - "Edit Background" Yazısını Kaldır

**Mevcut durum (Satır 89-103):**
Hover overlay içinde "Edit Background" yazısı gösteriliyor.

**Çözüm:**
Bu yazıyı tamamen kaldır. Sadece görsel hover efekti kalsın (karartma), metin olmasın. Kullanıcı sidebar'dan düzenleme yapacak.

```text
Öncesi:
+------------------------------------------+
|                                          |
|     [Edit Background yazısı + ikon]      |   ← KALDIRILACAK
|                                          |
+------------------------------------------+

Sonrası:
+------------------------------------------+
|                                          |
|     (sadece hafif karartma efekti)       |   ← Hover'da cursor:pointer
|                                          |
+------------------------------------------+
```

### 2. EditorSidebar.tsx - Regenerate Butonunu Pixabay'a Bağla

**Mevcut durum:**
- `onImageRegenerate` prop'u AI görsel üretimi için tasarlanmış
- TODO olarak bekliyor ve çalışmıyor

**Çözüm:**
- Regenerate butonunu tıklayınca `onImageChange` fonksiyonunu çağır
- Bu zaten Pixabay'dan alternatifleri getiriyor
- Buton metnini "Regenerate" yerine "Find Similar" olarak değiştir veya aynı `fetch-image-options` fonksiyonunu çağır

### 3. Project.tsx - handleImageRegenerate'i Pixabay'a Bağla

**Mevcut durum (Satır 295-317):**
```typescript
const handleImageRegenerate = useCallback(async () => {
  // TODO: Implement single image regeneration via edge function
  setTimeout(() => {
    setIsRegeneratingImage(false);
    toast({ title: 'Image regenerated', ... });
  }, 2000);
}, [...]);
```

**Çözüm:**
`handleImageRegenerate` fonksiyonunu `handleImageChange` ile aynı Pixabay API'sini çağıracak şekilde güncelle.

### 4. Gerçek Zamanlı Görsel Pozisyon Güncellemesi

**Mevcut durum:**
- Slider değiştiğinde `handleUpdateImagePosition` sadece EditorSidebar state'ini güncelliyor
- `generated_content` içindeki görsel pozisyonu güncellenmiyor
- Web sitede değişiklik görünmüyor

**Çözüm:**
1. `handleUpdateImagePosition` fonksiyonunu `generated_content.images` içine pozisyon kaydetecek şekilde güncelle
2. Hero ve diğer görsel bileşenlerine `positionX`, `positionY` değerlerini prop olarak geçir
3. Görsellerin `objectPosition` stilini dinamik yap

### 5. Gerçek Zamanlı Stil Değişiklikleri (Font Size, Alignment, Color)

**Mevcut durum:**
- EditorSidebar'daki Font Size, Text Alignment, Text Color seçenekleri sadece local state'te tutuluyor
- `generated_content` veya herhangi bir kalıcı state'e kaydedilmiyor
- Değişiklikler sayfaya yansımıyor

**Çözüm:**
1. EditorSidebar'a yeni callback'ler ekle: `onStyleChange`
2. Bu callback'ler stil değişikliklerini üst bileşene (Project.tsx) ilet
3. Project.tsx'te bu değişiklikleri `generated_content.sectionStyles` içine kaydet
4. Template bileşenlerine bu stilleri prop olarak geçir

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/templates/temp1/sections/hero/HeroOverlay.tsx` | "Edit Background" yazısını kaldır, sadece hover karartma efekti bırak |
| `src/components/website-preview/EditorSidebar.tsx` | Regenerate butonunu Pixabay'a yönlendir, stil callback'lerini ekle |
| `src/pages/Project.tsx` | `handleImageRegenerate`'i Pixabay'a bağla, `handleUpdateImagePosition`'ı gerçek zamanlı yap, stil handler'ları ekle |
| `src/types/generated-website.ts` | `sectionStyles` tipi ekle (pozisyon ve stil bilgileri için) |
| `src/templates/temp1/pages/FullLandingPage.tsx` | Görsellere pozisyon props'larını geçir |

---

## Teknik Detaylar

### HeroOverlay.tsx Değişikliği

```typescript
// KALDIRILAN KISIM (Satır 95-101):
<div className={cn(
  "opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 backdrop-blur-sm",
  isImageSelected && "opacity-100 ring-2 ring-primary"
)}>
  <ImageIcon className="w-4 h-4 text-gray-800" />
  <span className="text-sm font-medium text-gray-800">Edit Background</span>
</div>

// YENİ HALİ: Sadece karartma overlay, metin yok
{isEditable && (
  <div className={cn(
    "absolute inset-0 transition-all duration-200",
    isImageSelected 
      ? "bg-black/20 ring-4 ring-primary ring-inset" 
      : "bg-black/0 group-hover:bg-black/10"
  )} />
)}
```

### handleImageRegenerate Güncelleme

```typescript
const handleImageRegenerate = useCallback(async () => {
  if (!editorSelection?.imageData || !id) return;
  
  // Pixabay'dan alternatifler getir - aynı handleImageChange mantığı
  setIsRegeneratingImage(true);
  setImageOptions([]);
  
  try {
    let imageType = 'hero';
    const imagePath = editorSelection.imageData.imagePath;
    if (imagePath.includes('about')) imageType = 'about';
    else if (imagePath.includes('gallery')) imageType = 'gallery';
    else if (imagePath.includes('cta')) imageType = 'cta';
    else if (imagePath.includes('service')) imageType = 'service';
    
    const { data, error } = await supabase.functions.invoke('fetch-image-options', {
      body: { projectId: id, imageType, count: 3 },
    });

    if (error) throw error;
    
    if (data?.options && data.options.length > 0) {
      setImageOptions(data.options);
      toast({ title: 'Alternatives found', description: 'Choose from the options below.' });
    } else {
      toast({ title: 'No alternatives found', description: 'Try a different search.' });
    }
  } catch (err) {
    toast({ title: 'Error', description: 'Could not fetch alternatives.', variant: 'destructive' });
  } finally {
    setIsRegeneratingImage(false);
  }
}, [editorSelection, id, toast]);
```

### Gerçek Zamanlı Görsel Pozisyon

```typescript
// Project.tsx - handleUpdateImagePosition güncelleme
const handleUpdateImagePosition = useCallback((x: number, y: number) => {
  if (!editorSelection?.imageData?.imagePath || !project?.generated_content) return;
  
  // EditorSidebar state'ini güncelle
  setEditorSelection(prev => prev ? { 
    ...prev, 
    imageData: prev.imageData ? { ...prev.imageData, positionX: x, positionY: y } : undefined 
  } : null);
  
  // generated_content içine pozisyonu kaydet
  const positionPath = editorSelection.imageData.imagePath.replace('images.', 'imagePositions.');
  const updatedContent = updateNestedValue(
    project.generated_content, 
    positionPath, 
    { x, y }
  );
  
  setProject(prev => prev ? { ...prev, generated_content: updatedContent } : null);
  setHasUnsavedChanges(true);
}, [editorSelection, project]);
```

---

## Kullanıcı Deneyimi Akışı

### Görsel Düzenleme (Yeni)
1. Kullanıcı hero arka planına tıklar
2. Sadece hafif karartma efekti gösterilir (metin yok)
3. EditorSidebar açılır
4. "Regenerate" butonuna tıklayınca Pixabay'dan alternatifler gelir
5. Thumbnaillerden biri seçilir → Görsel anında değişir
6. Pozisyon slider'ları hareket ettirilir → Görsel pozisyonu gerçek zamanlı güncellenir

### Stil Düzenleme (Gelecek)
1. Kullanıcı Style tab'ına geçer
2. Font boyutu, alignment, renk seçer
3. Değişiklikler anında sayfaya yansır

