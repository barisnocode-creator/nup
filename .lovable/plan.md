

# Toolbar Görünmüyor - Genişlik Eşiği Sorunu

## Sorun

`ChaiBuilderWrapper.tsx` satir 25'te `MIN_EDITOR_WIDTH = 1280` tanımlı. Lovable preview iframe'i bu genişlikten dar olduğu icin `isMobileView` her zaman `true` oluyor ve `MobileEditorLayout` (alt cubuktaki Katmanlar/Ekle/Ozellikler/Stiller) gosteriliyor. Durable tarzi ust toolbar hic gorunmuyor.

## Cozum

### 1. MIN_EDITOR_WIDTH degerini dusur (`ChaiBuilderWrapper.tsx`)

`MIN_EDITOR_WIDTH` degerini `1280`'den `768`'e dusur. Bu sayede Lovable preview penceresinde de desktop toolbar gorunecek.

### 2. Alternatif: Sadece desktop layout kullan

`isMobileView` kontrolunu tamamen kaldirup her zaman `DesktopEditorLayout` kullan. Mobil cihazlarda da ust toolbar calisacak sekilde responsive yapilacak.

**Tercih edilen yaklasim**: `MIN_EDITOR_WIDTH = 768` olarak degistirmek - boylece tablet ve ustu tum ekranlarda ust toolbar gorunur, sadece telefon ekranlarinda mobil layout calisir.

## Teknik Detaylar

**Degistirilecek dosya:**
- `src/components/chai-builder/ChaiBuilderWrapper.tsx` - Satir 25: `const MIN_EDITOR_WIDTH = 1280;` -> `const MIN_EDITOR_WIDTH = 768;`

Bu tek satirlik degisiklik, Lovable preview penceresinde desktop toolbar'in gorunmesini saglayacak.
