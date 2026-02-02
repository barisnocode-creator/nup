
# Chaibuilder SDK Entegrasyon Planı

## Proje Özeti

Mevcut editör sistemini (GrapesJS + özel React template'ler) tamamen **Chaibuilder SDK** ile değiştireceğiz. Chaibuilder, React + Tailwind CSS tabanlı modern bir visual page builder SDK'sı olup, projemizin mevcut teknoloji yığınıyla (React 18, Tailwind CSS, Supabase) mükemmel uyum sağlar.

---

## Neden Chaibuilder?

| Özellik | Mevcut Sistem | Chaibuilder SDK |
|---------|---------------|-----------------|
| Mimari | GrapesJS (jQuery tabanlı) + React templates | Native React + Tailwind |
| Blok Sistemi | Ayrı template dosyaları | JSON tabanlı block registry |
| Tema Yönetimi | Özel CSS değişkenleri | Dahili theme presets |
| AI Entegrasyonu | Yok | Dahili `askAiCallback` |
| Kaydetme | Özel Supabase storage | `onSave` callback |
| Çoklu Dil | Özel implementation | Dahili i18n desteği |
| Responsive | Device emulators | Dahili breakpoint sistemi |

---

## Mimari Değişiklikler

### Mevcut Yapı (Kaldırılacak)

```text
src/
├── components/grapes-editor/        # GrapesJS editör (KALDIRILACAK)
├── components/website-preview/      # Özel editör bileşenleri (DÖNÜŞTÜRÜLECEK)
├── templates/                       # React template'ler (BLOK'a DÖNÜŞECEK)
└── pages/Project.tsx               # Editör sayfası (GÜNCELLENECEK)
```

### Yeni Yapı (Chaibuilder)

```text
src/
├── components/chai-builder/
│   ├── ChaiBuilderWrapper.tsx      # Ana wrapper
│   ├── blocks/                     # Özel bloklar
│   │   ├── hero/
│   │   │   ├── HeroSplit.tsx
│   │   │   ├── HeroOverlay.tsx
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── testimonials/
│   │   ├── contact/
│   │   └── index.ts                # Tüm blokları register eden dosya
│   ├── themes/
│   │   ├── presets.ts              # Tema presetleri
│   │   └── index.ts
│   ├── plugins/
│   │   ├── aiAssistant.ts          # AI entegrasyonu
│   │   └── supabaseSync.ts         # Supabase kaydetme
│   └── hooks/
│       └── useChaiBuilder.ts
├── lib/
│   └── chai-blocks-renderer.tsx    # Render bileşeni
└── pages/
    └── Project.tsx                 # Güncellenmiş editör
```

---

## Faz 1: Temel Kurulum

### 1.1 Bağımlılık Kurulumu

```json
{
  "dependencies": {
    "@chaibuilder/sdk": "^3.2.14"
  }
}
```

### 1.2 Tailwind Yapılandırması

Yeni dosya: `tailwind.chaibuilder.config.ts`

```typescript
import { getChaiBuilderTailwindConfig } from "@chaibuilder/sdk/tailwind";
export default getChaiBuilderTailwindConfig(["./src/**/*.{js,ts,jsx,tsx}"]);
```

Yeni CSS dosyası: `src/styles/chaibuilder.tailwind.css`

```css
@config "./tailwind.chaibuilder.config.ts";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.3 Ana Wrapper Bileşeni

Yeni dosya: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

```typescript
import "@chaibuilder/sdk/styles";
import "./chaibuilder.tailwind.css";
import { ChaiBuilderEditor } from "@chaibuilder/sdk";
import { loadWebBlocks } from "@chaibuilder/sdk/web-blocks";
import { registerCustomBlocks } from "./blocks";
import { themePresets, defaultTheme } from "./themes";

loadWebBlocks();
registerCustomBlocks();

interface ChaiBuilderWrapperProps {
  projectId: string;
  projectName: string;
  initialBlocks: any[];
  initialTheme?: any;
  onSave: (data: any) => Promise<boolean>;
  onPublish: () => void;
}

export function ChaiBuilderWrapper({
  projectId,
  projectName,
  initialBlocks,
  initialTheme,
  onSave,
  onPublish,
}: ChaiBuilderWrapperProps) {
  return (
    <ChaiBuilderEditor
      pageId={projectId}
      blocks={initialBlocks}
      theme={initialTheme || defaultTheme}
      themePresets={themePresets}
      onSave={onSave}
      autoSave={true}
      autoSaveActionsCount={5}
      locale="tr"
      // AI entegrasyonu
      askAiCallBack={async (type, prompt, blocks, lang) => {
        // Edge function çağrısı
        const response = await fetch('/api/ai-assistant', {
          method: 'POST',
          body: JSON.stringify({ type, prompt, blocks, lang }),
        });
        return response.json();
      }}
    />
  );
}
```

---

## Faz 2: Özel Blok Dönüşümü

Mevcut template bölümlerini Chaibuilder bloklarına dönüştüreceğiz.

### 2.1 Mevcut Template -> Blok Mapping

| Mevcut Template | Chaibuilder Blok |
|-----------------|------------------|
| `HeroSplit.tsx` | `HeroSplitBlock` |
| `HeroCentered.tsx` | `HeroCenteredBlock` |
| `ServicesGrid.tsx` | `ServicesGridBlock` |
| `TestimonialsSection.tsx` | `TestimonialsBlock` |
| `ContactSection.tsx` | `ContactFormBlock` |
| `FAQSection.tsx` | `FAQAccordionBlock` |
| `CTASection.tsx` | `CTABannerBlock` |

### 2.2 Örnek Blok Dönüşümü

Mevcut: `src/templates/temp1/sections/hero/HeroSplit.tsx`

Yeni: `src/components/chai-builder/blocks/hero/HeroSplit.tsx`

```typescript
import {
  registerChaiBlock,
  registerChaiBlockSchema,
  ChaiBlockComponentProps,
  ChaiStyles,
  StylesProp,
} from "@chaibuilder/sdk/runtime";

type HeroSplitProps = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  styles: ChaiStyles;
};

