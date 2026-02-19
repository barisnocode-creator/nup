

## Pixabay Gorsel Degistirme Kartini Iyilestirme

### Mevcut Durum

Kaydetme sistemi zaten calisiyor. `HeroDental`'daki `onUpdate?.({ image: url })` cagrisi, editor state'ini guncelliyor ve `useSiteSave` hook'u 2 saniyelik debounce ile degisiklikleri otomatik olarak veritabanina kaydediyor. Yani gorsel degistirdiginde kayit zaten yapiliyor.

Asil iyilestirilecek kisim: **PixabayImagePicker** karti daha hareketli, daha buyuk ve daha kolay kapanabilir olmali.

### Yapilacak Degisiklikler

**`src/components/sections/PixabayImagePicker.tsx` — UI/UX Yeniden Tasarim**

Mevcut kucuk absolute panel yerine, tam ekrani kaplayan bir modal/overlay yapisi:

```text
+--------------------------------------------------+
|  [dim backdrop - tikla kapat]                     |
|                                                   |
|   +------------------------------------------+    |
|   |  Gorsel Sec                         [X]  |    |
|   +------------------------------------------+    |
|   |  [🔍 Arama: dental clinic_________ ]     |    |
|   +------------------------------------------+    |
|   |                                          |    |
|   |  [img1] [img2] [img3] [img4]             |    |
|   |  [img5] [img6] [img7] [img8]             |    |
|   |  [img9] [img10] [img11] [img12]          |    |
|   |                                          |    |
|   +------------------------------------------+    |
|   |  Pixabay uzerinden ucretsiz gorseller    |    |
|   +------------------------------------------+    |
+--------------------------------------------------+
```

Yeni ozellikler:
- **Backdrop overlay** — Arkaplan karartmasi, tiklandiginda kapatir
- **Buyuk kapatma butonu** — Sag ustte belirgin X butonu, `hover:rotate-90` animasyonuyla
- **ESC tusu** ile kapatma destegi
- **Gorsel hover animasyonu** — `scale(1.05)` + parlak kenarlik + tag bilgisi overlay olarak gosterilir
- **Gorsel secim animasyonu** — Tiklandiginda `scale(0.95)` bounce + checkmark ikonu gosterilir, 300ms sonra kapanir
- **Staggered grid animasyonu** — Gorseller sirali olarak (50ms aralikla) `fade-in + slide-up` ile belirir
- **Loading animasyonu** — Skeleton placeholder kartlari (pulse animasyonlu)
- **Baslik ve aciklama** — "Gorsel Sec" basligi + "Pixabay'dan ucretsiz yuksek kaliteli gorseller" alt yazisi

### Teknik Detaylar

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/sections/PixabayImagePicker.tsx` | Modal overlay + animasyonlu grid + ESC/backdrop kapatma |

Animasyon detaylari (framer-motion):
- Backdrop: `initial={{ opacity: 0 }}` -> `animate={{ opacity: 1 }}`
- Panel: `initial={{ opacity: 0, scale: 0.9, y: 40 }}` -> `animate={{ opacity: 1, scale: 1, y: 0 }}` (spring)
- Her gorsel karti: `initial={{ opacity: 0, y: 20 }}` -> `animate={{ opacity: 1, y: 0 }}` staggered (`transition={{ delay: index * 0.05 }}`)
- Gorsel hover: `whileHover={{ scale: 1.05 }}` + tag overlay fade-in
- X butonu: `whileHover={{ rotate: 90 }}` gecisi
- Secim: `whileTap={{ scale: 0.95 }}` + kisa checkmark flash

