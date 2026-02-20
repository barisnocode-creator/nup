
# MASTER PLAN — Platform Genel İyileştirme

## Mevcut Durum Analizi

Sistemin temel akışı şöyle çalışıyor:
1. Kullanıcı AI sohbeti ile bilgi verir → `generate-website` edge function JSON üretir
2. JSON içindeki `imageSearchTerms` Pixabay'e sorgu olarak gönderilir, fakat bu görseller **template'lerin `defaultProps` içine yazılmıyor** — görüntüler hiçbir bölüme bağlanmıyor
3. Template seçimi `sectorTemplateMap` ile yapılıyor ama harita eksik; birçok sektör `pilates1` fallback'ine düşüyor
4. `SiteFooter` tüm şablonlarda yok — sadece eklenebilir bölüm olarak mevcut, zorunlu değil
5. Blog sayfaları `useSiteTheme` ile tema alıyor ama blog görsel alanları (`post1Image` vb.) boş kaldığında görsel yüklenmüyor
6. Şablon seçimi için sektör haritası 6 şablon için var; altyapı genişlemeye kapalı değil ama yeni şablon ekleme protokolü dokümante edilmemiş

---

## MASTER PLAN — 5 Aşama

```text
AŞAMA 1: Görsel Bağlama Sistemi (Image Injection)
  └─ generate-website çıktısındaki imageSearchTerms → section defaultProps'a yaz
  └─ Her bölümün ilgili görsel alanı Pixabay'den dolu gelmeli
  └─ Boş image prop'ları olan bileşenler tespit et ve doldur

AŞAMA 2: Şablon-Sektör Haritası & Akıllı Template Seçimi
  └─ generate-website'daki sectorTemplateMap tam ve güncel olsun
  └─ Pilates/Lawyer/Natural eski şablonları kaldırıldı → harita güncellenmeli
  └─ selectCatalogTemplate fonksiyonu çok daha geniş kapsam için geliştirilmeli
  └─ "Bu sektöre bu şablon gitsin" altyapısı genişletilebilir şekilde

AŞAMA 3: Footer Zorunlu & Temalı
  └─ SiteFooter her yeni oluşturulan template'de son section olarak otomatik gelsin
  └─ Footer tema renkleri (bg-gray-900 yerine var(--primary), var(--background)) kullansın
  └─ Footer işletme bilgilerini (ad, telefon, email) section'lardan otomatik çeksin

AŞAMA 4: Blog Görselleri & Blog Sayfası Kalitesi
  └─ Blog post'larına Pixabay'den gerçek görsel çekilsin (post1Image, post2Image boş kalmasın)
  └─ Blog liste ve detay sayfaları tema uyumlu (useSiteTheme)
  └─ SEO meta etiketleri (og:image, og:title, description) çalışsın

AŞAMA 5: Template Havuzu Altyapısı
  └─ Yeni şablon ekleme protokolü — sektöre göre multiple template desteği
  └─ Her sektör için 1+ şablon tanımı (doctor-modern, doctor-warm, doctor-minimal)
  └─ Wizard'da şablon önizleme ve seçme adımı
  └─ Template içindeki tüm görsel slotları açıkça tanımlanmış olsun
```

---

## AŞAMA 1 — Detaylı Plan: Görsel Bağlama Sistemi

### Sorun (Detaylı)

`generate-website` şu anda JSON içinde `imageSearchTerms` üretiyor:
```json
{
  "imageSearchTerms": {
    "hero": "specialty cafe barista coffee espresso interior",
    "about": "barista coffee making cafe interior",
    "gallery": ["cafe interior cozy", "coffee latte art", ...]
  }
}
```

Bu terimler `search-pixabay` edge function'a gönderiliyor ama dönen URL'ler **template section defaultProps'larına yazılmıyor**. Yani:
- `HeroCafe` → `image` prop'u: `https://images.unsplash.com/photo-...` (static Unsplash — her zaman aynı)
- Kullanıcı "Deneme Kafe" oluşturuyor → görseli hiç Pixabay'den çekilmiyor
- Editörde görsel değiştirmeden önce boş ya da Unsplash placeholder görünüyor

### Çözüm

