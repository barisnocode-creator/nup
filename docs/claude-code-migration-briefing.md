# Open Lucius — Claude Code Migration Briefing

> Bu doküman, projenin Claude Code ortamına taşınması için gerekli tüm mimari, API ve sistem bilgilerini içerir.

---

## 1. Proje Özeti

**Open Lucius**, kullanıcıların AI destekli web siteleri oluşturmasını, düzenlemesini ve yayınlamasını sağlayan bir SaaS platformudur.

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Editör**: ChaiBuilder SDK v4 (blok tabanlı sayfa editörü)
- **Deployment**: Netlify (Edge Function üzerinden statik HTML deploy)
- **AI Motoru**: Google Gemini modelleri (içerik üretimi, görsel arama)
- **Görseller**: Pixabay API (telif sorunsuz görseller)

---

## 2. Temel Akış (Kullanıcı Perspektifi)

```
1. Kullanıcı kaydolur/giriş yapar
2. Wizard ile yeni proje oluşturur (meslek, renk tercihi, AI sohbet)
3. generate-website Edge Function AI ile içerik üretir
4. İçerik → ChaiBlock[] dizisine dönüştürülür
5. ChaiBuilder editöründe bloklar düzenlenir (sürükle-bırak, metin düzenleme, görsel değiştirme)
6. deploy-to-netlify Edge Function ile statik HTML olarak yayınlanır
7. Yayınlanan site /site/:subdomain üzerinden görüntülenir
```

---

## 3. Veritabanı Şeması (Supabase)

### Ana Tablolar

| Tablo | Açıklama |
|-------|----------|
| `projects` | Web site projeleri. `chai_blocks` (JSON), `chai_theme` (JSON), `generated_content` (JSON), `template_id`, `subdomain` içerir |
| `profiles` | Kullanıcı profilleri |
| `appointments` | Randevu sistemi |
| `appointment_settings` | Randevu ayarları (çalışma saatleri, slot süresi vb.) |
| `blocked_slots` | Engellenen tarih/saatler |
| `contact_leads` | İletişim formu gönderileri |
| `custom_domains` | Özel alan adları |
| `analytics_events` | Ziyaretçi analitiği |
| `studio_images` | AI görsel stüdyosu |
| `notifications` | Bildirimler |
| `notification_templates` | Bildirim şablonları |
| `notification_logs` | Bildirim logları |
| `agenda_notes` | Ajanda notları |

### Kritik View
- `public_projects` — Yayınlanan sitelerin public görünümü (RLS olmadan okunabilir)

### Kritik Sütunlar (`projects`)
```sql
chai_blocks    JSON[]  -- ChaiBuilder blok dizisi (site yapısı)
chai_theme     JSON    -- Tema renkleri, fontlar, border-radius
generated_content JSON -- AI tarafından üretilen ham içerik
template_id    TEXT    -- Kullanılan şablon ID'si
subdomain      TEXT    -- site URL subdomain'i
is_published   BOOL   -- Yayın durumu
```

---

## 4. Edge Functions (Supabase)

| Function | Açıklama | Gerekli Secret'lar |
|----------|----------|--------------------|
| `generate-website` | AI ile web sitesi içeriği üretir | `LOVABLE_API_KEY` (Gemini erişimi) |
| `deploy-to-netlify` | Statik HTML oluşturup Netlify'a deploy eder | `NETLIFY_TOKEN` |
| `wizard-chat` | AI sohbet wizard'ı | `LOVABLE_API_KEY` |
| `chai-ai-assistant` | Editör içi AI asistan | `LOVABLE_API_KEY` |
| `fetch-images` / `search-pixabay` | Pixabay görsel arama | `PIXABAY_API_KEY` |
| `studio-generate-image` | AI görsel üretimi | `LOVABLE_API_KEY` |
| `book-appointment` | Randevu oluşturma | — |
| `manage-appointments` | Randevu yönetimi | — |
| `submit-contact-form` | İletişim formu | — |
| `track-analytics` | Analitik event kaydı | — |
| `add-custom-domain` / `verify-domain` / `remove-domain` | Domain yönetimi | — |
| `auto-configure-dns` | Otomatik DNS yapılandırma | — |
| `deploy-to-netlify` | HTML build + Netlify deploy | `NETLIFY_TOKEN` |
| `send-notification` / `process-reminders` | Bildirim sistemi | — |
| `regenerate-content` | İçerik yeniden üretimi | `LOVABLE_API_KEY` |
| `fetch-image-options` | Görsel seçenekleri | `PIXABAY_API_KEY` |

---

## 5. ChaiBuilder Blok Sistemi

### Blok Türleri (Kayıtlı)

**Hero**: `HeroSplit`, `HeroCentered`, `HeroOverlay`, `NaturalHero`, `NaturalHeader`  
**İçerik**: `AboutSection`, `NaturalIntro`, `ServicesGrid`, `StatisticsCounter`  
**Galeri**: `ImageGallery`, `NaturalArticleGrid`  
**Referans**: `TestimonialsCarousel`  
**CTA**: `CTABanner`, `NaturalNewsletter`  
**İletişim**: `ContactForm`, `NaturalFooter`  
**SSS**: `FAQAccordion`  
**Fiyat**: `PricingTable`  
**Randevu**: `AppointmentBooking`  

