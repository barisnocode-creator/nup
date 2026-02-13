
# Pilates Template Entegrasyonu ve Tekrarlanabilir Template Ekleme Sistemi

## Hedef
Pilates Circle template'inin birebir aynisini sisteme entegre etmek ve gelecekte her yeni template icin kullanilabilecek standart bir "template ekleme prompt'u" olusturmak.

## Template Analizi - Pilates Circle

Sitenin 7 ana bolumu:

```text
+------------------------------------------+
| HEADER: Logo + Nav (transparent overlay)  |
+------------------------------------------+
| HERO: Full-screen image/video bg          |
|   - Buyuk serif baslik (sol)              |
|   - Callback form overlay (sag)          |
|   - "Discover More" scroll butonu         |
+------------------------------------------+
| FEATURES: 3 gorsel kart                   |
|   "A studio where control meets calm"     |
|   Bespoke Space / Immersive / Trainers    |
+------------------------------------------+
| TOUR/GALLERY: Yatay kayan gorsel slider   |
|   "Tour our Space" - 3D studio turu       |
+------------------------------------------+
| TEACHERS: Egitmen kadrosu                 |
+------------------------------------------+
| TESTIMONIALS: Musteri yorumlari           |
+------------------------------------------+
| CONTACT: Iletisim bolumu                  |
+------------------------------------------+
| FOOTER: Logo + linkler                    |
+------------------------------------------+
```

Renk paleti: Sicak terracotta/peach tonlari, koyu yazi, krem arka plan
Tipografi: Serif basliklar (Playfair Display), sans-serif govde
Animasyonlar: Fade-in scroll, hover scale, smooth transitions

## Uygulama Plani

### Adim 1: React Template Bilesenlerini Olusturma (Editor Onizleme)

Yeni dosya yapisi:
```text
src/templates/pilates/
  index.tsx                    -- Ana template wrapper (TemplateProps uyumlu)
  components/
    TemplateHeader.tsx         -- Transparent overlay header
    TemplateFooter.tsx         -- Footer
  sections/
    hero/HeroFullscreen.tsx    -- Tam ekran hero + form overlay
    features/FeatureCards.tsx   -- 3 gorsel kartli ozellik bolumu
    tour/TourGallery.tsx       -- Yatay slider galeri
    teachers/TeacherGrid.tsx   -- Egitmen kartlari
    testimonials/Testimonials.tsx
    contact/ContactSection.tsx
  pages/
    FullLandingPage.tsx        -- Tum bolumleri sirayla render eder
```

Ana bilesenler mevcut `TemplateProps` interface'ini kullanarak:
- `content.pages.home.hero` -> Hero baslik, aciklama
- `content.pages.services.servicesList` -> Feature kartlari
- `content.pages.contact.info` -> Iletisim bilgileri
- `content.metadata` -> Site adi, tagline

### Adim 2: Template Registry'ye Kayit

`src/templates/index.ts` dosyasina yeni template eklenmesi:
- id: `pilates1`
- name: "Wellness Studio"
- category: "Wellness"
- Onizleme gorseli eklenmesi (screenshot)
- `supportedProfessions`: pilates, yoga, fitness, pt, gym, wellness, spa
- `supportedTones`: warm, elegant, premium, calm

### Adim 3: HTML Render Fonksiyonlari (Deploy/Publish)

`supabase/functions/deploy-to-netlify/index.ts` dosyasina yeni render fonksiyonlari:
- `renderHeroFullscreen()` -- Tam ekran hero + form + serif tipografi
- `renderFeatureCards()` -- 3 gorsel kartli ozellik bolumu
- `renderTourGallery()` -- CSS-only yatay galeri (JS gerektirmeden)
- `renderTeacherGrid()` -- Egitmen kartlari
- Her fonksiyon mevcut CSS degisken sistemini (`var(--primary)` vb.) kullanir
- Animasyonlar icin CSS `@keyframes` ve `IntersectionObserver` tabanli scroll-triggered animasyonlar eklenir

### Adim 4: Gorsel Stil Detaylari

Template'in ozel gorsel ozellikleri HTML ciktisina yansitilacak:
- Google Fonts: Playfair Display (serif basliklar) + Inter/DM Sans (govde)
- Warm color scheme: `--primary: #c4775a` (terracotta), `--background: #f5ebe0` (krem)
- Hero'da glassmorphism form overlay (backdrop-blur + rgba bg)
- Hover efektleri: Scale transform, shadow artisi
- Scroll animasyonlari: fade-in-up (CSS IntersectionObserver ile)

