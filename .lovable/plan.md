

## Template Onizlemede Dinamik Icerik Eslestirme

Kullanicinin isleri/projeleri icin template secerken, her template'in onceden tanimli "placeholder" icerikler yerine kullanicinin kendi is bilgileriyle (isim, sloganlar, hizmetler, iletisim vb.) otomatik olarak dolmus halini gormesini saglayacagiz.

### Mevcut Durum

- `ChangeTemplateModal` sadece **statik preview gorseli** gosteriyor
- `applyTemplate` (useEditorState) template uygularken sadece birkaç temel alanı (title, subtitle, description, phone, email) eski section'lardan tasıyor
- Kullanicinin `generated_content` ve `form_data` verileri Project sayfasinda mevcut ama template onizlemeye aktarilmiyor

### Cozum Yaklasimi

Uc katmanli bir mimari:

1. **Icerik Eslestirme Yardimci Fonksiyonu** — `mapContentToTemplate(templateDef, projectData)` 
2. **applyTemplate Gelistirmesi** — Mevcut eslestirme mantigi derinlestirilecek
3. **Modal Canli Onizleme** — Secilen template, kullanici verisiyle render edilecek

### Detayli Teknik Plan

#### 1. Yeni Dosya: `src/templates/catalog/contentMapper.ts`

Bu fonksiyon, bir template tanimi (TemplateDefinition) ve proje verisi (generated_content, form_data) alarak template'in defaultProps'larini kullanicinin verisiyle akilli sekilde degistirir:

- **Hero section'lari**: Proje adi, slogan, aciklama → title, subtitle, description
- **Hizmet/Menu/Oda section'lari**: generated_content.pages.services.servicesList → template'in ilgili listelerine
- **Iletisim section'lari**: generated_content.pages.contact.info → phone, email, address
- **Testimonial section'lari**: Orijinal template verisini korur (kullanicinin boyle verisi genelde yok)
- **CTA/Banner section'lari**: Proje adini ve sektorunu kullanarak uyarlar
- **Chef/Team section'lari**: about.team bilgisini kullanir

Esleme kurallari:
- Eger kullanici verisinde karsilik yoksa, template'in kendi default'unu korur (template bozulmaz)
- Sadece metin alanlari eslenir, gorseller template default'larinda kalir
- Sektorle uyumsuz alanlar zorlanmaz (orn. restoran template'indeki menu kartlari, doktor icin degistirilmez — sadece basliklar eslenir)

#### 2. Guncelleme: `src/components/editor/useEditorState.ts` → `applyTemplate`

Mevcut `applyTemplate` fonksiyonu genisletilecek:
- Yeni bir opsiyonel parametre: `projectData?: { generatedContent, formData }`
- Eger projectData verilmisse, `contentMapper` kullanarak section prop'larini kullanici verisiyle doldurur
- Verilmemisse mevcut davranisi korur (geriye uyumluluk)

#### 3. Guncelleme: `src/components/website-preview/ChangeTemplateModal.tsx`

- `projectData` prop'u eklenecek (Project.tsx'den gelecek)
- "Onizle" butonuna tiklaninca, template'in section'larini `contentMapper` ile doldurup `SectionRenderer` ile canli render yapilacak
- Modal icerisinde bir "onizleme modu" state'i: statik gorsel yerine canli React render gosterilecek
- Performans icin: sadece secilen/onizlenen template canli render edilecek, diger kartlar statik gorsel kalacak

#### 4. Guncelleme: `src/pages/Project.tsx` ve `src/components/editor/SiteEditor.tsx`

- `SiteEditor`'a `projectData` prop'u eklenir (generated_content + form_data)
- `SiteEditor` bu veriyi `ChangeTemplateModal`'a ve `applyTemplate` cagrisina aktarir

### Esleme Mantigi Ornegi

```text
Kullanici Verisi (generated_content)     →    Template Section Props
─────────────────────────────────────    →    ──────────────────────
pages.home.hero.title                    →    HeroRestaurant.title / HeroHotel.title / HeroPortfolio.name
pages.home.hero.description              →    Hero*.description
pages.services.servicesList[0..N]        →    CafeFeatures.features / DentalServices.services
pages.contact.info.phone                 →    ContactForm.phone
pages.contact.info.email                 →    ContactForm.email
pages.contact.info.address               →    ContactForm.address
pages.about.story.title                  →    AboutSection.title / CafeStory.title
pages.about.story.content                →    AboutSection.description / CafeStory.description
metadata.siteName                        →    Hero title fallback, CTA icerikleri
form_data.businessName                   →    Hero badge, site adi
```

### Dosya Degisiklikleri Ozeti

| Dosya | Islem |
|-------|-------|
| `src/templates/catalog/contentMapper.ts` | **Yeni** — Icerik esleme fonksiyonu |
| `src/components/editor/useEditorState.ts` | **Guncelleme** — applyTemplate'e projectData destegi |
| `src/components/website-preview/ChangeTemplateModal.tsx` | **Guncelleme** — Canli onizleme modu + projectData prop |
| `src/components/editor/SiteEditor.tsx` | **Guncelleme** — projectData prop'u aktarimi |
| `src/pages/Project.tsx` | **Guncelleme** — generated_content ve form_data'yi SiteEditor'a aktarma |

### Guvenlik Onlemleri (Template Bozulmaz)

- Esleme sadece `defaultProps` uzerine `Object.assign` / spread ile yapilir; template yapisi (section tipleri, siralama) degismez
- Bos veya undefined degerler atlanir — template'in kendi default'u korunur
- Her section tipi icin ayri esleme kurallari tanimlanir, bilinmeyen section tipleri dokunulmaz birakılır
- Canli onizleme, ana editoru etkilemez — ayri bir state'de calisir

