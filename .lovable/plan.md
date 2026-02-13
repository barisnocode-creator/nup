

# Randevu Formu Yeniden Tasarimi ve Editor-Yayinlama Parite Duzeltmesi

## Sorun 1: Randevu Formu Cok Basit ve Kaba

Mevcut tasarim duz butonlar ve sade bir form. Cal.com'dan ilham alinarak modern, minimal ve profesyonel bir randevu bilesenine donusturulecek.

## Sorun 2: Editorde Farkli, Yayinlayinca Farkli

`deploy-to-netlify/index.ts` dosyasindaki Pilates template renderer fonksiyonlari hala sabit renkler kullanıyor:
- `#c4775a` (terracotta) yerine `var(--primary)` olmali
- `#2d2420` (koyu kahve) yerine `var(--foreground)` olmali
- `#f5ebe0` (krem) yerine `var(--background)` olmali
- `#6b5e54` yerine `var(--muted-foreground)` olmali
- `#e8ddd0` yerine `var(--border)` olmali

Bu yuzden editorde tema degiskenlerini gorurken, yayinlayinca eski sabit renkler cikiyor.

---

## Degisiklik 1: AppointmentBooking.tsx - Cal.com Ilhamli Yeniden Tasarim

Mevcut kare butonlar ve duz liste yerine:

**Tarih Secimi:**
- Yatay kaydirmali takvim seritdi (horizontal date strip)
- Her gun: gun ismi + gun numarasi (ornek: "Pzt 17")
- Secili gun: `bg-primary text-primary-foreground` dolgu ile belirgin
- Secilmemis gun: hafif border, hover efekti
- Sol/sag ok butonlari ile haftalar arasi gezinti

**Saat Secimi:**
- 2 veya 3 sutunlu grid layout
- Pill seklinde butonlar (rounded-full)
- Secili saat: dolgu animasyonu ile belirgin
- Hover: hafif scale ve golge efekti

**Form Alanlari:**
- Saat secildikten sonra asagiya dogru akici bir `framer-motion` slide-down animasyonu ile acilsin
- Input alanlari: buyuk, havadar, minimal border
- Focus durumunda ring animasyonu

**Genel Gorunum:**
- Kart: `rounded-2xl shadow-xl` buyuk golge
- Adim gostergesi: "1. Tarih -> 2. Saat -> 3. Bilgiler" seklinde ust kisimda minimal step indicator
- Basarili gonderim: konfeti/check animasyonu

### Teknik Detaylar

```text
Dosya: src/components/chai-builder/blocks/appointment/AppointmentBooking.tsx

Degisiklikler:
- Tarih butonlari: yatay scroll strip, gun adi + numara formati
- Saat grid: 3 sutun, pill butonlar  
- Step indicator: ustde 3 adim gostergesi
- Form acilisi: framer-motion AnimatePresence ile slide-down
- Basari ekrani: buyuk check ikonu ile animasyon
- inBuilder preview'i da ayni tasarima uyumlu
```

## Degisiklik 2: deploy-to-netlify - Pilates Renderers Renk Duzeltmesi

Asagidaki fonksiyonlardaki tum sabit renk kodlari CSS degiskenlerine donusturulecek:

| Fonksiyon | Sabit Renk | CSS Degiskeni |
|-----------|-----------|---------------|
| `renderPilatesHero` | `#c4775a` | `var(--primary)` |
| `renderPilatesHero` | `rgba(196,119,90,...)` | `color-mix(in srgb, var(--primary) ...)` |
| `renderPilatesFeatures` | `#f5ebe0`, `#2d2420`, `#6b5e54` | `var(--background)`, `var(--foreground)`, `var(--muted-foreground)` |
| `renderPilatesTour` | `#2d2420`, `#f5ebe0` | `var(--foreground)`, `var(--background)` |
| `renderPilatesTeachers` | `#c4775a`, `#2d2420`, `#6b5e54` | `var(--primary)`, `var(--foreground)`, `var(--muted-foreground)` |
| `renderPilatesTestimonials` | `#c4775a`, `#2d2420`, `#f5ebe0` | `var(--primary)`, `var(--foreground)`, `var(--background)` |
| `renderPilatesContact` | `#c4775a`, `#2d2420`, `#6b5e54`, `#e8ddd0` | `var(--primary)`, `var(--foreground)`, `var(--muted-foreground)`, `var(--border)` |
| `renderPilatesHeader` | `#fff`, `#2d2420`, `rgba(245,235,224,...)` | `var(--primary-foreground)`, `var(--foreground)`, `var(--background)` |
| `renderPilatesFooter` | `#c4775a`, `#2d2420`, `#f5ebe0` | `var(--primary)`, `var(--foreground)`, `var(--background)` |

**Ayrica:** Header'daki nav linkleri ve footer'daki metinler Turkce'ye cevrilecek (editordeki ile ayni).

## Degisiklik 3: deploy-to-netlify - Randevu Blogu Renderer Guncelleme

`renderAppointmentBooking` fonksiyonu da yeni UI tasarimina uyumlu hale getirilecek:
- Ayni yatay tarih strip, pill saat butonlari
- Step indicator
- Tema degiskenlerini kullanan stiller

## Dosya Degisiklikleri Ozeti

| Dosya | Islem |
|-------|-------|
| `src/components/chai-builder/blocks/appointment/AppointmentBooking.tsx` | Cal.com ilhamli yeniden tasarim |
| `supabase/functions/deploy-to-netlify/index.ts` | Pilates renderer'larindaki sabit renkleri CSS degiskenlerine cevir + randevu renderer guncelle |

## Beklenen Sonuc

- Randevu formu Cal.com kalitesinde modern ve akici gorunecek
- Editorde gorunen ile yayinlanan site birebir ayni olacak
- Tema degistirildiginde hem editorde hem yayinlanan sitede renkler dogru yansiyacak

