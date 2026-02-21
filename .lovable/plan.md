

# NUppel Marka Donusumu ve Yeni Landing Page

## Ozet

"Open Lucius" markasi "NUppel" olarak degistirilecek ve mevcut turuncu temalı landing page, shadcn-landing-page templateinden esinlenen lacivert/beyaz renk semasina sahip modern bir SaaS landing page'e donusturulecek.

## Degisiklik Kapsamı

### 1. Renk Paleti Degisikligi (index.css)

Mevcut turuncu (orange) tema yerine lacivert (navy blue) / beyaz paleti uygulanacak:

- **Primary:** `24 95% 53%` (turuncu) → `222 47% 31%` (koyu lacivert #2B3A67)
- **Accent:** Turuncu → Acik mavi vurgu (`210 100% 56%` - #1E90FF)  
- **Ring/Focus:** Turuncu → Lacivert
- **Sidebar renkleri:** Turuncu → Lacivert

### 2. Marka Adi Degisikligi (10 dosya)

Tum "Open Lucius" referanslari "NUppel" olarak guncellenecek:

- `src/components/landing/Header.tsx` - Logo metni
- `src/components/landing/Footer.tsx` - Logo ve copyright
- `src/components/dashboard/DashboardSidebar.tsx` - Sidebar logo
- `src/pages/Dashboard.tsx` - Karsilama mesaji
- `src/pages/Project.tsx` - Logo
- `src/pages/PublicWebsite.tsx` - Site basligi, "Go to" linki, "Powered by"
- `src/pages/Help.tsx` - Yardim metni
- `src/components/help/FAQSection.tsx` - SSS cevaplari
- `src/components/sections/addable/SiteFooter.tsx` - "Powered by"
- `src/index.css` - Yorum satiri

### 3. Landing Page Yeniden Tasarimi (shadcn-landing-page stilinde)

Mevcut bilesenler korunup icerik ve stil guncellenecek:

**Header.tsx:**
- Font-serif yerine modern sans-serif (Inter)
- Nav linkleri eklenmesi (Ozellikler, Fiyatlandirma, SSS)
- Dark mode toggle butonu
- "NUppel" logosu lacivert tonunda

**Hero.tsx:**
- Shadcn stilinde: sol tarafta baslik + aciklama + CTA butonu, sag tarafta mockup/gorsel
- Gradient glow efekti arka planda (lacivert tonlarinda)
- "Explore the Possibilities of AI" tarzi buyuk, bold baslik
- Alt kisimda sponsor/guven seridi

**Features.tsx:**
- Bento grid / card layout (2x2 veya 3 sutun)
- Her feature karti: ikon + baslik + aciklama
- Hafif glassmorphism efekti kartlarda
- Mevcut AI web siteleri ve AI icerik yazimi ozellikleri korunacak

**TrustSection.tsx:**
- Yatay logo/sponsor seridi (mevcut ikon gridinden donusum)
- Rakam gostergeleri (1000+ site, 50+ sektor, 30 saniye)

**WebsiteShowcase.tsx:**
- Mevcut gorsel kartlar korunacak, border/shadow stili lacivert temaya uyarlanacak

**HowItWorks.tsx:**
- Timeline/stepper tasarimi korunacak, renk guncellemesi

**CTASection.tsx:**
- Lacivert gradient arka plan
- Beyaz metin, acik mavi CTA butonu

**Footer.tsx:**
- NUppel markasi ile guncel footer
- Ek linkler: Gizlilik, Kullanim Sartlari

### 4. Font Degisikligi

- Heading fontu: `Playfair Display` → `Inter` veya `Plus Jakarta Sans` (modern SaaS tarzi)
- Body fontu: `Inter` korunacak

## Teknik Detay

### Degisecek dosyalar:
1. `src/index.css` - Renk paleti + font + yorum
2. `src/components/landing/Header.tsx` - Yeni navigasyon, NUppel logosu
3. `src/components/landing/Hero.tsx` - Shadcn stili hero section
4. `src/components/landing/Features.tsx` - Bento card layout
5. `src/components/landing/TrustSection.tsx` - Rakam gostergeleri
6. `src/components/landing/WebsiteShowcase.tsx` - Renk uyumu
7. `src/components/landing/HowItWorks.tsx` - Renk uyumu
8. `src/components/landing/CTASection.tsx` - Lacivert gradient
9. `src/components/landing/Footer.tsx` - NUppel markasi
10. `src/components/dashboard/DashboardSidebar.tsx` - NUppel logosu
11. `src/pages/Dashboard.tsx` - NUppel karsilama
12. `src/pages/Project.tsx` - NUppel logosu
13. `src/pages/PublicWebsite.tsx` - NUppel referanslari
14. `src/pages/Help.tsx` - NUppel referansi
15. `src/components/help/FAQSection.tsx` - NUppel referansi
16. `src/components/sections/addable/SiteFooter.tsx` - NUppel referansi

### Renk Semasi Detayi:
- Primary (Lacivert): `222 47% 31%` (#2B3A67)
- Accent (Parlak Mavi): `210 100% 56%` (#1E90FF)
- Background: Beyaz `0 0% 100%`
- Foreground: Koyu gri `222 47% 11%`
- Card arkaplan: Beyaz, hafif mavi-gri border

### Korunan Yapı:
- Mevcut routing ve authentication sistemi aynen kalacak
- Dashboard, editor, wizard hic degismeyecek
- Sadece landing page gorsel kimlik ve marka adi guncellenecek
- Sohbet (wizard chat) ozelligi aynen korunacak

