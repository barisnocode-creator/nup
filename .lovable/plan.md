
# AI Destekli Görsel Oluşturma ve Detaylı Landing Page Planı

## Sorun Analizi

Şu anda sistemde iki ana eksiklik var:

1. **Görseller oluşturulmuyor**: `generate-images` edge function'ı hazır ancak hiçbir yerden çağrılmıyor
2. **Landing page'ler basit**: Mesleğe özgü detaylı bölümler eksik

---

## Çözüm Planı

### Adım 1: Görsel Oluşturma Entegrasyonu

**Değişiklik:** `src/pages/Project.tsx`

Website içeriği oluşturulduktan sonra otomatik olarak görsel oluşturma işlemini başlat:

```
generateWebsite() başarılı olduğunda → generate-images fonksiyonunu çağır (arka planda)
```

Eklenecek özellikler:
- Görsel oluşturma durumu için yeni state (`generatingImages`)
- Görseller hazırlanırken kullanıcıya bilgi mesajı
- Görseller tamamlandığında sayfayı güncelle

### Adım 2: "Görselleri Yenile" Butonu

Kullanıcıların istedikleri zaman görselleri yeniden oluşturabilmesi için editör toolbar'ına buton ekle:

```
[🖼️ Generate Images] butonu → generate-images fonksiyonunu tetikler
```

### Adım 3: Mesleğe Özgü Detaylı Bölümler

**Yeni Bileşenler ve İçerikler:**

| Meslek | Yeni Bölümler |
|--------|---------------|
| **Dişçi** | Tedavi galerisi, Önce/Sonra konsepti, Diş sağlığı istatistikleri |
| **Doktor** | Uzmanlık alanları grid'i, Sağlık ipuçları bölümü, Muayene süreci |
| **Eczacı** | İlaç kategorileri, Sağlık ürünleri, Danışmanlık hizmetleri |

**Değişiklik:** `supabase/functions/generate-website/index.ts`

Prompt'u zenginleştir:
- Daha uzun ve detaylı açıklamalar iste
- Mesleğe özgü terminoloji kullan
- Testimonial/referans şablonları ekle
- Çalışma saatleri ve konum detayları

### Adım 4: UI Geliştirmeleri

**Değişiklik:** Tüm sayfa bileşenleri

| Dosya | Geliştirme |
|-------|------------|
| `HomePage.tsx` | Hero görsel desteği zaten var, istatistik kartları ekle |
| `AboutPage.tsx` | Ekip üyesi placeholder'ları, timeline bölümü |
| `ServicesPage.tsx` | Hizmet kartlarına görsel desteği, fiyat kartı yapısı (bilgilendirme amaçlı) |
| `ContactPage.tsx` | Harita placeholder, çalışma saatleri tablosu |

---

## Teknik Uygulama Detayları

### 1. Project.tsx Güncellemesi

```typescript
// Yeni state'ler
const [generatingImages, setGeneratingImages] = useState(false);

// Website oluşturulduktan sonra görselleri başlat
const generateWebsite = async (projectId: string) => {
  // ... mevcut kod ...
  
  if (data?.content) {
    // Görselleri arka planda oluştur
    generateImages(projectId);
  }
};

// Yeni fonksiyon
const generateImages = async (projectId: string) => {
  setGeneratingImages(true);
  try {
    const { data } = await supabase.functions.invoke('generate-images', {
      body: { projectId },
    });
    
    if (data?.images) {
      // generated_content'i güncelle
      setProject(prev => prev ? {
        ...prev,
        generated_content: {
          ...prev.generated_content,
          images: data.images,
        },
      } : null);
    }
  } finally {
    setGeneratingImages(false);
  }
};
```

### 2. Editör Toolbar'a Buton

```typescript
// Authenticated header içinde
<Button 
  variant="outline" 
  size="sm"
  onClick={() => generateImages(id)}
  disabled={generatingImages}
>
  {generatingImages ? (
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  ) : (
    <ImageIcon className="w-4 h-4 mr-2" />
  )}
  {generatingImages ? 'Generating...' : 'Add Images'}
</Button>
```

### 3. Geliştirilmiş AI Prompt

```typescript
// generate-website/index.ts içinde
const prompt = `
...mevcut prompt...

ADDITIONAL REQUIREMENTS FOR ${profession.toUpperCase()}:
${profession === 'doctor' ? `
- Include medical credentials section
- Add patient care philosophy
- Describe consultation process step by step
- Include health statistics relevant to specialty
` : profession === 'dentist' ? `
- Describe dental procedures in patient-friendly language
- Include smile transformation concepts
- Add pediatric dentistry section if applicable
- Emphasize pain-free treatment approaches
` : `
- List pharmacy service categories
- Include health consultation services
- Add medication management information
- Describe prescription services process
`}

Make all content sound authentic and professional.
`;
```

### 4. Yeni Sayfa Bölümleri

**HomePage - İstatistik Bölümü:**
```typescript
// Yeni statistics section
<section className="py-16">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard value="10+" label="Years Experience" />
    <StatCard value="5000+" label="Happy Patients" />
    <StatCard value="15+" label="Services" />
    <StatCard value="4.9" label="Rating" />
  </div>
</section>
```

**ServicesPage - Süreç Bölümü:**
```typescript
// Tedavi/hizmet süreci
<section>
  <h2>How It Works</h2>
  <ProcessStep number={1} title="Book Consultation" />
  <ProcessStep number={2} title="Initial Assessment" />
  <ProcessStep number={3} title="Treatment Plan" />
  <ProcessStep number={4} title="Follow-up Care" />
</section>
```

---

## Dosya Değişiklikleri Özeti

| Dosya | İşlem | Açıklama |
|-------|-------|----------|
| `src/pages/Project.tsx` | Güncelle | Görsel oluşturma entegrasyonu + buton |
| `supabase/functions/generate-website/index.ts` | Güncelle | Zenginleştirilmiş prompt |
| `src/components/website-preview/pages/HomePage.tsx` | Güncelle | İstatistik bölümü + görsel entegrasyonu |
| `src/components/website-preview/pages/AboutPage.tsx` | Güncelle | Ekip ve timeline bölümleri |
| `src/components/website-preview/pages/ServicesPage.tsx` | Güncelle | Süreç bölümü + görsel desteği |
| `src/components/website-preview/pages/ContactPage.tsx` | Güncelle | Çalışma saatleri tablosu |
| `src/types/generated-website.ts` | Güncelle | Yeni içerik alanları için tipler |

---

## Beklenen Sonuç

Bu değişikliklerden sonra:

1. **Otomatik Görsel Oluşturma**: Website oluşturulduğunda AI görseller de otomatik oluşturulacak
2. **Manuel Görsel Yenileme**: Kullanıcılar isterlerse "Add Images" butonuyla yeni görseller oluşturabilecek
3. **Profesyonel Landing Page'ler**: 
   - Dişçi siteleri: Diş tedavileri, gülüş tasarımı konseptleri
   - Doktor siteleri: Uzmanlık alanları, muayene süreci
   - Eczacı siteleri: İlaç kategorileri, sağlık danışmanlığı
4. **Zengin İçerik**: İstatistikler, süreç açıklamaları, testimonial şablonları
