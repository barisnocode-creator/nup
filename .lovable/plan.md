

## DentalBooking: Editorde Calisir Hale Getirme + Premium Saat Secimi UI

### Sorun 1: Editorde Calismasi

`DentalBooking` ve `AppointmentBooking` bilesenlerinde `isEditing` modunda statik demo goruntusu gosteriliyor. Bunun nedeni `window.__PROJECT_ID__` ve `window.__SUPABASE_URL__` degiskenlerinin sadece `PublicWebsite.tsx` icerisinde ayarlanmasi. `Project.tsx` (editor sayfasi) bu degiskenleri set etmiyor, dolayisiyla editordeki randevu bilesenleri backend'e ulasamiyor.

**Cozum:** `src/pages/Project.tsx` icerisinde proje verisi yuklendiginde `window.__PROJECT_ID__` ve `window.__SUPABASE_URL__` set edilecek. Ayrica `DentalBooking` icerisindeki `isEditing` kontrolu kaldirilacak — editorde de gercek backend akisi calisacak.

### Sorun 2: Saat Secimi UI Yenileme

Mevcut saat secimi basit bir grid/liste gorunumunde. Daha premium bir Calendly/Cal.com tarzinda yeniden tasarlanacak:

- **Sabah/Ogle/Aksam gruplama** — Saatler "Sabah", "Ogle", "Aksam" kategorilerine ayrilacak, her kategori kendi basligina sahip
- **Pill-style slot butonlari** — Yuvarlak koseli, hover'da gradient kenarlk, secimde dolgu + glowing shadow
- **Slot suresi gostergesi** — Her slotun altinda kucuk "30 dk" etiketi yerine, secilen slotun zaman araligini gosteren bir mini-bar
- **Secim animasyonu** — Tiklandiginda `layoutId` ile morphing gecis (framer-motion shared layout)
- **Bos durum iyilestirmesi** — "Musait saat yok" yerine ikonlu, aciklamali bir empty state

### Yapilacak Degisiklikler

#### 1. `src/pages/Project.tsx`

Proje verisi yuklendiginde window degiskenlerini set et:

```text
useEffect icinde, project.id ayarlandiginda:
  (window as any).__PROJECT_ID__ = project.id;
  (window as any).__SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL;

Cleanup'ta:
  delete (window as any).__PROJECT_ID__;
  delete (window as any).__SUPABASE_URL__;
```

#### 2. `src/components/sections/DentalBooking.tsx`

**isEditing kontrolu degisikligi:**
- `isEditing` true oldugunda da gercek backend akisi calisacak (artik `__PROJECT_ID__` mevcut)
- Sadece `isEditing` modunda form submit edildiginde gercekten randevu olusturmak yerine bir "demo" toast gosterilecek (kullanicinin test verisi olusturmasini onlemek icin)

**Saat secimi UI yeniden tasarimi:**

Step 1 (Time Selection) tamamen yeniden yazilacak:

```text
+------------------------------------------+
|  Musait Saatler  |  19 Ocak Pazar         |
+------------------------------------------+
|                                          |
|  SABAH                                   |
|  [09:00] [09:30] [10:00] [10:30] [11:00] |
|                                          |
|  OGLE                                    |
|  [13:00] [13:30] [14:00] [14:30]         |
|                                          |
|  AKSAM                                   |
|  [17:00] [17:30] [18:00]                 |
|                                          |
|  Secilen: 09:30 - 10:00 (30 dk)          |
+------------------------------------------+
```

Tasarim ozellikleri:
- Slot'lar sabah (06-12), ogle (12-17), aksam (17+) olarak gruplanir
- Her grup basliginin solunda ikon: Sunrise, Sun, Sunset (lucide-react)
- Slot butonlari `rounded-full` pill gorunumde
- Secilmemis: `border border-border bg-background hover:border-primary/60 hover:shadow-sm`
- Secili: `bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]` (glow efekti)
- Hover: `scale-[1.03]` spring animasyonu
- Secim gecisi: `framer-motion layoutId="selected-slot"` ile morphing
- Secilen slotun altinda ozet satiri: tarih + saat araligi gosterilir
- Bos grup gizlenir (ornegin aksam slotu yoksa "Aksam" basligi gorunmez)
- Bos state: `CalendarX2` ikonu + "Bu tarihte musait saat bulunmuyor" + "Baska bir gun secmeyi deneyin" alt metni

### Teknik Detaylar

**Dosya degisiklikleri:**

| Dosya | Degisiklik |
|-------|-----------|
| `src/pages/Project.tsx` | `window.__PROJECT_ID__` ve `__SUPABASE_URL__` set etme (useEffect + cleanup) |
| `src/components/sections/DentalBooking.tsx` | isEditing engelini kaldirma + saat secimi UI tamamen yeniden tasarim (sabah/ogle/aksam gruplama, pill butonlar, glow efekt, empty state) |

**Animasyon detaylari:**
- Grup basliklar: `whileInView={{ opacity: 1, y: 0 }}` fade-in
- Slot butonlar: `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}`
- Secim gecisi: `layout` prop ile smooth morph
- Ozet satiri: `AnimatePresence` ile giris/cikis

