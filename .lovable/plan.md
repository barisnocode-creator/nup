

# Template Galerisi Sadeleştirme ve Görsel Önizleme

## Ozet

Template registry'den pilates1 haricindeki tum template'ler kaldirilacak. Galeri overlay'inde template kartina tiklandiginda, template'in gercek React bilesenlerinin render edilmis bir goruntusu (canli onizleme) gosterilecek.

## Adim 1: Template Registry Sadeleştirme

### `src/templates/index.ts`

- temp1 ~ temp9, gith1, gith2, gith3 tum kayitlar kaldirilacak
- Sadece `pilates1` kalacak
- Kullanilmayan import'lar (showcase goerselleri, template bilesenleri) temizlenecek
- `DEFAULT_TEMPLATE_ID` -> `'pilates1'` olacak
- `getTemplate()` fallback'i `pilates1` olacak
- `selectTemplate()` her zaman `'pilates1'` donecek

**Registry sonrasi hali (tek kayit):**
```
pilates1 -> PilatesTemplate (preview: template-pilates.jpg)
```

### `src/components/chai-builder/themes/presets.ts`

- `templateToPreset` mapping'ine `pilates1` eklenmeli (simdiki haliyle eksik)
- Pilates icin uygun preset tanimlanacak (warm tonlar, Playfair Display + DM Sans)

### `supabase/functions/generate-website/index.ts`

- `selectTemplate()` fonksiyonu `'pilates1'` donecek sekilde guncellenecek

## Adim 2: Galeri Overlay'inde Canli Template Onizlemesi

### `src/components/chai-builder/TemplateGalleryOverlay.tsx`

Su an kartlar sadece statik `preview` gorselini gosteriyor. Bunu gelistirmek icin:

1. **Kart icine canli render**: Template'in React bilesenini kucuk bir iframe/scale-down container icinde render et
2. **Yaklasim**: `iframe` yerine CSS `transform: scale()` ile kucultulmus bir container kullanilacak
   - Template bilesenini ~1200px genislikte render et
   - `transform: scale(0.23)` ile kartin icine sigdir (280px / 1200px)
   - `pointer-events: none` ile etkilesimi engelle
   - `overflow: hidden` ile tasmalari gizle

```text
+------- 280px kart --------+
| +---- 1200px scaled ----+ |
| |                        | |
| |  [Template tam render] | |  <- scale(0.23), pointer-events:none
| |                        | |
| |                        | |
| +------------------------+ |
+----------------------------+
Template Adi
Kategori
```

3. **Dummy content**: Template'e verilecek icerik, projenin `generated_content`'inden alinacak. Eger yoksa, varsayilan Turkce demo icerik olusturulacak.
4. **Fallback**: Render basarisiz olursa statik `preview` gorseli gosterilecek (ErrorBoundary ile)

### Teknik uygulama detaylari:

- `TemplateGalleryOverlay` icinde `generated_content`'i prop olarak alacak (ChaiBuilderWrapper'dan)
- Her kart icin template bilesenini `React.lazy` + `Suspense` ile yukleyecek
- Container: `width: 1200px, height: 2000px` -> `transform: scale(0.23) translateOrigin: top left`
- Kart boyutu 280px genislik, 3:5 oran korunacak

### `src/components/chai-builder/ChaiBuilderWrapper.tsx`

- `TemplateGalleryOverlay`'e `generatedContent` prop'u gecilecek (DB'den okunan `generated_content`)
- Mevcut preview akisi (Prompt 2'de eklenen) aynen korunacak

## Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `src/templates/index.ts` | Guncelle | Sadece pilates1 kalacak, diger kayitlar ve import'lar kaldirilacak |
| `src/components/chai-builder/themes/presets.ts` | Guncelle | pilates1 preset ekleme, templateToPreset guncelleme |
| `src/components/chai-builder/TemplateGalleryOverlay.tsx` | Guncelle | Canli template render, scale-down container |
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | Guncelle | generatedContent prop gecisi |
| `supabase/functions/generate-website/index.ts` | Guncelle | selectTemplate -> 'pilates1' |

## Dikkat Edilecekler

- `WebsitePreview.tsx` hala `getTemplate()` kullaniyor -- fallback pilates1 olacagi icin calismaya devam edecek
- `ChangeTemplateModal.tsx` (legacy) dokunulmayacak, zaten kullanilmiyor
- Mevcut projelerde `template_id` olarak temp1 vb. kayitli olabilir -- `getTemplate()` fallback'i ile pilates1'e yonlendirilecek
- Template dosyalari (src/templates/temp1, temp2, vb.) su an silinmeyecek (diger referanslar olabilir), sadece registry'den cikarilacak

