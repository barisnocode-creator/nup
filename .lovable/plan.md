
# Template Sistemi Genişletme Planı

## Genel Bakış

Mevcut tek template sistemini **2 farklı template** ve **section varyasyonları** ile genişleterek gerçek template değişikliği sağlayacağız. Preview + Onayla akışı ile kullanıcı güvenli bir şekilde template değiştirebilecek.

---

## Yeni Template Yapısı

```text
src/templates/
├── temp1/                    # Mevcut: Healthcare Modern
│   ├── sections/
│   │   ├── hero/ (4 varyant ✓ zaten var)
│   │   ├── about/ (yeni varyantlar)
│   │   └── services/ (yeni varyantlar)
│   └── index.tsx
│
├── temp2/                    # YENİ: Bold Agency
│   ├── sections/
│   │   ├── hero/
│   │   ├── about/
│   │   └── services/
│   ├── components/
│   │   ├── TemplateHeader.tsx
│   │   └── TemplateFooter.tsx
│   └── index.tsx
│
└── index.ts                  # Registry güncellemesi
```

---

## Template 1: Healthcare Modern (temp1) - Mevcut

**Karakteristik**:
- Yumuşak köşeler
- Primary renk tonları
- Profesyonel görünüm
- Sans-serif tipografi

**Yeni Section Varyasyonları**:
- About: Inline, Fullwidth, Timeline
- Services: Grid, List, Cards

---

## Template 2: Bold Agency (temp2) - YENİ

**Karakteristik**:
- Büyük tipografi
- Koyu arka planlar
- Gradient aksanlar
- Bold başlıklar
- Daha dramatik animasyonlar

**Dosyalar**:
```text
src/templates/temp2/
├── index.tsx                 # Ana template bileşeni
├── components/
│   ├── TemplateHeader.tsx    # Farklı header tasarımı
│   └── TemplateFooter.tsx    # Farklı footer tasarımı
├── pages/
│   └── FullLandingPage.tsx   # Section render
└── sections/
    ├── hero/
    │   ├── HeroBold.tsx      # Büyük metin, minimal görsel
    │   ├── HeroVideo.tsx     # Video arka plan destekli
    │   └── index.ts
    ├── about/
    │   ├── AboutCards.tsx
    │   └── index.ts
    └── services/
        ├── ServicesShowcase.tsx
        └── index.ts
```

---

## Preview + Onayla Akışı

### Mevcut Durum

```text
[Template Seç] → [Anında Değişir] → [Veritabanına Kaydedilir]
```

### Yeni Akış

```text
[Template Seç] → [Preview Modu] → [Beğendiysen: Uygula] → [Veritabanına Kaydet]
                       ↓
              [Beğenmediysen: İptal] → [Eski template'e dön]
```

### Durum Yönetimi

```typescript
// Project.tsx'de yeni state'ler
const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
const [originalTemplateId, setOriginalTemplateId] = useState<string | null>(null);

// Aktif template (preview varsa onu, yoksa gerçek template'i kullan)
const activeTemplateId = previewTemplateId || project?.template_id || 'temp1';

// Preview modunda üst banner göster
const isPreviewMode = previewTemplateId !== null;
```

---

## UI Değişiklikleri

### 1. Preview Modu Banner

Template preview modundayken üstte banner gösterilecek:

```text
+------------------------------------------------------------------+
| 🔍 Previewing: Bold Agency          [Apply Template] [Cancel]    |
+------------------------------------------------------------------+
|                                                                  |
|                    [Website Preview]                             |
|                                                                  |
+------------------------------------------------------------------+
```

### 2. ChangeTemplateModal Güncellemesi

- Preview butonu: Modal'ı kapatıp preview moduna geç
- Template'e tıklama: Seç ve preview moduna geç
- "Use this template" butonu yerine "Preview this template"

---

## Kod Değişiklikleri

### Dosya 1: src/templates/temp2/index.tsx (YENİ)

Bold Agency template'in ana bileşeni:

```typescript
export function BoldAgencyTemplate({
  content,
  colorPreference,
  isEditable,
  // ... diğer props
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BoldHeader siteName={content.metadata.siteName} />
      <main>
        <BoldHero content={content} />
        <BoldAbout content={content} />
        <BoldServices content={content} />
        {/* Diğer sections */}
      </main>
      <BoldFooter siteName={content.metadata.siteName} />
    </div>
  );
}
```

### Dosya 2: src/templates/temp2/sections/hero/HeroBold.tsx (YENİ)

```typescript
export function HeroBold({ title, subtitle, description }: HeroProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-12 flex gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-none hover:bg-gray-200">
            GET STARTED
          </button>
        </div>
      </div>
    </section>
  );
}
```

### Dosya 3: src/templates/index.ts Güncellemesi

```typescript
import { BoldAgencyTemplate } from './temp2';

const templateRegistry = {
  temp1: {
    config: {
      id: 'temp1',
      name: 'Healthcare Modern',
      description: 'Clean, professional template',
      category: 'Professional',
      preview: showcaseDental,
    },
    component: HealthcareModernTemplate,
  },
  temp2: {
    config: {
      id: 'temp2',
      name: 'Bold Agency',
      description: 'High-impact template for agencies',
      category: 'Creative',
      preview: showcaseDigitalAgency,
    },
    component: BoldAgencyTemplate,  // FARKLI BİLEŞEN
  },
  // Diğer template'ler (temp3-temp8) birini kullanabilir
};
```

