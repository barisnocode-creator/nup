

## Editor Kapsamli Guncelleme: Font Sistemi, Renk Uyumu ve UI/UX Iyilestirmeleri

### Tespit Edilen Sorunlar

**1. Font Degisiklikleri Calismior**
- `CustomizePanel`'de font secildiginde `--font-heading` ve `--font-body` CSS degiskenleri guncelleniyor
- AMA section bilesenleri bu degiskenleri kullanmiyor! Ornegin `HeroCafe.tsx` sabit `style={{ fontFamily: "'Playfair Display', Georgia, serif" }}` kullaniyor
- `HeroCentered.tsx` hic font-family belirtmiyor, varsayilan Tailwind fontu kullaniliyor
- Google Fonts'tan sadece Inter ve Playfair Display yukleniyor — kullanici Poppins, Lora vb. sectignde font yuklenmez
- **Cozum:** Tum section bilesenlerinde `font-heading-dynamic` ve `font-body-dynamic` CSS siniflarini kullan + dinamik Google Fonts yukleme

**2. Renk Degisimleri Sisteme Uymuyor**
- `SiteEditor.tsx` renkleri `--primary`, `--background` gibi CSS degiskenleri olarak set ediyor ama deger olarak hex string (`#C65D3E`) kullaniyor
- Tailwind'in HSL tabanli sistemi (`24 95% 53%`) ile hex degerleri uyumsuz
- Section bilesenleri `bg-primary`, `text-primary` gibi Tailwind siniflarini kullaniyor, bunlar HSL bekliyor
- HeroCafe gibi bilesenler ise sabit hex renkleri kullaniyor (`bg-[#C65D3E]`), tema renklerini yok sayiyor
- **Cozum:** Renk degisikliklerinde hex'i HSL'e cevirme fonksiyonu ekle + bilesenlerde tema renklerini kullan

**3. Eksik/Calismayan UI Bilesenleri**

- **Stil panelinde renk secici yok** — Sadece dropdown'lar var, section arka plan/metin rengi icin color picker eksik
- **Array prop duzenleyici yok** — `services`, `testimonials`, `items` gibi liste prop'lari `skipFields` ile gizleniyor, duzenlenemez
- **Gorsel yukleme/degistirme yok** — Gorseller input alaninda URL olarak gosteriliyor, dosya yukleme veya Pixabay entegrasyonu yok
- **Responsive onizleme yok** — Kullanici mobil/tablet gorunumu kontrol edemiyor

### Cozum Plani

#### Faz 1: Font Sistemi Duzeltme

**1a. Dinamik Google Fonts Yukleme**
- `SiteEditor.tsx`'e font degistiginde Google Fonts CSS'ini dinamik olarak `<link>` etiketi ile yukleme
- Desteklenen fontlari genislet: Inter, Playfair Display, Space Grotesk, Poppins, Open Sans, Lora, DM Sans, Sora, Roboto, Montserrat

**1b. Section Bilesenlerinde Dinamik Font Kullanimi**
Tum section bilesenlerinde (`HeroCafe`, `HeroCentered`, `HeroOverlay`, `HeroSplit`, `MenuShowcase`, `CafeStory`, `CafeFeatures`, `CafeGallery`, `ServicesGrid`, `AboutSection`, `StatisticsCounter`, `TestimonialsCarousel`, `ContactForm`, `CTABanner`, `FAQAccordion`, `PricingTable`) basliklarda `font-heading-dynamic` CSS sinifini, govde metinlerinde `font-body-dynamic` sinifini kullanacak sekilde guncelle.

Ornegin `HeroCafe.tsx` satirlari:
```text
style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
```
yerine:
```text
className="font-heading-dynamic"
```

#### Faz 2: Renk Sistemi Duzeltme

**2a. Hex-to-HSL Donusturucu**
`src/lib/utils.ts`'e `hexToHSL(hex: string): string` fonksiyonu ekle. Bu fonksiyon `#C65D3E` gibi hex degerleri `15 55% 51%` gibi HSL degerlerine cevirir.

**2b. SiteEditor'da Renk Uygulama Duzeltmesi**
`SiteEditor.tsx`'deki `useEffect` blogunda renk set ederken hex degerleri HSL'e cevirip set et:
```text
root.style.setProperty(`--${key}`, hexToHSL(val));
```

**2c. Section Bilesenlerinde Tema Renkleri Kullanimi**
`HeroCafe.tsx` gibi sabit renkli bilesenleri tema renklerini kullanacak sekilde guncelle:
- `bg-[#C65D3E]` yerine `bg-primary`
- `text-[#C65D3E]` yerine `text-primary`
- Boylece kullanici customize panelinden renk degistirdiginde tum bilesenler guncellenir

#### Faz 3: Stil Panelini Zenginlestirme

**3a. Renk Secici Ekleme (SectionEditPanel Stil Sekmesi)**
- Arka plan rengi icin mevcut dropdown'a ek olarak bir color picker ekle
- Metin rengi icin de color picker ekle
- Bunlar `section.style` uzerinden `customBgColor` ve `customTitleColor` olarak kayit edilir

