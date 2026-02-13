

# Randevu Formu: Loading Skeleton ve Musait Olmayan Gunler

## Ozet

Randevu formuna iki iyilestirme eklenecek:
1. Tarih secildiginde slot'lar yuklenirken animasyonlu skeleton gosterilecek
2. Musait olmayan gunler (tatil, kapali gunler) tarih seridinde gri ve tiklanamaz gorunecek

## Degisiklik 1: Loading Skeleton

Tarih secildikten sonra saat slotlari yuklenirken su an hicbir gorsel geri bildirim yok. Skeleton eklenecek:

- 3 sutunlu grid icinde 6 adet pill seklinde skeleton kutu
- `animate-pulse` animasyonu ile nabiz efekti
- Skeleton yuksekligi gercek slot butonlariyla ayni (py-2.5, rounded-full)
- `fetchSlots` fonksiyonunda `loading` state'i zaten var ama kullanilmiyor - saat secimi alaninda kullanilacak

## Degisiklik 2: Musait Olmayan Gunleri Gri Gosterme

Su an tarih seridi 28 gunu gosteriyor ama hangi gunlerin musait oldugunu bilmiyor. Cozum:

- Yeni bir state: `unavailableDates: Set<string>` - musait olmayan tarihleri tutar
- Goruntulenen hafta degistiginde (weekOffset degisince veya ilk yuklenmede), o haftanin 7 gunu icin toplu olarak `/book-appointment?project_id=...&date=...` cagrilari yapilacak
- Slot sayisi 0 olan veya hata donen gunler `unavailableDates` set'ine eklenecek
- `DateStrip` bileseninde `unavailableDates` prop'u alinacak
- Musait olmayan gunler:
  - `opacity-40 cursor-not-allowed` ile soluk gorunecek
  - Ustune kucuk bir cizgi (line-through) efekti
  - `onClick` devre disi
  - `pointer-events-none` ile tiklanamaz

### Performans Notu

- 7 paralel istek yerine `Promise.allSettled` ile toplu gonderim
- Sonuclar cache'lenecek: `checkedWeeks: Set<number>` ile ayni hafta tekrar sorgulanmayacak
- Sadece goruntulenen hafta kontrol edilecek (lazy loading)

## Dosya Degisiklikleri

| Dosya | Islem |
|-------|-------|
| `src/components/chai-builder/blocks/appointment/AppointmentBooking.tsx` | Skeleton eklenmesi, DateStrip'e unavailable prop'u, haftalik musaitlik kontrolu |

## Teknik Detaylar

### Yeni State'ler

```text
const [slotsLoading, setSlotsLoading] = useState(false);          // slot fetch sirasinda skeleton gostermek icin
const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
const [checkedWeeks, setCheckedWeeks] = useState<Set<number>>(new Set());
```

### Skeleton Komponenti (inline)

Saat secim alaninda `slotsLoading` true iken gosterilecek:
- 6 adet `div` ile `animate-pulse bg-muted rounded-full h-10` seklinde
- 3 sutunlu grid icinde

### DateStrip Degisiklikleri

- Yeni prop: `unavailableDates: Set<string>`
- Her tarih butonu icin: eger `unavailableDates.has(d)` ise:
  - `opacity-40 pointer-events-none` sinifi
  - Gun numarasinin ustune hafif cizgi (line-through)
  - `disabled` attribute

### Haftalik Musaitlik Kontrolu

- `useEffect` icinde `weekOffset` degistiginde tetiklenir
- O haftanin 7 gunu icin `Promise.allSettled` ile paralel fetch
- Her gun icin dondurulen `slots` dizisi bos ise o gun unavailable olarak isaretlenir
- Sonuclar `unavailableDates` state'ine merge edilir
- `checkedWeeks` set'ine hafta eklenir (tekrar sorgulanmaz)

### fetchSlots Guncelleme

```text
Mevcut:
  setAvailableSlots([]);
  ... fetch ...

Yeni:
  setSlotsLoading(true);
  setAvailableSlots([]);
  ... fetch ...
  setSlotsLoading(false);
```

