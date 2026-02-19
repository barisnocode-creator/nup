

## Preline UI Tasarim Dilinden Esinlenen 3 Yeni Template

Preline UI'in temiz, modern tasarim dilini referans alarak 3 yeni sektor template'i olusturulacak. Her biri mevcut section-based editore tam uyumlu, duzenlenebilir ve kaydedilebilir olacak.

### Mevcut Durum
- **Specialty Cafe** ve **Dental Clinic** template'leri zaten calisiyor
- Section registry'de 22 section tipi kayitli
- Yeni template eklemek icin sadece: 1) Section bilesenleri, 2) Registry kaydi, 3) Definition, 4) Theme preset gerekiyor

### Eklenecek 3 Template

#### 1. Restoran Template (Preline Agency karanlik estetigi + yemek sektoru)
Yeni section'lar:
- **HeroRestaurant** — Tam ekran gorsel arka plan, ortalanmis baslik, animasyonlu alt metin, "Rezervasyon" ve "Menu" butonlari
- **ChefShowcase** — Sef tanitim section'i: buyuk gorsel + baslik + aciklama + imza yemekler listesi
- **RestaurantMenu** — Kategorili menu kartlari (Baslangiclar, Ana Yemekler, Tatlilar), fiyat ve gorsel destekli

Mevcut section'lardan kullanilacaklar: TestimonialsCarousel, CafeGallery, AppointmentBooking (Rezervasyon olarak), ContactForm, CTABanner

#### 2. Otel Template (Preline Agency profesyonel stili + konaklama sektoru)
Yeni section'lar:
- **HeroHotel** — Parallax arka plan, check-in/check-out tarih secicili overlay, "Oda Ara" butonu
- **RoomShowcase** — Oda kartlari: gorsel, oda tipi, fiyat/gece, ozellik ikonlari (WiFi, klima, minibar), "Rezervasyon" butonu
- **HotelAmenities** — Otel olanaklari grid'i: havuz, spa, restoran, fitness, vale park gibi ikonlu kartlar

Mevcut section'lardan kullanilacaklar: ImageGallery, TestimonialsCarousel, StatisticsCounter, ContactForm, CTABanner, FAQAccordion

#### 3. Muhendis/Freelancer Template (Preline Personal tasarimi referans)
Yeni section'lar:
- **HeroPortfolio** — Avatar + isim + unvan + kisa bio + sosyal medya linkleri (Preline Personal birebir esinlenme)
- **ProjectShowcase** — Proje kartlari: gorsel, baslik, aciklama, kullanilan teknolojiler badge'leri, canli link
- **SkillsGrid** — Yetenek kartlari: kategori (Frontend, Backend, DevOps), ilerleme cubugu veya ikonlu liste

Mevcut section'lardan kullanilacaklar: TestimonialsCarousel, ContactForm, CTABanner, StatisticsCounter

---

### Olusturulacak Dosyalar

| Dosya | Aciklama |
|-------|----------|
| `src/components/sections/HeroRestaurant.tsx` | Tam ekran restoran hero |
| `src/components/sections/ChefShowcase.tsx` | Sef tanitim section |
| `src/components/sections/RestaurantMenu.tsx` | Kategorili yemek menusu |
| `src/components/sections/HeroHotel.tsx` | Tarih secicili otel hero |
| `src/components/sections/RoomShowcase.tsx` | Oda kartlari vitrini |
| `src/components/sections/HotelAmenities.tsx` | Otel olanaklari grid |
| `src/components/sections/HeroPortfolio.tsx` | Kisisel portfolio hero |
| `src/components/sections/ProjectShowcase.tsx` | Proje vitrini |
| `src/components/sections/SkillsGrid.tsx` | Yetenek kartlari |

### Guncellenecek Dosyalar

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/sections/registry.ts` | 9 yeni section kaydi |
| `src/templates/catalog/definitions.ts` | 3 yeni template tanimi (restaurant, hotel, engineer) |
| `src/themes/presets.ts` | 3 yeni theme preset (restaurantElegant, hotelLuxury, engineerDark) |
| `src/templates/index.ts` | templateToPreset ve templateRegistry guncelleme |

### Theme Renk Paleti Plani

- **Restaurant**: Koyu arka plan (#0a0a0a), altin vurgular (#d4a853), Playfair Display + Inter
- **Hotel**: Lacivert tonlar (#0f172a), altin/bej vurgular (#c9a96e), Cormorant Garamond + Inter
- **Engineer/Freelancer**: Siyah (#0a0a0a), mavi vurgular (#3b82f6), Space Grotesk + Inter (Preline Personal'a yakin)

### Her Template'in Section Yapisi

**Restaurant:**
1. HeroRestaurant (zorunlu)
2. CafeFeatures (restoran ozellikleri olarak uyarlanir)
3. RestaurantMenu
4. ChefShowcase
5. CafeGallery (restoran galeri)
6. TestimonialsCarousel
7. AppointmentBooking (Rezervasyon)
8. ContactForm
9. CTABanner

**Hotel:**
1. HeroHotel (zorunlu)
2. RoomShowcase
3. HotelAmenities
4. ImageGallery (otel galeri)
5. StatisticsCounter (yil, misafir, oda sayisi)
6. TestimonialsCarousel
7. FAQAccordion
8. ContactForm
9. CTABanner

**Engineer/Freelancer:**
1. HeroPortfolio (zorunlu)
2. SkillsGrid
3. ProjectShowcase
4. StatisticsCounter (proje, musteri, yil)
5. TestimonialsCarousel
6. ContactForm
7. CTABanner

### Animasyon ve Gorsel Kalite

Tum yeni section'lar mevcut sisteme uyumlu olarak:
- framer-motion ile staggered fade-in giris animasyonlari
- IntersectionObserver ile goruntuye girdiginde tetiklenen animasyonlar
- Hover efektleri (scale, shadow, border-glow)
- Responsive tasarim (mobil, tablet, masaustu)
- EditableText ve EditableImage bilesenleri ile editorle tam uyum
- onUpdate callback'i ile otomatik kaydetme destegi

### Uygulama Sirasi

1. Once 9 yeni section bilesenini olustur
2. Registry'ye kaydet
3. definitions.ts'e 3 template tanimi ekle
4. presets.ts'e 3 theme preset ekle
5. index.ts'i guncelle
6. Editorde test et

