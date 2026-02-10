

# Durable Tarzi Editor - Floating Kart ve Section Hover Sistemi

## Temel Sorun

Floating edit karti "absolute" pozisyonlama kullaniyor ama ust container'da `relative` sinifi yok. Bu yuzden kart dogru konumda gorunmuyor ve buyuk bir sidebar gibi davranıyor.

## Cozum Plani

### 1. DesktopEditorLayout.tsx - Tam Yeniden Yapilandirma

Durable benzeri bir editor deneyimi olusturulacak:

**Layout Duzeltmesi:**
- Ana container'a `relative` sinifi ekle (floating kart icin referans noktasi)
- Floating kart gercekten canvas ustunde yuzecek sekilde konumlandirilacak
- Sag tarafta sabit sidebar OLMAYACAK - sadece kucuk yüzen kart

**Section Hover Sistemi (Durable tarzi):**
- Sectionlara hover'da ince mavi outline gosterilecek
- Secilen section'da kalin mavi kenarlik + kose isaretleri
- Hover'da sag ust kosede floating action box (tasi, duzenle, kopyala, sil ikonlari)
- Action box fade-in/fade-out animasyonlu
- Tek seferde sadece bir section secilebilir
- Bos alana tiklandiginda secim temizlenir

**Floating Edit Kart:**
- Canvas'in sag ust kösesinde yuzecek (absolute, right-4, top-16)
- Uiverse.io tarzi donen gradient kenarlik
- Kompakt boyut: max-width 280px, max-height 420px
- Blok secildiginde otomatik acilir
- Bos alana tiklandiginda kapanir

### 2. CSS Guncellemeleri (chaibuilder.tailwind.css)

**Section hover efektleri:**
- `.section-hover-outline`: Ince mavi outline (2px solid, yarim seffaf)
- `.section-selected-outline`: Kalin mavi outline (3px solid) + kose isaretleri
- `.section-action-box`: Floating action box stilleri (fade-in animasyon)

**Floating kart CSS duzeltmesi:**
- Mevcut gradient animasyonu korunacak
- Kartin gercekten yuzecegi garanti edilecek

### 3. ChaiBuilderWrapper.tsx - Minimal Degisiklik

- Mevcut `layout` prop'u zaten `DesktopEditorLayout`'u kullaniyor, degisiklik gerekmez

## Teknik Detaylar

**DesktopEditorLayout yapisi:**

```text
+--------------------------------------------------+
| [<-] [Undo/Redo]          [Screen] [Settings]    |
+----+---------------------------------------------+
| L  |                                         [F] |
| a  |   Canvas (Website Preview)              [l] |
| y  |                                         [o] |
| e  |   +--Section--+                         [a] |
| r  |   | Hover:    |  <- mavi outline        [t] |
| s  |   | [actions] |  <- sag ust action box  [i] |
|    |   +----------+                          [n] |
| +  |                                         [g] |
|    |                                             |
+----+---------------------------------------------+

[F] = Floating Edit Card (280x420 max, gradient border)
     +--gradient-border--+
     | Ozellikler|Stiller|
     | -----------       |
     | Baslik: [___]     |
     | Aciklama: [___]   |
     +-------------------+
```

**Section hover davranisi:**
- Mouse hover -> gecici UI (outline + action box)
- Click -> kalici UI (selected outline)
- Baska yere tikla -> secim kalkar

**Degistirilecek dosyalar:**
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - Ana container'a `relative`, floating kart duzeltmesi
2. `src/styles/chaibuilder.tailwind.css` - Section hover/selection stilleri, action box animasyonlari
