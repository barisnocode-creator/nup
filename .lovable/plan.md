

## Natural Template - Editorde Tam Calisan Hale Getirme (5 Asamali Plan)

### Mevcut Durum ve Temel Sorunlar

Natural sablonu editorde su anda calismama nedeni: `Project.tsx` satir 1325-1403'te ChaiBuilder editor'u render ediliyor. Ama `handleApplyTemplate` Natural icin `chai_blocks: []` (bos dizi) kaydediyor. Sonra sayfa yenilendiginde `hasBlocks` kontrol ediliyor (satir 1327) ve bos oldugu icin `convertAndSaveChaiBlocks` cagriliyor. Bu fonksiyon (satir 288-350) Natural'a ozel bir sey yapmiyor - jenerik `HeroCentered`, `ServicesGrid`, `AboutSection`, `ContactForm`, `CTABanner` bloklari uretiyor. Yani Natural sablonunun kendi bilesenleri (HeroSection, ArticleCard, NewsletterSection, NaturalHeader/Footer) hic render edilmiyor.

**Iki yol var:**
1. Natural'i ChaiBuilder icinde gostermek (karmasik, SDK'nin iframe'i icinde custom bilesen render etmek gerekiyor)
2. Natural secildiginde ChaiBuilder yerine dogrudan React bilesenini render etmek (basit ve etkili)

2. yol dogru yaklasim cunku Natural, Lawyer, Pilates gibi sablonlar zaten tam React bilesenleri. ChaiBuilder'in jenerik blok sistemi bu sablonlarin ruhunu olduruyor.

---

### Asama 1: Project.tsx - Bilesen Tabanli Sablon Render Ayirimi

**Dosya:** `src/pages/Project.tsx`

**Sorun:** Satir 1325'te `USE_CHAI_BUILDER && isAuthenticated && project` kontrol ediliyor ve TUM sablonlar ChaiBuilder'a yonlendiriliyor. Natural icin bu yanlis.

**Cozum:** ChaiBuilder render blogunun ONCESINE bir kontrol ekle:

```text
if (USE_CHAI_BUILDER && isAuthenticated && project) {
  // YENI: Bilesen tabanli sablonlar icin ChaiBuilder KULLANMA
  if (isComponentTemplate(project.template_id || '')) {
    // NaturalTemplate / LawyerTemplate / PilatesTemplate'i dogrudan render et
    // Toolbar + sidebar'lar korunacak (customize, page settings vb.)
    return (
      <div className="relative min-h-screen">
        <EditorToolbar ... />
        <div className="pt-14">
          <TemplateComponent
            content={project.generated_content}
            colorPreference={colorPreference}
            isEditable={true}
            onFieldEdit={handleFieldEdit}
            ...
          />
        </div>
        {/* Sidebar'lar, modaller aynen korunacak */}
      </div>
    );
  }
  
  // Mevcut ChaiBuilder mantigi aynen devam eder
  const hasBlocks = ...
}
```

Bu degisiklikle Natural sablonu secildiginde ChaiBuilder yerine kendi React bileseni render edilecek. Editor toolbar'i, sidebar'lar, publish modal hepsi korunacak.

---

### Asama 2: Natural Template Icerik Guncelleme

**Sorun:** `defaultDemoContent` (ChaiBuilderWrapper satir 35-45) Natural icin dogru calisiyor ama `TemplateGalleryOverlay`'deki `defaultDemoContent` (satir 17-55) hala Turkce is yeri icerigi kullaniyor. Galeri kartinda Natural hala "Hos Geldiniz" gosteriyor.

**Dosya:** `src/components/chai-builder/TemplateGalleryOverlay.tsx`

**Cozum:** `TemplateCard` bileseninde Natural sablonuna ozel demo content kullan:
- Natural icin `metadata.siteName = 'Perspective'`, `metadata.tagline = "Journey Through Life's Spectrum"`
- `FullLandingPage.tsx`'deki `isGenericContent` fallback mantigi zaten bunu yakalayacak ama galeri karti icin daha temiz bir cozum: Natural'a gonderilen content'e uygun baslik ver

**Dosyalar (icerik duzeltmeleri):**
- `src/templates/natural/sections/HeroSection.tsx` - Mevcut hali dogru, degisiklik yok
- `src/templates/natural/sections/IntroSection.tsx` - Mevcut hali dogru, degisiklik yok
- `src/templates/natural/sections/NewsletterSection.tsx` - Mevcut hali dogru, degisiklik yok
- `src/templates/natural/data/articles.ts` - Mevcut hali dogru, degisiklik yok

