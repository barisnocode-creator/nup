
## Sorun: Template İçerikleri Boşaltılmalı, Sektör/Kullanıcı Verisi Her Zaman Öncelikli Olmalı

### Gerçek Sorun Nedir?

`definitions.ts` içindeki tüm şablonların `defaultProps`'unda hardcoded içerikler var:

```tsx
// specialty-cafe / definitions.ts
title: 'Where Every Cup Tells a Story',         // ← hardcoded!
description: 'A specialty cafe in the heart of Haight Ashbury...',  // ← hardcoded!
name: 'Chef Ahmet Yılmaz',                      // ← hardcoded!
bio: 'React, Node.js ve cloud teknolojileri...' // ← hardcoded!
```

Mapper sistemi (`mapHeroSection.ts`, `mapAboutSection.ts` vb.) kullanıcının `generated_content` veya `sectorProfile`'dan veriyi alıp `defaultProps` üzerine yazar — ama şu an **iki ciddi sorun** var:

**Sorun A:** Mapper çalıştığında `{ ...sectionProps, ...overrides }` şeklinde birleşiyor. Eğer `generated_content` boşsa ve `sectorProfile`'da alan yoksa, **hardcoded defaultProps kalıyor**.

**Sorun B:** `definitions.ts` içindeki `defaultProps`'ta café'ye özel içerikler var: "Where Every Cup Tells a Story", "Single Origin, Organic, Est. 2018", "Chef Ahmet Yılmaz". Kullanıcı farklı sektörde olsa dahi bu içerikler **sızmakta** — mapper tüm alanları kapsamıyor.

**Sorun C:** `applyTemplate` çağrıldığında (template değiştirildiğinde), `mapContentToTemplate` çalışıyor ama `injectImages()` ve `injectContactInfo()` **sadece `Project.tsx`'de** ilk oluşturma sırasında çalışıyor, template değişiminde çalışmıyor.

---

## Çözüm: 3 Katmanlı Temizlik

### Katman 1 — `definitions.ts` Boşalt: Hardcoded içerikler kaldırılır

Tüm `defaultProps` içindeki kişiye/şirkete özel içerikler boşaltılır. Yalnızca **yapısal** alanlar kalır (ikonlar, link hedefleri, puan formatları):

**Ne kaldırılır:**
- `title`, `description`, `subtitle`, `badge` → `''` (boş string)
- `name`, `bio` → `''`
- `features[i].title`, `features[i].description` → `''`
- `services[i].title`, `services[i].description` → `''`
- `testimonials[i].name`, `testimonials[i].role`, `testimonials[i].content` → `''`
- `ChefShowcase.title`, `ChefShowcase.description` → `''`
- `HeroPortfolio.name`, `HeroPortfolio.title`, `HeroPortfolio.bio` → `''`
- `CTABanner.title`, `CTABanner.description` → `''`
- `infoItems` gibi sektöre özel diziler → `[]`

**Ne kalır (yapısal):**
- `image` alanları → Pixabay placeholder kalabilir (injectImages zaten üstüne yazar)
- `primaryButtonLink: '#menu'` gibi link hedefleri
- `icon` alanları (`'Smile'`, `'☕'` vb.)
- `floatingBadge: '4.9★'` gibi görsel formatlar

### Katman 2 — Mapper'ları Güçlendir: Boş alan kaldığında sectorProfile devreye girsin

`mapHeroSection.ts` zaten bunu yapıyor (profile → override), ama mapper alanları eksik kapsıyor. Tüm mapper dosyaları güncellenir:

**`mapHeroSection.ts`:**
- `infoItems` → sectorProfile'dan doldur (zaten `infoItemsMap` var, çalışıyor)
- `badge` → businessName > sectorBadge > `''`
- `floatingBadgeSubtext` → sektöre göre farklı metin

