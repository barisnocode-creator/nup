

# ChaiBuilder SDK Editör Düzeltme Planı

## Mevcut Sorunlar

1. **Build Hatası**: CSS dosya yolu yanlış
   - `../styles/chaibuilder.tailwind.css` -> dosya `src/styles/` içinde ancak import yolu göreceli olarak yanlış
   - Doğru yol: `@/styles/chaibuilder.tailwind.css` veya `../../styles/chaibuilder.tailwind.css`

2. **Eksik Template Listesi**: ChaiBuilder editörde mevcut template'ler gösterilmiyor

3. **Font/Renk Ayarları**: Theme sistem çalışıyor ancak UI'da net görünmüyor

---

## Teknik Düzeltmeler

### 1. CSS Import Yolu Düzeltmesi

**Dosya**: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

```typescript
// HATALI:
import '../styles/chaibuilder.tailwind.css';

// DOĞRU:
import '@/styles/chaibuilder.tailwind.css';
```

### 2. Tailwind CSS Config Yolu Düzeltmesi

**Dosya**: `src/styles/chaibuilder.tailwind.css`

Config yolu kök dizine göre ayarlanmalı:
```css
@config "../tailwind.chaibuilder.config.ts";
```

### 3. Template Presets'i ChaiBuilder'a Entegre Etme

Mevcut 12 template'i (temp1-temp9, gith1-3) theme presets olarak göstereceğiz:

| Template | Theme Preset Adı |
|----------|-----------------|
| temp1 | Modern Professional |
| temp2 | Bold Agency |
| temp3 | Elegant Minimal |
| temp4-temp8 | (temp1 ile aynı) |
| temp9 | AI Video Studio |
| gith1 | Modern SaaS |
| gith2 | Corporate Blue |
| gith3 | Minimal Dark |

### 4. Theme Presets Yapısını Düzeltme

ChaiBuilder SDK'nın beklediği format:
```typescript
themePresets?: Record<string, Partial<ChaiThemeValues>>[];
```

Her preset bir obje olmalı ve key olarak preset adını içermeli:
```typescript
const themePresets = [
  { "Modern Professional": { fontFamily: {...}, colors: {...} } },
  { "Bold Agency": { fontFamily: {...}, colors: {...} } },
  // ...
];
```

### 5. Blok Kayıt Sistemini Güçlendirme

Mevcut bloklar:
- HeroSplit, HeroCentered, HeroOverlay
- ServicesGrid
- TestimonialsCarousel
- ContactForm
- CTABanner
- FAQAccordion

Eklenecek bloklar:
- **AboutSection**: Hakkımızda bölümü
- **StatisticsCounter**: Sayaç/istatistik bölümü
- **ImageGallery**: Görsel galeri
- **PricingTable**: Fiyatlandırma tablosu

---

## Dosya Değişiklikleri

### Düzeltilecek Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | CSS import yolu düzelt, theme presets format |
| `src/styles/chaibuilder.tailwind.css` | Config yolunu düzelt |
| `src/components/chai-builder/themes/presets.ts` | Template'leri preset'lere dönüştür |

### Yeni Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/components/chai-builder/blocks/about/AboutSection.tsx` | Hakkımızda bloğu |
| `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx` | İstatistik bloğu |

---

## ChaiBuilderWrapper Güncellemesi

