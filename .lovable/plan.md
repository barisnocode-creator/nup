

# Template Test Sonuclari — Kalan Sorunlar ve Duzeltmeler

## Tespit Edilen Sorunlar

### 1. HeroMedical.tsx — Hala hardcoded fallback var (Satir 211)
`statCardValue || '4.9/5'` ifadesi, `statCardValue` bos oldugunda sabit '4.9/5' gosteriyor. Bu deger mapper'dan gelecegi icin fallback kaldirilmali.

**Dosya:** `src/components/sections/HeroMedical.tsx`
**Duzeltme:** `{statCardValue || '4.9/5'}` yerine `{statCardValue}` kullanilacak. Zaten satir 199'da `(statCardValue || statCardLabel)` kontrolu oldugu icin card bos ise gorunmeyecek.

---

### 2. HeroMedical.tsx — Badge span bos olsa bile render ediliyor (Satir 73-78)
`badge` degeri bos string oldugunda, yesil noktali bos badge span'i gorunuyor. Diger hero'larda oldugu gibi `{badge && (...)}` kontrolu eklenmeli.

**Dosya:** `src/components/sections/HeroMedical.tsx`
**Duzeltme:** Satir 73-78'deki badge blogu `{badge && (...)}` ile sarilacak.

---

### 3. EditorCanvas.tsx — Footer'a props gecirilmiyor (Satir 124-131)
Header'a `projectName` gecilmesi duzeltildi ama footer'a hala `props: {}` gonderiliyor. Footer'da site adi "Site Adi" placeholder olarak gorunuyor.

**Dosya:** `src/components/editor/EditorCanvas.tsx`
**Duzeltme:** Footer section'a da `props: { siteName: projectName || '' }` gecirilecek.

---

### 4. StatisticsCounter.tsx — stats[] dizi formatini desteklemiyor
Hotel ve Engineer template'leri definitions'ta `stats: [{ value, label }]` dizisi kullaniyor ama bilesenin kendisi sadece `stat1Value/stat1Label` formatini okuyor. Mapper her iki formata da yaziyor ama bilesen diziyi render edemez.

**Dosya:** `src/components/sections/StatisticsCounter.tsx`
**Duzeltme:** Bilesen, hem `stats[]` dizisi hem de `stat1Value` formatini okuyacak sekilde guncellenmeli. Once `props.stats` dizisine bak, yoksa `stat1Value`'dan oku.

---

### 5. HeroHotel.tsx — isHotelMode mantigi bozuk (Satir 17)
```typescript
const isHotelMode = buttonText && (!p.buttonText || p.buttonText === 'Oda Ara' || p.buttonText === '');
```
Bu mantik yanlis: `buttonText` degiskeni zaten `p.buttonText || ''` ile atanmis; sonra `!p.buttonText` kontrol ediliyor ki bu zaten `buttonText` bos oldugunda tetiklenir. Ayrica `p.buttonText === ''` durumunda isHotelMode true oluyor ama `buttonText &&` kontrolu ile basliyor ki bos string'de false doner. Net sonuc: isHotelMode neredeyse hic true olamaz.

**Dosya:** `src/components/sections/HeroHotel.tsx`
**Duzeltme:** Sektore gore karar verilecek: `const isHotelMode = ['hotel', 'resort', 'accommodation'].some(s => sector.includes(s));`

---

### 6. DentalBooking.tsx — Hardcoded fallback'ler (Satir 268-272)
Hala sabit Turkce metinler mevcut:
- `'Online Randevu'`
- `'Hemen Baslayin'`
- `'Birkac adimda kolayca randevunuzu olusturun.'`
- `'Randevunuz Alindi!'`
- `'Randevu Olustur'`

**Dosya:** `src/components/sections/DentalBooking.tsx`
**Duzeltme:** Bu fallback'ler `''` ile degistirilmeli, icerik mapper veya sectorProfile'dan gelmeli.

---

### 7. SiteFooter.tsx — Hardcoded aciklama metni (Satir 66)
```
"Profesyonel hizmetlerimizle yaninizdayiz. Kaliteli ve guvenilir cozumler sunmak icin calisiyoruz."
```
Bu metin tum sektorler icin ayni gorunuyor.

**Dosya:** `src/components/sections/addable/SiteFooter.tsx`
**Duzeltme:** `p.description || ''` prop'undan okunmali, sectorProfile'dan doldurulmali.

---

## Degistirilecek Dosyalar

| Dosya | Sorun | Oncelik |
|---|---|---|
| `src/components/sections/HeroMedical.tsx` | statCardValue hardcoded fallback + badge bos render | Yuksek |
| `src/components/editor/EditorCanvas.tsx` | Footer'a siteName gecirilmiyor | Yuksek |
| `src/components/sections/StatisticsCounter.tsx` | stats[] dizi formati desteklenmiyor | Yuksek |
| `src/components/sections/HeroHotel.tsx` | isHotelMode mantik hatasi | Orta |
| `src/components/sections/DentalBooking.tsx` | Hardcoded Turkce fallback'ler | Orta |
| `src/components/sections/addable/SiteFooter.tsx` | Hardcoded aciklama metni | Dusuk |

---

## Yapilacaklar (Sirasiyla)

### Adim 1: HeroMedical duzeltmeleri
- Satir 211: `statCardValue || '4.9/5'` → `statCardValue`
- Satir 73-78: Badge blogu `{badge && (...)}` ile sarilacak

### Adim 2: EditorCanvas footer
- Satir 124-131: Footer props'a `siteName: projectName || ''` eklenecek

### Adim 3: StatisticsCounter dual-format
- `props.stats` dizisi varsa onu kullan, yoksa `stat1Value` formatina bak
- Her iki format da `.filter(s => s.value && s.label)` ile boslar filtrelenmeli

### Adim 4: HeroHotel isHotelMode
- Sektore dayali mantik: `const isHotelMode = sector && ['hotel', 'resort', 'accommodation', 'motel', 'hostel'].some(s => sector.includes(s));`

### Adim 5: DentalBooking fallback temizligi
- Tum sabit metinler `''` ile degistirilecek
- Mapper'da DentalBooking icin sektore duyarli basliklar eklenecek (zaten `AppointmentBooking` mapper var, DentalBooking da kapsamali)

### Adim 6: SiteFooter aciklama
- `p.description` prop'u eklenmeli, bos oldugunda paragraf gizlenmeli

---

## Beklenen Sonuc

- HeroMedical'da bos badge gorunmez, stat card deger yoksa gorunmez
- Editorde footer gercek site adini gosterir
- Hotel/Engineer template'lerinde istatistik bolumu duzgun dolar
- Hotel hero'sunda CTA butonu sektore gore dogru gorunur
- DentalBooking'de sektore gore uygun basliklar gorulur
- Footer'da generic aciklama yerine sektore ozel veya bos metin gorulur

