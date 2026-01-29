
# Birleşik Editor Sidebar Sistemi - Genişletilmiş Plan

## Hedef

Durable.co'daki gibi, görsellerin yanı sıra metin alanları, bölümler ve öğeler (service cards, statistics vb.) için de sağdan açılan context-aware bir editor sidebar oluşturmak.

## Durable.co Referans Analizi

Ekran görüntülerinden görülen 3 farklı sidebar tipi:

| Tip | Başlık | İçerik |
|-----|--------|--------|
| Banner/Hero | "Banner carousel" | Tagline, Headline, Subtext + Regenerate butonları, Carousel images |
| Text+Image | "Text + Image" | Content/Style tabs, Rich text editor, Image thumbnail |
| Item (Card) | "< Item" | Regenerate/Change, Alt text, Position, Title, Content |

## Mevcut Durum

```
ImageEditorSidebar (sadece görseller için)
├── Image preview
├── Regenerate/Change butonları
├── Alt text input
└── Position sliders

EditableField (inline editing)
├── Tıkla → Input aç
├── Enter → Kaydet
└── Escape → İptal
```

## Yeni Unified Yapı

```
EditorSidebar (birleşik)
├── type: 'image' | 'text' | 'section' | 'item'
├── Content/Style tabs (Durable tarzı)
└── Dinamik içerik based on type
```

## Yeni Bileşenler

### 1. EditorSidebar.tsx (Yeni - Birleşik)

Tüm düzenleme tiplerini tek bir sidebar'da birleştirir:

```typescript
interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  editingData: {
    type: 'image' | 'text' | 'section' | 'item';
    title: string;           // Sidebar başlığı ("Hero", "Service Card" vb.)
    
    // Image data (type='image' veya 'item' için)
    imageData?: ImageData;
    
    // Text fields (tüm tipler için)
    fields?: EditableFieldData[];
    
    // Section specific
    sectionId?: string;
  } | null;
  
  // Callbacks
  onFieldUpdate: (fieldPath: string, value: string) => void;
  onRegenerateField: (fieldPath: string) => void;
  onImageRegenerate: () => void;
  onImageChange: () => void;
  onUpdateAltText: (text: string) => void;
  onUpdatePosition: (x: number, y: number) => void;
}

interface EditableFieldData {
  label: string;        // "Headline", "Subtext" vb.
  fieldPath: string;    // "pages.home.hero.title"
  value: string;
  type: 'text' | 'textarea' | 'richtext';
  canRegenerate?: boolean;
}
```

### 2. EditableText.tsx (Yeni - Tıklanabilir Text Wrapper)

EditableImage gibi ama text için:

```typescript
interface EditableTextProps {
  value: string;
  fieldPath: string;
  fieldLabel: string;    // "Headline", "Description"
  as: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  isEditable: boolean;
  isSelected: boolean;
  onSelect: (data: EditableTextData) => void;
  className?: string;
}
```

### 3. EditableItem.tsx (Yeni - Card/Item Wrapper)

Service cards, statistics vb. için:

```typescript
interface EditableItemProps {
  children: React.ReactNode;
  itemType: 'service' | 'statistic' | 'testimonial' | 'faq';
  itemIndex: number;
  itemData: {
    title?: string;
    description?: string;
    image?: string;
  };
  isEditable: boolean;
  isSelected: boolean;
  onSelect: () => void;
}
```

## Sidebar İçerik Yapısı

### Image Type
```
+------------------------+
| < Hero Image    Done   |
+------------------------+
| Content | Style        |
+------------------------+
| [Image Preview]        |
| [Regenerate] [Change]  |
| Alt text: [________]   |
| Image position:        |
|   Horizontal ---o---   |
|   Vertical   --o----   |
+------------------------+
```

### Section Type (Hero, About vb.)
```
+------------------------+
| < Hero         Done   |
+------------------------+
| Content | Style        |
+------------------------+
| Tagline    [Generate]  |
| [________________]     |
|                        |
| Headline  [Regenerate] |
| [Advanced Treatments.] |
|                        |
| Subtext   [Regenerate] |
| [Delivering cutting..] |
|                        |
| -------------------    |
| Carousel images        |
| [img1] [img2] [img3]   |
+------------------------+
```

### Item Type (Service Card vb.)
```
+------------------------+
| < Item          Done   |
+------------------------+
| [Image Preview]        |
| [Regenerate] [Change]  |
| Alt text: [________]   |
| Image position:        |
|   Horizontal ---o---   |
|   Vertical   --o----   |
| -------------------    |
| Title    [Regenerate]  |
| [Advanced Cosmetic..]  |
|                        |
| Content  [Regenerate]  |
| [Enhance your smile..] |
+------------------------+
```

