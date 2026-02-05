
# ChaiBuilder Logo Kaldırma Planı

## Sorun
ChaiBuilder SDK editörüne girildiğinde, ekran küçük olduğunda gösterilen "Screen too small" mesajında ve muhtemelen diğer yerlerde ChaiBuilder logosu görünüyor. Bu logo `alt="Chai Builder"` attribute'una sahip bir img elementi.

## Çözüm
CSS ile bu logoyu gizleyeceğiz. `src/styles/chaibuilder.tailwind.css` dosyasına özel CSS kuralları ekleyeceğiz.

## Teknik Detaylar

### Değiştirilecek Dosya
`src/styles/chaibuilder.tailwind.css`

### Eklenecek CSS Kuralları

```css
/* ChaiBuilder branding/logo gizleme */
img[alt="Chai Builder"] {
  display: none !important;
}

/* Alternatif: belirli URL'yi hedefleme */
img[src*="ucarecdn.com/fbfc3b05-cb73-4e99-92a2-3a367b7c36cd"] {
  display: none !important;
}
```

### Etkilenecek Elementler
1. "Screen too small" ekranındaki logo (en yaygın)
2. SDK içinde olabilecek diğer ChaiBuilder logoları

## Uygulama Adımları

1. `src/styles/chaibuilder.tailwind.css` dosyasını aç
2. Mevcut Tailwind direktiflerinin altına CSS kurallarını ekle
3. Logoyu gizlemek için `display: none !important` kullan

## Dosya Değişikliği

| Dosya | Değişiklik |
|-------|-----------|
| `src/styles/chaibuilder.tailwind.css` | Logo gizleme CSS kuralları ekleme |

## Not
ChaiBuilder SDK açık kaynaklı (BSD-3-Clause lisansı) olduğu için logoyu gizlemek lisans ihlali oluşturmaz. Ancak üretim ortamında kullanırken kaynak belirtmek iyi bir uygulama olabilir.
