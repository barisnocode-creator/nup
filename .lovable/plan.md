

# ChaiBuilder Bloklarini Premium Kaliteye Yukseltme

## Sorun

Sistemde iki ayri render katmani var:

1. **Template React bilesenleri** (src/templates/pilates/): Glassmorphism, sonsuz galeri kaydirma, tam ekran hero + form overlay gibi premium gorsellerle dolu. Ancak bunlar **sadece galeri onizleme kartlarinda** kullaniliyor.

2. **ChaiBuilder bloklari** (src/components/chai-builder/blocks/): Editor tuvali VE yayinlanan site bu bloklari kullaniyor. Ancak bunlar basit, jenerik ve gorsel olarak zayif.

Sonuc: Template ne olursa olsun, editor ve yayinlanan site hep ayni jenerik gorunumde kaliyor. Renk degisiklikleri yansisa da, **tasarim kalitesi** degismiyor.

## Cozum Stratejisi

ChaiBuilder bloklarini, Pilates template'indeki gorsel kaliteye yukseltmek. Boylece editor tuvali ve yayinlanan site ayni premium gorunume sahip olacak.

## Degisiklik Detaylari

### 1. HeroCentered.tsx - Tam Ekran Premium Hero

Mevcut: Ortalanmis baslik + butonlar, basit arka plan
Hedef: Pilates'teki gibi tam ekran hero + glassmorphism form overlay

