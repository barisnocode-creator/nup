
## Editör SectionEditPanel — 3 Fazlı Tam Düzeltme Planı

Tespit edilen sorunlar 3 kategoriye ayrılıyor:

---

### Sorun Tespiti

#### Sorun 1 — İçerik Alanları Eksik / Yanlış Çalışıyor

`ContentFields` bileşeninde ciddi filtreleme hataları var:

- `skipFields` listesinde `'stats'`, `'images'`, `'plans'`, `'infoItems'` var — ama birçok bölümün gerçek içerik alanları bu listeye giriyor (örn. `infoItems` HeroCafe'de bir metin dizisi)
- `arrayKeys` yalnızca `['services', 'testimonials', 'items']` — HeroCafe'nin `features`, DentalServices'in `services`, MenuShowcase'in `items` gibi farklı isimli dizileri işlenmeksizin gizleniyor
- `getVisibleFields(item)` fonksiyonu yanlış: `f.key in item || item[f.key] !== undefined` — bu iki koşul aynı şeyi söylüyor, dolayısıyla boş string değerli alanlar (`""`) da gösterilmiyor
- `labelMap`'te `badge`, `floatingBadge` gibi sektöre özgü prop'lar var ama bunların büyük çoğunluğu `typeof val === 'object'` kontrolünde atlıyor
- `typeof val === 'boolean'` olan `true/false` alanlar da hiç gösterilmiyor

#### Sorun 2 — Stil Dropdown'ları Çalışmıyor (Ekran Yenilemesi)

`StyleFields` içindeki `Select` bileşenleri şu değerleri kullanıyor:
```
titleSize: 'small' | 'default' | 'large' | 'xl'
sectionPadding: 'compact' | 'default' | 'spacious'
```

Ama `styleUtils.ts`'deki haritalar tamamen farklı anahtarlar kullanıyor:
```ts
titleSizeMap: { lg, xl, 2xl, 3xl }   // 'small', 'default', 'large' YOK
paddingMap:   { sm, md, lg, xl }      // 'compact', 'default', 'spacious' YOK
```

`resolveStyles()` fonksiyonu şu fallback'i kullanıyor:
```ts
titleSize: (map ?? titleSizeMap)[props.titleSize || '2xl'] || titleSizeMap['2xl']
```

`'small'` anahtarı haritada olmadığı için her zaman fallback `titleSizeMap['2xl']` dönüyor — yani seçim hiç uygulanmıyor. Kullanıcı değişiklik yaparken `pushUndo()` çağrılıyor, bu da `useEffect` tetikleyip CSS değişkenlerinin yeniden inject edilmesine neden oluyor — ekran "yenileniyor" gibi görünüyor.

#### Sorun 3 — Sektöre Göre İçerik Mapping Eksik (Menü/Rezervasyon Metinleri)

`defaultProps` içindeki buton metinleri (`primaryButtonText: 'Menümüzü Keşfedin'`, `secondaryButtonText: 'Rezervasyon'`) sektör profilinden geçirilmiyor çünkü `mapHeroSection.ts` sadece `buttonText` ve `name` gibi genel anahtarları override ediyor; şablon-özgü `primaryButtonText`/`secondaryButtonText` override'ı yeni eklendi ama yeterince kapsamlı değil.

---

### Faz 1 — Stil Sistemi Anahtarlarını Hizala

**Dosya:** `src/components/editor/SectionEditPanel.tsx` → `StyleFields` fonksiyonu  
**Dosya:** `src/components/sections/styleUtils.ts` → haritalar ve `resolveStyles`

`StyleFields`'daki `SelectItem` değerlerini `styleUtils.ts`'deki gerçek harita anahtarlarıyla eşleştir:

```
titleSize dropdown:
  Küçük    → 'lg'     (text-2xl...)
  Varsayılan → '2xl'  (text-3xl...)
  Büyük    → '3xl'    (text-4xl...)
  Çok Büyük → '3xl'   (en büyük)

sectionPadding dropdown:
  Az       → 'sm'  (py-12)
  Varsayılan → 'md' (py-20)
  Geniş    → 'lg'  (py-28)
  Çok Geniş → 'xl' (py-36)
```

`resolveStyles`'da varsayılan değeri de `'lg'` yerine `'2xl'` olarak koru (zaten öyle).  
`SectionEditPanel`'de `Select value` için de `'2xl'` ve `'md'` varsayılanları kullan.

Bu düzeltme, stil panelindeki her değişikliğin anında section'da yansımasını sağlar.

---

### Faz 2 — İçerik Alanları Tam ve Doğru Çalışsın

**Dosya:** `src/components/editor/SectionEditPanel.tsx` → `ContentFields` ve `ArrayEditor`

#### 2a. skipFields ve arrayKeys Güncelleme

```ts
// Şu an:
const arrayKeys = ['services', 'testimonials', 'items'];
const skipFields = ['stats', 'images', 'plans', 'infoItems'];

// Olacak:
const arrayKeys = ['services', 'testimonials', 'items', 'features', 'stats', 'plans'];
const skipFields = ['images'];  // sadece gerçek görsel nesneleri atla
```

`infoItems` (HeroCafe'de badge alt metni gibi), `features` (CafeFeatures'da) artık düzgün işlenecek.

#### 2b. getVisibleFields Düzeltme

```ts
// Şu an (hatalı — iki koşul aynı):
return schema.fields.filter(f => f.key in item || item[f.key] !== undefined);

// Olacak (doğru — boş string'ler dahil tüm tanımlı alanlar):
return schema.fields.filter(f => f.key in item);
```

#### 2c. labelMap Genişletme

Sektöre özgü popüler prop'ları Türkçe etiketlerle ekle:

```ts
badge: 'Rozet Metni',
floatingBadge: 'Yüzen Rozet',
floatingBadgeSubtext: 'Rozet Alt Yazısı',
infoItems: 'Bilgi Etiketleri',
name: 'Ad / İsim',
role: 'Ünvan / Rol',
content: 'İçerik',
phone: 'Telefon',
email: 'E-posta',
address: 'Adres',
hours: 'Çalışma Saatleri',
primaryButtonText: 'Ana Buton',
primaryButtonLink: 'Ana Buton Linki',
secondaryButtonText: 'İkinci Buton',
secondaryButtonLink: 'İkinci Buton Linki',
```

#### 2d. Array Schema Tamamlama

`arrayFieldSchemas`'a eksik tipler ekle:

```ts
features: { fields: [
  { key: 'icon', label: 'İkon (emoji)' },
  { key: 'title', label: 'Başlık' },
  { key: 'description', label: 'Açıklama', type: 'textarea' }
]},
stats: { fields: [
  { key: 'value', label: 'Değer' },
  { key: 'label', label: 'Etiket' }
]},
plans: { fields: [
  { key: 'name', label: 'Plan Adı' },
  { key: 'price', label: 'Fiyat' },
  { key: 'description', label: 'Açıklama' }
]},
```

---

### Faz 3 — Sektöre Göre CTA / Buton Metinleri

**Dosya:** `src/templates/catalog/mappers/mapHeroSection.ts`  
**Dosya:** `src/templates/catalog/definitions.ts` — Doktor şablonu defaultProps

Şu an `specialtyCafe` şablonunda `primaryButtonText: 'Menümüzü Keşfedin'` ve `secondaryButtonText: 'Rezervasyon'` sabit geliyor ve kullanıcı doktor bile olsa bu değişmiyor.

#### 3a. defaultProps'u Nötr Hale Getir

`definitions.ts`'deki `HeroCafe`, `HeroRestaurant`, `HeroDental`, `HeroHotel`, `HeroPortfolio` section'larının `primaryButtonText` ve `secondaryButtonText` değerlerini boş bırak veya placeholder yap:

```ts
primaryButtonText: '',   // Sector mapper dolduracak
secondaryButtonText: '', // Sector mapper dolduracak
```

#### 3b. Sektöre Özgü CTA Metinlerini Zorunlu Uygula

`mapHeroSection.ts`'de sektör profili mevcutsa buton metinlerini her zaman override et:

```ts
// Tüm hero tipleri için geçerli
if (profile) {
  if (sectionProps.primaryButtonText !== undefined)
    overrides.primaryButtonText = profile.ctaText;   // "Randevu Al", "Rezervasyon Yap" vs.
  if (sectionProps.secondaryButtonText !== undefined)
    overrides.secondaryButtonText = profile.sectionLabels.services; // "Hizmetlerimiz", "Menümüz" vs.
  if (sectionProps.buttonText !== undefined)
    overrides.buttonText = profile.ctaText;
}
```

Bu, herhangi bir şablon seçildiğinde kullanıcının sektörüne uygun buton metinleri görmesini garanti eder.

---

### Değişecek Dosyalar

| Faz | Dosya | Değişiklik Özeti |
|---|---|---|
| 1 | `src/components/editor/SectionEditPanel.tsx` | Dropdown değerlerini `styleUtils` anahtarlarıyla eşleştir |
| 2 | `src/components/editor/SectionEditPanel.tsx` | skipFields, arrayKeys, labelMap, schema güncellemesi |
| 3 | `src/templates/catalog/mappers/mapHeroSection.ts` | Sektör profili varsa butonları her zaman override et |
| 3 | `src/templates/catalog/definitions.ts` | Hero defaultProps'ta buton metinlerini placeholder yap |

Toplam 3 dosya değişiyor, mantık katmanı (`useEditorState`) değişmiyor.