const HeroSplit = (props: ChaiBlockComponentProps<HeroSplitProps>) => {
  const { 
    blockProps, 
    title, 
    subtitle, 
    description, 
    buttonText,
    buttonLink,
    image,
    styles,
    inBuilder 
  } = props;

  return (
    <section {...blockProps} {...styles} className="relative min-h-[600px] flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {subtitle && (
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {subtitle}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              {description}
            </p>
            {buttonText && (
              <a 
                href={inBuilder ? "#" : buttonLink}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {buttonText}
              </a>
            )}
          </div>
          <div className="relative">
            <img 
              src={image || "/placeholder.svg"} 
              alt={title}
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSplitConfig = {
  type: "HeroSplit",
  label: "Hero - Split Layout",
  category: "sections",
  group: "hero",
  description: "İki kolonlu hero bölümü - metin ve görsel",
  icon: () => <span>🖼️</span>,
  props: registerChaiBlockSchema({
    properties: {
      styles: StylesProp("py-20 bg-background"),
      title: {
        type: "string",
        title: "Başlık",
        default: "Profesyonel Web Siteniz",
        ui: { "ui:widget": "richtext" },
      },
      subtitle: {
        type: "string",
        title: "Alt Başlık",
        default: "Hoş Geldiniz",
      },
      description: {
        type: "string",
        title: "Açıklama",
        default: "İşletmenizi dijital dünyada en iyi şekilde temsil eden profesyonel web sitesi.",
        ui: { "ui:widget": "textarea" },
      },
      buttonText: {
        type: "string",
        title: "Buton Metni",
        default: "Hemen Başlayın",
      },
      buttonLink: {
        type: "string",
        title: "Buton Linki",
        default: "#contact",
      },
      image: {
        type: "string",
        title: "Görsel",
        default: "",
        ui: { "ui:widget": "image" },
      },
    },
  }),
};

registerChaiBlock<HeroSplitProps>(HeroSplit, HeroSplitConfig);

export { HeroSplit, HeroSplitConfig };
```

### 2.3 Tüm Blokları Kayıt

Yeni dosya: `src/components/chai-builder/blocks/index.ts`

```typescript
// Hero blocks
import "./hero/HeroSplit";
import "./hero/HeroCentered";
import "./hero/HeroOverlay";
import "./hero/HeroGradient";

// Content blocks
import "./services/ServicesGrid";
import "./services/ServicesCards";
import "./about/AboutSection";
import "./about/AboutTimeline";

// Social proof
import "./testimonials/TestimonialsCarousel";
import "./testimonials/TestimonialsGrid";

// Conversion
import "./cta/CTABanner";
import "./cta/CTANewsletter";
import "./contact/ContactForm";
import "./contact/ContactMap";

// FAQ
import "./faq/FAQAccordion";

// Utility
import "./statistics/StatsCounter";
import "./gallery/ImageGallery";

export function registerCustomBlocks() {
  console.log("Custom Chai blocks registered");
}
```

---

## Faz 3: Tema Sistemi

### 3.1 Tema Presetleri

Yeni dosya: `src/components/chai-builder/themes/presets.ts`

```typescript
import { ChaiThemeValues } from "@chaibuilder/sdk/types";

export const modernProfessionalPreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Inter",
    body: "Inter",
  },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0a0a0a"],
    foreground: ["#0a0a0a", "#fafafa"],
    primary: ["#6366f1", "#818cf8"],
    "primary-foreground": ["#ffffff", "#0a0a0a"],
    secondary: ["#f1f5f9", "#1e293b"],
    "secondary-foreground": ["#0f172a", "#f8fafc"],
    muted: ["#f1f5f9", "#1e293b"],
    "muted-foreground": ["#64748b", "#94a3b8"],
    accent: ["#f1f5f9", "#1e293b"],
    "accent-foreground": ["#0f172a", "#f8fafc"],
    destructive: ["#ef4444", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e2e8f0", "#334155"],
    input: ["#e2e8f0", "#334155"],
    ring: ["#6366f1", "#818cf8"],
    card: ["#ffffff", "#0f172a"],
    "card-foreground": ["#0f172a", "#f8fafc"],
    popover: ["#ffffff", "#0f172a"],
    "popover-foreground": ["#0f172a", "#f8fafc"],
  },
};

