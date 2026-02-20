
## Switch Kapalı Durum Renk Düzeltmesi

### Sorun

`src/components/ui/switch.tsx` içinde Switch bileşeninin root elementi şu sınıfları taşıyor:

```
data-[state=unchecked]:bg-input
```

`bg-input` bir CSS değişkeni (`var(--input)`) — template teması koyu/siyah olduğunda bu değişken de siyaha dönüşüyor. Switch kapalıyken arka planı siyah görünüyor.

### Çözüm

Switch'in unchecked arka planını sabit bir gri (`bg-gray-200`) ile override etmek:

```
data-[state=unchecked]:bg-input  →  data-[state=unchecked]:bg-gray-200
```

Checked durumu zaten `[&[data-state=checked]]:bg-orange-500` ile CustomizePanel'den override ediliyor, o değişmeyecek.

### Değişecek Dosya

| Dosya | Satır | Değişiklik |
|---|---|---|
| `src/components/ui/switch.tsx` | ~9 | `data-[state=unchecked]:bg-input` → `data-[state=unchecked]:bg-gray-200` |

Tek satır değişikliği, tüm app genelindeki Switch bileşenleri de temiz gri renk alacak.
