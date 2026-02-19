

## Dental Template Gorsellerine "Degistir" Ozelligini Ekleme

### Mevcut Durum

Projede `EditableImage` adinda hazir bir bilesen var (`src/components/website-preview/EditableImage.tsx`). Bu bilesen, gorselin uzerine gelindiginde "Stili Degistir" ve "Yeniden Olustur" gibi aksiyonlar gosteren bir action toolbar iceriyor. Ancak bu bilesen sadece eski template sisteminde (`website-preview/`) tanimli — yeni native section'larda (`src/components/sections/`) hic kullanilmiyor.

Dental template'deki section'lardan gorsel iceren tek bilesen **HeroDental** (hero goeseli). `DentalServices` sadece ikon kullanir, `DentalTips` gorsel icermez, `DentalBooking` bir form bilesenidir.

### Yapilacaklar

#### 1. HeroDental'a EditableImage Entegrasyonu

**`src/components/sections/HeroDental.tsx`**

Mevcut duz `<img>` etiketini `EditableImage` ile degistir. `isEditing` true oldugunda hover'da "Gorseli Degistir" aksiyonu gorunecek. Tiklandiginda `onImageChange` callback'i tetiklenecek.

```text
Onceki:
  <img src={image} alt={title} className="..." />

Sonraki:
  isEditing ?
    <EditableImage
      src={image}
      alt={title}
      type="hero"
      imagePath="image"
      className="..."
      isEditable={true}
      onSelect={(data) => onImageChange?.("image", data.currentUrl)}
      actions={[{ id: 'change', icon: Paintbrush, label: 'Görseli Değiştir', onClick: openPixabayPicker, group: 'primary' }]}
    />
  :
    <img src={image} alt={title} className="..." />
```

#### 2. Pixabay Arama Paneli Ekleme (Inline Image Switcher)

HeroDental icerisine basit bir Pixabay arama paneli ekle. Gorsele tiklandiginda acilan, arama yapip sonuclari gosteren kucuk bir floating panel:

- Arama input'u (debounce 500ms)
- `search-pixabay` edge function'a istek
- Sonuclari 3x2 grid'de goster
- Bir gorsele tiklandiginda `onUpdate?.({ image: selectedUrl })` ile prop'u guncelle
- Panel disina tiklandiginda kapanir

#### 3. SectionComponentProps Genisletme (Opsiyonel)

`SectionComponentProps` uzerindeki mevcut `onImageChange` callback'i zaten tanimli. `EditorCanvas` bu callback'i `onUpdate` uzerinden calistirabilir — gorsel URL'si degistiginde section props guncellenir.

#### 4. EditorCanvas ve SectionEditPanel'e Image Prop Destegi

`SectionEditPanel` zaten `image` prop'unu bir Input olarak gosteriyor (labelMap'te var). Ek olarak:
- Image prop'unun yanina kucuk bir "Pixabay'da Ara" butonu ekle
- Bu buton tiklandiginda ayni Pixabay arama panelini ac

### Teknik Detaylar

**Dosya degisiklikleri:**

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/sections/HeroDental.tsx` | `EditableImage` + inline Pixabay picker ekleme |
| `src/components/sections/types.ts` | Degisiklik yok (onImageChange zaten var) |
| `src/components/editor/EditorCanvas.tsx` | Degisiklik yok (onUpdate zaten calisiyor) |

**Pixabay Entegrasyonu:**
- `search-pixabay` edge function zaten mevcut ve calisir durumda
- Arama sonuclari: `largeImageURL` veya `webformatURL` kullanilacak
- Her gorsel icin `tags` bilgisi tooltip olarak gosterilecek

**Kullanici Akisi:**
1. Editorde HeroDental section'indaki gorselin uzerine gel
2. "Gorseli Degistir" butonu belirir (ImageActionBox ile)
3. Tikla -> Pixabay arama paneli acilir
4. Anahtar kelime yaz (ornegin "dental clinic")
5. Sonuclardan birini sec
6. Gorsel aninda degisir (onUpdate ile props guncellenir)
7. Panel kapanir

**Animasyonlar:**
- Panel acilis: `framer-motion` ile `initial={{ opacity: 0, scale: 0.95 }}` -> `animate={{ opacity: 1, scale: 1 }}`
- Gorsel secimi: secilen gorselin etrafinda `ring-2 ring-primary` efekti
- Gorsel degisimi: `crossfade` gecis animasyonu

