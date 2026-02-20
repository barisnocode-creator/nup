
## Sorunun Kökü: deploy-to-netlify Section Type Uyumsuzluğu

### Neden Site Bozuluyor?

Editör ve Netlify deploy fonksiyonu **farklı diller konuşuyor**:

```
Editörde kaydedilen section type'ları (site_sections tablosunda):
  HeroCafe, CafeFeatures, MenuShowcase, CafeStory, CafeGallery,
  TestimonialsCarousel, AppointmentBooking, ContactForm, CTABanner,
  HeroRestaurant, ChefShowcase, RestaurantMenu, HeroHotel, RoomShowcase,
  HotelAmenities, ImageGallery, StatisticsCounter, FAQAccordion,
  HeroPortfolio, SkillsGrid, ProjectShowcase, HeroDental, DentalServices,
  DentalTips, DentalBooking, AboutSection, AddableSiteFooter, AddableBlog...

deploy-to-netlify renderSection() switch-case:
  "hero-centered", "hero-overlay", "hero-split",
  "statistics-counter", "about-section", "services-grid",
  "testimonials-carousel", "image-gallery", "faq-accordion",
  "contact-form", "cta-banner", "pricing-table",
  "appointment-booking", "pilates-hero", "pilates-features"...
  → default: boş string döndür ("")
```

**Sonuç:** Template değiştirilip yayınlandığında tüm section'lar `default` case'e düşüyor → her biri `""` döndürüyor → HTML içi tamamen boş → site bozuluyor.

---

## Plan: deploy-to-netlify Tam Section Eşleme

### Değiştirilecek Tek Dosya

`supabase/functions/deploy-to-netlify/index.ts`

Bu dosyada iki şey yapılacak:

**1. Yeni render fonksiyonları eklenmesi** (eksik olan tüm section tipleri için):
- `renderHeroCafe` — HeroCafe hero bölümü
- `renderHeroDental` — HeroDental hero
- `renderHeroRestaurant` — HeroRestaurant hero
- `renderHeroHotel` — HeroHotel hero (tarih picker olmadan)
- `renderHeroPortfolio` — HeroPortfolio (isim, bio, avatar, CTA)
- `renderCafeFeatures` — CafeFeatures 4'lü ikon + açıklama grid
- `renderMenuShowcase` — MenuShowcase (items array)
- `renderCafeStory` — CafeStory (görsel + metin + özellik listesi)
- `renderCafeGallery` — CafeGallery (images array, 2x2 grid)
- `renderChefShowcase` — ChefShowcase (şef isim, bio, görsel)
- `renderRestaurantMenu` — RestaurantMenu (kategorili menü)
- `renderRoomShowcase` — RoomShowcase (oda kartları)
- `renderHotelAmenities` — HotelAmenities (olanak kartları)
- `renderHeroPortfolio` — Portfolio hero
- `renderSkillsGrid` — SkillsGrid (skill badge grid)
- `renderProjectShowcase` — ProjectShowcase (proje kartları)
- `renderDentalServices` — DentalServices (4 servis kartı)
- `renderDentalTips` — DentalTips (ipucu kartları)
- `renderDentalBooking` — DentalBooking (adımlı randevu = AppointmentBooking ile aynı)
- `renderAboutSection` — zaten mevcut (about-section), PascalCase alias ekle
- `renderAddableSiteFooter` — SiteFooter (siteName, tagline, phone, email)
- `renderAddableBlog` — Blog bölümü (4 yazı kartı)

**2. switch-case içine tüm PascalCase eşlemeleri eklenmesi:**

