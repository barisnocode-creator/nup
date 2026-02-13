

# Gorsel Hover Aksiyon Sistemi ve Kompakt Ozelestir Paneli

## Sorun

Mevcut CustomizePanel 392px genisliginde buyuk bir sol sidebar olarak aciliyor. Kullanici bunu istemiyor -- daha kompakt, Durable.co tarzinda bir yaklasim isteniyor. Ayrica gorsel uzerinde hover'da sadece "Gorsel Degistir" butonu var, oysa istenen: Restyle, Regenerate Images, Move Up/Down ve More Options (Edit Section, Duplicate, Delete) aksiyonlarini iceren zengin bir overlay.

## Plan

### 1. MODIFY: `src/components/chai-builder/CustomizePanel.tsx` --> Kompakt Popover

Mevcut 392px sidebar yerine, toolbar butonunun altinda acilan kompakt bir dropdown/popover'a donusturmek:

- Genislik: 280px (sidebar degil, floating popover)
- Toolbar butonuna tiklandiginda asagiya dogru acilan bir panel
- Ayni menu ogeleri kalacak ama daha kompakt (40px yukseklik, 14px ikon)
- Alt paneller (Renkler, Fontlar vb.) ayni popover icinde drill-down olarak acilacak
- Popover disina tiklandiginda otomatik kapanacak

### 2. MODIFY: `src/components/chai-builder/DesktopEditorLayout.tsx`

- `leftPanel === 'customize'` durumunu kaldirmak
- Yerine, "Ozelestir" butonuna tiklandiginda CustomizePanel'i toolbar'in hemen altinda floating olarak gostermek
- Canvas alanini daraltmadan, overlay/popover seklinde acilacak

### 3. MODIFY: `src/components/chai-builder/blocks/shared/EditableChaiImage.tsx` --> Zengin Hover Overlay

Mevcut tek butonlu overlay yerine, Durable tarzinda coklu aksiyon overlay'i:

Kontroller (soldan saga):
- **Gorsel Degistir** (metin butonu) -- mevcut `handleChangeImage` islevini kullanir
- **Yeniden Olustur** (metin butonu) -- InlineImageSwitcher'i acar
- **Yukari Tasi** (ikon butonu, ChevronUp)
- **Asagi Tasi** (ikon butonu, ChevronDown)
- **Diger** (uc nokta ikonu) --> acilir menu:
  - Bolumu Duzenle
  - Cogalt
  - Sil (kirmizi, tehlike stili)

Onemli: Radix UI kullanilmayacak (Chai Builder iframe sorunu). Tum dropdown/tooltip'ler saf HTML/Tailwind ile yapilacak.

Hover davranisi:
- 120ms debounce ile gosterilecek
- Fade + translateY animasyonu (160ms ease-out)
- Overlay uzerindeyken gorunur kalacak (mouseleave 200ms buffer)

### 4. CREATE: `src/components/chai-builder/blocks/shared/ChaiImageActionOverlay.tsx`

Radix-free, portal-free aksiyon overlay komponenti:

```text
+--------------------------------------------------+
| Gorsel Degistir | Yeniden Olustur | ^ | v | ... |
+--------------------------------------------------+
```

- Tum butonlar saf `<button>` elementleri
- Dropdown (Diger) saf HTML ile: bir state toggle'i ile gosterilen/gizlenen `<div>`
- Tooltip yerine `title` attribute kullanilacak
- z-index: 30 (gorsel ustunde, modal altinda)
- Disable durumu: `opacity-40 pointer-events-none`

### 5. MODIFY: `src/components/chai-builder/blocks/shared/EditableChaiImage.tsx`

- Yeni `ChaiImageActionOverlay` komponentini import edip kullanmak
- `EditableChaiBackground` icin de ayni overlay'i uygulamak
- Overlay'e gecirilen aksiyonlar:
  - `onChangeImage`: mevcut `handleChangeImage`
  - `onRegenerate`: InlineImageSwitcher'i tetikler
  - `onMoveUp / onMoveDown`: CustomEvent ile parent bloga sinyal gonderir
  - `onEditSection / onDuplicate / onDelete`: CustomEvent ile editor'e sinyal gonderir

### 6. MODIFY: `src/components/chai-builder/ChaiBuilderWrapper.tsx`

- Yeni CustomEvent dinleyicileri eklemek:
  - `chai-move-block-up` / `chai-move-block-down`
  - `chai-edit-section` / `chai-duplicate-block` / `chai-delete-block`
- Bu event'ler Chai Builder SDK API'si uzerinden ilgili blogu manipule edecek

### 7. MODIFY: `src/components/chai-builder/MobileEditorLayout.tsx`

- Customize panel'in mobilde de popover/bottom-sheet formatinda kalmasini saglamak

## Teknik Detaylar

### Overlay Animasyon Zamanlari

| Ozellik | Deger |
|---------|-------|
| Hover debounce | 120ms |
| Fade-in suresi | 160ms ease-out |
| Fade-out gecikmesi | 100ms |
| Mouse buffer (overlay uzerinde) | 200ms |
| Buton hover scale | 1.04 |
| Dropdown acilma | 140ms |

### Dropdown (Diger) Implementasyonu

Radix DropdownMenu yerine saf HTML:

```text
const [showMore, setShowMore] = useState(false);

<div className="relative">
  <button onClick={() => setShowMore(!showMore)}>
    <MoreVertical />
  </button>
  {showMore && (
    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border min-w-[160px]">
      <button>Bolumu Duzenle</button>
      <button>Cogalt</button>
      <hr />
      <button className="text-red-600">Sil</button>
    </div>
  )}
</div>
```

### Dosya Degisiklikleri Ozeti

| Dosya | Degisiklik |
|-------|-----------|
| `CustomizePanel.tsx` | 392px sidebar --> 280px floating popover |
| `DesktopEditorLayout.tsx` | Left panel 'customize' state'i kaldirilip popover entegrasyonu |
| `ChaiImageActionOverlay.tsx` | YENI -- Radix-free coklu aksiyon overlay |
| `EditableChaiImage.tsx` | Tek buton yerine ChaiImageActionOverlay kullanimi |
| `ChaiBuilderWrapper.tsx` | Yeni CustomEvent dinleyicileri (move, edit, duplicate, delete) |
| `MobileEditorLayout.tsx` | Customize popover uyumu |

