
# Template 3: Elegant Minimal (Brillance Style) - Uygulama Planı

## Genel Bakış

Paylaştığınız Brillance landing page tasarımını sistemimize adapte edeceğiz. Next.js bileşenlerini React'a çevireceğiz ve `GeneratedContent` veri yapısıyla uyumlu hale getireceğiz.

---

## Brillance Tasarım Karakteristikleri

| Özellik | Brillance Stili |
|---------|-----------------|
| Arka plan | Sıcak krem/bej (`#F7F5F3`) |
| Tipografi | Serif başlıklar, sans-serif body |
| Köşeler | Pill-shape (90px radius) |
| Renkler | Kahverengi tonları (`#37322F`, `#49423D`, `#605A57`) |
| Dekorasyon | Diagonal çizgi pattern'leri, ince border'lar |
| Badge'ler | Pill-shape, ikon + metin |
| Genel his | Minimal, elegant, premium |

---

## Dosya Yapısı

```text
src/templates/temp3/
├── index.tsx                    # Ana Elegant template bileşeni
├── components/
│   ├── TemplateHeader.tsx       # Brillance-style pill navigation
│   └── TemplateFooter.tsx       # Minimal footer
├── pages/
│   └── FullLandingPage.tsx      # Section render mantığı
└── sections/
    ├── hero/
    │   ├── HeroElegant.tsx      # Büyük serif başlık, minimal CTA
    │   └── index.ts
    ├── socialproof/
    │   ├── SocialProofSection.tsx  # Logo grid, stats
    │   └── index.ts
    ├── features/
    │   ├── FeatureCards.tsx     # Progress bar'lı kartlar
    │   └── index.ts
    ├── bento/
    │   ├── BentoGrid.tsx        # 2x2 grid layout
    │   └── index.ts
    ├── about/
    │   ├── AboutElegant.tsx     # Minimal about section
    │   └── index.ts
    ├── services/
    │   ├── ServicesElegant.tsx  # Liste görünümü
    │   └── index.ts
    ├── testimonials/
    │   ├── TestimonialsElegant.tsx
    │   └── index.ts
    └── cta/
        ├── CTAElegant.tsx       # Minimal CTA
        └── index.ts
```

---

## Temel Bileşenler

### 1. ElegantBadge (Yeniden Kullanılabilir)

Brillance'ın pill-shape badge'lerini her section'da kullanacağız:

```typescript
function ElegantBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-4 py-1.5 bg-white shadow-sm rounded-full flex items-center gap-2 border border-[rgba(2,6,23,0.08)]">
      <div className="w-3.5 h-3.5 text-[#37322F]">{icon}</div>
      <span className="text-xs font-medium text-[#37322F]">{text}</span>
    </div>
  );
}
```

### 2. DiagonalPattern (Dekoratif)

Kenar çizgilerindeki diagonal pattern:

```typescript
function DiagonalPattern() {
  return (
    <div className="w-12 self-stretch relative overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="h-4 rotate-[-45deg] outline outline-[0.5px] outline-[rgba(3,7,18,0.08)]" />
        ))}
      </div>
    </div>
  );
}
```

### 3. ProgressCard (Feature kartları)

Brillance'ın auto-progress feature card'ları:

```typescript
function ProgressCard({ title, description, isActive, progress, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "px-6 py-5 cursor-pointer relative",
        isActive ? "bg-white" : "border border-[#E0DEDB]/80"
      )}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200">
          <div className="h-full bg-[#322D2B] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <h3 className="text-[#49423D] text-sm font-semibold">{title}</h3>
      <p className="text-[#605A57] text-[13px] mt-2">{description}</p>
    </div>
  );
}
```

---

## Section Detayları

### HeroElegant.tsx

**Brillance Hero özellikleri:**
- Ortalanmış büyük serif başlık
- Alt satırda ince sans-serif açıklama
- Tek pill-shape CTA butonu
- Arka planda subtle pattern SVG

```typescript
<section className="min-h-screen bg-[#F7F5F3] relative flex items-center justify-center">
  {/* Vertical border lines */}
  <div className="absolute left-0 top-0 w-px h-full bg-[rgba(55,50,47,0.12)]" />
  <div className="absolute right-0 top-0 w-px h-full bg-[rgba(55,50,47,0.12)]" />
  
  <div className="container max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-6xl lg:text-[80px] font-serif font-normal leading-tight text-[#37322F]">
      {title}
    </h1>
    <p className="mt-6 text-lg text-[rgba(55,50,47,0.80)] max-w-lg mx-auto">
      {subtitle}
    </p>
    <button className="mt-12 px-12 py-4 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#4a433f] transition-colors">
      {ctaText}
    </button>
  </div>
</section>
```

### SocialProofSection.tsx

**Logo grid + Stats:**
- 2x4 grid logo gösterimi
- Dekoratif diagonal pattern'ler
- Şirket/müşteri logoları

### BentoGrid.tsx

**4'lü grid layout:**
- Her bölüm farklı içerik tipi
- Subtle hover efektleri
- Alt kenardan yumuşak gradient fade

### CTAElegant.tsx

**Minimal CTA:**
- Sade arka plan
- Tek serif başlık
- Pill-shape buton

---

## Renk Paleti

