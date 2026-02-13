

# Ozelestir (Customize) Slide-Out Panel - Chai Builder Editoru Icin

## Mevcut Durum

Suanki "Ozelestir" butonu (ust toolbar'da) sadece sag paneldeki "Stiller" sekmesini aciyor (ChaiBlockStyleEditor). Ayrica projede zaten bir `CustomizeSidebar` komponenti var (`src/components/website-preview/CustomizeSidebar.tsx`) ama bu sadece eski website-preview akisinda kullaniliyor, Chai Builder editorune entegre degil.

## Hedef

"Ozelestir" butonuna basildiginda sol taraftan kayan, Durable.co tarzinda modern bir panel acilacak. Bu panel asagidaki menu ogelerini icerecek:

- Change Template
- Colors
- Fonts
- Background Image
- Buttons
- Corners
- Animations
- Browser icon
- Manage widgets
- Regenerate text
- Regenerate entire website
- Keywords

Alt paneller (Colors, Fonts vb.) secildiginde ayni panel icinde derinlesme (drill-down) yapilacak.

## Dosya Degisiklikleri

### 1. CREATE: `src/components/chai-builder/CustomizePanel.tsx`

Yeni bir Chai Builder'a ozel Customize paneli. Mevcut `CustomizeSidebar`'dan ilham alinacak ancak:

- Radix Sheet yerine `framer-motion` ile animasyonlu bir `motion.div` kullanilacak (mevcut left panel pattern'i ile ayni)
- Genislik: 392px (istenen 360-420px araliginda)
- Padding: 16px dikey, 20px yatay
- Her menu ogesi: 24px ikon + 16px medium label + chevron, 48px yukseklik
- Grup boluculeri: 1px ince cizgi
- Arka plan: `bg-background/95 backdrop-blur-xl` + `shadow-xl`
- Alt paneller (Colors, Fonts, Corners, Animations) icerde ayni panel icerisinde gosterilecek (ArrowLeft ile geri donus)
- Color presets, font seciciler, corner seciciler vb. mevcut `CustomizeSidebar`'daki iceriklerle ayni

Icerik ozellikleri:
- Renk preset'leri (Ocean, Forest, Sunset, Royal, Midnight) + custom color picker
- Font secici (Inter, Poppins, Playfair Display, Roboto, Open Sans vb.)
- Corners: Sharp / Rounded / Pill secenekleri
- Animations: Toggle switch
- Regenerate Text / Regenerate Entire Website butonlari (spinner destegi)

### 2. MODIFY: `src/components/chai-builder/DesktopEditorLayout.tsx`

- `LeftPanel` tipine `'customize'` eklenmesi: `type LeftPanel = 'outline' | 'add' | 'customize' | null;`
- "Ozelestir" butonunun artik `setLeftPanel('customize')` yapacak sekilde guncellenmesi (eskiden sag paneli aciyordu)
- Left panel `AnimatePresence` blogu icinde `leftPanel === 'customize'` kontrolu eklenmesi
- Customize paneli icin genislik 392px olarak ayarlanmasi (diger paneller 260px)
- `CustomizePanel` komponentinin import ve render edilmesi

### 3. MODIFY: `src/components/chai-builder/EditorContext.tsx`

- `EditorContextValue` arayuzune asagidaki prop'lar eklenmesi:
  - `onRegenerateText?: () => void`
  - `onRegenerateWebsite?: () => void`
  - `onChangeTemplate?: () => void`
  - `projectProfession?: string`

### 4. MODIFY: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

- `editorContextValue` icine yeni callback'lerin eklenmesi (regenerate, change template)
- `projectProfession` bilgisinin context'e aktarilmasi

### 5. MODIFY: `src/components/chai-builder/MobileEditorLayout.tsx`

- Mobil alt navigasyona "Ozelestir" sekmesi eklenmesi (Paintbrush ikonu)
- Mobil icin `CustomizePanel` iceriginin Sheet icinde gosterilmesi

## Teknik Detaylar

### Panel Animasyonu

Mevcut left panel pattern'i kullanilacak (spring animasyon):

```text
initial: { width: 0, opacity: 0 }
animate: { width: 392, opacity: 1 }
exit:    { width: 0, opacity: 0 }
transition: { type: 'spring', stiffness: 400, damping: 30 }
```

### Alt Panel Gecisi

Panel icinde drill-down yapildiginda `AnimatePresence` ile icerik degisimi:

```text
Ana Menu --> [Colors secildi] --> Color alt paneli (slide-right efekti)
Color alt paneli --> [Geri ok] --> Ana Menu (slide-left efekti)
```

### Erisilebilirlik

- Tum butonlarda `aria-label` ve `title`
- Focus trap: Panel acikken Tab ile gezinme panel icinde kalacak
- Escape tusu ile panel kapanacak
- Renk secicilerde kontrast bilgisi

### Responsive Davranis

| Ekran | Davranis |
|-------|----------|
| Desktop (>1024px) | Sol taraftan 392px genislikte panel, canvas daraltilir |
| Tablet (768-1024px) | Sol taraftan 320px genislikte panel |
| Mobil (<768px) | Bottom Sheet seklinde tam genislik |