---

### Asama 3: CSS Degiskenleri Izolasyonu Guclendir

**Dosya:** `src/templates/natural/styles/natural.css`

**Sorun:** CSS degiskenleri `.natural-template` icinde tanimli ama Tailwind'in `bg-background`, `text-foreground` gibi siniflari `:root` deki degiskenleri kullaniyor olabilir. Dashboard'un turuncu temasi (DashboardLayout'da `:root`'a enjekte edilen `--primary: 24 95% 53%`) Natural'in renklerini ezebilir.

**Cozum:** Natural CSS'de `!important` kullanmak yerine, `NaturalTemplate` bileseninin wrapper div'ine inline style ile CSS degiskenlerini zorla:

```tsx
// src/templates/natural/index.tsx
<div
  ref={wrapperRef}
  className={`natural-template min-h-screen${isDark ? ' dark' : ''}`}
  style={{
    '--background': '36 44% 96%',
    '--foreground': '0 0% 18%',
    '--primary': '0 0% 18%',
    // ... tum degiskenler
  } as React.CSSProperties}
>
```

Bu, CSS spesifiklik sorunlarini tamamen ortadan kaldirir cunku inline style her zaman kazanir.

---

### Asama 4: Editor Toolbar Entegrasyonu

**Dosya:** `src/pages/Project.tsx`

Natural template dogrudan render edildiginde, editor toolbar'in su ozellikleri calismali:
- **Dashboard** butonu: navigate('/dashboard') - mevcut, calisiyor
- **Yayinla** butonu: publishModalOpen - mevcut, calisiyor
- **Ozellestir**: customizeSidebarOpen - renk/font degisiklikleri Natural icin CSS degiskenlerini guncellemeli
- **Sablon Degistir**: changeTemplateModalOpen -> galeri acilir, baska sablon secilebilir

Natural icin ChaiBuilder'a ozel ozellikler (blok ekleme, blok silme, AI asistan) devre disi birakilacak. Bunun yerine basit metin duzenleme (inline contentEditable) aktif kalacak.

Toolbar'daki "Ekle" ve "Sayfalar" butonlari Natural moddayken gizlenecek veya devre disi birakilacak.

---

### Asama 5: Sablon Degistirme Akisi

**Dosya:** `src/pages/Project.tsx` ve `src/components/chai-builder/ChaiBuilderWrapper.tsx`

Natural'dan baska bir sablona gecis yapildiginda:
1. Galeri overlay acilir
2. Yeni sablon secilir (ornegin Pilates)
3. `template_id` DB'de guncellenir
4. Sayfa yenilenir -> yeni sablon render edilir

Baska bir sablondan Natural'a gecis yapildiginda:
1. ChaiBuilder icindeki galeri overlay'dan Natural secilir
2. `handleApplyTemplate` cagirilir -> `template_id = 'natural'`, `chai_blocks = []`
3. Sayfa yenilenir -> `Project.tsx` artik `isComponentTemplate('natural') = true` oldugu icin dogrudan NaturalTemplate render eder

---

### Teknik Detaylar - Duzenlenecek Dosyalar

1. **`src/pages/Project.tsx`** - Bilesen tabanli sablonlar icin ChaiBuilder bypass mantigi, toolbar entegrasyonu
2. **`src/templates/natural/index.tsx`** - Inline CSS degisken enjeksiyonu (izolasyon guclendirme)
3. **`src/components/chai-builder/TemplateGalleryOverlay.tsx`** - Natural icin demo content duzeltmesi
4. **`src/components/chai-builder/ChaiBuilderWrapper.tsx`** - Degisiklik yok, mevcut apply mantigi yeterli

### Beklenen Sonuc

- Natural sablonu editorde tam olarak orijinal haliyle gorunecek (header, hero, intro, makale kartlari, newsletter, footer)
- Animasyonlar calisacak (fade-in, slide-up, scale-in, stagger)
- Dark mode toggle calisacak
- Krem/bej renk paleti korunacak
- Toolbar uzerinden yayinlama ve sablon degistirme calisacak
- Galeri kartinda dogru onizleme gorunecek

