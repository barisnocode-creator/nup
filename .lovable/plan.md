

# Landing Page Yeniden Tasarim Plani

Durable.co sitesinin minimalist ve profesyonel tasarimini referans alarak Open Lucius landing page'ini yeniden tasarlayacagiz.

---

## Mevcut Durum vs Hedef Tasarim

| Ozellik | Mevcut | Hedef (Durable Tarzi) |
|---------|--------|----------------------|
| Tipografi | Sans-serif, gradient text | Serif basliklar, temiz sans-serif govde |
| Hero | Gradient arka plan, badge | Minimalist beyaz, input alani ile CTA |
| Trust Signals | Icon + text | Yildiz rating + kullanici sayisi |
| Website Showcase | Yok | Ornek site kartlari galeri/carousel |
| Feature Sections | Kart grid | Buyuk 2-kolonlu feature bloklari |
| Renk Paleti | Mor/pembe gradient | Siyah/beyaz + turuncu aksanlar |

---

## Yeni Sayfa Yapisi

```text
+--------------------------------------------------+
|  HEADER (Logo + Sign In + Start for free)        |
+--------------------------------------------------+
|                                                  |
|         "AI that builds your                     |
|          healthcare website"                     |
|                                                  |
|  [Ne tur klinik/muayenehane?          ] [Baslat] |
|                                                  |
|  ⭐⭐⭐⭐⭐ 4.8 Stars  •  Trusted by 1000+ doctors |
+--------------------------------------------------+
|                                                  |
|        [Website Showcase Carousel]               |
|   [Dental] [Doctor] [Pharmacy] [Clinic]          |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  "Your AI healthcare partner"                    |
|  Get online in record time                       |
|                                                  |
|  [Icon] [Icon] [Icon] [Icon]                    |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  The #1 AI website builder for healthcare        |
|                                                  |
|  +--------------------+  +--------------------+  |
|  | AI Websites       |  | AI Content         |  |
|  | Designed for you  |  | Written for you    |  |
|  | [Mockup Image]    |  | [Content Preview]  |  |
|  +--------------------+  +--------------------+  |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  [How It Works - 3 Steps]                        |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  [Final CTA Section]                             |
|  Start building your healthcare website today    |
|                                                  |
+--------------------------------------------------+
|  FOOTER                                          |
+--------------------------------------------------+
```

---

## Dosya Degisiklikleri

### 1. Guncellenecek Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `src/components/landing/Header.tsx` | Daha minimal header, navigation ekleme |
| `src/components/landing/Hero.tsx` | Serif font, input CTA, trust badges |
| `src/components/landing/Features.tsx` | 2-kolonlu buyuk feature kartlari |

### 2. Yeni Olusturulacak Dosyalar

| Dosya | Aciklama |
|-------|----------|
| `src/components/landing/WebsiteShowcase.tsx` | Ornek website kartlari carousel |
| `src/components/landing/TrustSection.tsx` | Icon strip + istatistikler |
| `src/components/landing/HowItWorks.tsx` | 3 adimli surec aciklamasi |
| `src/components/landing/CTASection.tsx` | Son call-to-action bolumu |
| `src/components/landing/Footer.tsx` | Footer component |

### 3. CSS Guncellemeleri

| Dosya | Degisiklik |
|-------|------------|
| `src/index.css` | Serif font ekleme, yeni utility class'lar |
| `tailwind.config.ts` | Serif font ailesi ekleme |

---

## Detayli Tasarim Ogeleri

### Hero Section (Yeni)

- **Baslik**: Buyuk serif font, siyah renk
- **Alt Baslik**: Acik gri, kisa aciklama
- **Input Alani**: Genis input + "Ucretsiz Basla" butonu
- **Trust Badges**: Yildiz rating + kullanici sayisi

```text
              AI that builds your
           healthcare website for you

Your AI partner for professional medical websites.
        Get online in 30 seconds.

+-----------------------------------------------+
| Ne tur klinik/muayenehane aciyorsunuz?        |
|                              [Ucretsiz Basla] |
+-----------------------------------------------+

⭐⭐⭐⭐⭐ 4.8 Rating  •  1000+ Saglik Profesyoneli
```

