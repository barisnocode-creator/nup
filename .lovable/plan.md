

## Kalan Isler: Ozel Editor ve SDK Temizligi

Faz 2 (bolum bilesenleri, registry, SectionRenderer) tamamlandi. Simdi kalan fazlar:

### Faz 3: Ozel Editor Bilesenleri

Yeni `src/components/editor/` klasoru altinda:

**useEditorState.ts** - Editor state hook'u
- `sections`, `selectedSectionId`, `theme` state'leri
- `selectSection`, `updateSectionProps`, `updateSectionStyle`, `addSection`, `removeSection`, `moveSectionUp/Down` aksiyonlari
- Undo/redo destegi (basit: onceki state'i tut)

**useSiteSave.ts** - Otomatik kaydetme
- 2 saniye debounce ile `site_sections` ve `site_theme`'i Supabase'e kaydet
- `isSaving` ve `hasUnsavedChanges` flag'leri

**SiteEditor.tsx** - Ana editor bileseni
- `useEditorState` ve `useSiteSave` hook'larini kullanir
- Uc katman: EditorToolbar (ust), EditorCanvas (orta), SectionEditPanel (sag floating)
- Ilk yukleme: Supabase'den `site_sections` ve `site_theme` okur; bos ise `chai_blocks`'dan migration yapar

**EditorToolbar.tsx** - Ust toolbar
- Sol: Dashboard'a don (ok ikonu), proje adi
- Orta: Onizleme/Duzenle toggle
- Sag: Ozelestir butonu, Yayinla butonu, kaydetme durumu gostergesi

**EditorCanvas.tsx** - Ana canvas alani
- `SectionRenderer`'i sarar, her bolume tiklanabilir overlay ekler
- Hover'da: ince mavi border + sag ustte bolum adi etiketi
- Secimde: kalin mavi border + sag ustte aksiyon kutucugu (yukari/asagi/sil)
- Locked bolumlerde sil butonu gizlenir
- Bolumler arasinda "+" butonu -> AddSectionPanel'i acar

**SectionEditPanel.tsx** - Sag floating panel (360px)
- Secili bolum olmadigi zaman gizli
- Icerik sekmesi: bolum tipi bazli dinamik form alanlari (input, textarea, select)
- Stil sekmesi: baslik boyutu, agirlik, renk, arka plan, padding secenekleri
- Gorsel alanlari icin Pixabay butonu
- Animasyonlu acilis (sag -> sol slide)
- "Tamam" butonu ile kapatma

**AddSectionPanel.tsx** - Sol panel (bolum ekleme)
- `sectionCatalog`'dan kategorilere gore gruplu liste
- Tiklandiginda varsayilan props ile yeni section ekler
- Overlay/modal olarak acilir

**CustomizePanel.tsx** - Tema ozellestirme paneli
- Toolbar'daki "Ozelestir" butonundan acilir
- Renkler: primary, background, foreground vb. color picker
- Fontlar: heading + body font secimi
- Koselerin yuvarlaklik seviyesi
- Degisiklikler aninda CSS degiskenlerine yansir

### Faz 4: Project.tsx Yeniden Yapilandirma

- `USE_CHAI_BUILDER` ve `USE_GRAPES_EDITOR` flag'leri kaldirilir
- `ChaiBuilderWrapper` lazy import kaldirilir
- `GrapesEditor` lazy import kaldirilir
- `convertAndSaveChaiBlocks` fonksiyonu -> `convertToSiteSections` olarak yeniden yazilir
- Render: `SiteEditor` bileseni kullanilir
- Mevcut `EditorSidebar`, `CustomizeSidebar` vb. eski sidebar'lar kaldirilir (yeni editorde icsel)
- `PixabayImagePicker` import'u `@/components/chai-builder/` yerine `@/components/editor/` altina tasiniror

### Faz 5: PublicWebsite.tsx Guncelleme

- `import { RenderChaiBlocks } from '@chaibuilder/sdk/render'` kaldirilir
- `import { SectionRenderer } from '@/components/sections/SectionRenderer'` eklenir
- Oncelik: `site_sections` varsa `SectionRenderer` ile render et
- Fallback: `chai_blocks` varsa `SectionRenderer` ile uyumlu formata donustur ve render et
- Son fallback: `generated_content` varsa eski `WebsitePreview` ile render et

### Faz 6: deploy-to-netlify Guncelleme

- Veri okuma: `site_sections` varsa kullan, yoksa `chai_blocks`'a fallback
- `site_sections` icin yeni bir `sectionsToHtml()` fonksiyonu: her section.type'a gore mevcut `renderX()` fonksiyonlarini cagir
- Tema: `site_theme` varsa kullan, yoksa `chai_theme`'e fallback
- Bu sayede hem eski hem yeni projeler sorunsuz yayinlanir

### Faz 7: Template Catalog Guncelleme

`src/templates/catalog/index.ts`:
- `import type { ChaiThemeValues } from '@chaibuilder/sdk'` kaldirilir
- `ChaiThemeValues` yerine basit `Record<string, any>` veya yeni `SiteTheme` tipi kullanilir
- `templateToPreset` import'u `presets.ts`'den alindi; `presets.ts` guncellenir (ChaiBuilder tip referanslari temizlenir)

### Faz 8: Migration Hook

`src/hooks/useMigrateSections.ts`:
- Proje ilk acildiginda `site_sections` bos ise `chai_blocks`'dan donusturucu calistirir
- `chai_blocks._type` -> `site_sections.type` esleme tablosu
- `chai_blocks` icindeki flat prop'lari `section.props` icine toplar
- Theme: `chai_theme` -> `site_theme` basit kopyalama
- Donusum sonrasi Supabase'e kaydet
- Sadece 1 kez calisir (site_sections dolu ise atlar)

### Faz 9: Temizlik

Silinecek dosya/klasorler:
- `src/components/chai-builder/` (tum klasor)
- `src/components/grapes-editor/` (tum klasor)
- `src/styles/chaibuilder.tailwind.css`
- `tailwind.chaibuilder.config.ts`
- `src/components/website-preview/` altindaki eski sidebar dosyalari (EditorSidebar, CustomizeSidebar, HomeEditorSidebar, AddContentSidebar, PageSettingsSidebar vb.)

`package.json`'dan kaldirilacak paketler:
- `@chaibuilder/sdk`
- `grapesjs`
- `grapesjs-blocks-basic`
- `grapesjs-plugin-forms`
- `grapesjs-preset-webpage`

### Uygulama Sirasi

1. Faz 3 -> Editor bilesenleri olustur (en buyuk is parcasi)
2. Faz 8 -> Migration hook yaz
3. Faz 4 -> Project.tsx'i yeniden yaz
4. Faz 5 -> PublicWebsite.tsx'i guncelle
5. Faz 6 -> deploy-to-netlify'i guncelle
6. Faz 7 -> Template catalog temizle
7. Faz 9 -> Eski dosyalari sil, paketleri kaldir

Her faz sonunda test yapilabilir. En kritik nokta: Faz 4 ve 5 tamamlanmadan site bozulabilir, bu yuzden 3-4-5 birlikte uygulanmalidir.

