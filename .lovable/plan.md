
# GrapeJS Entegrasyonu - Web Sitesi Editörünün Tamamen Yeniden Tasarlanması

## Proje Özeti

Mevcut özel yapım editör sistemini profesyonel açık kaynaklı **GrapeJS** editörü ile değiştireceğiz. Bu, görsel sürükle-bırak düzenleme, gelişmiş bileşen yönetimi ve responsive tasarım özellikleri sağlayacak.

---

## Mevcut Sistem Analizi

### Mevcut Editor Bileşenleri (Kaldırılacak/Refaktör Edilecek)
```
src/components/website-preview/
├── EditorSidebar.tsx          (697 satır) - Metin/görsel düzenleme paneli
├── EditorToolbar.tsx          (176 satır) - Üst toolbar
├── CustomizeSidebar.tsx       (500 satır) - Özelleştirme paneli
├── EditableText.tsx           - Inline text editing
├── EditableImage.tsx          - Görsel düzenleme
├── EditableField.tsx          - Form alanları
├── EditableSection.tsx        - Bölüm yönetimi
├── HomeEditorSidebar.tsx      - Ana sayfa bölüm listesi
├── PageSettingsSidebar.tsx    - Sayfa ayarları
├── AddContentSidebar.tsx      - İçerik ekleme
└── WebsitePreview.tsx         - Önizleme wrapper
```

### Mevcut Veri Yapısı
```typescript
interface GeneratedContent {
  pages: { home, about, services, contact, blog };
  images: { heroHome, heroAbout, ... };
  sectionVariants: { hero, services, about, ... };
  sectionStyles: { [sectionId]: SectionStyle };
  metadata: { siteName, tagline, seoDescription };
  siteSettings: { colors, fonts, corners, animations };
}
```

---

## GrapeJS Entegrasyon Planı

### Faz 1: Altyapı Kurulumu

#### Yeni Bağımlılıklar
```json
{
  "grapesjs": "^0.21.10",
  "@grapesjs/react": "^1.0.0",
  "grapesjs-blocks-basic": "^1.0.2",
  "grapesjs-preset-webpage": "^1.0.3",
  "grapesjs-plugin-forms": "^2.0.6",
  "grapesjs-style-bg": "^2.0.2"
}
```

#### Yeni Dosya Yapısı
```
src/
├── components/
│   └── grapes-editor/
│       ├── GrapesEditor.tsx           # Ana editor bileşeni
│       ├── GrapesCanvas.tsx           # Canvas wrapper
│       ├── GrapesToolbar.tsx          # Üst toolbar
│       ├── GrapesSidebar.tsx          # Sol panel (bloklar, katmanlar)
│       ├── GrapesStylePanel.tsx       # Sağ panel (stil ayarları)
│       ├── hooks/
│       │   ├── useGrapesEditor.ts     # Editor instance hook
│       │   └── useGrapesStorage.ts    # Supabase storage hook
│       ├── blocks/
│       │   ├── index.ts               # Blok registry
│       │   ├── heroBlocks.ts          # Hero bölüm blokları
│       │   ├── servicesBlocks.ts      # Hizmet blokları
│       │   ├── aboutBlocks.ts         # Hakkımızda blokları
│       │   ├── contactBlocks.ts       # İletişim blokları
│       │   └── sectionBlocks.ts       # Genel bölüm blokları
│       ├── plugins/
│       │   ├── supabaseStorage.ts     # Supabase kaydetme/yükleme
│       │   ├── turkishLocale.ts       # Türkçe dil desteği
│       │   └── templateBlocks.ts      # Template-specific bloklar
│       └── styles/
│           └── grapes-custom.css      # Özel GrapeJS stilleri
```

### Faz 2: Ana Editor Bileşeni