### Website Showcase Section

Ornek olusturulmus websiteler gosteren yatay scroll/carousel:
- 4-6 ornek website karti
- Her kart: baslik, kisa aciklama, mockup gorunum
- Saglik sektorune ozel ornekler (Dis Klinigi, Aile Hekimi, Eczane)

### Trust/Features Strip

Renkli iconlar ile ozellik gosterimi:
- 4 icon (gorsel, tipografi, SEO, hosting)
- Minimal aciklamalar
- Animasyonlu appearance

### Two-Column Feature Blocks

Durable'daki gibi buyuk 2-kolonlu feature kartlari:

**Sol Kolon - "AI Websites"**
- Baslik: "Sizin icin tasarlandi"
- Aciklama: Profesyonel web sitesi, kodlama gerektirmez
- Alt kisim: Mockup/onizleme gorunum

**Sag Kolon - "AI Content"**
- Baslik: "Sizin icin yazildi"
- Aciklama: Icerik otomatik olusturulur
- Alt kisim: Icerik onizleme

### How It Works Section

3 adimli basit surec:
1. Mesleginizi secin (Doktor, Dis Hekimi, Eczaci)
2. Bilgilerinizi girin (isim, adres, hizmetler)
3. AI sitenizi olusturur - yayinlayin!

### CTA Section

Son call-to-action bolumu:
- Buyuk serif baslik
- Tekrar input + buton
- Trust badge tekrari

---

## Tipografi Degisiklikleri

### Yeni Font Stack

```css
/* Serif: Basliklar icin */
font-family: 'Playfair Display', Georgia, serif;

/* Sans-serif: Govde metni icin (mevcut) */
font-family: 'Inter', system-ui, sans-serif;
```

### Font Boyutlari

| Element | Boyut |
|---------|-------|
| Hero Baslik | 4rem - 6rem (responsive) |
| Section Baslik | 2.5rem - 3.5rem |
| Govde Metni | 1.125rem - 1.25rem |
| Alt Baslik | 1.25rem - 1.5rem |

---

## Renk Semas Guncellemesi

Durable'in temiz gorunumu icin minimal renk paleti:

| Renk | Kullanim |
|------|----------|
| Siyah (#1a1a1a) | Basliklar |
| Koyu Gri (#4a4a4a) | Govde metni |
| Acik Gri (#6b7280) | Ikincil metin |
| Turuncu (#f97316) | Aksan rengi, badge'ler |
| Beyaz (#ffffff) | Arka plan |
| Acik Gri BG (#f9fafb) | Alternatif section bg |

---

## Teknik Uygulama

### Landing.tsx Guncellemesi

```typescript
// Yeni bolum sirasi
<Header />
<Hero />           // Yeni tasarim
<WebsiteShowcase /> // Yeni component
<TrustSection />    // Yeni component
<Features />        // Yeni 2-kolon tasarim
<HowItWorks />      // Yeni component
<CTASection />      // Yeni component
<Footer />          // Yeni component
```

### Google Fonts Ekleme (index.html)

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Animasyonlar

Durable'daki gibi subtle animasyonlar:
- Scroll-triggered fade-in
- Icon hover efektleri
- Carousel smooth scroll
- Button hover transitions

---

## Responsive Tasarim

| Breakpoint | Degisiklikler |
|------------|---------------|
| Mobile (<640px) | Tek kolon, kucuk basliklar |
| Tablet (640-1024px) | 2 kolon feature kartlari |
| Desktop (>1024px) | Tam genislik, buyuk tipografi |

---

## Uygulama Sirasi

1. **Tailwind config & CSS** - Serif font ve yeni utility'ler
2. **Header.tsx** - Minimal tasarim
3. **Hero.tsx** - Input CTA ile yeni tasarim
4. **WebsiteShowcase.tsx** - Ornek site carousel
5. **TrustSection.tsx** - Icon strip
6. **Features.tsx** - 2-kolon kartlar
7. **HowItWorks.tsx** - Surec adimlari
8. **CTASection.tsx** - Final CTA
9. **Footer.tsx** - Footer
10. **Landing.tsx** - Tum parcalari birlestir

