

# Tüm Sektörlere Dinamik İçerik ve Görsel Üretimi - Kapsamlı Düzeltme Planı

## Tespit Edilen Sorunlar

### Sorun 1: generate-images Edge Function Sadece Sağlık Sektörü İçin Çalışıyor
`supabase/functions/generate-images/index.ts` dosyasında `getImagePrompts` fonksiyonu sadece 3 sektör tanımlı:
- doctor
- dentist
- pharmacist

**Sonuç:** Kebapçı Halil gibi bir restoran oluşturulunca `profession` değeri `food` veya `service` geliyor, bu değer `professionImages` objesinde bulunamıyor ve fallback olarak `professionImages.doctor` kullanılıyor. Bu yüzden "Kebabçı Halil Medical Clinic" gibi sağlık görselleri üretiliyor.

### Sorun 2: fetch-image-options Fonksiyonunda Eksik Sektör Mapping
`supabase/functions/fetch-image-options/index.ts` dosyasında bazı sektörler (food, retail, creative, technology) eksik.

### Sorun 3: İçerik Dilinin Varsayılan Olarak Türkçe Olmaması
`generate-website` fonksiyonundaki prompt İngilizce varsayılan dil kullanıyor. Kullanıcı Türkçe seçse bile bazen İngilizce içerik üretiliyor.

### Sorun 4: Template Registry Çoğunlukla Sağlık Odaklı
`src/templates/index.ts` içindeki kategori ve açıklamalar ağırlıklı olarak "Healthcare" odaklı.

---

## Çözüm Planı

### Değişiklik 1: generate-images/index.ts - Tüm Sektörler İçin Dinamik Prompt Üretimi

**Mevcut Sorunlu Kod (satır 15-62):**
```typescript
function getImagePrompts(profession: string, businessName: string): ImagePrompt[] {
  const professionImages: Record<string, ImagePrompt[]> = {
    doctor: [...],
    dentist: [...],
    pharmacist: [...]
  };
  return professionImages[profession] || professionImages.doctor;  // HATA: doctor'a fallback
}
```

**Yeni Kod:**
```typescript
function getImagePrompts(
  profession: string, 
  businessName: string, 
  extractedData?: any
): ImagePrompt[] {
  // Sektör bazlı anahtar kelimeler
  const sectorKeywords: Record<string, { primary: string; secondary: string; style: string }> = {
    food: {
      primary: "restaurant cafe food dining",
      secondary: "chef kitchen culinary",
      style: "warm inviting appetizing"
    },
    retail: {
      primary: "store shop retail interior",
      secondary: "shopping customer products",
      style: "modern bright welcoming"
    },
    service: {
      primary: "professional office business",
      secondary: "team consultation meeting",
      style: "professional trustworthy"
    },
    creative: {
      primary: "design studio creative workspace",
      secondary: "artist designer portfolio",
      style: "modern artistic innovative"
    },
    technology: {
      primary: "tech startup office modern",
      secondary: "software developer coding",
      style: "innovative digital modern"
    },
    other: {
      primary: "professional business modern",
      secondary: "team office workspace",
      style: "professional clean"
    }
  };

  const keywords = sectorKeywords[profession] || sectorKeywords.other;
  const services = extractedData?.services?.slice(0, 2).join(', ') || '';
  
  return [
    {
      key: "heroHome",
      prompt: `Professional ${keywords.primary} for ${businessName}, ${services ? `featuring ${services},` : ''} ${keywords.style}, high quality photography, 16:9 hero image`
    },
    {
      key: "heroAbout",
      prompt: `${keywords.secondary} team at ${businessName}, professional atmosphere, ${keywords.style}, 16:9 aspect ratio`
    },
    {
      key: "heroServices",
      prompt: `${keywords.primary} showcasing services at ${businessName}, ${keywords.style}, professional setting, 16:9 aspect ratio`
    }
  ];
}
```

**Blog görseli için de düzeltme (satır 222):**
```typescript
// MEVCUT (sağlık odaklı):
const blogImagePrompt = `Professional blog article featured image about "${post.title}", healthcare topic...`;

// YENİ (sektör bazlı):
const sectorName = profession === 'food' ? 'culinary' : 
                   profession === 'retail' ? 'shopping' : 
                   profession === 'technology' ? 'tech' : 'business';
const blogImagePrompt = `Professional blog article featured image about "${post.title}", ${sectorName} topic, clean modern design, professional photography style, 16:9 aspect ratio`;
```

### Değişiklik 2: fetch-image-options/index.ts - Eksik Sektörleri Ekle

