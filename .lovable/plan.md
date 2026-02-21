

# Tum Templateler Icin Hardcoded Icerik Temizligi

MedCare Pro'da yaptigimiz gibi, kalan 5 template'in (Specialty Cafe, Dental Clinic, Restaurant Elegant, Hotel Luxury, Engineer Portfolio) tum bilesenlerindeki hardcoded Turkce/Ingilizce fallback metinleri kaldirilacak. Icerik sadece mapper'lardan ve sectorProfile'dan gelecek.

---

## Etkilenen Bilesenler ve Degisiklikler

### 1. HeroCafe.tsx
- Satir 44: `"Where Every Cup Tells a Story"` -> `''`
- Satir 53: `"A specialty cafe in the heart of..."` -> `''`
- Bos title/description durumunda render'i gizle

### 2. HeroDental.tsx
- Satir 11: `'Saglikli Gulusler Icin Profesyonel Bakim'` -> `''`
- Satir 12: `'Uzman dis hekimlerimiz...'` -> `''`
- Satir 13: `'Randevu Alin'` -> `''`
- Satir 16: `'Dis Klinigi'` -> `''`
- Bos alanlar icin conditional render ekle

### 3. HeroRestaurant.tsx
- Satir 11: `'Lezzetin Sanatla Bulustugu Yer'` -> `''`
- Satir 12: `'Sefimizin ozenle hazirladi...'` -> `''`
- Satir 13: `'Fine Dining'` -> `''`
- Satir 14: `'Rezervasyon'` -> `''`
- Satir 15: `'Menu'` -> `''`
- Bos butonlari gizle

### 4. HeroHotel.tsx
- Satir 11: `'Luksun ve Konforun Bulustugu Yer'` -> `''`
- Satir 12: `'Essiz manzara...'` -> `''`
- Satir 15: `'Oda Ara'` -> `''`
- Satir 17: `isHotelMode` kontrolunu buttonText bos degilse calistir

### 5. HeroPortfolio.tsx
- Satir 11: `'Ahmet Yilmaz'` -> `''`
- Satir 12: `'Full Stack Developer'` -> `''`
- Satir 13: `'React, Node.js ve cloud...'` -> `''`
- Satir 15-20: `socials` default dizisi -> `[]`
- Satir 21: `'Projelerimi Gor'` -> `''`

### 6. CafeFeatures.tsx
- Satir 7-12: `defaultFeatures` -> `[]` (bos dizi)
- Satir 20: `"Why Choose Us"` -> `''`
- Satir 24: `"Crafted With Care"` -> `''`
- Bos features dizisinde bolumu gizle

### 7. CafeStory.tsx
- Satir 42: `'Our Story'` -> `''`
- Satir 45: `'Founded in the heart of the city...'` -> `''`

### 8. CafeGallery.tsx
- Satir 20: `"Gallery"` -> `''`
- Satir 24: `"Our Space"` -> `''`
- Satir 7-12: default images dizisi kalabilir (gorsel placeholder)

### 9. DentalServices.tsx
- Satir 9-14: `defaultServices` -> `[]` (bos dizi)
- Satir 18: `'Hizmetlerimiz'` -> `''`
- Satir 19: `'Uzman Bakim'` -> `''`
- Satir 20: `'Modern ekipman ve deneyimli...'` -> `''`

### 10. DentalTips.tsx
- Satir 10-15: `defaultTips` -> `[]` (bos dizi)
- Satir 19: `'Agiz Sagligi Ipuclari'` -> `''`
- Satir 20: `'Bilmeniz Gerekenler'` -> `''`

### 11. ChefShowcase.tsx
- Satir 11: `'Bas Sefimiz'` -> `''`
- Satir 12: `'Chef Ahmet Yilmaz'` -> `''`
- Satir 13: `'15 yillik deneyimiyle...'` -> `''`
- Satir 15-19: `signatureDishes` default -> `[]`
- Satir 64: `'Imza Yemekler'` -> props'tan gelecek

### 12. RoomShowcase.tsx
- Satir 7-32: `defaultRooms` -> `[]`
- Satir 36: `'Odalarimiz'` -> `''`
- Satir 37: `'Konfor ve Zarafet'` -> `''`
- Satir 83: `'Rezervasyon'` butonu -> props'tan gelecek

### 13. HotelAmenities.tsx
- Satir 9-16: `defaultAmenities` -> `[]`
- Satir 20: `'Olanaklar'` -> `''`
- Satir 21: `'Premium Hizmetler'` -> `''`

### 14. ProjectShowcase.tsx
- Satir 5-27: `defaultProjects` -> `[]`
- Satir 31: `'Projeler'` -> `''`
- Satir 32: `'Son Calismalarim'` -> `''`

### 15. SkillsGrid.tsx
- Satir 4-32: `defaultCategories` -> `[]`
- Satir 36: `'Yetenekler'` -> `''`
- Satir 37: `'Teknik Beceriler'` -> `''`

### 16. RestaurantMenu.tsx
- Satir 5-27: `defaultCategories` -> `[]`
- Satir 31: `'Menumuz'` -> `''`
- Satir 32: `'Lezzetli Secimler'` -> `''`

### 17. MenuShowcase.tsx
- Satir 7-14: `default items` -> `[]`
- Satir 37: `"Our Menu"` -> `''`

### 18. TestimonialsCarousel.tsx
- Satir 6-9: `defaultTestimonials` -> `[]`
- Bos testimonials durumunda bolumu gizle

### 19. FAQAccordion.tsx
- Satir 5-10: `defaultItems` -> `[]` (zaten mapper'dan dolmasi lazim)

### 20. definitions.ts — Kalan hardcoded metin temizligi
- `sectionSubtitle: 'Degerlendirmeler'` -> `''` (tum template'lerde)
- `sectionSubtitle: 'Referanslar'` -> `''` (engineer template)
- `AppointmentBooking` ve `ContactForm` default prop'lari: `'Randevu / Rezervasyon'`, `'Hemen Baslayin'`, `'Iletisim'`, `'Bize Ulasin'` vb. -> `''`

---

## Uygulama Sirasi

1. **definitions.ts** — Kalan hardcoded Turkce metinleri temizle (AppointmentBooking, ContactForm, TestimonialsCarousel subtitle'lari)
2. **Hero bilsenleri** (6 dosya) — Tum fallback'leri kaldir, conditional render ekle
3. **Icerik bilsenleri** (CafeFeatures, CafeStory, CafeGallery, DentalServices, DentalTips, ChefShowcase, RestaurantMenu, MenuShowcase) — Default dizileri bosalt, fallback metinleri kaldir
4. **Ozel bilsenler** (RoomShowcase, HotelAmenities, ProjectShowcase, SkillsGrid) — Default dizileri bosalt
5. **Ortak bilsenler** (TestimonialsCarousel, FAQAccordion) — Default dizileri bosalt

---

## Beklenen Sonuc

- Hicbir bilesenin icinde hardcoded Turkce/Ingilizce metin kalmaz
- Tum icerikler 3 katmanli oncelik zincirinden gelir: generatedContent > sectorProfile > bos
- Template degistirildiginde icerik kaybi olmaz
- Bos prop gelen alanlar render edilmez (sayfa bos metin gostermez)

