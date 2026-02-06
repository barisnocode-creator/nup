
# ChaiBuilder Editör Kapsamlı Düzeltme Planı

## Tespit Edilen Sorunlar

### 1. Veritabanı Erişim Sorunu (406 Hatası)
Kullanıcı proje sayfasına girdiğinde 406 hatası alıyor ve dashboard'a yönlendiriliyor. RLS politikaları güncellenmiş ancak proje sayfası sorgusu başarısız oluyor.

**Kök Neden**: Browser'daki test kullanıcısı farklı bir hesapla giriş yapmış olabilir veya token doğrulaması başarısız. Ancak kod tarafında da bir kontrol eksikliği var - hata durumunda daha iyi geri bildirim gerekiyor.

### 2. Blok Prop İsimleri Uyumsuzluğu
`convertToChaiBlocks.ts` fonksiyonu yanlış prop isimleri kullanıyor:

| Dönüştürücüdeki İsim | Blok Şemasındaki Doğru İsim |
|---------------------|----------------------------|
| `title` | `sectionTitle` |
| `subtitle` | `sectionSubtitle` |
| `services` | (şemada tanımlı değil, hardcoded) |

### 3. Eksik Blok Şema Tanımları
Bazı bloklar için array/object props tanımlı değil:
- `ServicesGrid`: `services` prop'u şemada yok
- `TestimonialsCarousel`: `testimonials` prop'u şemada yok
- `FAQAccordion`: `faqs` prop'u şemada yok
- `ImageGallery`: `images` prop'u şemada yok

### 4. ChaiBuilder SDK Entegrasyon Eksiklikleri
- AI asistan endpoint düzeltildi ama test edilmedi
- Tema önayarları doğru formatta değil olabilir
- Blok kayıt sırası önemli ve kontrol edilmeli

---

## Düzeltme Planı

### Aşama 1: Dönüştürücü Düzeltmesi
**Dosya**: `src/components/chai-builder/utils/convertToChaiBlocks.ts`

Blok prop isimlerini şema ile uyumlu hale getir:

```typescript
// Hero bloğu - değişiklik yok, doğru

// Services bloğu düzeltmesi
blocks.push({
  _id: generateBlockId(),
  _type: 'ServicesGrid',
  sectionTitle: pages?.services?.hero?.title || 'Hizmetlerimiz',  // title → sectionTitle
  sectionSubtitle: 'Neler Yapıyoruz',
  sectionDescription: pages?.services?.intro?.content || '',
  // services prop'u şemada yok, default kullanılacak
});

// Testimonials düzeltmesi
blocks.push({
  _id: generateBlockId(),
  _type: 'TestimonialsCarousel',
  sectionTitle: 'Müşteri Yorumları',  // title → sectionTitle
  sectionSubtitle: 'Referanslar',
  // testimonials prop'u şemada yok, default kullanılacak
});

// Contact düzeltmesi
blocks.push({
  _id: generateBlockId(),
  _type: 'ContactForm',
  sectionTitle: contact.form?.title || 'Bize Ulaşın',  // title → sectionTitle
  sectionSubtitle: 'İletişim',
  sectionDescription: contact.form?.subtitle || '',
  email: contact.info.email || '',
  phone: contact.info.phone || '',
  address: contact.info.address || '',
  submitButtonText: 'Mesaj Gönder',
});
```

### Aşama 2: Blok Şemalarına Array Props Eklenmesi
Dinamik içerik için blok şemalarına array prop desteği eklenmeli:

**ServicesGrid.tsx**:
```typescript
schema: {
  properties: {
    // ... mevcut props
    services: builderProp({
      type: "array",
      title: "Hizmetler",
      items: {
        type: "object",
        properties: {
          icon: { type: "string", title: "İkon" },
          title: { type: "string", title: "Başlık" },
          description: { type: "string", title: "Açıklama" },
        },
      },
      default: defaultServices,
    }),
  },
},
```

**TestimonialsCarousel.tsx**:
```typescript
schema: {
  properties: {
    // ... mevcut props
    testimonials: builderProp({
      type: "array",
      title: "Müşteri Yorumları",
      items: {
        type: "object",
        properties: {
          name: { type: "string", title: "İsim" },
          role: { type: "string", title: "Ünvan" },
          content: { type: "string", title: "Yorum" },
          avatar: { type: "string", title: "Avatar URL" },
        },
      },
      default: defaultTestimonials,
    }),
  },
},
```

**FAQAccordion.tsx**:
```typescript
schema: {
  properties: {
    // ... mevcut props
    faqs: builderProp({
      type: "array",
      title: "Sorular",
      items: {
        type: "object",
        properties: {
          question: { type: "string", title: "Soru" },
          answer: { type: "string", title: "Cevap" },
        },
      },
      default: defaultFaqs,
    }),
  },
},
```

