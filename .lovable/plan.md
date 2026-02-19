
## Dental Clinic Template'ini Sisteme Entegre Etme

### Kaynak Template
**React Dental Clinic Landing Page** (React + Vite + Tailwind CSS + Framer Motion)
- Demo: https://react-dental-landing-page.netlify.app/
- Temiz, modern, sky-blue tonlarinda dis klinigi tasarimi
- Bolumleri: Hero, Services, About, Tips, Book Appointment, Testimonials, Footer

### Entegrasyon Yaklasimi

Bu template direkt JSX kopyalamak yerine, mevcut **section-based sistem** icin yeni section bilesenlerini olusturarak eklenecek. Boylece editorde tamamen duzenlenebilir ve tema degisikliklerine duyarli olacak.

### Yapilacaklar

#### 1. Yeni Section Bilesenleri (4 adet)

Dental template'in orijinal gorunumunu koruyarak, mevcut `SectionComponentProps` arayuzune uygun yeni section bilesenleri:

**`src/components/sections/HeroDental.tsx`**
- Sol tarafta baslik + aciklama + CTA butonu, sag tarafta yuvarlak koseli gorsel
- `sky-50` arka plan yerine tema renkleri (`bg-secondary`, `text-primary`)
- Framer Motion ile fade-in animasyonlari
- Props: `title`, `description`, `buttonText`, `buttonLink`, `image`

**`src/components/sections/DentalServices.tsx`**
- 4'lu kart grid, her kartta ikon + baslik + aciklama
- Gradient arka plan (`from-card to-secondary`)
- Framer Motion stagger animasyonu (kartlar sirayla yukari kayarak gorunur)
- `react-icons` yerine Lucide ikonlari kullanilacak (proje zaten Lucide kullaniyor)
- Props: `title`, `description`, `services[]` (icon, title, desc)

**`src/components/sections/DentalTips.tsx`**
- Tab/Toggle tarzinda icerik — tiklandiginda aciklama degisen interaktif kartlar
- Her tip icin ikon + baslik + icerik
- Props: `title`, `description`, `tips[]` (title, content, icon)

**`src/components/sections/DentalBooking.tsx`**
- Cok adimli randevu formu (3 step: Kisisel Bilgi -> Tarih/Saat -> Onay)
- Step indicator ile ilerleme gosterimi
- Mevcut `AppointmentBooking` section'indan farkli: daha gorsel, step-by-step UI
- Props: `title`, `description`, `services[]`, `availableTimes[]`

#### 2. Registry ve Katalog Guncelleme

**`src/components/sections/registry.ts`**
- 4 yeni section tipini ekle: `HeroDental`, `DentalServices`, `DentalTips`, `DentalBooking`
- Hem PascalCase hem kebab-case key'leri kaydet
- `sectionCatalog`'a Turkce etiketlerle ekle (kategori: "dental")

#### 3. Template Tanimi

**`src/templates/catalog/definitions.ts`**
- `dentalClinic: TemplateDefinition` ekle:
  - id: `dental-clinic`
  - sections: `HeroDental`, `DentalServices`, `AboutSection` (mevcut), `DentalTips`, `DentalBooking`, `TestimonialsCarousel` (mevcut), `ContactForm` (mevcut), `CTABanner` (mevcut)
  - themePresetKey: `dental-clinic`
  - supportedIndustries: `doctor, dentist, dental, clinic, health, hospital, medical, veterinary, physiotherapy, optometry`

#### 4. Tema Preset'i

**`src/themes/presets.ts`**
- `dentalClinicPreset: ThemePresetValues` ekle:
  - Font: heading `Sora`, body `Inter`
  - Renkler: sky-blue tonlari (`#0284c7` primary, `#f0f9ff` background, `#0c4a6e` foreground)
  - borderRadius: `12px`
- `templateToPreset` map'ine `"dental-clinic": dentalClinicPreset` ekle
- `namedPresets`'e `"Dental Klinik"` olarak ekle

#### 5. Template Index Guncelleme

**`src/templates/index.ts`**
- `getAllTemplates()` zaten catalog'dan okuyor, otomatik gorunecek
- Preview gorseli icin mevcut `showcase-dental.jpg` asset'i kullanilacak (zaten var)

### Teknik Detaylar

**Animasyon Detaylari (Framer Motion):**
- Hero: `initial={{ opacity: 0, y: 30 }}` -> `animate={{ opacity: 1, y: 0 }}` (0.6s delay cascade)
- Services kartlari: `whileInView` ile viewport'a girdiginde stagger (0.15s aralikla)
- Tips: tab degisiminde `AnimatePresence` ile icerik gecisi
- Booking steps: `slide` gecis animasyonu

**Ikon Stratejisi:**
Orijinal template `react-icons` kullaniyor ama projede `lucide-react` var. Tum ikonlar Lucide karsiliklarla degistirilecek:
- `FaTooth` -> Lucide `Heart` veya emoji kullanimina devam
- `GiToothbrush` -> Lucide `Sparkles`
- `FaSmileBeam` -> Lucide `Smile`
- `FaXRay` -> Lucide `ScanLine`
- `FaShieldAlt` -> Lucide `Shield`

**Dosya Degisiklikleri:**

| Dosya | Islem |
|-------|-------|
| `src/components/sections/HeroDental.tsx` | Yeni dosya |
| `src/components/sections/DentalServices.tsx` | Yeni dosya |
| `src/components/sections/DentalTips.tsx` | Yeni dosya |
| `src/components/sections/DentalBooking.tsx` | Yeni dosya |
| `src/components/sections/registry.ts` | 4 yeni section kaydı |
| `src/templates/catalog/definitions.ts` | `dentalClinic` template tanimi |
| `src/themes/presets.ts` | `dentalClinicPreset` + kayitlar |

### Sonuc

- Dental Clinic template'i editor'de tamamen duzenlenebilir olacak (metin, gorsel, renk, font)
- Tema degistirildiginde tum bilesenler guncellenecek
- "Sablon Degistir" modalinde gorunecek
- Yayinlandiginda (deploy-to-netlify) ayni gorunumu koruyacak
- Doktor, dis hekimi, klinik, hastane gibi sektorler icin otomatik onerilecek