`generate-website` edge function'ın içinde, JSON parse edildikten sonra şu akış eklenecek:

```
1. imageSearchTerms parse et
2. Her terim için search-pixabay çağır (hero, about, gallery[0..5], cta, blog)
3. Dönen URL'leri template section defaultProps içindeki doğru image alanlarına yaz
4. Veritabanına kaydet
```

**Hangi section hangi image alanını kullanıyor:**

| Section Tipi | Props içindeki image alanı | imageSearchTerms kaynağı |
|---|---|---|
| HeroCafe / HeroDental / HeroRestaurant / HeroHotel / HeroPortfolio / HeroMedical | `image` | `hero` |
| AboutSection / CafeStory | `image` | `about` |
| CafeGallery / ImageGallery | `images[0..3].src` | `gallery[0..3]` |
| ChefShowcase | `image` | `about` |
| CTABanner | `image` | `cta` |
| MenuShowcase / ServicesGrid | `items[i].image` | `services` arama terimi + item adı |
| BlogSection (AddableBlog) | `post1Image`, `post2Image`, `post3Image`, `post4Image` | `blog` |

### Uygulama Yöntemi

`generate-website/index.ts` içinde, content JSON başarıyla parse edildikten sonra, `injectPixabayImages(sections, imageSearchTerms)` adında bir yardımcı fonksiyon çalıştırılacak. Bu fonksiyon:

1. `search-pixabay` edge function'ı internal olarak çağırır (Deno `fetch`)
2. Tek bir search çağrısı yerine paralel çağrılar yapar (daha hızlı)
3. Dönen URL'yi ilgili section'ın props içindeki image alanına yazar
4. Görsel bulunamazsa eski Unsplash placeholder'ı korur (fallback)

**Önemli**: Bu işlem async olduğundan, website generation süresi biraz uzayabilir. Ancak kullanıcıya görselli bir site göstermek için bu gerekli.

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/generate-website/index.ts` | `injectPixabayImages()` fonksiyonu ekle, section builder'ları güncelle |
| `src/templates/catalog/definitions.ts` | Tüm section defaultProps'larında image alanlarını `''` (boş) yerine placeholder URL olarak tut — ama asıl değer DB'den gelecek |

### Test Kriteri

- Yeni site oluşturulduğunda Hero, About, Gallery bölümlerinde gerçek Pixabay görselleri görünmeli
- Editörde "Görsel Değiştir" butonu hover'da sağ üstte belirmeli, tıklayınca Pixabay picker açılmalı
- Görsel yeniden yüklendiğinde eski görsel kaybolmadan önce yeni görsel hazır olmalı

---

## AŞAMA 2 — Detaylı Plan: Şablon-Sektör Haritası

### Sorun

`generate-website/index.ts` içindeki `sectorTemplateMap`:
```javascript
const sectorTemplateMap = {
  wellness: 'wellness-studio',   // ← BU ŞABLON YOK!
  pilates: 'wellness-studio',    // ← BU ŞABLON YOK!
  lawyer: 'corporate-services',  // ← BU ŞABLON YOK!
  ...
  food: 'restaurant-cafe',       // ← BU ŞABLON YOK!
};
```

Mevcut şablonlar: `specialty-cafe`, `dental-clinic`, `restaurant-elegant`, `hotel-luxury`, `engineer-portfolio`, `medcare-pro`

Harita bu ID'lerle eşleşmiyor → `selectTemplate()` her zaman `pilates1` fallback'ine düşüyor.

### Çözüm

`sectorTemplateMap` ve `selectTemplate()` fonksiyonu güncel şablon ID'leriyle yeniden yazılacak:

```javascript
const sectorTemplateMap: Record<string, string> = {
  // Sağlık
  doctor: 'medcare-pro',
  dentist: 'dental-clinic',
  dental: 'dental-clinic',
  clinic: 'medcare-pro',
  health: 'medcare-pro',
  hospital: 'medcare-pro',
  veterinary: 'medcare-pro',
  physiotherapy: 'medcare-pro',
  optometry: 'medcare-pro',
  pharmacy: 'medcare-pro',
  
  // Yeme-İçme
  cafe: 'specialty-cafe',
  coffee: 'specialty-cafe',
  food: 'specialty-cafe',
  bakery: 'specialty-cafe',
  restaurant: 'restaurant-elegant',
  bistro: 'restaurant-elegant',
  bar: 'restaurant-elegant',
  'fine-dining': 'restaurant-elegant',
  
  // Konaklama
  hotel: 'hotel-luxury',
  resort: 'hotel-luxury',
  hostel: 'hotel-luxury',
  accommodation: 'hotel-luxury',
  
  // Teknoloji/Portfolyo
  developer: 'engineer-portfolio',
  engineer: 'engineer-portfolio',
  freelancer: 'engineer-portfolio',
  designer: 'engineer-portfolio',
  creative: 'engineer-portfolio',
  technology: 'engineer-portfolio',
  software: 'engineer-portfolio',
  
  // Varsayılan (avukat, danışman, sigorta, muhasebe, vb.)
  lawyer: 'medcare-pro',
  consultant: 'medcare-pro',
  finance: 'medcare-pro',
  accounting: 'medcare-pro',
  insurance: 'medcare-pro',
  education: 'medcare-pro',
  retail: 'medcare-pro',
  beauty_salon: 'medcare-pro',
  gym: 'medcare-pro',
  fitness: 'medcare-pro',
};
```

Ayrıca `selectCatalogTemplate()` (`src/templates/catalog/index.ts`) fonksiyonu da aynı mantıkla güncellenir.

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/generate-website/index.ts` | `sectorTemplateMap` ve `selectTemplate()` güncellemesi |
| `src/templates/catalog/index.ts` | `selectCatalogTemplate()` fonksiyonu genişletme |

