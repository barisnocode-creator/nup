

# Gorsel Duzenleme Overlay'ini Tum Bloklara Uygulama

## Mevcut Durum Analizi

Projede 11 ChaiBuilder blogu var. Bunlarin gorsel durumu:

| Blok | Gorsel Var mi? | EditableChaiImage Kullanıyor mu? |
|------|---------------|--------------------------------|
| AboutSection | Evet (ana gorsel) | Evet - zaten calisiyor |
| HeroSplit | Evet (yan gorsel) | Evet - zaten calisiyor |
| HeroOverlay | Evet (arka plan) | Evet (EditableChaiBackground) |
| ServicesGrid | Evet (kart gorselleri) | Evet - zaten calisiyor |
| ImageGallery | Evet (galeri gorselleri) | Evet - zaten calisiyor |
| **HeroCentered** | **Evet (arka plan)** | **Hayir - eski ImageActionBox kullanıyor** |
| TestimonialsCarousel | Avatar alani var ama initials fallback | Hayir |
| CTABanner | Gorsel yok | Degisiklik gerekmiyor |
| PricingTable | Gorsel yok | Degisiklik gerekmiyor |
| StatisticsCounter | Gorsel yok | Degisiklik gerekmiyor |
| ContactForm | Gorsel yok | Degisiklik gerekmiyor |
| FAQAccordion | Gorsel yok | Degisiklik gerekmiyor |
| AppointmentBooking | Gorsel yok | Degisiklik gerekmiyor |

## Yapilacak Degisiklikler

### 1. HeroCentered - EditableChaiBackground'a Gecis

**Sorun**: Eski `ImageActionBox` bilesenini kullaniyor, diger bloklardaki "Degistir / Yenile" overlay sistemiyle tutarsiz.

**Cozum**: `ImageActionBox` yerine `EditableChaiBackground` kullanarak diger bloklarla ayni hover overlay davranisini saglama.

### 2. TestimonialsCarousel - Avatar Gorseli Ekleme

**Sorun**: Avatar alani var ama sadece isim bas harfi gosteriyor, gorsel degistirme imkani yok.

**Cozum**: Avatar alaninda gorsel varsa `EditableChaiImage` ile sarmalayip hover'da "Degistir" overlay'i gosterme.

## Teknik Detaylar

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/chai-builder/blocks/hero/HeroCentered.tsx` | `ImageActionBox` import'unu kaldir, `EditableChaiBackground` import et. Arka plan gorselini `EditableChaiBackground` ile sarmala. Eski `bgHovered` state ve `ImageActionBox` kodunu kaldir. |
| `src/components/chai-builder/blocks/testimonials/TestimonialsCarousel.tsx` | `EditableChaiImage` import et. Avatar alaninda gorsel varsa `EditableChaiImage` ile goster, yoksa mevcut initials fallback'i koru. |

Toplam 2 dosya degisecek. Diger 5 blok zaten `EditableChaiImage` kullaniyor, gorseli olmayan 6 blokta degisiklik gerekmiyor.