**3b. Array Prop Duzenleyici**
`SectionEditPanel`'deki `ContentFields`'e basit bir liste duzenleyici ekle:
- `services` dizisi icin: Her bir ogede baslik+aciklama duzenle, sil, yenisini ekle
- `testimonials` icin: Isim, rol, yorum alanlari
- `items` (FAQ, Menu) icin: Soru/cevap, isim/fiyat alanlari
- Her liste ogesi bir Collapsible/Accordion icinde gosterilir

**3c. Gorsel URL Alani Iyilestirmesi**
- `backgroundImage`, `image` gibi prop'lar icin URL input'unun yanina bir kucuk onizleme gorseli goster
- Ileride dosya yukleme eklenebilir ancak su an URL girisi yeterli

#### Faz 4: Responsive Onizleme

**EditorToolbar'a Cihaz Toggler**
- Masaustu (1200px), Tablet (768px), Mobil (375px) genislik secenekleri
- Canvas container'ina `max-width` ve `mx-auto` ile boyutlandirma uygula
- Secili cihaz toolbar'da ikon ile gosterilir

#### Faz 5: CustomizePanel'e Tema Preset'leri

**Hizli Tema Secimi**
- Mevcut `specialtyCafePreset` ve `modernProfessionalPreset` disinda 3-4 yeni preset ekle:
  - "Koyu Minimal" (siyah bg, beyaz text, turkuaz accent)
  - "Pastel Zarif" (krem bg, gul kurusu accent, serif font)  
  - "Canli Enerjik" (beyaz bg, parlak kirmizi accent, sans-serif)
- CustomizePanel'de renk secicilerin ustune kucuk preset kartlari (renk dairesi + isim)
- Tiklandiginda tum tema renkleri, fontlar ve borderRadius guncellenir

### Teknik Detaylar

**Dosya Degisiklikleri:**

| Dosya | Degisiklik |
|-------|-----------|
| `src/lib/utils.ts` | `hexToHSL()` fonksiyonu ekle |
| `src/components/editor/SiteEditor.tsx` | Dinamik font yukleme + hex-to-HSL renk uygulama |
| `src/components/editor/CustomizePanel.tsx` | Tema preset'leri + iyilestirilmis renk seciciler |
| `src/components/editor/SectionEditPanel.tsx` | Array prop duzenleyici + section renk secicileri |
| `src/components/editor/EditorToolbar.tsx` | Responsive cihaz toggler |
| `src/components/editor/EditorCanvas.tsx` | Responsive genislik sinirlamasi |
| `src/components/sections/HeroCafe.tsx` | Sabit renkler yerine tema degiskenleri + dinamik font |
| `src/components/sections/HeroCentered.tsx` | Dinamik font siniflari |
| `src/components/sections/HeroOverlay.tsx` | Dinamik font siniflari |
| `src/components/sections/HeroSplit.tsx` | Dinamik font siniflari |
| `src/components/sections/MenuShowcase.tsx` | Tema renkleri + dinamik font |
| `src/components/sections/CafeStory.tsx` | Tema renkleri + dinamik font |
| `src/components/sections/CafeFeatures.tsx` | Tema renkleri + dinamik font |
| `src/components/sections/CafeGallery.tsx` | Tema renkleri + dinamik font |
| `src/components/sections/ServicesGrid.tsx` | Dinamik font siniflari |
| `src/components/sections/AboutSection.tsx` | Dinamik font siniflari |
| `src/components/sections/StatisticsCounter.tsx` | Dinamik font siniflari |
| `src/components/sections/TestimonialsCarousel.tsx` | Dinamik font siniflari |
| `src/components/sections/ContactForm.tsx` | Dinamik font siniflari |
| `src/components/sections/CTABanner.tsx` | Tema renkleri + dinamik font |
| `src/components/sections/FAQAccordion.tsx` | Dinamik font siniflari |
| `src/components/sections/PricingTable.tsx` | Dinamik font siniflari |
| `src/themes/presets.ts` | 3-4 yeni tema preset'i |
| `index.html` | Google Fonts linkine ek fontlar (Poppins, Lora, Space Grotesk vb.) |

### Uygulama Sirasi

1. **Faz 1** - Font sistemi (en kritik: dinamik yukleme + section guncelleme)
2. **Faz 2** - Renk sistemi (hex-to-HSL + tema uyumu)
3. **Faz 3** - Stil paneli zenginlestirme (array editor + color picker)
4. **Faz 4** - Responsive onizleme
5. **Faz 5** - Tema preset'leri

### Onemli Notlar

- Editor UI panelleri (toolbar, SectionEditPanel, CustomizePanel, AddSectionPanel) sabit Tailwind renkleri kullanmaya devam edecek — tema degiskenleri sadece canvas icerigini etkiler
- Font degisiklikleri canli onizlemede aninda gorunecek
- Renk degisiklikleri tum bilesenlere aninda yansiyacak (HeroCafe dahil)

