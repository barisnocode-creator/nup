
# Chambers & Associates Lawyer Template Entegrasyonu

## Ozet

GitHub'daki "Chambers & Associates" avukat web sitesini (7 sayfalik, siyah-beyaz temali, Playfair Display tipografili profesyonel tasarim) React bilesenlerine donusturulup template galerisine eklenecek. Orijinal tasarim birebir korunacak.

## Template Ozellikleri

- Siyah-beyaz renk semasi (zarif, zamansiz)
- Playfair Display (basliklar) + Inter (govde) tipografisi
- Tam ekran hero bolgesi (adalet heykeli arka plani, gradient overlay)
- Glassmorphic sabit navigasyon (backdrop-blur)
- Hamburger menu (mobil)
- fadeInUp animasyonlari ve scroll gostergesi
- 7 sayfa icerigi: Ana Sayfa, Hakkimizda, Uygulama Alanlari, Referanslar, Iletisim, SSS, Gizlilik/Sartlar

## Sayfa Bazli Bolumleme

Tum sayfalar tek bir "FullLandingPage" bileseninde birlesirilecek (diger template'lerdeki yapiyla ayni):

1. **Header** - Sabit navbar, glassmorphism, hamburger menu
2. **Hero** - Tam ekran, arka plan gorsel, gradient overlay, fadeInUp animasyonlar, scroll indicator
3. **Overview/About** - 2 kolonlu grid (metin + istatistikler: 30+ yil, 500+ dava, %100 memnuniyet)
4. **Values** - 4 kart (Integrity, Excellence, Client-Focused, Innovation) hover efektleriyle
5. **Team** - 2 kisilik avukat kadrosu, daire fotograflar, kimlik bilgileri
6. **Practice Areas** - 6 hukuk alani karti (Corporate, Litigation, Real Estate, Employment, IP, Estate)
7. **Testimonials** - Alintilar, yazar bilgileri
8. **Contact** - Form + iletisim bilgileri grid
9. **FAQ** - Akordeon yapi, arama fonksiyonu
10. **CTA** - Koyu arka planli iletisim baglantisi
11. **Footer** - 3 kolonlu, siyah arka plan

## Uygulama Adimlari

### Adim 1: Template Dosya Yapisi Olusturma

```text
src/templates/lawyer/
  index.tsx                    -- Ana template bileşeni (PilatesTemplate yapısıyla aynı)
  components/
    TemplateHeader.tsx         -- Glassmorphic navbar + hamburger
    TemplateFooter.tsx         -- 3 kolonlu siyah footer
  pages/
    FullLandingPage.tsx        -- Tüm bölümleri barındıran tek sayfa
  sections/
    hero/HeroLawyer.tsx        -- Tam ekran hero, gradient overlay, fadeInUp, scroll indicator
    overview/OverviewSection.tsx   -- 2 kolon: metin/özellikler + istatistik kartları
    values/ValuesGrid.tsx      -- 4 değer kartı, hover translateY efekti
    team/TeamSection.tsx       -- Avukat profilleri, daire foto, credentials
    practice/PracticeAreas.tsx -- 6 hukuk alanı kartı, madde listeli
    testimonials/TestimonialsSection.tsx -- Alıntı kartları, büyük tırnak işareti
    contact/ContactSection.tsx -- Form + iletişim bilgisi grid
    faq/FAQSection.tsx         -- Akordeon, +/- geçişi
    cta/CTADark.tsx            -- Koyu arka plan CTA
  styles/
    lawyer.css                 -- Orijinal CSS'in tamamı (reset hariç), CSS değişkenleriyle
```

### Adim 2: CSS Stratejisi

Orijinal template'in CSS'i (main.css, hero.css, navigation.css, pages.css) tek bir `lawyer.css` dosyasinda birlestirilecek. Tum stiller `.lawyer-template` sinifi altinda kapsullenecek (scope), boylece diger template'lerle cakisma olmayacak.

```text
.lawyer-template {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-100 ... --color-gray-900;
  /* ... tüm orijinal değişkenler */
}
```

### Adim 3: Template Registry'ye Kayit

- `src/templates/index.ts` dosyasina `LawyerTemplate` eklenmesi
- Template ID: `lawyer-firm`
- Kategori: Hukuk & Danismanlik
- Desteklenen sektorler: lawyer, legal, law, attorney, consulting, finance

### Adim 4: Katalog Tanimina Ekleme

`src/templates/catalog/definitions.ts` dosyasina `lawyerFirm` taniminin eklenmesi. Bu, mevcut ChaiBuilder blok tipleriyle (HeroOverlay, ServicesGrid vb.) eslesen bir katalog girisdir -- ancak gercek React bilesenler (Adim 1) orijinal tasarimi birebir koruyacak.

### Adim 5: Tema Preset Ekleme

`src/components/chai-builder/themes/presets.ts` dosyasina `lawyer` tema preset'i:
- Siyah-beyaz renk paleti
- Playfair Display + Inter font ailesi
- border-radius: 0 (kare koseler, orijinal tasarima sadik)

### Adim 6: Onizleme Gorseli

Template galerisi icin bir statik onizleme gorseli olusturulacak (orijinal sitenin ekran goruntusu kullanilacak).

### Adim 7: deploy-to-netlify Guncelleme

Yayinlanan sitenin orijinal tasarimi birebir gostermesi icin `deploy-to-netlify` Edge Function'a `lawyer-firm` template renderer eklenmesi. Google Fonts baglantilari, tum CSS ve HTML yapisi dahil edilecek.

## Teknik Notlar

- Framer Motion zaten projede yuklu -- hero animasyonlari icin kullanilacak
- Google Fonts (Playfair Display + Inter) `index.html` veya biles en icinden yuklenecek
- Gorseller Unsplash/Pexels'ten referans aliniyor -- Pixabay entegrasyonu ile degistirilebilir olacak
- `TemplateProps` arayuzu korunacak, tum prop'lar (isEditable, onFieldEdit vb.) desteklenecek
- Orijinal template'deki tum responsive breakpoint'ler (768px, 480px) korunacak
