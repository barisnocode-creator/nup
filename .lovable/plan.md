
## Hedef

`CustomizePanel.tsx` içindeki "Hızlı Tema" ve "Renkler" ve "Yazı Tipleri" bölümlerini yeniden tasarlamak:

1. **Hızlı Tema** → Sadece renk değiştirir, fontlara/boyutlara dokunmaz
2. **Renkler** → Renk kodları görünmez; sadece renkli daire paleti + isim; "Rastgele" butonu her basıldığında farklı bir renk paleti uygular
3. **Yazı Tipleri** → 20 adet font, dropdown'da fontun kendi yazı tipiyle önizlenir

---

## Değiştirilecek Dosyalar (2 adet)

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/themes/presets.ts` | 20 font listesi ve renk paletleri ekle |
| 2 | `src/components/editor/CustomizePanel.tsx` | Hızlı tema sadece renk, ColorPicker kodu gizle, Rastgele butonu, 20 font dropdown |

---

## 1. Hızlı Tema — Sadece Renk Değiştirir

Şu anki `applyPreset` fonksiyonu hem renkleri hem fontları hem borderRadius'u değiştiriyor:

```typescript
// Eski — her şeyi değiştiriyor
const applyPreset = (preset) => {
  onUpdateTheme({
    colors: presetColors,
    fonts: preset.fontFamily ? { heading: ..., body: ... } : undefined,
    borderRadius: preset.borderRadius,  // ← bunlar kaldırılacak
  });
};
```

**Yeni — sadece renkler:**
```typescript
const applyPreset = (preset: typeof namedPresets[0]['preset']) => {
  const presetColors: Record<string, string> = {};
  if (preset.colors) {
    Object.entries(preset.colors).forEach(([key, vals]) => {
      presetColors[key] = vals[0]; // sadece light mode değeri
    });
  }
  // Sadece colors güncellenir, fonts ve borderRadius korunur
  onUpdateTheme({ colors: presetColors });
};
```

---

## 2. Renkler — Kodu Gizle, Sadece Palet Göster

Mevcut `ColorPicker` bileşeni `<Input>` ile hex kodunu gösteriyor. Bu tamamen yeniden tasarlanacak:

**Yeni ColorPicker tasarımı:**
```
[●] Ana Renk    ← renkli daire (tıklayınca native color picker açılır)
[●] Arka Plan
[●] Metin
[●] Vurgu
```

HTML: Renk kodu input'u `hidden` olacak, sadece daire gösterilecek. Kullanıcı daireye tıklayınca `<input type="color">` trigger'lanacak.

```tsx
function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      <label className="cursor-pointer group">
        <div
          className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only" // tamamen gizli
        />
      </label>
    </div>
  );
}
```

---

## 3. Rastgele Renk Paleti Butonu

"Renkler" başlığının yanına bir **🎲 Rastgele** butonu eklenir. Her basıldığında `namedPresets` listesinden rastgele bir preset'in renkleri uygulanır (font/boyut değişmez):

```tsx
const applyRandomColors = () => {
  const randomPreset = namedPresets[Math.floor(Math.random() * namedPresets.length)];
  applyPreset(randomPreset.preset); // zaten sadece renk değiştiriyor
};
```

UI:
```
RENKLER                              🎲 Rastgele
─────────────────────────────────────────────────
● Ana Renk                                    [●]
● Arka Plan                                   [●]
● Metin                                       [●]
```

---

## 4. Yazı Tipleri — 20 Font, Kendi Yazı Tipiyle Görünür

Mevcut 10 font → 20 fonta çıkarılır. Her font, dropdown'da o fontta yazılmış olarak görünür (Google Fonts embed linkleri `<head>`'e dinamik eklenir).

**20 Seçilmiş Font Listesi:**

| Kategori | Fontlar |
|---|---|
| Serif (5) | Playfair Display, Lora, Cormorant Garamond, Merriweather, EB Garamond |
| Sans-Serif Modern (7) | Inter, DM Sans, Plus Jakarta Sans, Sora, Space Grotesk, Outfit, Nunito |
| Sans-Serif Klasik (4) | Poppins, Montserrat, Raleway, Open Sans |
| Dekoratif (4) | Josefin Sans, Bebas Neue, Quicksand, Exo 2 |

Bu 20 fontun Google Fonts URL'i bir kez load edilecek — dropdown açılmadan önce font linkler inject edilir.

**Font Dropdown Tasarımı:**

```tsx
const FONTS = [
  // Serif
  { family: 'Playfair Display', category: 'Serif' },
  { family: 'Lora', category: 'Serif' },
  { family: 'Cormorant Garamond', category: 'Serif' },
  { family: 'Merriweather', category: 'Serif' },
  { family: 'EB Garamond', category: 'Serif' },
  // Sans-Serif Modern
  { family: 'Inter', category: 'Modern' },
  { family: 'DM Sans', category: 'Modern' },
  { family: 'Plus Jakarta Sans', category: 'Modern' },
  { family: 'Sora', category: 'Modern' },
  { family: 'Space Grotesk', category: 'Modern' },
  { family: 'Outfit', category: 'Modern' },
  { family: 'Nunito', category: 'Modern' },
  // Klasik
  { family: 'Poppins', category: 'Klasik' },
  { family: 'Montserrat', category: 'Klasik' },
  { family: 'Raleway', category: 'Klasik' },
  { family: 'Open Sans', category: 'Klasik' },
  // Dekoratif
  { family: 'Josefin Sans', category: 'Dekoratif' },
  { family: 'Bebas Neue', category: 'Dekoratif' },
  { family: 'Quicksand', category: 'Dekoratif' },
  { family: 'Exo 2', category: 'Dekoratif' },
];
```

Dropdown her option'da `style={{ fontFamily: family }}` ile kendi fontunda gösterilir. Google Fonts linkleri CustomizePanel yüklenince `useEffect` ile `<head>`'e eklenir.

---

## Sonuç: CustomizePanel'in Yeni Görünümü

```
┌─────────────────────────────┐
│ Özelleştir              [X] │
├─────────────────────────────┤
│ ŞABLON                      │
│ [▦ Template Değiştir]       │
├─────────────────────────────┤
│ EKLENEBİLİR BÖLÜMLER       │
│ [≡ Eklenebilir Bölümler ▾] │
├─────────────────────────────┤
│ HIZLI TEMA (sadece renk)   │
│ [●●●][●●●][●●●][●●●]       │
│  Sıcak  Koyu  Pastel Mavi  │
│ ...                         │
├─────────────────────────────┤
│ RENKLER           [🎲]      │
│ Ana Renk           [●]      │
│ Arka Plan          [●]      │
│ Metin              [●]      │
│ Vurgu              [●]      │
│ Kart               [●]      │
│ İkincil            [●]      │
├─────────────────────────────┤
│ YAZI TİPLERİ               │
│ Başlık: [Playfair Display▾] │
│ Gövde:  [Inter           ▾] │
├─────────────────────────────┤
│ KÖŞELER                    │
│ [Varsayılan             ▾]  │
└─────────────────────────────┘
```

---

## Teknik Notlar

- `applyPreset` → yalnızca `colors` günceller; `fonts` ve `borderRadius` mevcut değerlerini korur
- `ColorPicker` → `<input type="color">` gizli, `<div>` daire tıklanabilir `<label>` sarmalı
- Font linkleri → `loadGoogleFont` utility'si zaten `useThemeColors.ts` içinde mevcut; sadece import edilip 20 font için çağrılır
- Rastgele buton → `Math.random()` ile `namedPresets` array'inden random seçim, sadece renk uygulanır
