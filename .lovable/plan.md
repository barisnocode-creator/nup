

# Template Sistemi Yol Haritası — Sıfırdan Doğru Mimari

## Mevcut Sorunların Kök Nedeni

Sistem şu an üç çakışan katmandan oluşuyor ve hiçbiri tam çalışmıyor:

```text
1. definitions.ts      → defaultProps içinde hardcoded içerik (Espresso, Cappuccino vs.)
2. sectorProfiles.ts   → Sektöre göre metin, ama sadece bazı alanları dolduruyor
3. mappers/            → generatedContent'ten veri çekiyor, ama boş string kontrolü yok

Sorun: Boş string ("") truthy sayılmadığı için mapper bazen overrides uygulayamıyor,
       bazen eski hardcoded veri kalıyor.
```

**Template değiştirildiğinde** (`applyTemplate`):
- Eski `site_sections`'daki prop'lar sadece belirli anahtarlar için taşınıyor
- `generatedContent` mapper'lara gönderiliyor ama `""` (boş string) olan alanlar atlanıyor
- Sonuç: Deneme Kafe'de template değişince bambaşka (cafe) içerikler görünüyor

---

## Doğru Mimari — 3 Katmanlı Öncelik Zinciri (Düzeltilmiş)

```text
Öncelik 1: generatedContent (kullanıcının gerçek AI verileri) — her zaman kazanır
Öncelik 2: sectorProfile (sektöre göre Türkçe varsayılanlar) — gc yoksa devreye girer
Öncelik 3: template defaultProps — sadece placeholder/görsel için (METİN içermemeli)
```

**Kritik kural:** `definitions.ts`'deki `defaultProps` içinde HİÇBİR Türkçe metin bulunmamalı. Tüm metinler ya `generatedContent`'ten ya da `sectorProfile`'dan gelecek.

---

## Değiştirilecek Dosyalar ve Yapılacaklar

### 1. `src/templates/catalog/definitions.ts` — defaultProps Temizleme

Tüm template tanımlarındaki `defaultProps` içinden sabit Türkçe metinler kaldırılır. Sadece şunlar kalır:
- Görsel URL'leri (placeholder images)
- Yapısal veriler (items dizisinin şekli, icon isimleri)
- Boş string `""` veya boş dizi `[]` (mapper'ların dolduracağı yerler)

Örnek:
```typescript
// ÖNCE (hatalı — hardcoded içerik)
{
  type: 'MenuShowcase',
  defaultProps: {
    subtitle: 'Menümüz',
    title: 'Özel Seçkiler',
    items: [
      { name: 'Espresso', description: 'Zengin, dolgun...', price: '₺45' },
    ]
  }
}

// SONRA (doğru — boş, mapper dolduracak)
{
  type: 'MenuShowcase',
  defaultProps: {
    subtitle: '',
    title: '',
    items: [],
  }
}
```

### 2. `src/templates/catalog/mappers/index.ts` — Boş String Güvenliği

Tüm mapper'larda `""` (boş string) kontrolü eklenir. Şu an bazı override'lar `if (value)` ile yapılıyor ama `""` falsy olduğu için sectorProfile devreye girmiyor doğru sırayla.

Düzeltme: Her alanda önce `generatedContent`'e bak, yoksa `sectorProfile`'e bak, yoksa sabit fallback kullan.

```typescript
// Düzeltilmiş örnek
const title = safeGet(gc, 'pages.home.hero.title')  // 1. generatedContent
  || profile?.heroTitle                               // 2. sectorProfile  
  || 'Hoş Geldiniz';                                  // 3. son çare fallback
```

### 3. `src/templates/catalog/mappers/mapServicesSection.ts` — Yeni mapper

`CafeFeatures`, `DentalServices`, `ServicesGrid` için `generatedContent.pages.services.servicesList` verisini doğrudan section props'larına enjekte eden mapper oluşturulur.

### 4. `src/utils/sectionInjectors.ts` — MenuShowcase ve RestaurantMenu için içerik enjeksiyonu

Şu an `MenuShowcase`'e sadece görsel enjekte ediliyor. Menü öğelerinin isim ve açıklamaları da `generatedContent.pages.services.servicesList` veya `pages.home.highlights`'tan doldurulacak.

### 5. `src/components/editor/useEditorState.ts` — applyTemplate İçerik Taşıma Güçlendirme

Template değiştirildiğinde mevcut `sections` içindeki TÜM props anahtarları taşınacak (şu an sadece 9 anahtar taşınıyor). İçerik kaybını önlemek için daha geniş bir anahtar listesi kullanılacak.

```typescript
// Şu an (yetersiz)
const carryKeys = ['title', 'subtitle', 'description', 'sectionTitle', ...9 anahtar];

// Sonra (tam)  
const carryKeys = Object.keys(old).filter(k => !k.startsWith('_') && typeof old[k] === 'string');
```

---

## Uygulama Sırası

```text
Adım 1: definitions.ts → defaultProps'ları temizle (hardcoded metinleri kaldır)
Adım 2: mappers/index.ts → boş string güvenliği + tam içerik enjeksiyonu  
Adım 3: sectionInjectors.ts → MenuShowcase/RestaurantMenu içerik enjeksiyonu
Adım 4: useEditorState.ts → applyTemplate'de tam prop taşıma
Adım 5: Test: Deneme Kafe → template değiştir → içerikler geldi mi?
```

---

## Beklenen Sonuç

- Deneme Kafe projesi açıldığında: AI'ın ürettiği gerçek cafe içerikleri görünür
- Template değiştirildiğinde: Kullanıcının gerçek içerikleri yeni template'e aktarılır
- Hiçbir template'de "Espresso", "Cappuccino" gibi hardcoded içerik kalmaz
- Sektör farklı olsa bile (ör. doktor) içerik her zaman sektöre uygun gelir