### Blok Veri Yapısı
```typescript
interface ChaiBlock {
  _id: string;      // Benzersiz ID
  _type: string;    // Blok türü (ör. "HeroCentered")
  _position?: number;
  _name?: string;
  // ...blok-özel proplar (title, description, services[], vb.)
}
```

### Blok Kayıt Mekanizması
```typescript
import { registerChaiBlock } from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps } from "@chaibuilder/sdk/types";

registerChaiBlock(MyBlockComponent, {
  type: "MyBlockType",
  label: "Blok Adı",
  category: "Kategori",
  schema: {
    properties: {
      title: builderProp({ type: "string", title: "Başlık", default: "..." }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "center" }),
    },
  },
});
```

### Stil Sistemi (Tüm Bloklarda Standart)

Her blok `CommonStyleProps` + `resolveStyles()` kullanmalıdır:

```typescript
// Props
interface MyBlockProps extends ChaiBlockComponentProps & CommonStyleProps { ... }

// Kullanım
const s = resolveStyles(styleProps);
<section className={cn(s.bgColor, s.sectionPadding)}>
  <h2 className={cn(s.titleSize(titleSizeMap), s.titleWeight, s.titleColor)}>
```

Kontrol edilen stiller:
- `titleSize`: lg / xl / 2xl / 3xl
- `titleWeight`: normal / medium / semibold / bold / extrabold
- `titleColor`: default / primary / secondary / white / muted
- `textAlign`: left / center / right
- `descSize`: sm / base / lg / xl
- `descColor`: default / primary / dark / muted / white
- `bgColor`: transparent / background / muted / card / primary / secondary
- `sectionPadding`: sm / md / lg / xl

### Görsel Bileşeni
```typescript
<EditableChaiImage
  src={imageUrl}
  alt="Açıklama"
  className="w-full h-full object-cover"
  containerClassName="aspect-[4/3] rounded-2xl overflow-hidden" // Zorunlu!
  inBuilder={inBuilder}
/>
```

---

## 6. Şablon Sistemi

### İki Tür Şablon

1. **Component-based (React)**: `pilates1`, `lawyer-firm`, `natural`
   - `src/templates/{name}/` altında tam React bileşenleri
   - `TemplateProps` interface'i ile render edilir

2. **Catalog-based (Data-driven)**: `src/templates/catalog/definitions.ts`
   - Saf veri tanımları (section dizisi + tema anahtarı)
   - `convertTemplateToBlocks()` ile ChaiBlock[] dizisine dönüşür
   - Yeni şablonlar sadece `definitions.ts`'ye eklenerek oluşturulur

### Tema Preset'leri (`src/components/chai-builder/themes/presets.ts`)
```typescript
// Her tema: fontFamily, borderRadius, colors (light/dark çifti)
export const modernProfessionalPreset: Partial<ChaiThemeValues> = {
  fontFamily: { heading: "Inter", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0d0d0d"],  // [light, dark]
    primary: ["#f97316", "#fb923c"],
    // ...
  },
};
```

---

## 7. Yayınlama (Deploy) Süreci

### `deploy-to-netlify` Edge Function

1. DB'den `chai_blocks` ve `chai_theme` okunur
2. Her blok türü için HTML renderer fonksiyonu çağrılır
3. Tailwind CSS CDN + tema CSS değişkenleri eklenir
4. Tam HTML string oluşturulur
5. Netlify API'ye deploy edilir

**Kritik**: Editördeki her blok için `deploy-to-netlify`'da karşılık gelen bir HTML renderer olmalıdır. Yeni blok eklendiğinde renderer da eklenmelidir.

---

## 8. Dosya Yapısı

```
src/
├── App.tsx                          # Router
├── pages/
│   ├── Landing.tsx                  # Ana sayfa
│   ├── Dashboard.tsx                # Kontrol paneli
│   ├── Project.tsx                  # Proje editörü (1846 satır, ana sayfa)
│   ├── PublicWebsite.tsx            # Yayınlanan site görüntüleyici
│   ├── Analytics.tsx / Appointments.tsx / Studio.tsx / Settings.tsx / ...
│
├── components/
│   ├── chai-builder/
│   │   ├── ChaiBuilderWrapper.tsx   # ChaiBuilder SDK sarmalayıcı
│   │   ├── blocks/                  # Özel bloklar
│   │   │   ├── shared/styleUtils.ts # Stil sistemi (CommonStyleProps)
│   │   │   ├── shared/EditableChaiImage.tsx
│   │   │   ├── hero/ about/ services/ gallery/ ...
│   │   ├── hooks/useChaiBuilder.ts  # Save/Load hook'ları
│   │   ├── themes/presets.ts        # Tema tanımları
│   │   ├── utils/                   # themeUtils, imagePatching
│   │   ├── PixabayImagePicker.tsx   # Görsel seçici
│   │   ├── InlineImageSwitcher.tsx  # Satır içi görsel değiştirici
│   │   ├── TemplateGalleryOverlay.tsx
│   │
│   ├── website-preview/             # Legacy editör bileşenleri
│   ├── dashboard/                   # Dashboard panelleri
│   ├── wizard/                      # Proje oluşturma wizard'ı
│   ├── landing/                     # Landing page bileşenleri
│   ├── ui/                          # shadcn/ui bileşenleri
│
├── templates/
│   ├── types.ts                     # TemplateProps, TemplateConfig
│   ├── index.ts                     # Template registry
│   ├── catalog/definitions.ts       # Data-driven şablon tanımları
│   ├── pilates/ lawyer/ natural/    # React şablon bileşenleri
│
├── types/generated-website.ts       # GeneratedContent tipi
├── contexts/AuthContext.tsx          # Auth context
├── integrations/supabase/client.ts  # Supabase client (DÜZENLEME!)
│
supabase/
├── config.toml                      # Edge function yapılandırması
├── functions/                       # Tüm edge function'lar
```

