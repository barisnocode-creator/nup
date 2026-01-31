

# Studio Görsel Oluşturma API Düzeltmesi

## Problem

`studio-generate-image` edge function'ı yanlış API endpoint'i kullanıyor:
- **Yanlış**: `https://api.lovable.dev/v1/images/generations` → 404 hatası
- **Doğru**: `https://ai.gateway.lovable.dev/v1/chat/completions` (Gemini image modeli)

---

## Çözüm

`studio-generate-image` edge function'ını `generate-images` fonksiyonuyla aynı API endpoint ve formatı kullanacak şekilde güncellemek.

---

## Teknik Değişiklikler

### Dosya: `supabase/functions/studio-generate-image/index.ts`

#### 1. API Endpoint Değişikliği

```typescript
// ESKİ
const imageResponse = await fetch('https://api.lovable.dev/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${lovableApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'flux.schnell',
    prompt: fullPrompt,
    n: 1,
    size: `${dimensions.width}x${dimensions.height}`,
  }),
});

// YENİ
const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${lovableApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash-image',
    messages: [
      {
        role: 'user',
        content: fullPrompt
      }
    ],
    modalities: ['image', 'text']
  }),
});
```

#### 2. Response Parsing Değişikliği

```typescript
// ESKİ
let imageUrl = '';
if (imageData.data && imageData.data[0]) {
  if (imageData.data[0].url) {
    imageUrl = imageData.data[0].url;
  } else if (imageData.data[0].b64_json) {
    // base64 işleme
  }
}

// YENİ
let imageUrl = '';
// Gemini API formatı - choices[0].message.images[0].image_url.url
if (imageData.choices && imageData.choices[0]?.message?.images?.[0]?.image_url?.url) {
  imageUrl = imageData.choices[0].message.images[0].image_url.url;
}
```

---

## Test Adımları

1. Edge function deploy et
2. Studio'da Favicon kategorisini seç
3. Bir prompt gir ve oluştur
4. Görsel başarıyla oluşturulmalı
5. "Web Sitesine Uygula" ile projeye uygula
6. Veritabanında `generated_content.siteSettings.favicon` kontrol et

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `supabase/functions/studio-generate-image/index.ts` | API endpoint ve response parsing düzeltmesi |

