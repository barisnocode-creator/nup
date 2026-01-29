

# Pixabay API Entegrasyonu Planı

## Maliyet Karşılaştırması

### Mevcut Sistem (AI Görsel Üretimi)

| Özellik | Değer |
|---------|-------|
| Servis | Lovable AI (Gemini 2.5 Flash Image) |
| Proje başına görsel | 3-6 adet (hero + blog) |
| Maliyet | Lovable AI token kredisi tüketimi |
| Üretim süresi | ~3-5 saniye/görsel + rate limit beklemesi |
| Toplam | ~15-30 saniye/proje |

### Pixabay Alternatifi

| Özellik | Değer |
|---------|-------|
| Servis | Pixabay API |
| Maliyet | **Tamamen Ücretsiz** (ticari kullanım dahil) |
| Rate limit | 100 istek/dakika |
| Lisans | Pixabay License (atıf gerekmez) |
| Görsel kalitesi | Profesyonel stok fotoğraflar |
| Üretim süresi | ~200-500ms/istek |

### Maliyet Tasarrufu

```text
+-------------------+     +-------------------+
|   AI Generation   |     |   Pixabay API     |
|   (Şu anki)       |     |   (Önerilen)      |
+-------------------+     +-------------------+
| Token maliyeti    |     | $0 (Ücretsiz)     |
| ~15-30 sn/proje   |     | ~1-2 sn/proje     |
| Benzersiz görsel  |     | Stok fotoğraflar  |
+-------------------+     +-------------------+
```

## Pixabay API Özellikleri

- **Ücretsiz**: API key gerektirir ama tamamen bedava
- **Yüksek kalite**: HD/Full HD görseller
- **Arama özellikleri**: Kategori, renk, yönelim filtreleri
- **Sağlık kategorisi**: "doctor", "dentist", "pharmacy", "clinic" aramaları zengin sonuçlar verir
- **Türkçe desteği**: `lang=tr` parametresiyle yerelleştirme

## Uygulama Planı

### Adım 1: Pixabay API Key Kurulumu

Pixabay'dan ücretsiz API key alınması ve Supabase secrets'a eklenmesi.

### Adım 2: Edge Function Oluşturma

`supabase/functions/fetch-images/index.ts` - Pixabay'dan görsel çekme:

```typescript
// Meslek bazlı arama terimleri
const searchTerms = {
  doctor: ["medical clinic", "doctor office", "healthcare"],
  dentist: ["dental clinic", "dentist", "dental care"],
  pharmacist: ["pharmacy", "drugstore", "medicine"]
};

// Pixabay API çağrısı
const response = await fetch(
  `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&orientation=horizontal&min_width=1200&per_page=5&category=science`
);
```

### Adım 3: Görsel Seçim Stratejisi

| Sayfa | Arama Terimi | Filtreler |
|-------|--------------|-----------|
| heroHome | "{profession} clinic reception" | horizontal, 1920px+ |
| heroAbout | "{profession} team professional" | horizontal, 1920px+ |
| heroServices | "{profession} equipment modern" | horizontal, 1920px+ |
| Blog | Blog başlığına göre dinamik | horizontal, 1200px+ |

### Adım 4: Hibrit Yaklaşım (Opsiyonel)

İleride hem Pixabay hem AI görseli sunulabilir:
- **Varsayılan**: Pixabay (hızlı, ücretsiz)
- **Premium**: AI üretimi (benzersiz, özelleştirilmiş)

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `supabase/functions/fetch-images/index.ts` | Yeni - Pixabay API entegrasyonu |
| `supabase/functions/generate-website/index.ts` | Güncelle - Görsel çekme mantığı |
| `src/types/generated-website.ts` | Güncelle - Görsel kaynak tipi ekleme |

## Teknik Detaylar

### Pixabay API Response Yapısı

```json
{
  "hits": [
    {
      "id": 195893,
      "webformatURL": "https://pixabay.com/get/..._640.jpg",
      "largeImageURL": "https://pixabay.com/get/..._1280.jpg",
      "imageWidth": 1920,
      "imageHeight": 1080,
      "tags": "doctor, medical, healthcare"
    }
  ]
}
```

### Edge Function Yapısı

```typescript
interface FetchImagesRequest {
  projectId: string;
  profession: string;
  businessName: string;
}

// Sayfa bazlı görsel arama
async function fetchPixabayImage(query: string, apiKey: string) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&min_width=1200&per_page=3&safesearch=true`
  );
  const data = await response.json();
  return data.hits[0]?.largeImageURL || null;
}
```

## Avantajlar ve Dezavantajlar

### Avantajlar
- Sıfır maliyet (API ücretsiz)
- Çok daha hızlı (~10x)
- Profesyonel kalite fotoğraflar
- Rate limit yüksek (100/dk)
- Güvenilir servis uptime

### Dezavantajlar
- Görseller benzersiz değil (stok)
- İşletme ismi görselde olmayacak
- Bazen alakasız sonuçlar gelebilir
- Pixabay sunucularına bağımlılık

## Sonuç

Pixabay entegrasyonu maliyet açısından kesinlikle avantajlı. Özellikle template sistemiyle birleştiğinde, profesyonel stok fotoğraflar + AI üretimi metin içeriği = yüksek kaliteli web siteleri sağlar.

**Öneri**: Pixabay'ı varsayılan olarak kullan, AI görsel üretimini ileride "premium" özellik olarak sun.

