

# Floating Edit Paneli - Animasyonlu Gradient Kenarlikli Kart

## Mevcut Durum
Bir blok secildiginde sag tarafta sabit bir "Ozellikler" paneli aciliyor ve canvas arka plani karariyor. Bu gorunum sert ve eski.

## Cozum
Sag sidebar yerine, secilen blogun yakininda (veya sabit konumda sag tarafta) yüzen, dönen gradient kenarlikli modern bir kart paneli olusturulacak.

### 1. Ozel Masaustu Layout Bileseni Olustur
**Yeni dosya: `src/components/chai-builder/DesktopEditorLayout.tsx`**

- ChaiBuilder SDK'nin `layout` prop'u ile ozel bir masaustu layout bileseni kullanilacak
- `ChaiBuilderCanvas`, `ChaiBlockPropsEditor`, `ChaiBlockStyleEditor`, `ChaiOutline`, `ChaiAddBlocksPanel` bilesenlerini kullanan ozel bir duzenleme
- Sag sidebar yerine **floating card** icinde `ChaiBlockPropsEditor` gosterilecek
- Kart, ekranin sag tarafinda sabit konumda yuzecek (absolute/fixed positioning)

### 2. Animasyonlu Gradient Kenarlik CSS
**Dosya: `src/styles/chaibuilder.tailwind.css`**

Uiverse.io orneginden esinlenerek:
- Kart disinda donen gradient `::before` pseudo-elementi
- Ic kisimda koyu arka plan `::after` pseudo-elementi
- `@keyframes rotBGimg` animasyonu ile surekli donen kenarlik efekti
- Gradient renkleri: `rgb(0, 183, 255)` -> `rgb(255, 48, 255)` (mavi-mor)

### 3. Canvas Kararma Efektini Azaltma
**Dosya: `src/styles/chaibuilder.tailwind.css`**

SDK'nin secim sirasinda uygulayabilecegi overlay/backdrop stillerini CSS ile override ederek kararmayi azaltma veya kaldirma.

### 4. ChaiBuilderWrapper Guncelleme
**Dosya: `src/components/chai-builder/ChaiBuilderWrapper.tsx`**

- Masaustunde de ozel layout bilesenini kullan (`layout={DesktopEditorLayout}`)
- Mevcut `isMobileView ? MobileEditorLayout : undefined` yerine her iki durumda da ozel layout

### Teknik Detaylar

**DesktopEditorLayout bileseni yapisi:**
- Sol: Outline + Add Blocks paneli (mevcut SDK sidebar yerine ozel)
- Orta: ChaiBuilderCanvas (tam genislik)
- Sag: Floating card (absolute positioned, z-index yuksek)
  - Iceride: ChaiBlockPropsEditor + ChaiBlockStyleEditor (tab'li)
  - Kart gorunumu: Donen gradient kenarlik animasyonu
  - Icerik alani: Koyu/acik tema uyumlu arka plan
  - Scroll destegi: Icerik uzun oldugunda kaydirma

**CSS animasyonu:**
```text
+---------------------------+
|  ::before (gradient bar)  |  <-- donen gradient
|  +---------------------+  |
|  |                     |  |
|  |  Ozellikler         |  |  <-- ::after (ic arka plan)
|  |  ---------------    |  |
|  |  Baslik: [input]    |  |
|  |  Aciklama: [input]  |  |
|  |  ...                |  |
|  |                     |  |
|  +---------------------+  |
+---------------------------+
```

**Degistirilecek dosyalar:**
1. `src/components/chai-builder/DesktopEditorLayout.tsx` (yeni)
2. `src/styles/chaibuilder.tailwind.css` (CSS animasyonu + overlay azaltma)
3. `src/components/chai-builder/ChaiBuilderWrapper.tsx` (layout prop guncelleme)

