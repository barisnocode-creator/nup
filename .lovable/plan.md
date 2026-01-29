
# Editor Sidebar Geliştirmesi: AI İçerik Regenerasyonu ve Gelişmiş Stil Seçenekleri

## Amaç
Editör sidebar'ını genişleterek:
1. AI tabanlı içerik regenerasyonu (Headline, Subtitle, Description için çalışan Generate butonları)
2. Gelişmiş stil seçenekleri (her bölüm için font, boyut, renk)
3. Daha fazla düzenlenebilir alan (Welcome, Buttons, Statistics, About Story)
4. Görsel için Pixabay'dan alternatif seçenekler sunulması
5. Gerçek zamanlı görsel pozisyonlama

---

## Yapılacak Değişiklikler

### 1. Yeni Edge Function: `regenerate-content`
Tek bir alan veya bölüm için AI ile içerik yenileme fonksiyonu.

**Özellikler:**
- Mevcut içerik ve bağlamı alarak yeni alternatifler üretir
- `fieldPath` parametresi ile hangi alanın regenerate edileceğini belirler
- LOVABLE_API_KEY kullanarak AI Gateway'e istek gönderir
- Sektör ve ton bilgisini kullanarak uygun içerik üretir

**Endpoint:** `POST /regenerate-content`
```text
Request:
{
  "projectId": "uuid",
  "fieldPath": "pages.home.hero.title",
  "context": {
    "profession": "pharmacist",
    "siteName": "Super Brands Pharmacy",
    "tone": "professional"
  }
}

Response:
{
  "newValue": "Your Trusted Community Pharmacy",
  "fieldPath": "pages.home.hero.title"
}
```

### 2. Yeni Edge Function: `fetch-image-options`
Pixabay'dan belirli bir görsel slotu için 2-3 alternatif görsel getirir.

**Özellikler:**
- Sektöre ve görsel tipine göre arama yapar
- 2-3 farklı seçenek döner
- Thumbnail URL'leri ile birlikte gelir

**Endpoint:** `POST /fetch-image-options`
```text
Request:
{
  "projectId": "uuid",
  "imageType": "about" | "hero" | "gallery" | "cta",
  "count": 3
}

Response:
{
  "options": [
    { "url": "...", "thumbnail": "...", "alt": "..." },
    { "url": "...", "thumbnail": "...", "alt": "..." },
    { "url": "...", "thumbnail": "...", "alt": "..." }
  ]
}
```

### 3. EditorSidebar.tsx Güncellemesi

**Content Tab Değişiklikleri:**
- Generate butonları için `onRegenerateField` çağrısı zaten mevcut, backend entegrasyonu eklenecek
- Loading state'i her alan için ayrı gösterilecek

**Style Tab Değişiklikleri:**
- Hero dışındaki bölümler için de stil seçenekleri
- Font boyutu slider'ı (small, medium, large, xlarge)
- Metin rengi seçici (primary, secondary, custom)
- Text alignment seçenekleri

**Image Section Değişiklikleri:**
- "Change" butonuna tıklandığında Pixabay'dan 2-3 alternatif gösterilir
- Alternatifler küçük thumbnail olarak sidebar içinde listelenir
- Seçilen görsel anında uygulanır

### 4. Project.tsx Handler Güncellemeleri

**handleRegenerateField fonksiyonu:**
- Mevcut TODO kodunu gerçek edge function çağrısıyla değiştir
- Regenerate edilecek alan için bağlam bilgisini topla
- Response'u `handleFieldEdit` ile uygula

**handleImageChange fonksiyonu:**
- Pixabay'dan alternatifler getir
- State'e kaydet ve sidebar'da göster
- Seçim yapıldığında güncelle

**handleUpdateImagePosition fonksiyonu:**
- Mevcut implementasyon görsel state'ini güncelliyor
- Değişikliği `generated_content.images` içine kaydet

### 5. Yeni Düzenlenebilir Alanlar

**FullLandingPage.tsx'e eklenecekler:**