---

## AŞAMA 3 — Detaylı Plan: Footer Zorunlu & Temalı

### Sorun

- `SiteFooter` bileşeni mevcut, iyi çalışıyor
- Ama her yeni oluşturulan şablonda **otomatik son bölüm olarak gelmiyor**
- `allDefinitions` içindeki hiçbir şablonun sections dizisinde `AddableSiteFooter` yok
- Kullanıcı "Eklenebilir Bölümler" panelinden manuel eklemedikçe footer görünmüyor
- `SiteFooter` renkleri hardcoded: `bg-gray-900`, `text-blue-400` — temayı yansıtmıyor

### Çözüm

**3A — Her şablona footer otomatik eklenir:**

`definitions.ts` içindeki 6 şablonun `sections` dizisinin sonuna:
```javascript
{
  type: 'AddableSiteFooter',
  defaultProps: {
    siteName: '',  // hero section'dan otomatik çekilecek
    tagline: '',
    phone: '',
    email: '',
    address: '',
  }
}
```

**3B — Alternatif (daha iyi): `SiteEditor.tsx` içinde**

Section oluşturulurken, eğer sections dizisinde `AddableSiteFooter` yoksa, otomatik olarak son sıraya eklenir. Bu şekilde mevcut DB'deki siteler de etkilenir.

**3C — Footer tema uyumu:**

`SiteFooter.tsx` içindeki hardcoded renkler CSS değişkenleriyle değiştirilir:
```tsx
// Önce
<footer className="bg-gray-900 text-gray-300">
// Sonra  
<footer className="bg-foreground/95 text-background/80">
// veya primary renk varyantı:
<footer style={{ background: 'var(--footer-bg, #111827)', color: 'var(--footer-text, #d1d5db)' }}>
```

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|---|---|
| `src/templates/catalog/definitions.ts` | 6 şablona footer section ekle |
| `src/components/sections/addable/SiteFooter.tsx` | Tema CSS değişkenleri ile renkleri uyumlu hale getir |
| `src/components/editor/useEditorState.ts` | Section oluşturulurken footer auto-inject mantığı |

---

## AŞAMA 4 — Detaylı Plan: Blog Görselleri & Kalite

### Sorun

- Blog post'larında `post1Image`, `post2Image` alanları boş string olarak başlıyor
- `BlogSection` bileşeninde image boşsa `<img>` tag'i render edilmiyor — görsel kart görünmüyor
- `useSiteTheme` hook'u blog sayfaları için tema uygulasa da, blog görselleri hiç yok
- SEO için `og:image` tag'i blog detay sayfalarında boş kalıyor