### Adim 5: Chaibuilder Blok Eslestirmesi

Mevcut Chaibuilder bloklari bu template icin yeniden eslenir:
- `HeroCentered` veya yeni `HeroFullscreen` blok tipi
- `ServicesGrid` -> Feature kartlari olarak kullanilir
- `ImageGallery` -> Tour galerisi
- `ContactForm` -> Iletisim bolumu
- `TestimonialsCarousel` -> Yorumlar

`renderBlock()` fonksiyonunda template-bazli render secimi eklenir:
- Proje hangi template'i kullaniyorsa, o template'in HTML ciktisi uretilir.

## Tekrarlanabilir Template Ekleme Prompt'u

Asagidaki prompt, her yeni template eklerken kullanilacak standart talimatlar setidir:

---

**TEMPLATE EKLEME PROMPT'U:**

```text
Yeni bir template eklemek istiyorum. Asagidaki adimlari siraya uyarak uygula:

1. ANALIZ: [TEMPLATE_URL] sitesini incele. Su bilgileri cikar:
   - Kac bolum var ve isimleri ne?
   - Renk paleti (hex kodlari)
   - Tipografi (font ailesi, agirliklari)
   - Ozel animasyonlar ve efektler
   - Layout yapisi (grid, flex, kolon sayilari)

2. REACT BILESEN: src/templates/[TEMPLATE_ID]/ altinda olustur:
   - index.tsx: TemplateProps interface'ini implement et
   - components/TemplateHeader.tsx ve TemplateFooter.tsx
   - sections/: Her bolum icin ayri bilesenler
   - pages/FullLandingPage.tsx: Tum bolumleri sectionOrder'a gore render et
   - GeneratedContent verisinden icerik cek (hero, services, contact, about)

3. REGISTRY KAYIT: src/templates/index.ts dosyasina ekle:
   - Benzersiz template ID
   - Onizleme gorseli
   - supportedProfessions ve supportedTones dizileri

4. HTML RENDER: supabase/functions/deploy-to-netlify/index.ts dosyasina:
   - Her bolum icin renderXxx() fonksiyonu yaz
   - CSS degiskenleri kullan (var(--primary), var(--background) vb.)
   - Google Fonts linkini <head>'e ekle
   - Animasyonlar icin CSS @keyframes ekle
   - renderBlock() switch'ine yeni tipleri ekle VEYA
     template-bazli render mantigi ekle

5. TEST: Template'i editor'de onizle ve Netlify'a deploy et.
   Her iki tarafin da ayni goruntuyu verdigi dogrulanmali.

KURALLAR:
- Gorseller Pixabay'den cekilecek (AI generation kullanma)
- Icerik GeneratedContent yapisindan gelecek (hardcode etme)
- Responsive olmali (mobil, tablet, masaustu)
- CSS degisken sistemiyle tema uyumlu olmali
- Mevcut editör ozelliklerini desteklemeli (isEditable, onFieldEdit vb.)
```

---

## Teknik Detaylar

### Degisecek/Olusturulacak Dosyalar:

**Yeni dosyalar (8 adet):**
1. `src/templates/pilates/index.tsx`
2. `src/templates/pilates/components/TemplateHeader.tsx`
3. `src/templates/pilates/components/TemplateFooter.tsx`
4. `src/templates/pilates/sections/hero/HeroFullscreen.tsx`
5. `src/templates/pilates/sections/features/FeatureCards.tsx`
6. `src/templates/pilates/sections/tour/TourGallery.tsx`
7. `src/templates/pilates/sections/teachers/TeacherGrid.tsx`
8. `src/templates/pilates/pages/FullLandingPage.tsx`

**Guncellenecek dosyalar (2 adet):**
1. `src/templates/index.ts` -- Yeni template registry kaydı
2. `supabase/functions/deploy-to-netlify/index.ts` -- Yeni HTML render fonksiyonlari + template-bazli render mantigi

### Olusturma Sirasi:
1. Once React bilesenlerini olustur (editor'de hemen gorunsun)
2. Template registry'ye kaydet
3. HTML render fonksiyonlarini yaz (publish calissin)
4. Test et

### Onizleme Gorseli:
Pilates Circle sitesinin screenshot'u `src/assets/template-pilates.jpg` olarak kaydedilecek.