Degisiklikler:
- `min-h-screen` tam ekran yaklasimi
- `items-end` ile icerigi alta yasla (Pilates'teki gibi)
- Gradient overlay'ler: `from-primary/60 via-primary/30` + `from-black/40 via-transparent`
- Sag tarafta glassmorphism form kutusu: `backdrop-blur-xl bg-white/10 border border-white/20`
- Grid layout: sol taraf baslik+aciklama, sag taraf form
- Alt ortada "Kesfet" butonu + bounce animasyonu
- `font-serif` baslik ve `tracking-tight leading-[0.95]`

### 2. ServicesGrid.tsx - Gorsel Oncelikli Kartlar

Mevcut: Ikon + baslik + aciklama kartlari
Hedef: Referans sitedeki gibi gorsel ustune overlay metin

Degisiklikler:
- Kart yaklasimi: gorsel tam arka plan, alt kisimda gradient overlay uzerine baslik
- `aspect-[3/4]` dikdortgen kart orani
- Hover efekti: gorsel `scale-110`, overlay koyulasma
- IntersectionObserver ile stagger animasyonlari (her kart sirayla fade-in)
- Gorseli olmayan kartlar icin mevcut ikon yaklasimi korunacak (fallback)

### 3. ImageGallery.tsx - Sonsuz Yatay Kaydirma

Mevcut: Statik grid layout
Hedef: Pilates'teki gibi sonsuz yatay kaydirma (infinite marquee)

Degisiklikler:
- Grid yerine `overflow-hidden` + `flex` + CSS animation
- Gorselleri ciftleyerek sonsuz dongu efekti
- `@keyframes marquee` animasyonu: `translateX(0) -> translateX(-50%)`
- Koyu arka plan (bg-foreground text-background) ile kontrast
- Gorseller arasi boslukta baslik overlay'leri
- Hover'da animasyonu durdurma: `hover:[animation-play-state:paused]`
- Scrollbar gizleme

### 4. TestimonialsCarousel.tsx - Koyu Tema + Buyuk Alinti

Mevcut: Kart grid'i, basit gorunum
Hedef: Koyu arka plan, buyuk alinti metni, minimal tasarim

Degisiklikler:
- Koyu section arka plani: `bg-foreground text-background`
- Buyuk tirnak isareti dekoratif eleman
- Grid yerine tek buyuk testimonial + yanlarda kucuk preview
- Veya referans siteye uygun olarak buyuk fontlu alinti + isim altta
- Border-top ile ayirici cizgi

### 5. CTABanner.tsx - Gradient Arka Plan + Gorsel

Mevcut: Duz renkli arka plan
Hedef: Gradient + blur dekoratif elemanlar

Degisiklikler:
- `bg-gradient-to-br from-primary via-primary/90 to-accent` gradient
- Dekoratif blur daireler (pilates'teki gibi)
- Daha buyuk tipografi
- Buton stillerini iyilestir: `backdrop-blur bg-white/20`

### 6. StatisticsCounter.tsx - Minimal Cizgi Ayiricilar

Mevcut: Basit sayilar
Hedef: Sayilar arasi ince border ayiricilar, daha sofistike layout

Degisiklikler:
- Her istatistik arasina `border-r border-primary-foreground/20` dikey cizgi
- Ustune decorative ince cizgi
- Font boyutunu buyut: `text-6xl md:text-7xl`
- Label icin `tracking-widest uppercase text-xs`

### 7. AboutSection.tsx - Daha Buyuk Gorsel + Paralaks Hissi

Mevcut: Basit grid + gorsel
Hedef: Daha buyuk, kenarliksiz gorsel alani

Degisiklikler:
- Gorsele `rounded-3xl` ve golge ekle
- Dekoratif arka plan elemani: renk splatteri veya gradient blob
- Feature listesi icin daha sofistike ikon (checkmark yerine nokta + cizgi)
- Typography: serif baslik

### 8. ContactForm.tsx - Glassmorphism Form

Mevcut: Standart kart icinde form
Hedef: Pilates'teki hero form tarzinda glassmorphism

Degisiklikler:
- Form container: `backdrop-blur-sm bg-card/80` veya `bg-muted/50`
- Input stili: `bg-background/50 border-border/50` daha yumusak
- Buton: `bg-primary hover:bg-primary/90` gradient efekti
- Iletisim bilgileri bolumune dekoratif arka plan

## Dosya Degisiklikleri Ozeti

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `src/components/chai-builder/blocks/hero/HeroCentered.tsx` | Yeniden yaz | Tam ekran + glassmorphism form |
| `src/components/chai-builder/blocks/services/ServicesGrid.tsx` | Yeniden yaz | Gorsel-oncelikli kartlar + stagger animasyonu |
| `src/components/chai-builder/blocks/gallery/ImageGallery.tsx` | Yeniden yaz | Sonsuz yatay kaydirma marquee |
| `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` | Yeniden yaz | Koyu tema + buyuk alinti |
| `src/components/chai-builder/blocks/cta/CTABanner.tsx` | Guncelle | Gradient + dekoratif blur |
| `src/components/chai-builder/blocks/statistics/StatisticsCounter.tsx` | Guncelle | Cizgi ayiricilar + buyuk font |
| `src/components/chai-builder/blocks/about/AboutSection.tsx` | Guncelle | Serif baslik + dekoratif blob |
| `src/components/chai-builder/blocks/contact/ContactForm.tsx` | Guncelle | Glassmorphism form stili |

## Beklenen Sonuc

- Editor tuvalinde bloklar premium gorunecek (glassmorphism, animasyonlar, buyuk tipografi)
- Yayinlanan sitede (`RenderChaiBlocks`) ayni premium gorunum yansiyacak
- Tema degistirildiginde renkler degisecek AMA tasarim kalitesi her zaman yuksek kalacak
- Farkli sektorler icin AI farkli icerik urettiginde, bloklar o icerigi premium sekilde gosterecek

## Dikkat Edilecekler

- Tum bloklar `inBuilder` prop'unu kullanarak editor icinde form submit/link tiklamalarini engelliyor - bu korunacak
- `registerChaiBlock` schema'lari degismeyecek (kullanici ayni prop panelinden duzenlemeye devam edecek)
- `inlineEditProps` korunacak (tuval uzerinde metin duzenleme)
- CSS animasyonlari `@keyframes` icin Tailwind config'e ekleme gerekebilir (marquee icin)
- Mevcut `resolveStyles` ve `commonStyleSchemaProps` sistemi korunacak

