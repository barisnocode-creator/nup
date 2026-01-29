

# Hero Arka Plan Görselini Doğrudan Tıklanabilir Yapma

## Amaç
Hero bölümündeki arka plan görselinin doğrudan tıklanabilir olmasını sağlamak ve ayrı bir "Edit Background" butonu yerine görselin kendisine tıklanarak düzenleme sidebar'ının açılmasını mümkün kılmak. Ayrıca Customize menüsüne de bu seçeneği eklemek.

---

## Yapılacak Değişiklikler

### 1. HeroOverlay.tsx - Arka Plan Görselini Tıklanabilir Yap

**Mevcut durum:** Sol altta ayrı bir "Edit Background" butonu var

**Yeni durum:**
- "Edit Background" butonunu tamamen kaldır
- Arka plan görsel container'ına (`<div className="absolute inset-0">`) tıklama özelliği ekle
- Görsel üzerine hover yapıldığında düzenlenebilir olduğunu gösteren görsel ipucu (cursor, hafif overlay) ekle
- Tıklandığında `handleImageSelect` fonksiyonunu çağır

```text
Arka plan görselinin yapısı:
+------------------------------------------+
|  [Arka Plan Görseli - Tıklanabilir Alan] |
|                                          |
|    Hover: cursor-pointer + overlay       |
|    Tıklama: EditorSidebar açılır         |
|                                          |
+------------------------------------------+
```

### 2. HeroSplit.tsx ve HeroCentered.tsx - Tutarlılık

Bu hero varyantlarında görsel zaten `EditableImage` bileşeni ile tıklanabilir durumda. Değişiklik gerekmez.

### 3. HeroGradient.tsx - Arka Plan Yok

Bu varyant gradient arka plan kullanıyor, görsel yok. Değişiklik gerekmez.

### 4. CustomizeSidebar.tsx - Edit Background Seçeneği Ekle

**Mevcut menü öğeleri:**
- Colors
- Fonts
- Buttons
- Corners
- Animations
- Browser icon
- Manage widgets

**Yeni menü öğesi ekleme:**
- "Background Image" seçeneği menüye eklenir
- Image ikonu kullanılır
- Tıklandığında hero arka plan görselini düzenlemek için callback tetiklenir

### 5. Project.tsx - CustomizeSidebar'a Background Handler Ekle

CustomizeSidebar'a yeni bir prop eklenir:
- `onEditBackground`: Hero arka planını düzenlemek için EditorSidebar'ı açar
- Mevcut hero görsel bilgisini kullanarak selection oluşturur

---

## Teknik Detaylar

### HeroOverlay.tsx Değişiklikleri

```typescript
// Arka plan container'ını tıklanabilir yap
<div 
  className={cn(
    "absolute inset-0",
    isEditable && "cursor-pointer group"
  )}
  onClick={isEditable ? (e) => {
    e.stopPropagation();
    handleImageSelect({
      type: 'hero',
      imagePath: 'images.heroHome',
      currentUrl: heroImage || '',
      altText: 'Hero Background',
      positionX: 50,
      positionY: 50,
    });
  } : undefined}
>
  {/* Görsel */}
  {heroImage ? (
    <img ... />
  ) : (
    <div ... />
  )}
  
  {/* Hover overlay - düzenlenebilirlik ipucu */}
  {isEditable && (
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Edit Background</span>
      </div>
    </div>
  )}
</div>

// Mevcut "Edit Background" butonunu SİL
```

### CustomizeSidebar.tsx Değişiklikleri

```typescript
// Props'a ekle
interface CustomizeSidebarProps {
  // ... mevcut props
  onEditBackground?: () => void;
  heroImageUrl?: string;
}

// Menü öğelerine ekle
const menuItems = [
  { id: 'colors', icon: Palette, label: 'Colors' },
  { id: 'fonts', icon: Type, label: 'Fonts' },
  { id: 'background', icon: Image, label: 'Background Image', action: true },
  // ... diğerleri
];

// Tıklama handler'ında action öğelerini ayır
onClick={() => {
  if (item.action && item.id === 'background') {
    onEditBackground?.();
    handleClose();
  } else {
    setActivePanel(item.id);
  }
}}
```

### Project.tsx Değişiklikleri

```typescript
// handleEditHeroBackground fonksiyonu
const handleEditHeroBackground = useCallback(() => {
  const heroImage = project?.generated_content?.images?.heroHome || '';
  handleEditorSelect({
    type: 'image',
    title: 'Hero Background',
    sectionId: 'hero',
    imageData: {
      type: 'hero',
      imagePath: 'images.heroHome',
      currentUrl: heroImage,
      altText: 'Hero Background',
      positionX: 50,
      positionY: 50,
    },
    fields: [],
  });
  setCustomizeSidebarOpen(false);
}, [project, handleEditorSelect]);

// CustomizeSidebar'a prop geç
<CustomizeSidebar
  // ... mevcut props
  onEditBackground={handleEditHeroBackground}
  heroImageUrl={project.generated_content?.images?.heroHome}
/>
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/templates/temp1/sections/hero/HeroOverlay.tsx` | Arka planı tıklanabilir yap, butonu kaldır |
| `src/components/website-preview/CustomizeSidebar.tsx` | "Background Image" menü öğesi ekle |
| `src/pages/Project.tsx` | `handleEditHeroBackground` fonksiyonu ve prop aktarımı |

---

## Kullanıcı Deneyimi

**Değişiklik öncesi:**
- Kullanıcı "Edit Background" butonunu aramalıydı
- Buton sol altta sabit konumdaydı

**Değişiklik sonrası:**
- Arka plan görseline hover yapıldığında "Edit Background" ipucu görünür
- Görsele tıklayınca doğrudan düzenleme sidebar'ı açılır
- Customize menüsünden de "Background Image" seçeneği ile erişilebilir
- Daha sezgisel ve doğrudan etkileşim

