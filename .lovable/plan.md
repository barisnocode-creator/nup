
## Hedef

`SectionEditPanel` şu an sağ kenara yapışık, tam ekran yüksekliğinde bir panel olarak açılıyor. Kullanıcı bunu, `CustomizePanel` gibi küçük, yüzen, rounded bir kart yapısına dönüştürmek istiyor.

## Mevcut vs Yeni Konum

Mevcut (SectionEditPanel):
```
fixed top-14 right-0 bottom-0 w-[360px]
→ Sağ kenara yapışık, full-height sidebar
```

Yeni (CustomizePanel tarzı):
```
fixed top-16 right-3 w-[310px] max-h-[calc(100vh-80px)]
→ Sağ üste yüzen küçük kart, scroll edilebilir, rounded-xl
```

## Görsel Karşılaştırma

```text
Mevcut:                          Yeni:
┌──────────────┐                     ╭──────────────╮
│ Hero (Ortala)│                     │Hero (Ortala) │
│──────────────│                     │──────────────│
│ İçerik │ Stil│                     │ İçerik │ Stil│
│              │                     │              │
│  [alanlar]   │                     │  [alanlar]   │
│              │          →          │  (scroll)    │
│              │                     │              │
│              │                     ╰──────────────╯
│              │
│  [Tamam]     │
└──────────────┘
```

## Teknik Değişiklik

Sadece `SectionEditPanel.tsx` içindeki `motion.div` className güncellenir:

**Eski (satır 50):**
```
"fixed top-14 right-0 bottom-0 w-[360px] bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-700 shadow-lg z-40 flex flex-col overflow-hidden"
```

**Yeni:**
```
"fixed top-16 right-3 w-[310px] max-h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg z-[60] overflow-hidden flex flex-col"
```

Değişen noktalar:
- `right-0 bottom-0` → `right-3` (kenarda yüzer, alta uzamaz)
- `w-[360px]` → `w-[310px]` (biraz daha kompakt)
- `border-l` → `border` (her yanda border, kart gibi)
- `top-14` → `top-16` (CustomizePanel ile aynı hizalama)
- `rounded-xl` eklendi (yuvarlatılmış köşeler)
- `max-h-[calc(100vh-80px)]` eklendi (ekrandan taşmaz)
- `z-40` → `z-[60]` (CustomizePanel ile aynı z-index seviyesi)

Ayrıca animasyon da güncellenir — mevcut `x: 20` (soldan kayma) yerine `CustomizePanel` ile aynı: `y: -4, scale: 0.97` (hafif yukarıdan drop-in efekti).

## Değiştirilecek Dosya

| Dosya | İşlem |
|---|---|
| `src/components/editor/SectionEditPanel.tsx` | Sadece `motion.div` wrapper className ve animasyon güncellenir (satır 47-51) |

Başka hiçbir şey değişmez — içerik, sekmeler, alanlar, Tamam butonu hepsi aynı kalır.
