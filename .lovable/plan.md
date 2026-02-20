
## Yapılacaklar

### Sorun 1: SectionEditPanel'de Görsel URL'si Görünüyor
`SectionEditPanel.tsx` içindeki `ContentFields` fonksiyonunda, görsel alanları (`image`, `backgroundImage`) için şu an hem thumbnail + hem de URL input kutusu gösteriliyor. Kullanıcı URL'yi görüyor — bu gereksiz ve çirkin.

**Çözüm:** Görsel alanlarında URL input'unu kaldır. Yerine:
- Geniş, tıklanabilir görsel kartı (thumbnail)
- Üzerinde hover ile beliren "Görseli Değiştir" overlay butonu
- Görsel yoksa büyük noktalı çerçeve + "Görsel Ekle" alanı
- Pixabay butonu ayrı değil, görselin üstündeki overlay'den tetikleniyor

```
Mevcut:
┌──────────────────────────────────┐
│  [küçük thumbnail]               │
│  [https://pixabay.com/...  ] [🖼] │  ← URL kutusu görünüyor
└──────────────────────────────────┘

Yeni:
┌──────────────────────────────────┐
│                                  │
│    [Geniş Görsel Thumbnail]      │  ← Tıkla = Pixabay açılır
│    hover → "Görseli Değiştir"    │
│                                  │
└──────────────────────────────────┘
```

### Sorun 2: SectionEditPanel Genel UI — Modernleştirme

Mevcut panel görünümü çok "form-like" ve düz. Kullanıcı screenshot'ında Özelleştir panelinin modern accordion/kart yapısını beğenmiş.

**SectionEditPanel İçerik Sekmesi İyileştirmeleri:**
- Alan grupları arasında hafif separator/divider
- Label'lar daha kompakt: `text-[11px]` + `font-medium` + `text-gray-400`
- Input'lar: daha düz, `h-8` yükseklik, soft border
- Görsel alanları: büyük tıklanabilir kart (yukarıda açıklandı)
- "Tamam" butonu: şu an mavi — marka rengine (orange-500) çevir

**SectionEditPanel Stil Sekmesi İyileştirmeleri:**
- Mevcut stil kontrolleri (başlık boyutu, hizalama, renk) aynı kalır
- Görsel düzeni: 2 kolonlu grid (boyut + hizalama yan yana)
- Renk seçiciler daha kompakt

### Değiştirilecek Dosya

**`src/components/editor/SectionEditPanel.tsx`** — sadece şu kısımlar:

1. **`ContentFields` fonksiyonu içinde görsel alanı render (satır 257-285)**:
   - `isImage` koşulunda: URL Input kaldırılır
   - Yerine: `aspect-video` tıklanabilir kart, hover overlay, Pixabay tetikleyici

2. **"Tamam" butonu (satır 77)**:
   - `bg-blue-600 hover:bg-blue-700` → `bg-orange-500 hover:bg-orange-600`

3. **Label stilleri (satır 259)**:
   - Hafif güncelleme: daha hafif renk ve boyut

### Değiştirilecek Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/components/editor/SectionEditPanel.tsx` | Görsel alanı UI yenile, URL input kaldır, Tamam butonu marka rengi |

### Sonuç

Kullanıcı editörde bir hero bölümünü tıkladığında:
- Görsel alanında sadece büyük thumbnail görecek
- URL kirliği olmayacak
- Tıklayınca Pixabay açılacak
- Panel genel görünümü daha modern, marka rengiyle uyumlu olacak