export const corporateBluePreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Poppins",
    body: "Open Sans",
  },
  borderRadius: "4px",
  colors: {
    primary: ["#1e40af", "#3b82f6"],
    // ... diğer renkler
  },
};

export const minimalDarkPreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Space Grotesk",
    body: "Inter",
  },
  borderRadius: "0px",
  colors: {
    background: ["#0a0a0a", "#0a0a0a"],
    foreground: ["#fafafa", "#fafafa"],
    primary: ["#ffffff", "#ffffff"],
    // ... diğer renkler
  },
};

export const themePresets = [
  { name: "Modern Professional", ...modernProfessionalPreset },
  { name: "Corporate Blue", ...corporateBluePreset },
  { name: "Minimal Dark", ...minimalDarkPreset },
];

export const defaultTheme = modernProfessionalPreset;
```

---

## Faz 4: Supabase Entegrasyonu

### 4.1 Veri Yapısı Değişikliği

Veritabanındaki `projects` tablosu güncellenecek:

- `generated_content` -> `chai_blocks` (JSON array)
- `grapes_content` -> kaldırılabilir

### 4.2 Kaydetme Fonksiyonu

```typescript
// src/components/chai-builder/hooks/useChaiBuilder.ts
import { supabase } from "@/integrations/supabase/client";

export function useChaiBuilderSave(projectId: string) {
  const saveToSupabase = async (data: {
    blocks: any[];
    theme?: any;
    designTokens?: any;
  }) => {
    const { error } = await supabase
      .from("projects")
      .update({
        chai_blocks: data.blocks,
        chai_theme: data.theme,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (error) {
      console.error("Save error:", error);
      return false;
    }
    return true;
  };

  return { saveToSupabase };
}
```

---

## Faz 5: AI Entegrasyonu

### 5.1 AI Callback Edge Function

Yeni dosya: `supabase/functions/chai-ai-assistant/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { type, prompt, blocks, lang } = await req.json();

  // Lovable AI kullanarak içerik/stil üret
  const response = await fetch("https://api.lovable.ai/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("LOVABLE_AI_KEY")}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: type === "styles" 
            ? "You are a CSS/Tailwind expert. Suggest style improvements."
            : "You are a content writer. Improve the given content."
        },
        { role: "user", content: prompt }
      ],
    }),
  });

  const result = await response.json();
  
  return new Response(JSON.stringify({
    blocks: type === "styles" ? result.styleUpdates : result.contentUpdates,
  }));
});
```

---

## Faz 6: Project.tsx Güncelleme

### 6.1 Editör Değişimi

```typescript
// src/pages/Project.tsx

import { ChaiBuilderWrapper } from "@/components/chai-builder/ChaiBuilderWrapper";
import { RenderChaiBlocks } from "@chaibuilder/sdk/render";

// Feature flag - artık true
const USE_CHAI_BUILDER = true;

