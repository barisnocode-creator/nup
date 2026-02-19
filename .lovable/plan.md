

## Template Preview Sistemi Refactoring

Mevcut `contentMapper.ts` ve `ChangeTemplateModal` zaten calisiyor ancak kod kalitesi, guvenlik ve bakim kolayligi icin asagidaki degisiklikler yapilacak.

### Degisiklik Ozeti

| Dosya | Islem |
|-------|-------|
| `src/templates/catalog/mappers/utils.ts` | **Yeni** — `safeGet` helper |
| `src/templates/catalog/mappers/mapHeroSection.ts` | **Yeni** — Hero esleme |
| `src/templates/catalog/mappers/mapServicesSection.ts` | **Yeni** — Servis esleme |
| `src/templates/catalog/mappers/mapContactSection.ts` | **Yeni** — Iletisim esleme |
| `src/templates/catalog/mappers/mapAboutSection.ts` | **Yeni** — Hakkinda esleme |
| `src/templates/catalog/mappers/mapCtaSection.ts` | **Yeni** — CTA esleme |
| `src/templates/catalog/mappers/mapTeamSection.ts` | **Yeni** — Takim esleme |
| `src/templates/catalog/mappers/index.ts` | **Yeni** — Orchestrator |
| `src/templates/catalog/contentMapper.ts` | **Guncelleme** — Yeni mapper sistemini kullanacak sekilde yeniden yazilacak |
| `src/components/editor/useEditorState.ts` | **Guncelleme** — `applyTemplate` icerisinde projectData yoksa esleme atlanacak |
| `src/components/website-preview/ChangeTemplateModal.ts` | **Guncelleme** — Onizleme banner'i eklenecek |
| `src/pages/Project.tsx` | **Guncelleme** — `sector` alani projectData'ya eklenecek |

### Detayli Plan

#### 1. `src/templates/catalog/mappers/utils.ts`

Tum mapper'larda kullanilacak `safeGet` helper fonksiyonu:

```text
safeGet(obj, 'generated_content.pages.home.hero.title', '')
```

- Nokta ile ayrilmis yolu izleyerek guvenli erisim saglar
- Herhangi bir adim `null` veya `undefined` ise fallback doner
- Bos string de fallback olarak degerlendirilir

#### 2. Her Mapper Dosyasi

Her dosya su yapiyi takip eder:
- `compatibleSectors` array'i export eder (bos array = tum sektorlerle uyumlu)
- Tek bir fonksiyon export eder: `mapXxxSection(sectionProps, projectData) => Record<string, any>`
- `safeGet` kullanarak veri erisimi yapar
- Overrides objesi olusturur, sadece dolu degerler eklenir
- `{ ...sectionProps, ...overrides }` ile birlestirir, asla mutasyon yapmaz

Mapper listesi ve sektor uyumlulugu:

| Mapper | Eslenen Section Tipleri | compatibleSectors |
|--------|------------------------|-------------------|
| mapHeroSection | Hero*, HeroCafe, HeroDental, HeroRestaurant, HeroHotel, HeroPortfolio | `[]` (hepsi) |
| mapServicesSection | CafeFeatures, DentalServices, ServicesGrid | `[]` (hepsi) |
| mapContactSection | ContactForm | `[]` (hepsi) |
| mapAboutSection | AboutSection, CafeStory | `[]` (hepsi) |
| mapCtaSection | CTABanner | `[]` (hepsi) |
| mapTeamSection | ChefShowcase | `['restaurant','cafe','food']` |

#### 3. Orchestrator (`mappers/index.ts`)

- Section tipine gore dogru mapper'i secer
- Sektor uyumluluk kontrolu yapar: `compatibleSectors` bos degilse ve projectData.sector uyusmuyorsa, esleme atlanir
- Bilinmeyen section tipleri dokunulmadan doner
- `mapContentToTemplate(sections, projectData)` imzasi korunur

#### 4. `contentMapper.ts` Guncelleme

Mevcut tek dosya yerine yeni mapper sistemine delege eder. Eski `ProjectData` interface'i korunur ancak `sector` alani eklenir. Geriye uyumluluk saglanir — `generatedContent` ve `formData` isimleri ayni kalir.

#### 5. `useEditorState.ts` Guncelleme

`applyTemplate` icinde:
- `projectData?.generatedContent || projectData?.formData` kontrolu eklenir
- Sadece icerik varsa `mapContentToTemplate` cagirilir
- Yoksa template'in kendi default'lari kullanilir (mevcut davranis korunur)

#### 6. `ChangeTemplateModal.tsx` Guncelleme

- Onizleme modunda ust kisma bilgi banner'i eklenir:
  "Metin icerikleri isletme verilerinizi gostermektedir. Gorseller sablon varsayilanlarini kullanir."

#### 7. `Project.tsx` Guncelleme

projectData'ya `sector` alani eklenir:
```text
projectData={{
  generatedContent: project.generated_content,
  formData: project.form_data,
  sector: project.form_data?.businessType ?? project.form_data?.sector ?? ''
}}
```

SiteEditor props interface'ine de `sector` eklenir.

### Uygulama Sirasi

1. `mappers/utils.ts` olustur
2. 6 mapper dosyasini olustur
3. `mappers/index.ts` orchestrator olustur
4. `contentMapper.ts` guncelle (yeni mapper'lari kullansin)
5. `useEditorState.ts` guncelle
6. `ChangeTemplateModal.tsx` banner ekle
7. `Project.tsx` ve `SiteEditor.tsx` sector aktarimi

### Korunan Davranislar

- Template kartlari statik gorsel gostermeye devam eder
- Sadece "Onizle" tiklaninca canli render yapilir (mevcut davranis zaten boyle)
- `applyTemplate()` projectData olmadan cagrildiginda mevcut davranis korunur
- Section bilesenlerine ve template tanimlarina dokunulmaz
- Modal acma/kapama mantigi degismez