### Çözüm

**4A — Blog post görselleri:**

`generate-website/index.ts` içinde, Pixabay'den dönen blog image URL'i tüm 4 blog post'una yazılır (veya farklı aramalar yapılır: `blog0`, `blog1`, `blog2`, `blog3`).

**4B — BlogSection fallback görsel:**

`BlogSection.tsx` içinde, `postImage` boş olduğunda sektöre uygun bir placeholder gösterilir:
```tsx
const imageUrl = props.postImage || 
  `https://images.unsplash.com/photo-1488998527040-7e2a2c7e4e1e?w=400&q=60`; // genel fallback
```

**4C — Editörde blog görseli yönetimi:**

`SectionEditPanel` içinde blog bölümü seçildiğinde, her post için Pixabay'den görsel arama butonu görünür.

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/generate-website/index.ts` | Blog post görsellerini Pixabay'den çek, prop'lara yaz |
| `src/components/sections/addable/BlogSection.tsx` | Boş image için fallback, görsel seçici entegrasyonu |

---

## AŞAMA 5 — Detaylı Plan: Template Havuzu Altyapısı

### Mevcut Altyapı

`definitions.ts` ve `catalog/index.ts` zaten iyi bir temel sunuyor:
- Her şablon `supportedIndustries: string[]` ile hangi sektörlere uyduğunu bildiriyor
- `getTemplatesForIndustry(industry)` fonksiyonu var ama kullanılmıyor
- `selectCatalogTemplate()` sadece ilk eşleşmeyi dönüyor — birden fazla seçenek sunmuyor

### Hedef Altyapı

Tek bir sektör için birden fazla şablon olabilsin:
```
doctor → ['medcare-pro', 'dental-clinic', 'corporate-services']
cafe   → ['specialty-cafe', 'restaurant-elegant']
```

**5A — `definitions.ts` genişletme protokolü:**

Yeni bir şablon eklemek için tek yapılması gereken:
1. `allDefinitions` dizisine yeni `TemplateDefinition` nesnesi eklemek
2. `sectorTemplateMap` içine sektör → şablon ID eşlemesi eklemek
3. `themes/presets.ts` içine yeni tema presetini eklemek

**5B — Çoklu şablon desteği:**

`generate-website/index.ts` içindeki `selectTemplate()`:
```javascript
function selectBestTemplate(sector: string, tone?: string): string {
  const candidates = allDefinitions
    .filter(t => t.supportedIndustries.includes(sector))
    .sort((a, b) => /* tone-based priority */);
  return candidates[0]?.id || 'medcare-pro';
}
```

**5C — Wizard'da şablon önizleme (gelecek):**

Wizard son adımında, sektöre göre 2-3 şablon önerisi gösterilir. Kullanıcı seçim yapar.

### Değiştirilecek Dosyalar

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/generate-website/index.ts` | `selectTemplate()` güncel ID'lerle, `selectBestTemplate()` |
| `src/templates/catalog/definitions.ts` | Her yeni şablon için eklenecek bölüm |
| `src/templates/catalog/index.ts` | `getTemplatesForIndustry()` dökümanlaştırma |

---

## Uygulama Sırası

Her aşama bağımsız test edilebilir:

```text
AŞAMA 1 → En kritik (görsel yok sorunu) → Önce uygula
AŞAMA 2 → Şablon seçimi (sektör eşleşmesi) → Aşama 1 ile paralel
AŞAMA 3 → Footer zorunlu → Hızlı, bağımsız
AŞAMA 4 → Blog görselleri → Aşama 1'den sonra
AŞAMA 5 → Template havuzu → En son, altyapı hazır olunca
```

Sizin test akışınız:
1. Aşama 1 uygulandıktan sonra → yeni kafe sitesi oluştur → görseller dolu mu?
2. Aşama 2 → "Doktor" diyin → dental-clinic mi geliyor, medcare-pro mu?
3. Aşama 3 → Site en altında footer var mı? İletişim bilgileri orada mı?
4. Aşama 4 → Blog köşesini ekle → blog kartlarında görsel var mı?
5. Aşama 5 → Wizard'da sektöre göre şablon önerisi geliyor mu?