**`mapServicesSection.ts`:**
- `features[i].description` boşsa sectorProfile'dan doldur
- `CafeFeatures` section'ı da mapper'a ekle (şu an `CafeFeatures` register edilmiş ama `features` array'ini iyi doldurmayabiliyor)

**`mapTeamSection.ts`:**
- `ChefShowcase` için: `name` → `generated_content`'den şef adı > sectorProfile team label
- `description` → about story

**Yeni: `mapTestimonialsSection.ts` içerik dolumu:**
- Testimonial `role` alanları sektöre göre değişsin:
  - `doctor/dentist` → 'Hasta'
  - `lawyer` → 'Müvekkil'
  - `cafe/restaurant` → 'Düzenli Müşteri'
  - `hotel` → 'Misafir'

**Yeni: `mapFaqSection.ts` içerik dolumu:**
- FAQ sorularını sektöre göre belirle (şu an hotel'e özel sorular hardcoded)

### Katman 3 — `applyTemplate` İçinde `injectImages` Çağır

`useEditorState.ts`'deki `applyTemplate` fonksiyonu, `mapContentToTemplate` sonrası `injectImages` ve `injectContactInfo`'yu da çağırmalı. Şu an bu iki fonksiyon sadece `Project.tsx`'de var ve ilk yüklemede çalışıyor.

Çözüm: Bu fonksiyonlar `src/utils/sectionInjectors.ts` adında ayrı bir utility dosyasına taşınır, hem `Project.tsx` hem `useEditorState.ts`'den import edilir.

---

## Değiştirilecek Dosyalar

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/templates/catalog/definitions.ts` | Tüm 6 şablonda hardcoded içerik alanlarını `''` veya `[]` ile boşalt |
| 2 | `src/templates/catalog/mappers/mapHeroSection.ts` | `infoItems`, `badge` alanlarını daha iyi doldur, `CafeFeatures` features dolumu |
| 3 | `src/templates/catalog/mappers/mapServicesSection.ts` | `CafeFeatures` için de `features` array dolumu, boş alan koruması |
| 4 | `src/templates/catalog/mappers/mapTeamSection.ts` | ChefShowcase için isim/açıklama dolumu |
| 5 | `src/templates/catalog/mappers/mapTestimonialsSection.ts` | Sektöre göre `role` alanları |
| 6 | `src/templates/catalog/mappers/mapFaqSection.ts` | Sektöre göre FAQ soruları |
| 7 | `src/utils/sectionInjectors.ts` | `injectImages` + `injectContactInfo` + `buildFooterSection` → buraya taşı |
| 8 | `src/pages/Project.tsx` | `sectionInjectors.ts`'den import et (mevcut lokal fonksiyonları sil) |
| 9 | `src/components/editor/useEditorState.ts` | `applyTemplate` içinde `injectImages`/`injectContactInfo` çağır |

---

## Sonuç: İçerik Akışı (Önce/Sonra)

**Önce:**
```
Template seçildi (specialty-cafe)
  ↓
defaultProps: "Where Every Cup Tells a Story" (hardcoded café içeriği)
  ↓
Mapper: generated_content yoksa → hardcoded kalır
  ↓
Kullanıcı doktor sitesi görüyor ama: "Haight Ashbury", "Chef Ahmet", "Single Origin" yazıyor
```

**Sonra:**
```
Template seçildi (specialty-cafe)
  ↓
defaultProps: title: '', description: '', features: [{title:'', desc:''}, ...]
  ↓
Mapper: generated_content → sectorProfile → '' (boş)
  → Hero: "Sağlığınız İçin Profesyonel Bakım" (doctor sectorProfile)
  → Features: "Genel Muayene", "Laboratuvar" (doctor services)
  → Testimonials role: "Hasta"
  → CTA: "Randevu Al"
  ↓
injectImages: Pixabay'den çekilen gerçek görseller
  ↓
injectContactInfo: business adı, telefon, email
  ↓
Kullanıcı doktor sitesi görüyor ve içerik 100% doktor sektörüne uygun
```
