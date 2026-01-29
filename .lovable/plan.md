
# Hero Varyasyonları ve Section Variants Sistemi

## Hedef

Yazının resmin üstünde durduğu (overlay), centered, full-width gibi farklı hero tarzları ve diğer section'lar için varyasyonlar eklemek. Ayrıca kullanıcıların hazır template örnekleri yükleyerek yeni tasarımlar ekleyebilmesi.

## Yeni Hero Varyasyonları

| Varyasyon | Görünüm | Kullanım |
|-----------|---------|----------|
| `split` (mevcut) | Yazı solda, resim sağda | Klasik profesyonel |
| `overlay` | Tam genişlik resim, üzerinde yazı | Modern, etkileyici |
| `centered` | Ortada yazı, arkada büyük resim | Minimal, şık |
| `video` | Arka planda video, üzerinde yazı | Dinamik |
| `gradient` | Gradient arka plan, resim yok | Hızlı yükleme |

## Dosya Yapısı

```
src/templates/temp1/sections/hero/
├── index.ts              # Hero registry
├── HeroSplit.tsx         # Mevcut (rename)
├── HeroOverlay.tsx       # YENİ - Resim üzerinde yazı
├── HeroCentered.tsx      # YENİ - Ortalanmış
├── HeroGradient.tsx      # YENİ - Gradient arka plan
└── types.ts              # Hero props types
```

## Yeni Hero Bileşenleri

### 1. HeroOverlay.tsx (Yazı resmin üzerinde)

```
+------------------------------------------+
|                                          |
|     [Full-width background image]        |
|                                          |
|         ✨ Welcome to our practice       |
|                                          |
|       Advanced Treatments for            |
|          Global Patients                 |
|                                          |
|      Delivering cutting-edge care...     |
|                                          |
|      [Get Started]  [Learn More]         |
|                                          |
+------------------------------------------+
```

- Tam genişlik arka plan görseli
- Koyu gradient overlay (okunabilirlik için)
- Yazılar ortalanmış, resmin üzerinde
- min-height: 100vh

### 2. HeroCentered.tsx (Ortalanmış)

```
+------------------------------------------+
|                                          |
|     ✨ Welcome to our practice           |
|                                          |
|     Advanced Treatments for              |
|        Global Patients                   |
|                                          |
|   [Get Started]  [Learn More]            |
|                                          |
|   +------------------------------+       |
|   |                              |       |
|   |     [Large centered image]   |       |
|   |                              |       |
|   +------------------------------+       |
|                                          |
+------------------------------------------+
```

- Yazılar üstte, ortalanmış
- Görsel altta, büyük ve rounded
- Temiz, minimal görünüm

### 3. HeroGradient.tsx (Gradient)

```
+------------------------------------------+
|  ████████████████████████████████████   |
|  ██   Gradient Background Only     ██   |
|  ██                                 ██   |
|  ██   Advanced Treatments for       ██   |
|  ██      Global Patients            ██   |
|  ██                                 ██   |
|  ██   [Get Started] [Learn More]    ██   |
|  ██                                 ██   |
|  ████████████████████████████████████   |
+------------------------------------------+
```

- Görsel yok, sadece gradient
- Çok hızlı yükleme
- Modern ve temiz

## Hero Registry Sistemi

```typescript
// src/templates/temp1/sections/hero/index.ts
import { HeroSplit } from './HeroSplit';
import { HeroOverlay } from './HeroOverlay';
import { HeroCentered } from './HeroCentered';
import { HeroGradient } from './HeroGradient';

export const heroVariants = {
  split: HeroSplit,
  overlay: HeroOverlay,
  centered: HeroCentered,
  gradient: HeroGradient,
} as const;

export type HeroVariant = keyof typeof heroVariants;

export function getHeroComponent(variant: HeroVariant) {
  return heroVariants[variant] || heroVariants.split;
}
```

## GeneratedContent Güncelleme

```typescript
// src/types/generated-website.ts
export interface GeneratedContent {
  // ... mevcut alanlar
  
  // YENİ: Section varyasyonları
  sectionVariants?: {
    hero?: 'split' | 'overlay' | 'centered' | 'gradient';
    services?: 'grid' | 'list' | 'cards';
    about?: 'inline' | 'fullwidth' | 'timeline';
    // ... diğer section'lar
  };
}
```

## FullLandingPage Güncelleme

```typescript
// src/templates/temp1/pages/FullLandingPage.tsx
import { getHeroComponent } from '../sections/hero';

export function FullLandingPage({ content, ... }) {
  // Varyasyonu al veya default kullan
  const heroVariant = content.sectionVariants?.hero || 'split';
  const HeroComponent = getHeroComponent(heroVariant);
  
  return (
    <div>
      <EditableSection sectionId="hero" ...>
        <HeroComponent
          title={pages.home.hero.title}
          subtitle={pages.home.hero.subtitle}
          description={pages.home.hero.description}
          heroImage={images?.heroHome}
          // ... diğer props
        />
      </EditableSection>
      {/* ... diğer section'lar */}
    </div>
  );
}
```

## Editor'da Varyasyon Değiştirme

EditorSidebar'da section seçildiğinde "Layout" seçeneği:

```
+------------------------+
| < Hero           Done  |
+------------------------+
| Content | Style        |
+------------------------+
| Layout:                |
| [Split] [Overlay]      |
| [Centered] [Gradient]  |
+------------------------+
| Headline  [Regenerate] |
| [Advanced Treatments.] |
| ...                    |
+------------------------+
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/templates/temp1/sections/hero/index.ts` | YENİ - Hero registry |
| `src/templates/temp1/sections/hero/types.ts` | YENİ - Shared props |
| `src/templates/temp1/sections/hero/HeroSplit.tsx` | Mevcut kodu taşı |
| `src/templates/temp1/sections/hero/HeroOverlay.tsx` | YENİ |
| `src/templates/temp1/sections/hero/HeroCentered.tsx` | YENİ |
| `src/templates/temp1/sections/hero/HeroGradient.tsx` | YENİ |
| `src/types/generated-website.ts` | sectionVariants ekle |
| `src/templates/temp1/pages/FullLandingPage.tsx` | Dinamik hero seçimi |
| `src/components/website-preview/EditorSidebar.tsx` | Layout seçici ekle |

## HeroOverlay Detaylı Tasarım

```typescript
// Görsel üzerinde yazı için temel yapı
<section className="relative min-h-[100vh] flex items-center">
  {/* Arka plan görseli */}
  <div className="absolute inset-0">
    <EditableImage
      src={heroImage}
      className="w-full h-full object-cover"
    />
    {/* Koyu overlay - yazıların okunabilirliği için */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
  </div>
  
  {/* İçerik - resmin üzerinde */}
  <div className="relative z-10 container mx-auto text-center text-white">
    <EditableText value={title} ... />
    <EditableText value={subtitle} ... />
    <EditableText value={description} ... />
    {/* Butonlar */}
  </div>
</section>
```

## Template Örneği Yükleme (Gelecek Özellik)

Kullanıcıların hazır template yükleyebilmesi için:

1. Template dosyası formatı tanımla (JSON/YAML)
2. Upload modal ekle
3. Template parser oluştur
4. Kod üreteci ekle

Bu özellik Phase 2 olarak eklenebilir.

## Beklenen Sonuç

1. 4 farklı hero varyasyonu kullanılabilir
2. Overlay hero ile yazı resmin üzerinde görünür
3. Editor'dan layout değiştirilebilir
4. Gelecekte daha fazla varyasyon eklenebilir
5. Diğer section'lar için de benzer sistem uygulanabilir