```typescript
// src/components/chai-builder/ChaiBuilderWrapper.tsx

import '@chaibuilder/sdk/styles';
import '@/styles/chaibuilder.tailwind.css';  // Düzeltilmiş yol
import { ChaiBuilderEditor, ChaiBlock, ChaiThemeValues } from '@chaibuilder/sdk';
import { loadWebBlocks } from '@chaibuilder/sdk/web-blocks';
import { supabase } from '@/integrations/supabase/client';

// Custom blocks'u kaydet
import './blocks';

loadWebBlocks();

// Template bazlı theme presets
const themePresets: Record<string, Partial<ChaiThemeValues>>[] = [
  {
    "Modern Professional": {
      fontFamily: { heading: "Inter", body: "Inter" },
      borderRadius: "8px",
      colors: {
        background: ["#ffffff", "#0d0d0d"],
        foreground: ["#1a1a1a", "#fafafa"],
        primary: ["#f97316", "#fb923c"],
        // ... tam renk paleti
      },
    }
  },
  {
    "Bold Agency": {
      fontFamily: { heading: "Space Grotesk", body: "Inter" },
      borderRadius: "0px",
      colors: {
        background: ["#0f0f0f", "#0f0f0f"],
        foreground: ["#ffffff", "#ffffff"],
        primary: ["#ffffff", "#ffffff"],
        // ... koyu tema renkleri
      },
    }
  },
  {
    "Elegant Minimal": {
      fontFamily: { heading: "Playfair Display", body: "Lora" },
      borderRadius: "4px",
      colors: {
        background: ["#F7F5F3", "#1a1814"],
        foreground: ["#37322F", "#e8e4e0"],
        primary: ["#37322F", "#e8e4e0"],
        // ... sıcak tonlar
      },
    }
  },
  // ... diğer presets
];

export function ChaiBuilderWrapper({...}) {
  return (
    <ChaiBuilderEditor
      pageId={projectId}
      blocks={initialBlocks}
      theme={initialTheme || defaultTheme}
      themePresets={themePresets}
      onSave={handleSave}
      autoSave={true}
      autoSaveActionsCount={5}
      locale="tr"
      askAiCallBack={handleAskAi}
      htmlDir="ltr"
      flags={{
        darkMode: true,
        dragAndDrop: true,
        copyPaste: true,
        exportCode: false,
        importHtml: true,
        designTokens: true,
      }}
    />
  );
}
```

---

## Template -> Theme Preset Dönüşüm Tablosu

| Template ID | Preset Adı | Font Heading | Font Body | Ana Renk | Stil |
|-------------|-----------|--------------|-----------|----------|------|
| temp1 | Modern Professional | Inter | Inter | Orange #f97316 | Temiz |
| temp2 | Bold Agency | Space Grotesk | Inter | White | Koyu/Dramatik |
| temp3 | Elegant Minimal | Playfair Display | Lora | Kahve #37322F | Sıcak/Serif |
| temp9 | AI Video Studio | Space Grotesk | Inter | Lime #a3e635 | Sinematik |
| gith1 | Modern SaaS | Inter | Inter | Purple #8B5CF6 | Tech |
| gith2 | Corporate Blue | Poppins | Open Sans | Blue #1e40af | Kurumsal |
| gith3 | Minimal Dark | Space Grotesk | Inter | White | Minimalist |

---

## Editör Özellikleri

ChaiBuilder SDK ile kullanıcı şunları yapabilecek:

1. **Sol Panel - Blok Ekleme**:
   - Hazır Hero blokları (3 varyant)
   - Hizmetler bloğu
   - Testimonials/Referanslar
   - İletişim formu
   - CTA banner
   - FAQ accordion

2. **Sağ Panel - Stil Düzenleme**:
   - Seçili bloğun tüm özellikleri
   - Tailwind class editörü
   - Renk, font, spacing ayarları

3. **Üst Panel - Tema Ayarları**:
   - Theme preset seçimi (8 hazır tema)
   - Font ailesi değiştirme
   - Renk paleti özelleştirme
   - Border radius ayarı

4. **AI Asistan**:
   - İçerik iyileştirme
   - Stil önerileri

---

## Uygulama Sırası

1. CSS import yolunu düzelt (`ChaiBuilderWrapper.tsx`)
2. Tailwind config yolunu düzelt (`chaibuilder.tailwind.css`)
3. Theme presets'i zenginleştir (8 template -> 8 preset)
4. Eksik blokları ekle (AboutSection, Statistics)
5. Test et - editörün açılıp açılmadığını kontrol et

---

## Beklenen Sonuç

Build başarılı olduktan sonra:
- `/project/:id` sayfasında ChaiBuilder editörü açılacak
- Sol panelde bloklar, sağ panelde stil editörü görünecek
- Üstte theme presets dropdown'ı ile 8 farklı tema seçilebilecek
- Drag-drop ile blok ekleme/silme/sıralama çalışacak
- Auto-save ile değişiklikler Supabase'e kaydedilecek

