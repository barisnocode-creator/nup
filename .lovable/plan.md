
## Natural Template - Editorde Orijinal Haliyle Gorunmesi

### Sorun

`Project.tsx` satirlari 1325-1384'te, **tum projeler** icin `ChaiBuilderWrapper` render ediliyor. Yani `template_id = 'natural'` olan bir proje bile ChaiBuilder editoru icinde jenerik bloklarla (`HeroCentered`, `CTABanner` vb.) gosteriliyor. Natural sablonunun kendi header'i, makale kartlari, newsletter bolumu ve footer'i hic gorunmuyor.

Daha da kotusu: Natural sablonu uygulandiginda `chai_blocks` bos diziye (`[]`) set ediliyor. Sayfa yenilendiginde `convertAndSaveChaiBlocks` fonksiyonu tetikleniyor ve Turkce jenerik bloklar olusturuyor ("Hos Geldiniz", "Hizmetlerimiz" vb.). Sonuc: ekranda Natural degil, jenerik bir site gorunuyor.

### Cozum

`Project.tsx`'de, ChaiBuilder'a girmeden once `template_id`'nin bilesen tabanli (component-based) olup olmadigini kontrol et. Eger oyle ise, `ChaiBuilderWrapper` yerine `WebsitePreview` bilesenini kullan. Bu bilesen zaten `getTemplate(templateId)` ile dogru React bilesenini (NaturalTemplate) render ediyor ve `EditorToolbar` ile editing destegi sagliyor.

### Uygulama Adimlari

**1. Project.tsx - Bilesen Tabanli Sablon Kontrolu**

Satir ~1325'teki `if (USE_CHAI_BUILDER && isAuthenticated && project)` blogunun **oncesine** yeni bir kontrol eklenecek:

```text
if (isComponentTemplate(project.template_id) && isAuthenticated && project.generated_content) {
  -> Legacy editor yolunu kullan (WebsitePreview + EditorToolbar)
  -> ChaiBuilderWrapper'a GIRME
}
```

Bu sayede:
- `template_id = 'natural'` -> Legacy editor (WebsitePreview -> NaturalTemplate) render edilir
- `template_id = 'pilates1'` -> Legacy editor (WebsitePreview -> PilatesTemplate) render edilir  
- `template_id = 'lawyer-firm'` -> Legacy editor (WebsitePreview -> LawyerTemplate) render edilir
- Diger tum template'ler -> ChaiBuilderWrapper (mevcut davranis)

**2. Project.tsx - convertAndSaveChaiBlocks Engellemesi**

Satir ~252'deki otomatik blok donusumunu bilesen tabanli sablonlar icin devre disi birak:

```text
if (projectData.generated_content && 
    (!projectData.chai_blocks || projectData.chai_blocks.length === 0) &&
    !isComponentTemplate(projectData.template_id)) {  // <-- yeni kontrol
  await convertAndSaveChaiBlocks(projectData);
}
```

Boylece Natural sablonu icin gereksiz jenerik blok uretimi engellenir.

**3. Project.tsx - Import Ekleme**

`isComponentTemplate` fonksiyonunu `src/templates/index.ts`'den import et (zaten `getTemplateConfig` import ediliyor, yanina ekle).

---

### Teknik Detaylar

Duzenlenecek dosya: Sadece `src/pages/Project.tsx`

Degisiklik 1 - Import satirina `isComponentTemplate` ekleme (satir 27 civari):
```
import { getTemplateConfig, isComponentTemplate } from '@/templates';
```

Degisiklik 2 - Satir ~1325'ten once bilesen tabanli kontrol:
```
// Component-based templates: render with legacy editor (WebsitePreview)
if (USE_CHAI_BUILDER && isAuthenticated && project && isComponentTemplate(project.template_id || '')) {
  // Render the full legacy editor with EditorToolbar + WebsitePreview
  // This ensures Natural, Lawyer, Pilates templates show their actual React components
  return (
    <div className="relative min-h-screen">
      <EditorToolbar ... />
      <WebsitePreview templateId={project.template_id} ... />
      <EditorSidebar ... />
      ... (mevcut legacy editor kodunun aynisi)
    </div>
  );
}
```

Degisiklik 3 - convertAndSaveChaiBlocks'u bilesen tabanli sablonlar icin atlama (satir ~252):
Mevcut kosula `&& !isComponentTemplate(projectData.template_id || '')` ekleme.

### Sonuc

Bu degisiklikle:
- Natural sablonu editorde kendi orijinal gorunumuyle (header, hero, makaleler, newsletter, footer) render edilecek
- `isEditable=true` sayesinde metin duzenlemesi calisacak
- EditorToolbar ile yayinlama, onizleme vb. islevler korunacak
- ChaiBuilder'a girmeyecegi icin jenerik blok uretimi sorunu ortadan kalkacak
- Diger (katalog tabanli) sablonlar mevcut ChaiBuilder akisini kullanmaya devam edecek
