
# Blok Stil Kontrolleri Kapsamli Genisleme Plani

## Mevcut Durum
Su anda her blokta yalnizca 2 stil kontrolu var:
- `titleSize` (lg, xl, 2xl, 3xl)
- `textAlign` (left, center, right)

Kullanici, her yazi icin font agirligini, rengini, boyutunu, arka plan rengini, bosluk ayarlarini ve daha fazlasini kontrol edebilmek istiyor.

## Eklenecek Yeni Kontroller

Her bloga asagidaki yeni stil ozellikleri eklenecek:

| Kontrol | Secenekler | Etkiledigi Alan |
|---------|-----------|-----------------|
| Baslik Kalinligi | Normal, Orta, Kalin, Cok Kalin | Ana baslik (h1/h2) |
| Baslik Rengi | Varsayilan, Birincil, Ikincil, Beyaz, Soluk | Ana baslik |
| Aciklama Boyutu | Kucuk, Normal, Buyuk, Cok Buyuk | Aciklama metni |
| Aciklama Rengi | Varsayilan, Birincil, Koyu, Soluk | Aciklama metni |
| Alt Baslik Stili | Normal, Buyuk Harf | Alt baslik etiketi |
| Arka Plan | Saydam, Varsayilan, Soluk, Kart, Birincil, Ikincil | Bolum arka plani |
| Bolum Boslugu | Kucuk, Normal, Buyuk, Cok Buyuk | Ust/alt padding |

## Teknik Yaklasim

### 1. Paylasilan Stil Yardimci Dosyasi Olusturma
**Yeni dosya:** `src/components/chai-builder/blocks/shared/styleUtils.ts`

Tum bloklarin ortak kullanacagi harita (map) ve yardimci fonksiyonlar tek bir dosyada toplanacak:
- `titleWeightMap`: font-normal, font-medium, font-semibold, font-bold, font-extrabold
- `colorMap`: text-foreground, text-primary, text-muted-foreground, text-white, text-secondary-foreground
- `descSizeMap`: text-sm, text-base, text-lg, text-xl
- `bgColorMap`: bg-transparent, bg-background, bg-muted/30, bg-card, bg-primary, bg-secondary
- `paddingMap`: py-12, py-20, py-28, py-36
- `subtitleTransformMap`: normal-case, uppercase
- `commonStyleProps()`: Tum bloklar icin ortak builderProp tanimlarini donduren fonksiyon

Bu yaklasim, 11 blok dosyasindaki tekrari onler ve gelecekte yeni kontroller eklemeyi kolaylastirir.

### 2. Tum Blok Dosyalarini Guncelleme
Her blok dosyasinda yapilacak degisiklikler:

**a) Tip tanimlarina yeni alanlar ekleme:**
```
titleWeight: string;    // font kalinligi
titleColor: string;     // baslik rengi
descSize: string;       // aciklama boyutu
descColor: string;      // aciklama rengi
subtitleTransform: string; // alt baslik stili
bgColor: string;        // arka plan rengi
sectionPadding: string; // bolum boslugu
```

**b) JSX'te stil siniflarini dinamik uygulama:**
- Baslik: `className={titleSizeMap[titleSize] + ' ' + titleWeightMap[titleWeight] + ' ' + colorMap[titleColor]}`
- Aciklama: `className={descSizeMap[descSize] + ' ' + colorMap[descColor]}`
- Section: `className={paddingMap[sectionPadding] + ' ' + bgColorMap[bgColor]}`

**c) Schema'ya yeni builderProp tanimlari ekleme:**
`commonStyleProps()` fonksiyonundan spread ile ekleme.

### 3. Degistirilecek Dosyalar

Toplam 12 dosya:

1. **YENi** `src/components/chai-builder/blocks/shared/styleUtils.ts` - Ortak stil haritalari ve prop tanimlari
2. `src/components/chai-builder/blocks/hero/HeroCentered.tsx` - 7 yeni kontrol
3. `src/components/chai-builder/blocks/hero/HeroSplit.tsx` - 7 yeni kontrol
4. `src/components/chai-builder/blocks/hero/HeroOverlay.tsx` - 7 yeni kontrol
5. `src/components/chai-builder/blocks/about/AboutSection.tsx` - 7 yeni kontrol
6. `src/components/chai-builder/blocks/services/ServicesGrid.tsx` - 7 yeni kontrol
7. `src/components/chai-builder/blocks/contact/ContactForm.tsx` - 7 yeni kontrol
8. `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` - 7 yeni kontrol
9. `src/components/chai-builder/blocks/cta/CTABanner.tsx` - 7 yeni kontrol
10. `src/components/chai-builder/blocks/faq/FAQAccordion.tsx` - 7 yeni kontrol
11. `src/components/chai-builder/blocks/gallery/ImageGallery.tsx` - 7 yeni kontrol
12. `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx` - 7 yeni kontrol
13. `src/components/chai-builder/blocks/pricing/PricingTable.tsx` - 7 yeni kontrol

### 4. Ornek Sonuc (ServicesGrid icin Sag Panel Gorunumu)

Mevcut:
- Bolum Basligi (metin)
- Bolum Alt Basligi (metin)
- Hizmetler (dizi)
- Baslik Boyutu (dropdown)
- Metin Hizalama (dropdown)

Yeni:
- Bolum Basligi (metin)
- Bolum Alt Basligi (metin)
- Hizmetler (dizi)
- **--- Stil Ayarlari ---**
- Baslik Boyutu (dropdown: lg/xl/2xl/3xl)
- Baslik Kalinligi (dropdown: Normal/Orta/Kalin/Cok Kalin)
- Baslik Rengi (dropdown: Varsayilan/Birincil/Ikincil/Beyaz/Soluk)
- Metin Hizalama (dropdown: Sol/Orta/Sag)
- Aciklama Boyutu (dropdown: Kucuk/Normal/Buyuk/Cok Buyuk)
- Aciklama Rengi (dropdown: Varsayilan/Koyu/Soluk)
- Alt Baslik Stili (dropdown: Normal/Buyuk Harf)
- Arka Plan (dropdown: Saydam/Varsayilan/Soluk/Kart/Birincil/Ikincil)
- Bolum Boslugu (dropdown: Kucuk/Normal/Buyuk/Cok Buyuk)

## Notlar
- `PricingTable` ve `StatisticsCounter` gibi ozel arka planli bloklarda `bgColor` varsayilani farkli olacak (ornegin primary)
- `HeroOverlay` blogu baslik rengi icin beyaz'i varsayilan olarak kullanacak (overlay ustunde okunurluk)
- Mevcut blok verileri bozulmayacak: tum yeni prop'lar varsayilan degerlere sahip olacak, mevcut kayitlarda eksik prop'lar varsayilani kullanacak
