

## Sorun

Kullanıcının ekran görüntüsünde görüldüğü gibi, "Görsel Değiştir" butonu bazı bileşenlerde görselin **ortasında** tam ekran karanlık bir overlay ile (bg-black/40 + flex items-center justify-center) gösteriliyor. Bu hem görselin renklerini/içeriğini bozuyor hem de UX olarak ağır bir görünüm yaratıyor.

## Hedef

Tüm şablonlarda (14 bileşen) görsel değiştirme butonu:
- **Görselin sağ üst köşesinde** konumlanır — `absolute top-3 right-3`
- **Minimal, şeffaf kart** — küçük ikon + metin, `bg-white/90 backdrop-blur-sm` ile arka plan rengi bozmaz
- **Tam ekran overlay yok** — `absolute inset-0 bg-black/40` gibi karartma efektleri kaldırılır
- **Hover'da belirir** — `opacity-0 group-hover:opacity-100`
- **Tüm bileşenlerde aynı görünüm** — tek bir standart CSS sınıf seti

## Standart Buton Stili (Tek Kalıp)

Tüm bileşenlerde şu CSS sınıf seti kullanılacak:

```tsx
<button
  onClick={() => setPickerOpen(true)}
  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100"
>
  <ImageIcon className="w-3.5 h-3.5" />
  Görseli Değiştir
</button>
```

**Özellikler:**
- `bg-white/90 backdrop-blur-sm` — görselin rengi görünür, beyaz/saydam kart bozmuyor
- `top-3 right-3` — sağ üst köşe, merkez yok
- `text-xs` — küçük ve öz
- `opacity-0 group-hover:opacity-100` — hover'da görünür

## Değiştirilecek Dosyalar (14 adet)

| # | Dosya | Mevcut Durum | Değişiklik |
|---|---|---|---|
| 1 | `AboutSection.tsx` | `top-3 right-3` ✓ ama `bg-black/50` | Stil güncelle |
| 2 | `HeroCafe.tsx` | `top-3 right-3` ✓ ama `bg-black/50` | Stil güncelle |
| 3 | `CafeStory.tsx` | `top-3 right-3` ✓ ama `bg-black/50` | Stil güncelle |
| 4 | `ChefShowcase.tsx` | `top-3 right-3` ✓ ama `bg-black/50` | Stil güncelle |
| 5 | `HeroRestaurant.tsx` | `top-4 right-4` ✓ ama `bg-black/50` | Stil güncelle |
| 6 | `HeroOverlay.tsx` | `top-4 right-4` ✓ `bg-background/90` | Küçük stil düzeltme |
| 7 | `HeroCentered.tsx` | `top-4 right-4` ✓ `bg-background/90` | Küçük stil düzeltme |
| 8 | `HeroMedical.tsx` | **SORUNLU** — tam overlay (`absolute inset-0 bg-foreground/40 flex items-center justify-center`) | Overlay'i kaldır, köşe butonu ekle |
| 9 | `HeroSplit.tsx` | **SORUNLU** — tam overlay (`absolute inset-0 bg-foreground/40 flex items-center justify-center`) | Overlay'i kaldır, köşe butonu ekle |
| 10 | `HeroPortfolio.tsx` | **SORUNLU** — avatar için `absolute inset-0 rounded-full bg-black/50` | Yuvarlak avatar için küçük ikon butonu |
| 11 | `HeroDental.tsx` | `EditableImage` + `ImageActionBox` kullanıyor | Zaten sağ üstte — dokunmaya gerek yok |
| 12 | `BlogSection.tsx` | **SORUNLU** — tam overlay (`absolute inset-0 bg-black/40 flex items-center justify-center`) | Overlay'i kaldır, köşe butonu ekle |
| 13 | `ServicesGrid.tsx` | Görsel değiştirme butonu **hiç yok** | Kart resmi üzerine köşe butonu ekle |
| 14 | `HeroHotel.tsx` | Kontrol gerekiyor | Güncelle |

## Detaylı Değişiklikler

### Grup 1 — Sadece Stil Güncelleme (zaten köşede, sadece renk/boyut değişimi)

`AboutSection.tsx`, `HeroCafe.tsx`, `CafeStory.tsx`, `ChefShowcase.tsx`:

```tsx
// ESKİ — bg-black/50, text-white, border-white/20
className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-medium hover:bg-black/70 transition-all backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100"

// YENİ — bg-white/90, text-gray-800, zarif
className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100"
```

### Grup 2 — Overlay Kaldır, Köşe Buton Ekle

`HeroMedical.tsx`, `HeroSplit.tsx`, `BlogSection.tsx`:

```tsx
// ESKİ — tam ekran overlay + ortada buton
{isEditing && (
  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/90 text-foreground text-sm font-semibold shadow-lg">
      <ImageIcon className="w-4 h-4" />
      Görseli Değiştir
    </div>
  </div>
)}

// YENİ — sadece köşede küçük buton
{isEditing && (
  <button
    onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}
    className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100"
  >
    <ImageIcon className="w-3.5 h-3.5" />
    Görseli Değiştir
  </button>
)}
```

`HeroMedical.tsx` için ek: Tıklama `onClick={() => isEditing && setPickerOpen(true)}` olan div yerine, tıklamayı kaldıracağız — sadece butonla tetiklensin.

### Grup 3 — HeroPortfolio (Avatar)

Avatar yuvarlak olduğu için overlay farklı uygulanıyor. Küçük kare buton avatarın sağ üstüne konumlandırılır:

```tsx
// ESKİ — inset-0 rounded-full bg-black/50 + ortada ikon
className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"

// YENİ — köşede küçük dairesel ikon butonu (avatar için daha uygun)
className="absolute -top-1 -right-1 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-gray-800 hover:bg-white shadow-md border border-white/30 opacity-0 group-hover:opacity-100 transition-all"
```

### Grup 4 — HeroDental

`EditableImage` + `ImageActionBox` kullanıyor. `ImageActionBox` zaten `position="top-right"` ile `top-3 right-3`'e konumlanıyor. Bu bileşen zaten standarda uygun — dokunmaya gerek yok.

## Görsel Fark (Önce / Sonra)

**Önce:**
```
┌────────────────────────────────────┐
│                                    │
│    ████████████████████████████    │  ← Koyu overlay tüm görseli kaplıyor
│    █  📷 Görseli Değiştir      █    │  ← Buton ortada, büyük
│    ████████████████████████████    │
│                                    │
└────────────────────────────────────┘
```

**Sonra:**
```
┌────────────────────────────────────┐
│                      [📷 Değiştir] │  ← Sağ üstte, küçük, beyaz kart
│                                    │
│     (görsel renkleri bozulmaz)     │
│                                    │
└────────────────────────────────────┘
```

