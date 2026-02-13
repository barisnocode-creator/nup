
# Prompt 1: Tam Ekran Template Galerisi Overlay Bileseni

## Ozet

"Template Degistir" butonuna basildiginda, URL degismeden tam ekrani kaplayan bir overlay acilir. Mevcut template "Kullanilan" badge'i ile isaretlenir. Diger templateler yatay kayarak goruntulenebilir. Sag ustten X ile kapatilir. Bu asamada sadece gorsel galeri ve UI olusturulur -- Preview ve Apply akislari Prompt 2'de eklenecek.

## Goruntulenecek Ekran

```text
+-----------------------------------------------------------------------+
| [X]  Template Degistir                                     sag ust    |
|-----------------------------------------------------------------------|
|                                                                       |
|  Kullanilan                                                           |
|  +------------+    +------------+    +------------+    +-------       |
|  |            |    |            |    |            |    |              |
|  |  (mevcut)  |    |  Template  |    |  Template  |    |  Temp...    |
|  |            |    |    2       |    |    3       |    |             |
|  |  Onizle    |    |  Onizle    |    |  Onizle    |    |             |
|  |            |    |            |    |            |    |             |
|  |            |    |            |    |            |    |             |
|  +------------+    +------------+    +------------+    +-------       |
|  Modern Prof.      Bold Agency      Elegant Min.                      |
|  Professional      Creative         Minimal                           |
|                                                                       |
+-----------------------------------------------------------------------+
```

- Kartlar dikey uzun (aspect ratio 3:5 -- siteyi daha genis gosterir)
- Yatay kaydirma (horizontal scroll) ile templateler arasinda gecis
- Scroll icin mouse wheel, trackpad ve touch destegi
- Her kartin altinda template adi ve kategorisi

## Teknik Detaylar

### Yeni Dosya: `src/components/chai-builder/TemplateGalleryOverlay.tsx`

```typescript
interface TemplateGalleryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onPreview: (templateId: string) => void; // Prompt 2'de kullanilacak
}
```

**Ozellikler:**
- Tam ekran overlay: `fixed inset-0 z-[80] bg-white`
- Sag ust kose: X kapatma butonu
- Sol ust kose: "Template Degistir" basligi
- Ortada: Yatay kaydirmali template kartlari
- Her kart: ~280px genislik, 3:5 oran, template preview gorseli
- Mevcut template: Sol ust kosede `Kullanilan` badge'i (yesil, Check ikonu)
- Diger templateler: Hover'da `Onizle` butonu belirir (yari saydam overlay)
- Giris animasyonu: Soldan saga kayarak acilma (x: -100% -> 0, 300ms)
- Cikis animasyonu: Saga kayarak kapanma (x: 0 -> 100%, 250ms)
- Escape tusu ile kapanma
- `getAllTemplates()` fonksiyonundan template listesi alinir

**Kart hover davranisi:**
- Mevcut template: Hover'da efekt yok, sadece `Kullanilan` badge'i gorunur
- Diger templateler: Hover'da koyu overlay + `Onizle` butonu (Eye ikonu)
- `Onizle` butonuna tiklandiginda `onPreview(templateId)` cagirilir (Prompt 2'de baglanti yapilacak, simdilik sadece console.log)

### Degistirilecek Dosya: `src/components/chai-builder/EditorContext.tsx`

- `onChangeTemplate` callback'inin tipi `() => void` olarak kaliyor
- Degisiklik yok -- mevcut callback yeterli

### Degistirilecek Dosya: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

- `onChangeTemplate` callback'i artik `TemplateGalleryOverlay`'i acacak
- `useState` ile `showTemplateGallery` state'i eklenir
- `TemplateGalleryOverlay` bilesenini JSX'e ekle
- `currentTemplateId`'yi proje veritabanindan (veya `initialBlocks` meta'sindan) al

Projenin hangi template'i kullandigini belirlemek icin:
- Veritabanindan `template_id` alani kontrol edilecek
- Yoksa varsayilan `temp1` kullanilacak

### Degistirilecek Dosya: `src/components/chai-builder/DesktopEditorLayout.tsx`

- Degisiklik yok -- `CustomizePanel` icindeki "Template Degistir" butonu mevcut `onChangeTemplate` callback'ini zaten cagiriyor

### Kullanilmayacak Dosya: `src/components/website-preview/ChangeTemplateModal.tsx`

- Bu dosya mevcut haliyle kalacak, silinmeyecek (baska yerlerde referans olabilir)
- Yeni overlay bunun yerini almayacak, cunku farkli bir akis (ChaiBuilder editoru icinde)

## Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `src/components/chai-builder/TemplateGalleryOverlay.tsx` | Yeni | Tam ekran overlay + yatay kaydirma + kartlar |
| `src/components/chai-builder/ChaiBuilderWrapper.tsx` | Guncelle | State ekleme + overlay render + callback baglama |

## Animasyon Detaylari

- Overlay acilis: `framer-motion` ile `x: '-100%' -> '0%'`, duration 300ms, ease `[0.32, 0.72, 0, 1]` (Durable benzeri yumusak egrisi)
- Overlay kapanis: `x: '0%' -> '100%'`, duration 250ms
- Kart hover: `scale 1 -> 1.02`, `shadow-md -> shadow-xl`, duration 200ms
- Badge: sabit, animasyonsuz

## Erisebilirlik (A11y)

- Overlay: `role="dialog" aria-modal="true" aria-label="Template galerisi"`
- X butonu: `aria-label="Kapat"`
- Kartlar: `role="button" aria-label="[Template adi] template'i"`
- Mevcut template karti: `aria-current="true"`
- Escape tusu ile kapatma
- Acildiginda X butonuna focus

## Performans

- `getAllTemplates()` zaten senkron, cache gereksiz
- Template gorselleri `loading="lazy"` ile yuklenecek
- Overlay sadece `isOpen=true` oldugunda DOM'a eklenir (AnimatePresence)