```typescript
// Mevcut (sadece kebab-case):
case "hero-centered": return renderHeroCentered(section);
case "about-section": return renderAboutSection(section);

// Yeni (hem PascalCase hem kebab-case):
case "HeroCentered":
case "hero-centered":
  return renderHeroCentered(section);

case "HeroCafe":
case "hero-cafe":
  return renderHeroCafe(section);

case "HeroDental":
case "hero-dental":
  return renderHeroDental(section);

case "HeroRestaurant":
case "hero-restaurant":
  return renderHeroRestaurant(section);

case "HeroHotel":
case "hero-hotel":
  return renderHeroHotel(section);

case "HeroPortfolio":
case "hero-portfolio":
  return renderHeroPortfolio(section);

case "AboutSection":
case "about-section":
  return renderAboutSection(section);

case "StatisticsCounter":
case "statistics-counter":
  return renderStatisticsCounter(section);

case "ServicesGrid":
case "services-grid":
  return renderServicesGrid(section);

case "TestimonialsCarousel":
case "testimonials-carousel":
  return renderTestimonialsCarousel(section);

case "FAQAccordion":
case "faq-accordion":
  return renderFAQAccordion(section);

case "ImageGallery":
case "image-gallery":
  return renderImageGallery(section);

case "ContactForm":
case "contact-form":
  return renderContactForm(section, projectId);

case "CTABanner":
case "cta-banner":
  return renderCTABanner(section);

case "PricingTable":
case "pricing-table":
  return renderPricingTable(section);

case "AppointmentBooking":
case "appointment-booking":
case "DentalBooking":
case "dental-booking":
  return renderAppointmentBooking(section);

case "CafeFeatures":
case "cafe-features":
  return renderCafeFeatures(section);

case "MenuShowcase":
case "menu-showcase":
  return renderMenuShowcase(section);

case "CafeStory":
case "cafe-story":
  return renderCafeStory(section);

case "CafeGallery":
case "cafe-gallery":
  return renderCafeGallery(section);

case "ChefShowcase":
case "chef-showcase":
  return renderChefShowcase(section);

case "RestaurantMenu":
case "restaurant-menu":
  return renderRestaurantMenu(section);

case "RoomShowcase":
case "room-showcase":
  return renderRoomShowcase(section);

case "HotelAmenities":
case "hotel-amenities":
  return renderHotelAmenities(section);

case "SkillsGrid":
case "skills-grid":
  return renderSkillsGrid(section);

case "ProjectShowcase":
case "project-showcase":
  return renderProjectShowcase(section);

case "DentalServices":
case "dental-services":
  return renderDentalServices(section);

case "DentalTips":
case "dental-tips":
  return renderDentalTips(section);

case "AddableSiteFooter":
  return renderAddableSiteFooter(section);

case "AddableBlog":
  return renderAddableBlog(section);

// Addable sections (silently ignored if no renderer — placeholder göster)
case "AddableAppointment":
  return renderAppointmentBooking(section);
case "AddableFAQ":
  return renderFAQAccordion(section);
case "AddableMessageForm":
  return renderContactForm(section, projectId);
case "AddableWorkingHours":
case "AddableOnlineConsultation":
case "AddableInsurance":
case "AddableMenuHighlights":
case "AddableRoomAvailability":
case "AddableCaseEvaluation":
case "AddableBeforeAfter":
case "AddablePetRegistration":
case "AddableCallUs":
case "AddableSocialProof":
case "AddableTeamGrid":
case "AddablePromotionBanner":
  return renderGenericAddable(section); // Basit placeholder renderer
```

### Render Fonksiyonu Örnekleri

**renderCafeFeatures:**
```html
<section style="background:var(--muted); padding:5rem 0">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    <h2 style="text-align:center;color:var(--foreground)">{{title}}</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2rem">
      <!-- feature kartları: icon + title + description -->
    </div>
  </div>
</section>
```

**renderAddableSiteFooter:**
```html
<footer style="background:var(--foreground);color:var(--background);padding:3rem 0">
  <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem">
    <h3>{{siteName}}</h3>
    <p>{{tagline}}</p>
    <div>📞 {{phone}} | 📧 {{email}} | 📍 {{address}}</div>
    <p>© 2026 {{siteName}}</p>
  </div>
</footer>
```

**renderAddableBlog:**
```html
<section style="background:var(--background);padding:5rem 0">
  <div style="max-width:72rem;margin:0 auto">
    <h2>{{sectionTitle}}</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem">
      <!-- post1Title, post1Excerpt, post1Category, post1Image kartları -->
    </div>
  </div>
</section>
```

### HeroHotel için Önemli Not

HeroHotel'in React bileşeninde tarih picker var — bu Netlify'da çalışmaz. Deploy fonksiyonunda sadece başlık + açıklama + CTA butonu gösterilecek (tarih picker olmadan), tıpkı diğer hero'lar gibi.

### Değişiklik Özeti

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/deploy-to-netlify/index.ts` | ~20 yeni render fonksiyonu + switch-case'e tüm PascalCase alias'lar |

**Sadece 1 dosya** — kapsamlı ama odaklı bir değişiklik.

### Beklenen Sonuç

Template değiştirilip "Güncelle" butonuna basıldığında:
- Önceki: Boş sayfa (tüm section'lar `default` case'e düşüyor)
- Sonrası: Editördeki görünümle birebir uyumlu, tema renklerini kullanan tam HTML sayfası
