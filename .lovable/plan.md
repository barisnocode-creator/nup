

# AI Video Studio Template Entegrasyonu

## Kaynak Analizi

GitHub repository'den aldığım AI Video Studio landing page:
- **URL**: https://github.com/barisnocode-creator/remix-of-ai-video-studio-landing-page
- **Teknoloji**: React + TypeScript + Tailwind (Lovable projesi)
- **Bölümler**: Hero (video arka plan), Portfolio, Awards, About (process steps), Services, Team ("Wanted" poster tarzı), Contact (Cal.com entegrasyonu), Footer
- **Tasarım**: Modern dark/light tema, gradient renkler (blue, emerald, purple), motion animasyonları

## Mevcut Section'lar

| Bölüm | Özellikler |
|-------|------------|
| **Hero** | Video arka plan, mobil menü, scroll tetiklemeli header |
| **Portfolio** | YouTube video embed, featured work |
| **Awards** | 6 adet ödül rozeti animasyonlu |
| **About** | 5 adımlı süreç (storyboard tarzı) |
| **Services** | Polaroid tarzı kartlar, hover efektleri |
| **Team** | "Wanted" poster temalı ekip tanıtımı |
| **Contact** | Cal.com takvim entegrasyonu |

---

## Uygulama Planı

### Adım 1: Template Klasör Yapısı

```
src/templates/temp4-video-studio/
├── index.tsx                    # Ana template bileşeni
├── components/
│   ├── TemplateHeader.tsx       # Scroll tetiklemeli header
│   └── TemplateFooter.tsx       # Footer
├── sections/
│   ├── hero/
│   │   ├── HeroVideo.tsx        # Video arka planlı hero
│   │   └── index.ts
│   ├── portfolio/
│   │   ├── PortfolioSection.tsx # Video showcase
│   │   └── index.ts
│   ├── awards/
│   │   ├── AwardsSection.tsx    # Ödül rozetleri
│   │   └── index.ts
│   ├── about/
│   │   ├── AboutProcess.tsx     # Süreç adımları
│   │   └── index.ts
│   ├── services/
│   │   ├── ServicesCards.tsx    # Polaroid kartlar
│   │   └── index.ts
│   ├── team/
│   │   ├── TeamWanted.tsx       # Wanted poster tarzı
│   │   └── index.ts
│   └── contact/
│       ├── ContactEmbed.tsx     # Takvim entegrasyonu
│       └── index.ts
└── pages/
    └── FullLandingPage.tsx      # Tüm section'ları birleştirir
```

---

### Adım 2: CSS Değişkenleri ve Tema

`src/index.css` dosyasına yeni accent renkler eklenmeli:

```css
:root {
  /* AI Video Studio accent colors */
  --accent-blue: #2563eb;
  --accent-emerald: #059669;
  --accent-purple: #7c3aed;
}
```

---

### Adım 3: Hero Section Özellikleri

```
+-------------------------------------------+
|  [Video Background - Auto-play Muted]     |
|                                           |
|  ┌────────────────────────────────────┐   |
|  │  SCROLL-TRIGGERED HEADER           │   |
|  │  Logo    Nav Links      🔊 Mute    │   |
|  └────────────────────────────────────┘   |
|                                           |
|        ★ AI VIDEO PRODUCTION ★            |
|                                           |
|      BRING YOUR                           |
|      STORIES TO LIFE                      |
|                                           |
|   We craft stunning AI-powered video...   |
|                                           |
|   [Get Started]  [Watch Showreel]         |
|                                           |
|   Trusted by: [Brand Logos...]            |
|                                           |
+-------------------------------------------+
```

Önemli: Video arka plan orijinal projeden kullanılabilir veya placeholder video URL'si kullanılabilir.

---

### Adım 4: GeneratedContent Uyumluluğu

Template, mevcut `GeneratedContent` yapısıyla çalışacak şekilde adapte edilmeli:

| Kaynak Alan | Template Kullanımı |
|-------------|-------------------|
| `pages.home.hero.title` | Hero başlık |
| `pages.home.hero.subtitle` | Hero alt başlık |
| `pages.home.hero.description` | Hero açıklama |
| `pages.services.servicesList` | Services kartları |
| `pages.about.story` | About bölümü |
| `pages.about.values` | Process adımları (adapte) |
| `pages.contact.info` | İletişim bilgileri |
| `pages.home.highlights` | Awards/Portfolio fallback |

---

### Adım 5: Template Registry Güncellemesi

`src/templates/index.ts` dosyasına ekleme:

```typescript
temp9: {
  config: {
    id: 'temp9',
    name: 'AI Video Studio',
    description: 'Cinematic dark template for video production studios and creative agencies',
    category: 'Creative',
    preview: showcaseVideoStudio, // Yeni preview görseli gerekli
    supportedProfessions: ['video-production', 'film-studio', 'creative-agency', 'animation', 'media'],
    supportedTones: ['cinematic', 'bold', 'dramatic', 'modern'],
  },
  component: VideoStudioTemplate,
}
```

---

### Adım 6: Framer Motion Bağımlılığı

Orijinal template `framer-motion` kullanıyor. Bu paket eklenmeli:

```bash
npm install framer-motion
```

Alternatif olarak, animasyonlar Tailwind CSS `animate-*` class'larıyla değiştirilebilir.

---

### Adım 7: Editör Entegrasyonu

Tüm metin ve görsel alanları `EditableText` ve `EditableImage` bileşenleriyle sarmalanmalı:

```typescript
<EditableText
  value={title}
  fieldPath="pages.home.hero.title"
  fieldLabel="Hero Title"
  sectionTitle="Hero Section"
  sectionId="hero"
  as="h1"
  isEditable={isEditable}
  isSelected={isTitleSelected}
  onSelect={onEditorSelect}
/>
```

---

## Dosya Değişiklikleri Özeti

| Dosya | İşlem |
|-------|-------|
| `src/templates/temp4-video-studio/index.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/components/TemplateHeader.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/components/TemplateFooter.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/hero/HeroVideo.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/services/ServicesCards.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/about/AboutProcess.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/team/TeamWanted.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/portfolio/PortfolioSection.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/awards/AwardsSection.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/sections/contact/ContactEmbed.tsx` | Yeni oluştur |
| `src/templates/temp4-video-studio/pages/FullLandingPage.tsx` | Yeni oluştur |
| `src/templates/index.ts` | Güncelle (temp9 ekle) |
| `src/index.css` | Güncelle (accent renkler) |
| `package.json` | Güncelle (framer-motion ekle) |
| `src/assets/showcase-video-studio.jpg` | Yeni ekle (preview görsel) |

---

## Beklenen Sonuçlar

1. Yeni "AI Video Studio" template'i galeri'de görünecek
2. Video prodüksiyon, film stüdyoları ve kreatif ajanslar için uygun
3. Koyu tema, sinematik görünüm
4. Tüm bölümler düzenlenebilir (EditableText/EditableImage)
5. Section sıralaması değiştirilebilir
6. Gerçek zamanlı stil güncellemeleri çalışacak

---

## Teknik Notlar

- **Video Arka Plan**: Performans için `poster` attribute ve lazy loading kullanılmalı
- **Animasyonlar**: Framer Motion veya CSS animasyonları (tercihe bağlı)
- **Responsive**: Mobil menü ve responsive grid yapısı korunmalı
- **Cal.com Entegrasyonu**: Opsiyonel - genel form ile değiştirilebilir