### Aşama 3: Proje Sayfası Hata Yönetimi İyileştirmesi
**Dosya**: `src/pages/Project.tsx`

```typescript
// Fetch hatası durumunda daha iyi geri bildirim
useEffect(() => {
  async function fetchProject() {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('...')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        
        // 406 hatası: Yetki sorunu
        if (error.code === 'PGRST116' || error.message.includes('406')) {
          toast({
            title: 'Erişim Hatası',
            description: 'Bu projeye erişim yetkiniz yok.',
            variant: 'destructive',
          });
        }
        
        navigate('/dashboard');
        return;
      }
      // ... devam
    } catch (err) {
      console.error('Fetch exception:', err);
      navigate('/dashboard');
    }
  }
  fetchProject();
}, [id, navigate]);
```

### Aşama 4: Mevcut Blokların Güncellenmesi
Her blok için şema ve component uyumunu sağla:

| Blok | Düzeltilecek |
|------|-------------|
| `HeroCentered` | ✅ Doğru |
| `HeroSplit` | ✅ Doğru |
| `HeroOverlay` | ✅ Doğru |
| `ServicesGrid` | ⚠️ services array prop eksik |
| `TestimonialsCarousel` | ⚠️ testimonials array prop eksik |
| `ContactForm` | ✅ Doğru |
| `CTABanner` | ✅ Doğru |
| `FAQAccordion` | ⚠️ faqs array prop eksik |
| `AboutSection` | ⚠️ features array prop kontrol et |
| `StatisticsCounter` | ⚠️ stats array prop kontrol et |
| `ImageGallery` | ⚠️ images array prop kontrol et |
| `PricingTable` | ⚠️ plans array prop kontrol et |

### Aşama 5: Dönüşüm Sonrası Verileri Temizleme
Mevcut projeler için `chai_blocks` verilerini sıfırlayıp yeniden dönüştürme:

```sql
-- Önce mevcut hatalı blokları temizle
UPDATE projects 
SET chai_blocks = NULL, chai_theme = NULL 
WHERE chai_blocks IS NOT NULL 
AND jsonb_array_length(chai_blocks) > 0;
```

Bu sayede sayfa açıldığında `convertAndSaveChaiBlocks` tekrar çalışacak.

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik Türü |
|-------|----------------|
| `src/components/chai-builder/utils/convertToChaiBlocks.ts` | Prop isimleri düzeltme |
| `src/components/chai-builder/blocks/services/ServicesGrid.tsx` | Array prop şeması ekleme |
| `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` | Array prop şeması ekleme |
| `src/components/chai-builder/blocks/faq/FAQAccordion.tsx` | Array prop şeması ekleme |
| `src/components/chai-builder/blocks/about/AboutSection.tsx` | Array prop şeması kontrol |
| `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx` | Array prop şeması kontrol |
| `src/components/chai-builder/blocks/gallery/ImageGallery.tsx` | Array prop şeması kontrol |
| `src/components/chai-builder/blocks/pricing/PricingTable.tsx` | Array prop şeması kontrol |
| `src/pages/Project.tsx` | Hata yönetimi iyileştirme |

---

## Test Senaryoları

Düzeltmeler sonrası test edilecekler:

1. **Editör Açılma Testi**
   - `/project/:id` sayfasına git
   - ChaiBuilder editörünün yüklenmesini bekle
   - Blokların canvas'ta görünmesini doğrula

2. **Blok Düzenleme Testi**
   - Bir bloğa tıkla
   - Sağ panelde prop'ların görünmesini doğrula
   - Değer değiştir ve kaydet

3. **Tema Değiştirme Testi**
   - Tema preset dropdown'ını aç
   - Farklı bir tema seç
   - Renklerin değiştiğini doğrula

4. **Otomatik Kayıt Testi**
   - Değişiklik yap
   - 5 değişiklik sonrası auto-save tetiklenmesini doğrula
   - Veritabanında `chai_blocks` güncellenmesini kontrol et

5. **Dönüşüm Testi**
   - `chai_blocks` boş olan bir projeyi aç
   - Otomatik dönüşümün çalışmasını doğrula
   - Blokların doğru prop'larla oluşturulduğunu kontrol et

---

## Beklenen Sonuç

Düzeltmeler tamamlandığında:

1. ✅ Editör düzgün açılacak ve bloklar görünecek
2. ✅ Blok prop'ları sağ panelde düzenlenebilecek
3. ✅ Array içerikleri (hizmetler, yorumlar, SSS) dinamik olarak eklenip çıkarılabilecek
4. ✅ Tema presetleri çalışacak
5. ✅ Eski içerikler doğru şekilde dönüştürülecek
6. ✅ Otomatik kayıt çalışacak
