
# Customize Sidebar Durable.co Stili Güncelleme

## Hedef
Durable.co referans görselindeki tasarımı uygulamak:
- Sidebar açıldığında website kararmamalı (overlay yok)
- Sidebar sol taraftan açılmalı
- Menü öğeleri sade olmalı: icon + text + ok işareti
- Alt açıklamalar ve collapsible content inline gösterilmemeli

## Durable.co Referans Analizi (Screenshot)

```
+------------------------+
| Customize         □ X  |
+------------------------+
| 🎨 Colors          >   |
| Aa Fonts           >   |
| ⏹  Buttons         >   |
| └  Corners         >   |
| ⚡ Animations      >   |
| 🖼  Browser icon   >   |
| ⊞  Manage widgets  >   |
| ✨ Regenerate text     |
| 🔄 Regenerate website  |
| 📄 Keywords        >   |
+------------------------+
```

**Önemli Özellikler:**
- Beyaz arka plan, karartma yok
- Sol tarafta konumlandırma
- Tek satırda icon + text + ok
- Alt açıklama yok
- Sade, minimal görünüm

## Yapılacak Değişiklikler

### 1. Sheet Bileşenini Güncelle (overlay kaldır)
```typescript
// Yeni "noOverlay" prop ekle
interface SheetContentProps {
  noOverlay?: boolean; // Overlay'ı kaldırmak için
}

// SheetContent içinde:
{!noOverlay && <SheetOverlay />}
```

### 2. CustomizeSidebar'ı Yeniden Tasarla

**Mevcut (hatalı):**
```
+----------------------------------+
| Customize                     X  |
+----------------------------------+
| 🎨 Colors                     >  |
|    Primary, secondary, accent    | <-- Alt açıklama
|                                  |
|    [Collapsible content inline]  | <-- Açık içerik
```

**Durable.co Stili (hedef):**
```
+------------------------+
| Customize         □ X  |
+------------------------+
| 🎨 Colors          >   |
| Aa Fonts           >   |
| ⏹  Buttons         >   |
| └  Corners         >   |
| ⚡ Animations      >   |
| 🖼  Browser icon   >   |
| ⊞  Manage widgets  >   |
| ✨ Regenerate text     |
| 🔄 Regenerate website  |
| 📄 Keywords        >   |
+------------------------+
```

### 3. Menü Akışı

Bir menü öğesine tıklandığında:
1. Ana sidebar yerinde kalır (açık)
2. Alt panel sağa doğru kayarak açılır (veya aynı sidebar'da navigasyon)
3. Geri butonu ile ana menüye dönülür

**Alternatif (basit implementasyon):**
- Menü öğesine tıklandığında sidebar içeriği değişir
- Başlıkta geri butonu görünür
- Geri tıklandığında ana menü gösterilir

## Teknik Detaylar

### Sidebar Konumu
```typescript
// Mevcut (sağ):
<SheetContent side="right" ...>

// Hedef (sol):
<SheetContent side="left" ...>
```

### Overlay Kaldırma
```typescript
// sheet.tsx'de yeni variant ekle
<SheetContent 
  side="left" 
  noOverlay  // Yeni prop
  className="shadow-xl border-r"
>
```

### Menü Öğesi Stili (Durable.co)
```typescript
<button className="flex items-center w-full px-4 py-3 hover:bg-gray-50">
  <Icon className="w-5 h-5 text-gray-500 mr-3" />
  <span className="flex-1 text-left text-sm font-normal text-gray-700">
    {label}
  </span>
  {hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
</button>
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/ui/sheet.tsx` | `noOverlay` prop ekle |
| `src/components/website-preview/CustomizeSidebar.tsx` | - Sol taraftan aç, - Collapsible yapıyı kaldır, - Sade menü öğeleri, - Manage widgets ve Keywords ekle, - Alt panel navigasyonu |
| `src/components/website-preview/HomeEditorSidebar.tsx` | Sol taraftan aç, overlay kaldır |
| `src/components/website-preview/PageSettingsSidebar.tsx` | Sol taraftan aç, overlay kaldır |
| `src/components/website-preview/AddContentSidebar.tsx` | Sol taraftan aç, overlay kaldır |

## CustomizeSidebar Yeni Yapı

```typescript
type SubPanel = 'colors' | 'fonts' | 'buttons' | 'corners' | 
                'animations' | 'browser-icon' | 'widgets' | 'keywords' | null;

const [activeSubPanel, setActiveSubPanel] = useState<SubPanel>(null);

// Ana menü öğeleri
const menuItems = [
  { id: 'colors', icon: Palette, label: 'Colors', hasSubmenu: true },
  { id: 'fonts', icon: Type, label: 'Fonts', hasSubmenu: true },
  { id: 'buttons', icon: ToggleLeft, label: 'Buttons', hasSubmenu: true },
  { id: 'corners', icon: Square, label: 'Corners', hasSubmenu: true },
  { id: 'animations', icon: Zap, label: 'Animations', hasSubmenu: true },
  { id: 'browser-icon', icon: Image, label: 'Browser icon', hasSubmenu: true },
  { id: 'widgets', icon: LayoutGrid, label: 'Manage widgets', hasSubmenu: true },
];

const actionItems = [
  { id: 'regenerate-text', icon: Sparkles, label: 'Regenerate text', action: onRegenerateText },
  { id: 'regenerate-website', icon: RefreshCw, label: 'Regenerate entire website', action: onRegenerateWebsite },
];

const bottomMenuItems = [
  { id: 'keywords', icon: FileText, label: 'Keywords', hasSubmenu: true },
];

// Render
return (
  <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <SheetContent side="left" noOverlay className="w-[350px] p-0">
      {activeSubPanel ? (
        // Alt panel içeriği
        <SubPanelContent 
          panel={activeSubPanel} 
          onBack={() => setActiveSubPanel(null)} 
        />
      ) : (
        // Ana menü
        <MainMenu items={menuItems} onSelect={setActiveSubPanel} />
      )}
    </SheetContent>
  </Sheet>
);
```

## Alt Panel İçerikleri

### Colors Alt Paneli
```
+------------------------+
| < Colors          □ X  |
+------------------------+
| [Ocean] [Forest] [Sun] |
| [Royal] [Midnight]     |
|                        |
| --- Custom ---         |
| Primary: [#3B82F6]     |
| Secondary: [#6366F1]   |
| Accent: [#F59E0B]      |
+------------------------+
```

### Fonts Alt Paneli
```
+------------------------+
| < Fonts           □ X  |
+------------------------+
| Heading: [Playfair ▼]  |
| Body: [Inter ▼]        |
|                        |
| --- Presets ---        |
| ○ Modern (Poppins)     |
| ○ Classic (Merriweather)|
| ○ Minimal (Inter)      |
+------------------------+
```

## Beklenen Sonuç

1. CustomizeSidebar sol taraftan açılır
2. Website kararma olmaz - yan yana görünür
3. Menü öğeleri Durable.co gibi sade görünür
4. Tıklama ile alt panel açılır, geri butonu ile ana menüye dönülür
5. Manage widgets ve Keywords menü öğeleri eklenir
6. Regenerate text/website butonları düz liste öğesi olarak görünür

