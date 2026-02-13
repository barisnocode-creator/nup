
# Prompt 2: Template Onizleme Akisi

## Ozet

"Onizle" butonuna tiklandiginda, secilen template'in bloklari ve temasi gecici olarak editore yuklenir. Ustte mor gradient banner ile "Uygula" ve "Iptal" butonlari gosterilir. Kullanici "Uygula" derse veritabanina kaydedilir; "Iptal" derse orijinal bloklar ve temaya geri donulur.

## Akis Diyagrami

```text
Galeri Overlay -> "Onizle" tikla
  |
  v
1. Orijinal blok/tema yedeklenir (state)
2. Secilen template icin yeni bloklar olusturulur (convertGeneratedContentToChaiBlocks)
3. Yeni tema preset alinir (getThemeForTemplate)
4. ChaiBuilderEditor'e yeni blocks + theme props gecirilir
5. Galeri kapanir, TemplatePreviewBanner gosterilir
  |
  +-- "Uygula" -> DB'ye kaydet (chai_blocks, chai_theme, template_id) -> banner kaldir
  |
  +-- "Iptal" -> Orijinal blok/tema geri yukle -> banner kaldir
```

## Teknik Detaylar

### Degistirilecek Dosya: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

**Yeni state'ler:**
```typescript
// Template preview state
const [previewBlocks, setPreviewBlocks] = useState<ChaiBlock[] | null>(null);
const [previewTheme, setPreviewTheme] = useState<Partial<ChaiThemeValues> | null>(null);
const [previewTemplateName, setPreviewTemplateName] = useState<string | null>(null);
const [previewTemplateIdState, setPreviewTemplateIdState] = useState<string | null>(null);
const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

// Backup of original blocks/theme before preview
const originalBlocksRef = useRef<ChaiBlock[]>(initialBlocks);
const originalThemeRef = useRef<Partial<ChaiThemeValues> | undefined>(initialTheme);
```

**`handlePreviewTemplate` fonksiyonu:**
1. `getTemplateConfig(templateId)` ile template adini al
2. Projenin mevcut `generated_content`'ini veritabanindan oku (veya mevcut prop'tan al)
3. `convertGeneratedContentToChaiBlocks(content, templateId)` ile yeni bloklar olustur
4. `getThemeForTemplate(templateId)` ile yeni tema al
5. `previewBlocks`, `previewTheme`, `previewTemplateName` state'lerini set et
6. `showTemplateGallery` kapat
7. Eger `generated_content` yoksa, varsayilan bos bloklar olustur

**`handleApplyTemplate` fonksiyonu:**
1. `setIsApplyingTemplate(true)`
2. `saveToSupabase({ blocks: previewBlocks, theme: previewTheme })` ile kaydet
3. Ayrica `template_id` alanini guncelle: `supabase.from('projects').update({ template_id: previewTemplateIdState })`
4. Basarili olursa: `originalBlocksRef.current = previewBlocks`, preview state'lerini temizle
5. `toast.success('Template uygulandı!')`
6. Hata olursa: `toast.error(...)`, preview state'lerini temizleme (kullanici tekrar deneyebilir)

**`handleCancelPreview` fonksiyonu:**
1. Preview state'lerini null'a cek (previewBlocks, previewTheme, previewTemplateName)
2. Orijinal bloklar/tema otomatik olarak ChaiBuilderEditor'e geri gecer (cunku artik previewBlocks null oldugu icin initialBlocks kullanilir)

**ChaiBuilderEditor props degisikligi:**
```typescript
<ChaiBuilderEditor
  blocks={previewBlocks || initialBlocks}
  theme={(previewTheme || initialTheme || defaultTheme) as ChaiThemeValues}
  // ... diger props ayni
/>
```

**TemplatePreviewBanner render:**
```typescript
{previewTemplateName && (
  <TemplatePreviewBanner
    templateName={previewTemplateName}
    onApply={handleApplyTemplate}
    onCancel={handleCancelPreview}
    isApplying={isApplyingTemplate}
  />
)}
```

Banner, editörun ustunde `absolute top-0 left-0 right-0 z-[90]` ile konumlandirilacak (toolbar'in da ustunde).

### Degistirilecek Dosya: `src/components/website-preview/TemplatePreviewBanner.tsx`

**Turkcelestirme:**
- "Previewing:" -> "Onizleniyor:"
- "Cancel" -> "Iptal"
- "Apply Template" -> "Uygula"
- "Applying..." -> "Uygulanıyor..."

### Degistirilecek Dosya: `src/components/chai-builder/TemplateGalleryOverlay.tsx`

Degisiklik yok -- mevcut `onPreview` callback'i zaten dogru calisiyor.

## SDK Uyumlulugu

ChaiBuilderEditor `blocks` prop'unu degistirdigimizde SDK canvas'i yeniden render eder. Bu, React'in standart prop degisikligi davranisidir. SDK belgelerine gore `blocks` bir kontrollü (controlled) prop'tur.

Onemli: Preview sirasinda auto-save DEVRE DISI BIRAKILMAMALI. Bunun yerine, `onSave` callback'i preview modundayken kaydetmeyi engelleyecek sekilde sarmalanmalidir:

```typescript
const handleSave = useCallback(async (data) => {
  // Preview modundayken SDK auto-save'i engelle
  if (previewBlocks) return true; // "basarili" dondur ama kaydetme
  return await saveToSupabase({ blocks: data.blocks, theme: data.theme });
}, [saveToSupabase, previewBlocks]);
```

## Banner Konumlandirma

Banner, editör container'inin icinde `absolute` olarak konumlandirilacak:

```text
+-----------------------------------------------------------------------+
| [Onizleniyor: Wellness Studio]            [Iptal] [Uygula]   z-[90] |
|-----------------------------------------------------------------------|
| [Toolbar]                                                     z-50    |
|-----------------------------------------------------------------------|
|                     Canvas                                            |
+-----------------------------------------------------------------------+
```

## Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `ChaiBuilderWrapper.tsx` | Guncelle | Preview state, handlePreview/Apply/Cancel, banner render, save guard |
| `TemplatePreviewBanner.tsx` | Guncelle | Turkce ceviri |

## Edge Case'ler

- **generated_content yoksa**: Bos blok seti olusturulur (sadece bir hero + CTA). Kullanici bunu gorecek ve template'in layout'unu anlayacak.
- **Ayni template secilirse**: Galeri'de zaten engelleniyor (mevcut template'e tiklanamaz).
- **Preview sirasinda sayfa yenileme**: Preview state kaybolur, orijinal bloklar yuklenir (guvenli).
- **Preview sirasinda baska template preview**: Onceki preview uzerine yazilir (yeni preview baslar).
- **Network hatasi Apply sirasinda**: Toast ile hata gosterilir, preview aktif kalir, kullanici tekrar deneyebilir.