## State Yönetimi

Project.tsx'e eklenecek unified state:

```typescript
interface EditorSelection {
  type: 'image' | 'text' | 'section' | 'item';
  sectionId?: string;
  itemIndex?: number;
  
  // Current data
  title: string;
  imageData?: ImageData;
  fields: Array<{
    label: string;
    fieldPath: string;
    value: string;
    type: 'text' | 'textarea';
  }>;
}

const [editorSelection, setEditorSelection] = useState<EditorSelection | null>(null);
```

## Props Flow

```
Project.tsx
    │
    ├── editorSelection state
    ├── setEditorSelection callback
    │
    ▼
WebsitePreview → Template → Sections
    │
    ├── HeroSplitSection
    │   ├── EditableText (title) → sidebar
    │   ├── EditableText (subtitle) → sidebar
    │   └── EditableImage → sidebar
    │
    ├── ServicesGridSection
    │   └── EditableItem (each card) → sidebar
    │       ├── title field
    │       ├── description field
    │       └── image (if any)
    │
    └── StatisticsSection
        └── EditableItem (each stat) → sidebar
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/EditorSidebar.tsx` | YENİ - Birleşik sidebar |
| `src/components/website-preview/EditableText.tsx` | YENİ - Text wrapper |
| `src/components/website-preview/EditableItem.tsx` | YENİ - Item/Card wrapper |
| `src/components/website-preview/ImageEditorSidebar.tsx` | KALDIRILACAK (EditorSidebar ile birleşecek) |
| `src/pages/Project.tsx` | editorSelection state + EditorSidebar render |
| `src/templates/types.ts` | onEditorSelect type ekle |
| `src/templates/temp1/sections/HeroSplitSection.tsx` | EditableText kullan |
| `src/templates/temp1/sections/ServicesGridSection.tsx` | EditableItem kullan |
| `src/templates/temp1/sections/StatisticsSection.tsx` | EditableItem kullan |
| `src/templates/temp1/sections/AboutInlineSection.tsx` | EditableText kullan |

## Kullanım Senaryoları

### 1. Başlığa Tıklama
- Kullanıcı "Advanced Treatments for Global Patients" başlığına tıklar
- Sidebar açılır: "Hero" başlığı, Content tab'ı aktif
- Tagline, Headline, Subtext alanları gösterilir
- Her alanın yanında "Regenerate" butonu

### 2. Service Card'a Tıklama  
- Kullanıcı bir servis kartına tıklar
- Sidebar açılır: "< Item" başlığı
- Varsa görsel + Regenerate/Change
- Title ve Content alanları

### 3. Görsele Tıklama
- Kullanıcı hero görselene tıklar
- Sidebar açılır: "< Hero Image" başlığı
- Görsel preview + Regenerate/Change
- Alt text + Position sliders

## Regenerate Özelliği

Her text alanı için AI ile yeniden oluşturma:

```typescript
const handleRegenerateField = async (fieldPath: string) => {
  // Edge function çağrısı yapılacak
  // Örn: pages.home.hero.title için yeni başlık oluştur
  
  const response = await supabase.functions.invoke('regenerate-content', {
    body: { 
      projectId: id,
      fieldPath: fieldPath,
      context: project.profession
    }
  });
  
  if (response.data?.newValue) {
    handleFieldEdit(fieldPath, response.data.newValue);
  }
};
```

## UI/UX Detayları

### Seçili Eleman Gösterimi
- Seçili text/item etrafında mavi border (2px solid primary)
- Hafif gölge efekti
- Diğer elemanlar %95 opacity

### Sidebar Animasyonu
- Sağdan slide-in (300ms ease-out)
- Backdrop: %20 siyah overlay (tıklanabilir, kapatır)
- Width: 320px sabit

### Content/Style Tabs
- Content: Text alanları, görseller
- Style: Font, renk, spacing (Phase 2 - locked)

## Beklenen Sonuç

1. Herhangi bir düzenlenebilir elemana (text, image, card) tıklandığında sağdan sidebar açılır
2. Sidebar içeriği tıklanan elemana göre değişir
3. Text alanları inline değil sidebar'da düzenlenir
4. Her alan için "Regenerate" ile AI yeniden oluşturma
5. Görseller için Regenerate/Change + Position ayarları
6. Durable.co'daki gibi profesyonel ve tutarlı UX