```css
--elegant-bg: #F7F5F3;           /* Ana arka plan */
--elegant-text-primary: #37322F; /* Başlıklar */
--elegant-text-secondary: #49423D; /* Alt başlıklar */
--elegant-text-muted: #605A57;   /* Açıklamalar */
--elegant-border: rgba(55, 50, 47, 0.12);
--elegant-border-light: #E0DEDB;
```

---

## Tipografi

**Serif Font (Başlıklar):**
- Playfair Display veya `font-serif` (sistem serif)
- Normal weight
- Tight line-height

**Sans-serif (Body):**
- Mevcut Tailwind `font-sans`
- Medium/Regular weight

---

## Template Registry Güncellemesi

```typescript
// src/templates/index.ts
temp3: {
  config: {
    id: 'temp3',
    name: 'Elegant Minimal',
    description: 'Premium minimal template with warm tones',
    category: 'Minimal',
    preview: showcaseRestaurant, // veya yeni bir preview
    supportedProfessions: ['boutique', 'agency', 'consulting', 'luxury'],
    supportedTones: ['elegant', 'minimal', 'premium', 'warm'],
  },
  component: ElegantMinimalTemplate,
},
```

---

## GeneratedContent Uyumu

Brillance'ın bazı özel section'ları (feature cards, bento grid) için mevcut veri yapısını kullanacağız:

| Brillance Section | GeneratedContent Mapping |
|-------------------|--------------------------|
| Hero | `pages.home.hero.title`, `subtitle`, `description` |
| Feature Cards | `pages.home.highlights` (3 kart) |
| Social Proof | `pages.home.statistics` + logo grid (sabit) |
| Bento Grid | `pages.about.values` (4 değer) |
| Services | `pages.services.servicesList` |
| Testimonials | Testimonials (sabit veya ekleme) |
| CTA | `metadata.tagline`, CTA button |

---

## Uygulama Sırası

1. **temp3 klasör yapısını oluştur**
2. **ElegantHeader** - Pill-shape navigation
3. **HeroElegant** - Serif başlık, minimal layout
4. **SocialProofSection** - Logo grid + stats
5. **FeatureCards** - Progress bar'lı kartlar (opsiyonel, highlights'tan)
6. **AboutElegant** - Değerler grid'i
7. **ServicesElegant** - Liste görünümü
8. **TestimonialsElegant** - Minimal testimonials
9. **CTAElegant** - Minimal CTA
10. **ElegantFooter** - Minimal footer
11. **FullLandingPage** - Section render mantığı
12. **index.ts güncellemesi** - temp3 kaydet

---

## Dosya Listesi

| Dosya | Değişiklik |
|-------|------------|
| `src/templates/temp3/index.tsx` | YENİ - Elegant template ana bileşen |
| `src/templates/temp3/components/TemplateHeader.tsx` | YENİ - Pill nav |
| `src/templates/temp3/components/TemplateFooter.tsx` | YENİ - Minimal footer |
| `src/templates/temp3/pages/FullLandingPage.tsx` | YENİ - Section render |
| `src/templates/temp3/sections/hero/HeroElegant.tsx` | YENİ |
| `src/templates/temp3/sections/socialproof/SocialProofSection.tsx` | YENİ |
| `src/templates/temp3/sections/features/FeatureCards.tsx` | YENİ |
| `src/templates/temp3/sections/about/AboutElegant.tsx` | YENİ |
| `src/templates/temp3/sections/services/ServicesElegant.tsx` | YENİ |
| `src/templates/temp3/sections/testimonials/TestimonialsElegant.tsx` | YENİ |
| `src/templates/temp3/sections/cta/CTAElegant.tsx` | YENİ |
| `src/templates/index.ts` | GÜNCELLE - temp3 ekle |

---

## Template Karşılaştırması (3 Template)

| Özellik | temp1 (Healthcare) | temp2 (Bold Agency) | temp3 (Elegant) |
|---------|-------------------|---------------------|-----------------|
| Arka plan | Beyaz/Açık | Koyu/Siyah | Krem (`#F7F5F3`) |
| Tipografi | Sans-serif | Bold uppercase | Serif başlıklar |
| Köşeler | Yuvarlatılmış | Keskin | Pill-shape |
| Renk paleti | Primary tonlar | Gradientler | Kahverengi tonlar |
| Dekorasyon | Minimal | Grid pattern | Diagonal lines |
| Genel his | Profesyonel | Cesur/Dramatik | Elegant/Premium |

---

## Önemli Notlar

1. **Harici Bileşenler Yok**: Brillance'ın `SmartSimpleBrilliant`, `YourWorkInSync` gibi bileşenlerini kullanmayacağız. Bunların yerine mevcut `GeneratedContent` verisini görselleştiren basit bileşenler yapacağız.

2. **Görsel Kaynakları**: Vercel Blob URL'leri yerine sistemin mevcut görsellerini veya placeholder'ları kullanacağız.

3. **Font**: Serif font için Tailwind'in `font-serif` class'ını kullanacağız. İleride özel font (Playfair Display) eklenebilir.

4. **Editor Desteği**: Tüm section'lar mevcut `EditableText`, `EditableImage`, `EditorSelection` sistemiyle uyumlu olacak.

---

## Sonuç

Bu plan tamamlandığında:
- 3 görsel olarak tamamen farklı template olacak
- Brillance'ın elegant tasarım dilini koruyacağız
- Mevcut editör sistemiyle tam uyumlu olacak
- `GeneratedContent` veri yapısını kullanacak
- Preview + Onayla akışıyla çalışacak