**Satır 23-39 güncellenecek:**
```typescript
const professionKeywords: Record<string, string> = {
  // Yeni sektörler
  food: 'restaurant cafe food dining culinary kitchen',
  retail: 'store shop retail shopping products display',
  service: 'professional business consulting office',
  creative: 'design studio creative art portfolio',
  technology: 'tech startup software coding modern',
  other: 'professional business modern office',
  // Eski (legacy) değerler korunuyor
  pharmacist: 'pharmacy medicine healthcare',
  doctor: 'medical doctor clinic healthcare',
  dentist: 'dental dentist teeth clinic',
  lawyer: 'lawyer legal office professional',
  restaurant: 'restaurant food dining culinary',
  // ... diğerleri
};
```

### Değişiklik 3: generate-website/index.ts - Dil Tercihini Zorunlu Türkçe Yap

**buildPrompt fonksiyonunda (satır 219-224):**
```typescript
// MEVCUT:
WEBSITE PREFERENCES:
- Language: ${prefs?.language || "English"} - ALL content MUST be in this language

// YENİ:
// Dil tercihi: extractedData'dan veya websitePreferences'tan al
const selectedLanguage = extractedData?.languages?.[0] || prefs?.language || "Turkish";
const languageInstruction = selectedLanguage === "Turkish" || selectedLanguage === "Türkçe" 
  ? "Türkçe - Tüm içerik MUTLAKA Türkçe olmalı, İngilizce kelime KULLANMA"
  : "English - ALL content MUST be in English";

WEBSITE PREFERENCES:
- Language: ${languageInstruction}
```

### Değişiklik 4: Proje Oluştururken extractedData'yı generate-images'a Aktar

**Project.tsx'te generateImages çağrısını güncelle (satır 165-201):**
```typescript
const generateImages = async (projectId: string) => {
  setGeneratingImages(true);
  try {
    const { data, error } = await supabase.functions.invoke('generate-images', {
      body: { 
        projectId,
        // extractedData'yı da gönder
        extractedData: project?.form_data?.extractedData 
      },
    });
    // ... rest
  }
};
```

**generate-images/index.ts'te extractedData'yı al ve kullan:**
```typescript
const { projectId, extractedData: requestExtractedData } = await req.json();

// ...

const profession = project.profession;
const formData = project.form_data || {};
const extractedData = requestExtractedData || formData.extractedData;
const businessName = extractedData?.businessName || formData?.businessInfo?.businessName || "Business";

// getImagePrompts'a extractedData'yı da gönder
const imagePrompts = getImagePrompts(profession, businessName, extractedData);
```

### Değişiklik 5: Template Registry'yi Güncellle (Opsiyonel ama Önerilen)

**src/templates/index.ts - Kategorileri daha genel yap:**
```typescript
// temp1 için:
config: {
  id: 'temp1',
  name: 'Modern Professional',  // 'Healthcare Modern' yerine
  description: 'Clean, professional template for all business types',
  category: 'Professional',     // 'Healthcare' yerine
  // ...
}
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik Türü |
|-------|-----------------|
| `supabase/functions/generate-images/index.ts` | Sektör bazlı dinamik prompt üretimi |
| `supabase/functions/fetch-image-options/index.ts` | Eksik sektörleri ekle |
| `supabase/functions/generate-website/index.ts` | Dil tercihini doğru uygula |
| `src/pages/Project.tsx` | extractedData'yı generate-images'a aktar |
| `src/templates/index.ts` | Kategori isimlerini genelleştir (opsiyonel) |

---

## Teknik Detaylar

### Sektör Değerleri ve Karşılık Gelen Anahtar Kelimeler

| Sektör | Görsel Arama Terimleri |
|--------|------------------------|
| food | restaurant, cafe, food, dining, culinary, kitchen, chef |
| retail | store, shop, products, shopping, display, customer |
| service | professional, office, consultation, business, meeting |
| creative | design, studio, art, portfolio, creative workspace |
| technology | tech, startup, coding, software, digital, innovation |
| other | professional, business, modern, office, workspace |

### Dil Değerleri

| Kullanıcı Seçimi | Prompt Talimatı |
|------------------|-----------------|
| Turkish / Türkçe | "Tüm içerik MUTLAKA Türkçe olmalı, İngilizce kelime KULLANMA" |
| English / İngilizce | "ALL content MUST be in English" |

---

## Beklenen Sonuçlar

1. **Kebapçı Halil örneği:**
   - Sektör: food
   - Görseller: Restaurant, cafe, food presentation görselleri
   - İçerik: Türkçe menü, yemek tanıtımları
   - Asla "Medical Clinic" yazmayacak

2. **Hukuk Bürosu örneği:**
   - Sektör: service
   - Görseller: Professional office, legal team görselleri
   - İçerik: Türkçe hukuki danışmanlık metinleri

3. **Online Moda Mağazası örneği:**
   - Sektör: retail
   - Görseller: Store, fashion, products görselleri
   - İçerik: Türkçe ürün tanıtımları