#### GrapesEditor.tsx (Yeni)
```typescript
import GjsEditor, { Canvas, WithEditor } from '@grapesjs/react';
import grapesjs, { Editor } from 'grapesjs';
import basicBlocksPlugin from 'grapesjs-blocks-basic';
import webpagePresetPlugin from 'grapesjs-preset-webpage';
import formsPlugin from 'grapesjs-plugin-forms';
import { supabaseStoragePlugin } from './plugins/supabaseStorage';
import { turkishLocalePlugin } from './plugins/turkishLocale';
import { customBlocksPlugin } from './plugins/templateBlocks';

interface GrapesEditorProps {
  projectId: string;
  initialContent: GeneratedContent;
  templateId: string;
  onSave: (content: any) => void;
  onPublish: () => void;
}

export function GrapesEditor({
  projectId,
  initialContent,
  templateId,
  onSave,
  onPublish,
}: GrapesEditorProps) {
  const onEditor = (editor: Editor) => {
    // Editor hazır olduğunda
    console.log('GrapeJS Editor initialized');
    
    // Mevcut içeriği yükle
    loadProjectContent(editor, initialContent);
    
    // Auto-save eventi
    editor.on('storage:store', (data) => {
      onSave(data);
    });
  };

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: '100vh',
        storageManager: {
          type: 'remote',
          autosave: true,
          stepsBeforeSave: 3,
          options: {
            remote: {
              urlStore: `/api/projects/${projectId}/content`,
              urlLoad: `/api/projects/${projectId}/content`,
            }
          }
        },
        deviceManager: {
          devices: [
            { id: 'desktop', name: 'Masaüstü', width: '' },
            { id: 'tablet', name: 'Tablet', width: '768px' },
            { id: 'mobile', name: 'Mobil', width: '375px' },
          ]
        },
        panels: {
          defaults: [] // Özel paneller kullanacağız
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          ]
        }
      }}
      plugins={[
        basicBlocksPlugin,
        webpagePresetPlugin,
        formsPlugin,
        supabaseStoragePlugin,
        turkishLocalePlugin,
        customBlocksPlugin,
      ]}
      pluginsOpts={{
        [basicBlocksPlugin]: {
          blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video'],
          flexGrid: true,
        },
        [webpagePresetPlugin]: {
          blocksBasicOpts: { flexGrid: true },
        },
      }}
      onEditor={onEditor}
    >
      <GrapesLayout 
        projectId={projectId} 
        onPublish={onPublish} 
      />
    </GjsEditor>
  );
}
```

### Faz 3: Özel Bloklar (Template Uyumlu)

#### blocks/heroBlocks.ts (Yeni)
```typescript
export function registerHeroBlocks(editor: Editor) {
  const bm = editor.BlockManager;
  
  // Hero Split
  bm.add('hero-split', {
    label: 'Hero (Bölünmüş)',
    category: 'Hero Bölümleri',
    content: `
      <section class="hero-split min-h-[80vh] flex items-center">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <span class="text-primary font-medium" data-gjs-editable="true">Alt Başlık</span>
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-gjs-editable="true">
                Ana Başlık Buraya
              </h1>
              <p class="text-lg text-muted-foreground" data-gjs-editable="true">
                Açıklama metni buraya gelecek.
              </p>
              <div class="flex gap-4">
                <button class="px-8 py-3 bg-primary text-primary-foreground rounded-lg">
                  Başla
                </button>
              </div>
            </div>
            <div class="relative">
              <img src="/placeholder.svg" alt="Hero" class="rounded-2xl shadow-2xl" data-gjs-type="image"/>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-columns' },
  });

  // Hero Overlay
  bm.add('hero-overlay', {
    label: 'Hero (Arka Plan)',
    category: 'Hero Bölümleri',
    content: `
      <section class="hero-overlay relative min-h-[80vh] flex items-center justify-center text-center text-white"
               style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/placeholder.svg') center/cover">
        <div class="container mx-auto px-6 max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6" data-gjs-editable="true">
            İşletmeniz İçin Profesyonel Çözümler
          </h1>
          <p class="text-xl opacity-90 mb-8" data-gjs-editable="true">
            Deneyimli ekibimizle hizmetinizdeyiz.
          </p>
          <button class="px-10 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100">
            Hemen Başlayın
          </button>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-image' },
  });

  // Daha fazla hero varyantı...
}
```

#### blocks/servicesBlocks.ts (Yeni)
```typescript
export function registerServicesBlocks(editor: Editor) {
  const bm = editor.BlockManager;
  
  // Hizmetler Grid
  bm.add('services-grid', {
    label: 'Hizmetler (Grid)',
    category: 'Hizmet Bölümleri',
    content: `
      <section class="services-grid py-20 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4" data-gjs-editable="true">Hizmetlerimiz</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto" data-gjs-editable="true">
              Size en iyi hizmeti sunmak için buradayız.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="service-card bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span class="text-2xl">⚡</span>
              </div>
              <h3 class="text-xl font-semibold mb-3" data-gjs-editable="true">Hizmet Adı</h3>
              <p class="text-muted-foreground" data-gjs-editable="true">Hizmet açıklaması buraya gelecek.</p>
            </div>
            <!-- Daha fazla kart -->
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-th' },
  });
}
```

### Faz 4: Supabase Storage Plugin

#### plugins/supabaseStorage.ts (Yeni)
```typescript
import { supabase } from '@/integrations/supabase/client';