| Bölüm | Alan | fieldPath |
|-------|------|-----------|
| Welcome | Title | `pages.home.welcome.title` |
| Welcome | Content | `pages.home.welcome.content` |
| Statistics | Her stat value | `pages.home.statistics[i].value` |
| Statistics | Her stat label | `pages.home.statistics[i].label` |
| About | Story Title | `pages.about.story.title` |
| About | Story Content | `pages.about.story.content` |
| CTA | Headline | Yeni alan eklenecek |
| Header | Site Name | `metadata.siteName` |

**HeroOverlay.tsx'e eklenecekler:**
- "Get Started" butonu için text editing
- "Learn More" butonu için text editing

### 6. Görsel Pozisyonlama Gerçek Zamanlı Senkronizasyonu

**Mevcut Durum:**
- Slider değişikliği `handleUpdateImagePosition` çağırıyor
- Sadece EditorSidebar içindeki preview güncelleniyor

**Yenilik:**
- `generated_content.images` içine position bilgisi eklenir
- Her görsel için `positionX` ve `positionY` değerleri saklanır
- Görsel bileşenleri bu değerleri `objectPosition` olarak kullanır

---

## Dosya Değişiklikleri Özeti

### Yeni Dosyalar
| Dosya | Açıklama |
|-------|----------|
| `supabase/functions/regenerate-content/index.ts` | AI içerik yenileme edge function |
| `supabase/functions/fetch-image-options/index.ts` | Pixabay alternatif görsel edge function |

### Düzenlenecek Dosyalar
| Dosya | Değişiklik |
|-------|------------|
| `src/pages/Project.tsx` | Handler'ları edge function'lara bağla |
| `src/components/website-preview/EditorSidebar.tsx` | Style tab genişletme, image options UI |
| `src/templates/temp1/pages/FullLandingPage.tsx` | Welcome ve diğer bölümler için editör bağlantısı |
| `src/templates/temp1/sections/hero/HeroOverlay.tsx` | Buton text editing, position senkronizasyonu |
| `src/templates/temp1/sections/AboutInlineSection.tsx` | Daha fazla field için editör |
| `src/templates/temp1/sections/StatisticsSection.tsx` | Her stat için değiştirilebilir |
| `src/types/generated-website.ts` | Image position fields ekleme |
| `supabase/config.toml` | Yeni edge function tanımları |

---

## Teknik Detaylar

### regenerate-content Edge Function

```typescript
// Prompt yapısı
const prompt = `You are a professional content writer. 
Generate a new ${fieldType} for a ${profession} website.

Current content: "${currentValue}"
Site name: ${siteName}
Tone: ${tone}

Requirements:
- Keep the same approximate length
- Maintain professional ${tone} tone
- Make it different but equally engaging
- Language: ${language}

Return ONLY the new text, no explanation.`;
```

### Görsel Pozisyonlama Data Yapısı

```typescript
// GeneratedContent.images genişletmesi
images?: {
  heroHome?: string;
  heroHomePosition?: { x: number; y: number };
  aboutImage?: string;
  aboutImagePosition?: { x: number; y: number };
  // ... diğer görseller
};
```

### EditorSidebar Style Tab Genişletmesi

```typescript
// Section-specific style options
interface SectionStyleOptions {
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textColor: 'primary' | 'secondary' | 'muted' | 'custom';
  customColor?: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
}
```

---

## Kullanıcı Deneyimi Akışı

### İçerik Regenerasyonu
1. Kullanıcı bir text alanına tıklar → EditorSidebar açılır
2. "Regenerate" butonuna tıklar
3. Loading spinner görünür (o spesifik alanda)
4. AI yeni içerik üretir
5. İçerik anında sayfada güncellenir

### Görsel Değiştirme
1. Kullanıcı görsele tıklar → EditorSidebar açılır
2. "Change" butonuna tıklar
3. Sidebar'da 2-3 alternatif thumbnail görünür
4. Birini seçer → Görsel anında değişir
5. Horizontal/Vertical slider'lar ile pozisyon ayarlanır (gerçek zamanlı)

### Stil Düzenleme
1. Kullanıcı bir bölüme tıklar
2. Style tab'a geçer
3. Font boyutu, renk, hizalama seçenekleri görünür
4. Değişiklikler anında yansır
