

# Editör Geliştirme Planı: Bölüm Sıralama + GitHub Template Entegrasyonu

## Proje Özeti

Mevcut editöre iki ana özellik ekleyeceğiz:
1. **Bölüm Sıralama İyileştirmesi:** Drag-and-drop ile bölüm sıralaması
2. **GitHub Template Entegrasyonu:** 3 yeni template (gith1, gith2, gith3) GitHub'dan alınarak sisteme entegre edilecek

---

## Mevcut Durum Analizi

### Bölüm Sıralama (Mevcut)
- `sectionOrder` state'i `Project.tsx` içinde yönetiliyor (satır 67-69)
- `handleMoveSection` ve `handleDeleteSection` fonksiyonları mevcut (satır 723-754)
- `EditableSection` bileşeni yukarı/aşağı ok butonları sunuyor
- **Eksik:** Drag-and-drop desteği yok, sıralama veritabanına kaydedilmiyor

### Template Sistemi (Mevcut)
- 9 template tanımlı (`src/templates/index.ts`)
- Her template `TemplateConfig` ve `TemplateComponent` içeriyor
- `ChangeTemplateModal` ile template değiştirme mevcut

---

## Faz 1: Bölüm Sıralama İyileştirmesi

### Değişiklik 1.1: Drag-and-Drop Bölüm Sıralama

`react-beautiful-dnd` veya native HTML5 drag-and-drop ile bölüm sıralama.

**Dosya:** `src/templates/temp1/pages/FullLandingPage.tsx`

```typescript
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export function FullLandingPage({ ..., onReorderSections }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorderSections(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sectionOrder.map((sectionId, index) => (
              <Draggable key={sectionId} draggableId={sectionId} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderSection(sectionId)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

### Değişiklik 1.2: Sıralama Kaydetme

**Dosya:** `src/pages/Project.tsx`

```typescript
// sectionOrder'ı generated_content içinde saklama
const handleReorderSections = useCallback((sourceIndex: number, destIndex: number) => {
  const newOrder = [...sectionOrder];
  const [removed] = newOrder.splice(sourceIndex, 1);
  newOrder.splice(destIndex, 0, removed);
  setSectionOrder(newOrder);

  // Veritabanına kaydet
  const updatedContent = {
    ...project.generated_content,
    sectionOrder: newOrder,
  };
  setProject(prev => prev ? { ...prev, generated_content: updatedContent } : null);
  debouncedSave(updatedContent);
}, [sectionOrder, project, debouncedSave]);
```

### Değişiklik 1.3: HomeEditorSidebar'da Sıralama UI

**Dosya:** `src/components/website-preview/HomeEditorSidebar.tsx`

Bölüm listesine drag handle ve yeniden sıralama özelliği ekle.

---

## Faz 2: GitHub Template Entegrasyonu

### 3 Yeni Template Kaynakları

Tailwind CSS tabanlı açık kaynak templateler:

| ID | Kaynak | Stil |
|----|--------|------|
| gith1 | horizon-ui/free-tailwind-css-landing-kit-page | Modern SaaS |
| gith2 | spacemadev/Free-blue-star-tailwind-landing-page-template | Corporate Blue |
| gith3 | Tailwind + custom | Minimal Dark |

### Yeni Dosya Yapısı

```text
src/templates/
├── gith1/                    # GitHub Template 1 - Modern SaaS
│   ├── index.tsx
│   ├── components/
│   │   ├── TemplateHeader.tsx
│   │   └── TemplateFooter.tsx
│   ├── pages/
│   │   └── FullLandingPage.tsx
│   └── sections/
│       ├── hero/
│       ├── features/
│       ├── pricing/
│       └── cta/
├── gith2/                    # GitHub Template 2 - Corporate
│   ├── index.tsx
│   └── ...
└── gith3/                    # GitHub Template 3 - Minimal
    ├── index.tsx
    └── ...
```

### Template Konfigürasyonları

**Dosya:** `src/templates/index.ts`

```typescript
import { GitH1Template } from './gith1';
import { GitH2Template } from './gith2';
import { GitH3Template } from './gith3';

// Template registry'ye ekle
const templateRegistry = {
  // ... mevcut templateler
  
  gith1: {
    config: {
      id: 'gith1',
      name: 'Modern SaaS',
      description: 'GitHub tabanlı modern SaaS landing page şablonu',
      category: 'SaaS',
      preview: '/assets/gith1-preview.jpg',
      supportedProfessions: ['saas', 'startup', 'tech', 'app'],
      supportedTones: ['modern', 'tech', 'professional'],
    },
    component: GitH1Template,
  },
  
  gith2: {
    config: {
      id: 'gith2',
      name: 'Corporate Blue',
      description: 'Kurumsal mavi tonlarında profesyonel şablon',
      category: 'Corporate',
      preview: '/assets/gith2-preview.jpg',
      supportedProfessions: ['consulting', 'finance', 'legal', 'corporate'],
      supportedTones: ['professional', 'trustworthy', 'corporate'],
    },
    component: GitH2Template,
  },
  
  gith3: {
    config: {
      id: 'gith3',
      name: 'Minimal Dark',
      description: 'Minimalist koyu tema, portföy ve ajanslar için',
      category: 'Minimal',
      preview: '/assets/gith3-preview.jpg',
      supportedProfessions: ['creative', 'portfolio', 'agency', 'designer'],
      supportedTones: ['minimal', 'dark', 'elegant'],
    },
    component: GitH3Template,
  },
};
```

---

## Faz 3: Gith1 Template Detaylı Tasarım

### sections/hero/HeroSaaS.tsx

```typescript
interface HeroSaaSProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  isDark: boolean;
  isEditable: boolean;
  onFieldEdit?: (path: string, value: string) => void;
}