export function supabaseStoragePlugin(editor: Editor) {
  editor.Storage.add('supabase', {
    async load(options) {
      const { projectId } = options;
      
      const { data, error } = await supabase
        .from('projects')
        .select('grapes_content')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      return data?.grapes_content || {};
    },
    
    async store(data, options) {
      const { projectId } = options;
      
      const { error } = await supabase
        .from('projects')
        .update({
          grapes_content: data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);
      
      if (error) throw error;
    },
  });
  
  // Supabase storage'ı varsayılan yap
  editor.StorageManager.setCurrent('supabase');
}
```

### Faz 5: Türkçe Dil Desteği

#### plugins/turkishLocale.ts (Yeni)
```typescript
export function turkishLocalePlugin(editor: Editor) {
  editor.I18n.addMessages({
    tr: {
      blockManager: {
        labels: {
          'hero-split': 'Hero (Bölünmüş)',
          'hero-overlay': 'Hero (Arka Plan)',
          'services-grid': 'Hizmetler (Grid)',
          'contact-form': 'İletişim Formu',
        },
        categories: {
          'Hero Bölümleri': 'Hero Bölümleri',
          'Hizmet Bölümleri': 'Hizmet Bölümleri',
          'İletişim': 'İletişim',
          'Genel': 'Genel',
        },
      },
      panels: {
        buttons: {
          titles: {
            'preview': 'Önizle',
            'export': 'Dışa Aktar',
            'fullscreen': 'Tam Ekran',
            'sw-visibility': 'Bileşen Görünürlüğü',
          },
        },
      },
      styleManager: {
        sectors: {
          general: 'Genel',
          dimension: 'Boyutlar',
          typography: 'Yazı Tipi',
          decorations: 'Dekorasyonlar',
        },
      },
      traitManager: {
        empty: 'Seçili öğe düzenlenebilir özellik içermiyor',
        label: 'Özellikler',
      },
      deviceManager: {
        device: 'Cihaz',
        devices: {
          desktop: 'Masaüstü',
          tablet: 'Tablet',
          mobile: 'Mobil',
        },
      },
    },
  });
  
  editor.I18n.setLocale('tr');
}
```

### Faz 6: Veritabanı Değişiklikleri

#### Migration: grapes_content sütunu ekle
```sql
-- projects tablosuna grapes_content sütunu ekle
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS grapes_content JSONB DEFAULT '{}';

-- Mevcut generated_content'i grapes formatına dönüştürmek için trigger (opsiyonel)
COMMENT ON COLUMN projects.grapes_content IS 'GrapeJS editor content in JSON format';
```

### Faz 7: Layout Bileşeni

#### GrapesLayout.tsx (Yeni)
```typescript
import { useEditor, Canvas, Topbar } from '@grapesjs/react';

interface GrapesLayoutProps {
  projectId: string;
  onPublish: () => void;
}

export function GrapesLayout({ projectId, onPublish }: GrapesLayoutProps) {
  const editor = useEditor();
  
  const handleSave = async () => {
    await editor.store();
    toast({ title: 'Kaydedildi', description: 'Değişiklikleriniz kaydedildi.' });
  };
  
  const handlePreview = () => {
    editor.runCommand('preview');
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Üst Toolbar */}
      <div className="h-14 bg-background border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4" />
          </Button>
          
          {/* Cihaz Seçici */}
          <DeviceSelector editor={editor} />
          
          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" onClick={() => editor.runCommand('core:undo')}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.runCommand('core:redo')}>
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Önizle
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
          <Button size="sm" onClick={onPublish}>
            <Globe className="w-4 h-4 mr-2" />
            Yayınla
          </Button>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sol Panel - Bloklar */}
        <div className="w-64 bg-muted/30 border-r overflow-y-auto">
          <BlocksPanel />
          <LayersPanel />
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-gray-100">
          <Canvas />
        </div>
        
        {/* Sağ Panel - Stiller */}
        <div className="w-72 bg-background border-l overflow-y-auto">
          <StylePanel />
          <TraitsPanel />
        </div>
      </div>
    </div>
  );
}
```

---

## Değişiklik Özeti

### Yeni Dosyalar (Oluşturulacak)
| Dosya | Açıklama |
|-------|----------|
| `src/components/grapes-editor/GrapesEditor.tsx` | Ana editor wrapper |
| `src/components/grapes-editor/GrapesLayout.tsx` | Editor layout |
| `src/components/grapes-editor/GrapesToolbar.tsx` | Üst toolbar |
| `src/components/grapes-editor/blocks/heroBlocks.ts` | Hero blokları |
| `src/components/grapes-editor/blocks/servicesBlocks.ts` | Hizmet blokları |
| `src/components/grapes-editor/blocks/aboutBlocks.ts` | Hakkımızda blokları |
| `src/components/grapes-editor/blocks/contactBlocks.ts` | İletişim blokları |
| `src/components/grapes-editor/blocks/index.ts` | Blok registry |
| `src/components/grapes-editor/plugins/supabaseStorage.ts` | Supabase storage |
| `src/components/grapes-editor/plugins/turkishLocale.ts` | Türkçe dil |
| `src/components/grapes-editor/plugins/templateBlocks.ts` | Template blokları |
| `src/components/grapes-editor/hooks/useGrapesEditor.ts` | Editor hook |
| `src/components/grapes-editor/styles/grapes-custom.css` | Özel stiller |

### Güncellenecek Dosyalar
| Dosya | Değişiklik |
|-------|-----------|
| `src/pages/Project.tsx` | GrapesEditor kullanımı |
| `package.json` | GrapeJS bağımlılıkları |
| `src/types/generated-website.ts` | grapes_content tipi |

### Migration
| Dosya | Açıklama |
|-------|----------|
| `supabase/migrations/xxx_add_grapes_content.sql` | grapes_content sütunu |

---

## Beklenen Sonuçlar

1. **Görsel Sürükle-Bırak:** Kullanıcılar blokları sürükleyip bırakabilir
2. **Responsive Tasarım:** Masaüstü/Tablet/Mobil önizleme
3. **Türkçe Arayüz:** Tüm menüler ve mesajlar Türkçe
4. **Otomatik Kaydetme:** Supabase'e gerçek zamanlı kaydetme
5. **Template Uyumu:** Mevcut template blokları GrapeJS'e dönüştürülmüş
6. **Stil Düzenleme:** Her element için detaylı stil paneli

---

## Teknik Notlar

### GrapeJS Avantajları
- **Açık Kaynak:** MIT lisansı, ticari kullanım serbest
- **Genişletilebilir:** Plugin sistemi ile özelleştirilebilir
- **Responsive:** Mobil-öncelikli tasarım desteği
- **Undo/Redo:** Sınırsız geri alma
- **Export:** HTML/CSS/JSON export

### Dikkat Edilmesi Gerekenler
- GrapeJS ~500KB gzip boyutunda (lazy loading önerilir)
- Mevcut `generated_content` ile senkronizasyon stratejisi gerekli
- Template geçişi için migration scripti yazılmalı