---

## 9. Gerekli API Anahtarları

| Secret | Kullanım | Nereden Alınır |
|--------|----------|----------------|
| `PIXABAY_API_KEY` | Görsel arama | https://pixabay.com/api/docs/ |
| `NETLIFY_TOKEN` | Site deploy | https://app.netlify.com/user/applications |
| `LOVABLE_API_KEY` | AI modelleri (Gemini) | Lovable Cloud otomatik sağlar |

**Not**: `LOVABLE_API_KEY` Lovable Cloud'a özgüdür. Claude Code'da kendi AI provider'ınızı kullanmanız gerekecek. Önerilen: Google AI Studio'dan Gemini API key alın ve `GEMINI_API_KEY` olarak kullanın.

---

## 10. Kritik Kurallar ve Kısıtlamalar

1. **Editor Safety**: Mevcut editör render motoru değiştirilemez, CSS token yapısı korunmalı
2. **Blok Paritesi**: Editör ve deploy-to-netlify arasında %100 görsel uyum
3. **Yeni Blok Ekleme**: 
   - `blocks/{category}/NewBlock.tsx` oluştur
   - `blocks/{category}/index.ts`'ye export ekle
   - `blocks/index.ts`'ye import ekle
   - `deploy-to-netlify/index.ts`'ye HTML renderer ekle
4. **Yeni Şablon Ekleme**:
   - `catalog/definitions.ts`'ye TemplateDefinition ekle
   - `themes/presets.ts`'ye tema preset'i ekle
   - `presets.ts`'deki `templateToPreset` map'ine ekle
5. **Görseller**: `containerClassName` ile aspect ratio ve overflow kontrol et
6. **Tüm bloklar**: `commonStyleSchemaProps()` + `resolveStyles()` kullanmalı
7. **AI Modeli**: `google/gemini-3-flash-preview` (generate-website'da)
8. **Sayfa başına maks 12 bölüm**, blok başına 50KB prop sınırı

---

## 11. Claude Code'da Yapılması Gerekenler

### Adım 1: Repo'yu Clone'la
```bash
git clone <repo-url>
cd project
npm install
```

### Adım 2: Supabase Kurulumu
- Supabase hesabı oluştur
- Yeni proje aç
- `supabase/migrations/` altındaki SQL dosyalarını çalıştır
- `.env` dosyasına `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` ekle

### Adım 3: Edge Function Secret'ları
```bash
supabase secrets set PIXABAY_API_KEY=xxx
supabase secrets set NETLIFY_TOKEN=xxx
supabase secrets set GEMINI_API_KEY=xxx  # LOVABLE_API_KEY yerine
```

### Adım 4: AI Provider Değişikliği
`generate-website`, `wizard-chat`, `chai-ai-assistant`, `regenerate-content` edge function'larında Lovable AI proxy yerine doğrudan Gemini API kullanılacak şekilde güncelle:

```typescript
// Mevcut (Lovable Cloud):
const response = await fetch("https://ai.lovable.dev/v1/chat/completions", { ... });

// Yeni (Doğrudan Gemini):
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, { ... });
```

### Adım 5: Netlify Deploy
- Netlify hesabı oluştur
- Personal access token al
- `deploy-to-netlify` edge function'ına token ekle

---

## 12. Mevcut Supabase Proje Bilgileri (Referans)

```
Project ID: lpgyafvuihdymgsrmswh
Supabase URL: (VITE_SUPABASE_URL env variable'dan alınır)
```

Bu bilgiler sadece referans içindir. Claude Code'da kendi Supabase projenizi oluşturmanız gerekir.

---

## 13. Önemli npm Paketleri

```json
{
  "@chaibuilder/sdk": "^4.0.0-beta.27",  // Sayfa editörü
  "@supabase/supabase-js": "^2.93.2",     // Backend
  "react": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "framer-motion": "^12.29.2",           // Animasyonlar
  "sonner": "^1.7.4",                    // Toast bildirimleri
  "@tanstack/react-query": "^5.83.0",    // Data fetching
  "lucide-react": "^0.462.0",            // İkonlar
  "recharts": "^2.15.4",                 // Grafikler
  "grapesjs": "^0.21.13"                 // Legacy editör (devre dışı)
}
```