export default function Project() {
  // ... mevcut state'ler

  const handleChaiSave = useCallback(async (data: any) => {
    const { error } = await supabase
      .from("projects")
      .update({
        chai_blocks: data.blocks,
        chai_theme: data.theme,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast({ title: "Kaydetme hatası", variant: "destructive" });
      return false;
    }
    
    toast({ title: "Kaydedildi" });
    return true;
  }, [id, toast]);

  // Editör render
  if (USE_CHAI_BUILDER) {
    return (
      <ChaiBuilderWrapper
        projectId={id}
        projectName={project.name}
        initialBlocks={project.chai_blocks || []}
        initialTheme={project.chai_theme}
        onSave={handleChaiSave}
        onPublish={() => setPublishModalOpen(true)}
      />
    );
  }

  // Fallback - eski editör
  return <WebsitePreview ... />;
}
```

---

## Faz 7: Public Website Render

### 7.1 RenderChaiBlocks Kullanımı

```typescript
// src/pages/PublicWebsite.tsx
import { RenderChaiBlocks } from "@chaibuilder/sdk/render";

export default function PublicWebsite() {
  const { project } = usePublicProject();

  return (
    <div className="min-h-screen">
      <RenderChaiBlocks 
        blocks={project.chai_blocks || []} 
        theme={project.chai_theme}
      />
    </div>
  );
}
```

---

## Dosya Değişiklikleri Özeti

### Yeni Dosyalar (Oluşturulacak)

| Dosya | Açıklama |
|-------|----------|
| `tailwind.chaibuilder.config.ts` | Chaibuilder Tailwind config |
| `src/styles/chaibuilder.tailwind.css` | Chaibuilder CSS |
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | Ana wrapper |
| `src/components/chai-builder/blocks/hero/HeroSplit.tsx` | Hero blok |
| `src/components/chai-builder/blocks/hero/HeroCentered.tsx` | Hero blok |
| `src/components/chai-builder/blocks/hero/HeroOverlay.tsx` | Hero blok |
| `src/components/chai-builder/blocks/services/ServicesGrid.tsx` | Hizmetler blok |
| `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` | Testimonial blok |
| `src/components/chai-builder/blocks/contact/ContactForm.tsx` | İletişim blok |
| `src/components/chai-builder/blocks/faq/FAQAccordion.tsx` | FAQ blok |
| `src/components/chai-builder/blocks/cta/CTABanner.tsx` | CTA blok |
| `src/components/chai-builder/blocks/index.ts` | Blok registry |
| `src/components/chai-builder/themes/presets.ts` | Tema presetleri |
| `src/components/chai-builder/hooks/useChaiBuilder.ts` | Hook'lar |
| `supabase/functions/chai-ai-assistant/index.ts` | AI edge function |

### Güncellenecek Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `package.json` | `@chaibuilder/sdk` ekleme |
| `src/pages/Project.tsx` | ChaiBuilderWrapper kullanımı |
| `src/pages/PublicWebsite.tsx` | RenderChaiBlocks kullanımı |
| `tailwind.config.ts` | Chaibuilder extends |

### Kaldırılacak/Arşivlenecek Dosyalar

| Dosya | Durum |
|-------|-------|
| `src/components/grapes-editor/` | Arşivle (backup) |
| `src/templates/temp1-temp9/` | Blok'lara dönüştür, sonra arşivle |

---

## Veritabanı Migrasyonu

```sql
-- Yeni sütunlar ekle
ALTER TABLE projects 
ADD COLUMN chai_blocks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN chai_theme JSONB DEFAULT '{}'::jsonb;

-- Mevcut içeriği dönüştür (opsiyonel migration script)
-- Bu, generated_content'i chai_blocks formatına dönüştüren bir script olacak
```

---

## Zaman Çizelgesi

| Faz | Süre | Öncelik |
|-----|------|---------|
| Faz 1: Temel Kurulum | 2-3 saat | Yüksek |
| Faz 2: Blok Dönüşümü | 4-6 saat | Yüksek |
| Faz 3: Tema Sistemi | 1-2 saat | Orta |
| Faz 4: Supabase Entegrasyonu | 1-2 saat | Yüksek |
| Faz 5: AI Entegrasyonu | 2-3 saat | Düşük |
| Faz 6: Project.tsx | 2-3 saat | Yüksek |
| Faz 7: Public Render | 1-2 saat | Yüksek |
| **Toplam** | **13-21 saat** | - |

---

## Risk ve Dikkat Edilecekler

1. **Mevcut Projelerin Uyumluluğu:** `generated_content` -> `chai_blocks` dönüşümü için migration script gerekli
2. **Template Kaybı:** 12 template'in tamamı blok'lara dönüştürülmeli
3. **Bundle Size:** Chaibuilder SDK ~200KB gzip, performans izlenmeli
4. **Türkçe Lokalizasyon:** `locale="tr"` destekleniyor, ancak özel çeviriler eklenebilir
