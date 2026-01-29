

# Hibrit Template Sistemi Planı

## Genel Bakış

Mevcut sistemde AI tüm layout ve içeriği dinamik olarak üretiyor. Bu planda, **profesyonel hazır template'ler** kullanarak görsel kaliteyi artırırken, AI'ın sadece **içerik üretimi**ne odaklanmasını sağlayacağız. Müşteri template seçmeyecek - sistem otomatik olarak en uygun template'i atayacak.

## Mevcut Mimari

```text
+------------------+      +-------------------+      +------------------+
|  Wizard Form     | ---> | generate-website  | ---> | WebsitePreview   |
|  (4 adım)        |      | (Edge Function)   |      | (React)          |
+------------------+      +-------------------+      +------------------+
        |                         |                         |
        v                         v                         v
  - Profession              AI Gemini ile             Sabit React
  - BusinessInfo           JSON üretimi              bileşenleri
  - Details                                          (HomePage, etc.)
  - Preferences
```

## Önerilen Hibrit Mimari

```text
+------------------+      +-------------------+      +------------------+
|  Wizard Form     | ---> | generate-website  | ---> | Template Router  |
|  (4 adım)        |      | (Edge Function)   |      | (Yeni)           |
+------------------+      +-------------------+      +------------------+
        |                         |                         |
        v                         v                         v
  Aynı form               Template Seçimi +          Seçilen Template
  (değişiklik yok)        Sadece İçerik              render edilir
                          Üretimi                    (temp1, temp2...)
```

## Uygulama Detayları

### 1. Template Yapısı Oluşturma

**Yeni klasör yapısı:**
```
src/
├── templates/
│   ├── index.ts              # Template registry
│   ├── types.ts              # Template tipleri
│   ├── temp1/                # İlk template (Healthcare Modern)
│   │   ├── index.tsx         # Template entry point
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── BlogPage.tsx
│   │   └── styles.ts         # Template-specific stiller
│   └── temp2/                # Gelecekte eklenecek
│       └── ...
```

### 2. Template Registry Sistemi

```typescript
// src/templates/types.ts
export interface TemplateConfig {
  id: string;                    // "temp1", "temp2"
  name: string;                  // "Healthcare Modern"
  supportedProfessions: string[]; // ["doctor", "dentist", "pharmacist"]
  supportedTones: string[];      // ["professional", "friendly"]
  preview?: string;              // Preview image URL
}

// src/templates/index.ts
const templates: Record<string, TemplateConfig> = {
  temp1: {
    id: 'temp1',
    name: 'Healthcare Modern',
    supportedProfessions: ['doctor', 'dentist', 'pharmacist'],
    supportedTones: ['professional', 'friendly', 'premium'],
  },
};

export function selectTemplate(
  profession: string, 
  tone: string
): string {
  // Otomatik template seçimi mantığı
  // Şu an tek template var, gelecekte genişletilebilir
  return 'temp1';
}
```

### 3. Veritabanı Güncellemesi

`projects` tablosuna yeni alan eklenmesi:

```sql
ALTER TABLE projects 
ADD COLUMN template_id TEXT DEFAULT 'temp1';
```

### 4. Edge Function Güncellemesi

`generate-website/index.ts` içinde template seçimi:

```typescript
// Template seçimi (otomatik)
const templateId = selectTemplate(profession, formData.websitePreferences?.tone);

// Prompt'u sadeleştirme - layout talimatları kaldırılır
// Sadece metin içeriği üretilir
const prompt = buildContentOnlyPrompt(profession, formData);

// Veritabanına template_id kaydet
await supabase.from('projects').update({
  generated_content: generatedContent,
  template_id: templateId,
  status: 'generated',
}).eq('id', projectId);
```

### 5. WebsitePreview Güncellemesi

```typescript
// src/components/website-preview/WebsitePreview.tsx

import { getTemplate } from '@/templates';

export function WebsitePreview({ 
  content, 
  colorPreference, 
  templateId = 'temp1',  // Yeni prop
  ...
}: WebsitePreviewProps) {
  
  // Template'e göre doğru bileşeni seç
  const Template = getTemplate(templateId);
  
  return (
    <Template 
      content={content}
      colorPreference={colorPreference}
      isEditable={isEditable}
      onFieldEdit={onFieldEdit}
    />
  );
}
```

### 6. İlk Template (temp1) Oluşturma

Mevcut `website-preview/pages/*` dosyalarını temel alarak ilk profesyonel template:

- GitHub'dan sağlık sektörüne uygun açık kaynak tasarımlardan ilham
- Modern, minimal, güvenilir görünüm
- Responsive tasarım
- Animasyonlar ve geçiş efektleri
- Profesyonel renk paleti

## Uygulama Adımları

| Adım | İş | Dosyalar |
|------|-----|----------|
| 1 | Template tip tanımlamaları | `src/templates/types.ts` |
| 2 | Template registry | `src/templates/index.ts` |
| 3 | temp1 template bileşenleri | `src/templates/temp1/*.tsx` |
| 4 | DB migration | `supabase/migrations/*.sql` |
| 5 | Edge function güncelleme | `supabase/functions/generate-website/index.ts` |
| 6 | WebsitePreview güncelleme | `src/components/website-preview/WebsitePreview.tsx` |
| 7 | Project.tsx güncelleme | `src/pages/Project.tsx` |
| 8 | types güncelleme | `src/types/generated-website.ts` |

## Avantajlar

1. **Görsel Kalite**: Profesyonel tasarlanmış template'ler
2. **Hız**: AI sadece içerik üretir, layout zaten hazır
3. **Maliyet**: Daha kısa prompt = daha az token
4. **Tutarlılık**: Her site aynı kalitede
5. **Genişletilebilirlik**: Yeni template'ler kolayca eklenir

## Teknik Notlar

- Mevcut `generated-website.ts` tipi korunacak (geriye uyumluluk)
- Template'ler aynı `GeneratedContent` tipini kullanacak
- İlk etapta tek template (`temp1`) ile başlanacak
- Mevcut projeler `temp1` olarak default atanacak
- Template seçimi tamamen backend'de otomatik olacak

