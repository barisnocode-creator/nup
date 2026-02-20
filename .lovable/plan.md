
## Sorun

`ServicesGrid.tsx` satır 50'de hizmet kartı görselleri için `aspect-[4/5]` oranı kullanılmış. Bu dikey bir oran (genişlik < yükseklik) olduğu için görsel çok uzun ve abartılı görünüyor.

## Çözüm

Görseli daha dengeli ve doğal görünecek bir orana çevirmek:

| Seçenek | Oran | Açıklama |
|---|---|---|
| `aspect-[16/9]` | 16:9 | Yatay, sinema/video oranı — çok yatık olur |
| `aspect-[3/2]` | 3:2 | Fotoğraf oranı — dengeli, doğal ✅ |
| `aspect-[4/3]` | 4:3 | Klasik, hafif kare — güvenli seçim ✅ |

En uygun: **`aspect-[3/2]`** — fotoğrafçılıkta standart oran, ne çok yatık ne çok uzun, kart tasarımıyla uyumlu.

## Değişiklik

**`src/components/sections/ServicesGrid.tsx`** — sadece satır 50:

```
Eski: <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-6 relative">
Yeni: <div className="w-full aspect-[3/2] rounded-xl overflow-hidden mb-6 relative">
```

Tek satır değişiklik, başka hiçbir şey etkilenmez.

## Görsel Fark

```text
Eski (4/5):          Yeni (3/2):
┌────────┐           ┌──────────────┐
│        │           │              │
│        │    →      │              │
│        │           └──────────────┘
│        │
└────────┘
```

Kartlar daha uyumlu, doğal ve profesyonel görünecek.