export function HeroSaaS({
  title,
  subtitle,
  description,
  heroImage,
  isDark,
  isEditable,
  onFieldEdit,
}: HeroSaaSProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {subtitle}
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              Ücretsiz Başla
            </button>
            <button className="px-8 py-4 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              Demo İzle
            </button>
          </div>
        </div>
        
        {/* Hero Image */}
        {heroImage && (
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <img 
              src={heroImage} 
              alt="Product screenshot" 
              className="rounded-2xl shadow-2xl mx-auto max-w-5xl w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
```

### sections/features/FeaturesGrid.tsx

```typescript
export function FeaturesGrid({ features, isDark }) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Özellikler
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            İşinizi büyütmek için ihtiyacınız olan tüm araçlar tek platformda.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-background rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Faz 4: Preview Görselleri

### Yeni Dosyalar

```text
src/assets/
├── gith1-preview.jpg    # Modern SaaS screenshot
├── gith2-preview.jpg    # Corporate Blue screenshot  
├── gith3-preview.jpg    # Minimal Dark screenshot
```

Geçici olarak Unsplash görsellerini kullanabiliriz:
- gith1: `https://images.unsplash.com/photo-1551434678-e076c223a692` (SaaS dashboard)
- gith2: `https://images.unsplash.com/photo-1497366216548-37526070297c` (Corporate office)
- gith3: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe` (Dark minimal)

---

## Dosya Değişiklikleri Özeti

### Yeni Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/templates/gith1/index.tsx` | Template 1 ana bileşeni |
| `src/templates/gith1/components/TemplateHeader.tsx` | Header |
| `src/templates/gith1/components/TemplateFooter.tsx` | Footer |
| `src/templates/gith1/pages/FullLandingPage.tsx` | Ana sayfa |
| `src/templates/gith1/sections/hero/HeroSaaS.tsx` | SaaS hero |
| `src/templates/gith1/sections/features/FeaturesGrid.tsx` | Özellikler grid |
| `src/templates/gith2/...` | Template 2 dosyaları |
| `src/templates/gith3/...` | Template 3 dosyaları |
| `src/assets/gith1-preview.jpg` | Preview görsel 1 |
| `src/assets/gith2-preview.jpg` | Preview görsel 2 |
| `src/assets/gith3-preview.jpg` | Preview görsel 3 |

### Güncellenecek Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `package.json` | `@hello-pangea/dnd` (drag-drop library) |
| `src/templates/index.ts` | 3 yeni template registry |
| `src/pages/Project.tsx` | `handleReorderSections`, `sectionOrder` kaydetme |
| `src/templates/temp1/pages/FullLandingPage.tsx` | Drag-drop wrapper |
| `src/components/website-preview/HomeEditorSidebar.tsx` | Reorder UI |
| `src/types/generated-website.ts` | `sectionOrder` tipi |

---

## Bağımlılık

```json
{
  "@hello-pangea/dnd": "^16.5.0"
}
```

`@hello-pangea/dnd` seçildi çünkü:
- React 18 uyumlu (`react-beautiful-dnd` artık bakımda değil)
- Aynı API, kolay geçiş
- Küçük bundle size (~45KB gzip)

---

## Teknik Detaylar

### Drag-Drop Entegrasyonu

1. `DragDropContext` en üst seviyede wrapper
2. Her bölüm `Draggable` ile sarılır
3. `onDragEnd` callback'i sıralamayı günceller
4. Animasyonlar smooth transition sağlar

### Template Yapısı Standartları

Her yeni template şunları içermelidir:
- `index.tsx` - Ana export ve template wrapper
- `components/TemplateHeader.tsx` - Navigation
- `components/TemplateFooter.tsx` - Footer
- `pages/FullLandingPage.tsx` - Tüm bölümleri birleştiren sayfa
- `sections/` - Her bölüm için ayrı klasör

### Türkçe İçerik

Tüm yeni templateler Türkçe placeholder metinler ile gelecek:
- "Hemen Başlayın" / "Ücretsiz Deneyin"
- "Hizmetlerimiz" / "Özellikler"
- "Hakkımızda" / "İletişim"

---

## Beklenen Sonuçlar

1. **Drag-Drop Sıralama:** Bölümleri sürükleyerek yeniden düzenleme
2. **Sıralama Kalıcılığı:** Sıralama veritabanına kaydedilir
3. **3 Yeni Template:** gith1, gith2, gith3 template galeriside görünür
4. **Template Önizleme:** Her template için profesyonel preview görseli
5. **Türkçe İçerik:** Tüm yeni templateler Türkçe