### Dosya 4: src/pages/Project.tsx Güncellemesi

```typescript
// Preview state'leri
const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
const [originalTemplateId, setOriginalTemplateId] = useState<string | null>(null);

// Preview'i başlat
const handleTemplatePreview = (templateId: string) => {
  if (!originalTemplateId) {
    setOriginalTemplateId(project?.template_id || 'temp1');
  }
  setPreviewTemplateId(templateId);
  setChangeTemplateModalOpen(false);
};

// Preview'i onayla ve kaydet
const handleApplyTemplate = async () => {
  if (!previewTemplateId) return;
  
  await supabase
    .from('projects')
    .update({ template_id: previewTemplateId })
    .eq('id', id);
  
  setProject(prev => prev ? { ...prev, template_id: previewTemplateId } : null);
  setPreviewTemplateId(null);
  setOriginalTemplateId(null);
  toast({ title: 'Template applied!' });
};

// Preview'i iptal et
const handleCancelPreview = () => {
  setPreviewTemplateId(null);
  setOriginalTemplateId(null);
};

// Aktif template ID
const activeTemplateId = previewTemplateId || project?.template_id || 'temp1';
```

### Dosya 5: src/components/website-preview/TemplatePreviewBanner.tsx (YENİ)

```typescript
interface TemplatePreviewBannerProps {
  templateName: string;
  onApply: () => void;
  onCancel: () => void;
}

export function TemplatePreviewBanner({ templateName, onApply, onCancel }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Eye className="w-5 h-5" />
        <span>Previewing: <strong>{templateName}</strong></span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="bg-white text-purple-600" onClick={onApply}>
          Apply Template
        </Button>
      </div>
    </div>
  );
}
```

---

## Dosya Listesi

| Dosya | Değişiklik |
|-------|------------|
| `src/templates/temp2/index.tsx` | YENİ - Bold Agency template |
| `src/templates/temp2/components/TemplateHeader.tsx` | YENİ - Bold header |
| `src/templates/temp2/components/TemplateFooter.tsx` | YENİ - Bold footer |
| `src/templates/temp2/pages/FullLandingPage.tsx` | YENİ - Section render |
| `src/templates/temp2/sections/hero/HeroBold.tsx` | YENİ - Bold hero |
| `src/templates/temp2/sections/hero/index.ts` | YENİ - Hero registry |
| `src/templates/temp2/sections/about/AboutCards.tsx` | YENİ - Cards layout |
| `src/templates/temp2/sections/services/ServicesShowcase.tsx` | YENİ - Showcase |
| `src/templates/index.ts` | GÜNCELLE - temp2 ekle |
| `src/pages/Project.tsx` | GÜNCELLE - Preview state'leri |
| `src/components/website-preview/TemplatePreviewBanner.tsx` | YENİ - Preview banner |
| `src/components/website-preview/ChangeTemplateModal.tsx` | GÜNCELLE - Preview akışı |

---

## Template Karşılaştırması

| Özellik | temp1 (Healthcare) | temp2 (Bold Agency) |
|---------|-------------------|---------------------|
| Arka plan | Açık/Nötr | Koyu/Siyah |
| Tipografi | Sans-serif, normal ağırlık | Sans-serif, bold/black |
| Köşeler | Yuvarlatılmış | Keskin |
| Hero | Overlay/Split | Büyük tipografi, minimal |
| Renk paleti | Primary ağırlıklı | Gradientler, kontrast |
| Genel his | Profesyonel, güvenilir | Cesur, modern, etkileyici |

---

## Uygulama Sırası

1. **temp2 klasör yapısı oluştur** - index.tsx, components/, sections/
2. **Bold header/footer bileşenleri** - Farklı tasarım
3. **Bold hero bileşeni** - Büyük tipografi
4. **Bold about/services** - Farklı layout'lar
5. **templates/index.ts güncelle** - temp2 kaydet
6. **Project.tsx preview state'leri** - Preview mode
7. **TemplatePreviewBanner** - Onay/iptal UI
8. **ChangeTemplateModal güncelle** - Preview akışı

---

## Preview Akışı Diyagramı

```text
Kullanıcı                   Sistem
   |                          |
   |-- Change Template -->    |
   |                          |-- Modal aç
   |<-- Template listesi --   |
   |                          |
   |-- Preview tıkla -->      |
   |                          |-- Modal kapat
   |                          |-- previewTemplateId = seçilen
   |<-- Preview banner gör -- |
   |<-- Site yeni template -- |
   |                          |
   |-- Apply Template -->     |
   |                          |-- Veritabanına kaydet
   |                          |-- Preview state temizle
   |<-- Başarı mesajı --      |
   |                          |
   | VEYA                     |
   |                          |
   |-- Cancel -->             |
   |                          |-- Preview state temizle
   |<-- Eski template geri -- |
```

---

## Sonuç

Bu plan tamamlandığında:
- 2 görsel olarak farklı template olacak
- Kullanıcı önizleme yapıp onaylayabilecek
- Template değişikliği gerçekten sitenin görünümünü değiştirecek
- Mevcut editör sistemi her iki template ile de çalışacak
