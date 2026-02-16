

## Natural Template - Orijinal Repo ile Birebir Eslestirme

Mevcut Natural sablonu orijinal repo'dan cok farkli olusturulmus. Icerik Turkcelesstirilmis, dark mode toggle eksik, makale verileri sadelesstirilmis, footer kategorileri degistirilmis. Asagidaki plan ile orijinal repo'daki tasarimi birebir yansitacak sekilde guncelleme yapilacak.

---

### Farklar ve Yapilacaklar

**1. Header - Dark Mode Toggle Eksik + Icerik Yanlis**
- Mevcut: Turkce nav linkleri ("Ana Sayfa", "Makaleler", "Hakk1m1zda", "Iletisim"), dark mode yok
- Orijinal: Ingilizce nav ("Home", "Articles", "Wellness", "Travel", "About"), Moon/Sun dark mode toggle butonu
- Islem: `NaturalHeader.tsx` tamamen guncellenecek - dark mode toggle eklenecek, nav linkleri orijinal ile eslestirilecek, "Join Now" butonu

**2. HeroSection - Icerik Hardcoded Olmali**
- Mevcut: Props ile disaridan aliyor (title, description), "Katil" butonu
- Orijinal: Hardcoded "Journey Through Life's Spectrum" basligi, uzun aciklama metni, "Join Now" butonu
- Islem: Varsayilan degerler orijinal Ingilizce icerikle guncellenecek, buton metni "Join Now" olacak

**3. IntroSection - Icerik Hardcoded Olmali**
- Mevcut: Props aliyor, bos icerik gelirse bosluyor
- Orijinal: Hardcoded "Perspective is a space for exploring ideas..." basligi ve aciklama
- Islem: Varsayilan Ingilizce icerik eklenecek

**4. Articles Data - Tamamen Eksik**
- Mevcut: Sadece 6 basit kayit (id, title, category, date, image) - subtitle, readTime, author, content, tags yok
- Orijinal: 6 zengin makale verisi (subtitle, readTime, author bilgileri, tam icerik, tags)
- Islem: `articles.ts` orijinal repo'daki zengin veriyle tamamen degistirilecek

**5. ArticleCard - Size Prop Eksik**
- Mevcut: `div` wrapper, size prop yok
- Orijinal: `<a>` link wrapper, `size` prop (small/large) ile responsive boyut destegi
- Islem: `<a>` tag'i ve size prop eklenerek orijinale eslestirilecek

**6. NewsletterSection - Icerik Yanlis**
- Mevcut: Turkce varsayilan metinler ("Ilham alin.", "Abone Ol")
- Orijinal: "Stay inspired.", "Subscribe" Ingilizce icerik
- Islem: Varsayilan degerler Ingilizce orijinal ile degistirilecek

**7. Footer - Kategoriler ve Icerik Yanlis**
- Mevcut: Turkce ("Kesfet", "Iletisim", "Takip Et", "Yasal") - 2'ser link
- Orijinal: Ingilizce ("Explore": Wellness/Travel/Creativity/Growth, "About": Our Story/Authors/Contact, "Resources": Style Guide/Newsletter, "Legal": Privacy/Terms) - daha zengin icerik
- Islem: `NaturalFooter.tsx` orijinal repo ile eslestirilecek

**8. CSS - Animasyonlar .natural-template Scope'unda**
- Mevcut: Tum animasyonlar `.natural-template` prefix ile scoped
- Orijinal: Global utility class'lar (`@layer utilities` icinde)
- Islem: CSS dogru calisiyor, scope'lu yaklasim korunacak (proje genelini etkilememek icin daha iyi)

**9. FullLandingPage - Icerik Baslik Yanlis**
- Mevcut: Turkce "One Cikanlar", "Tumunu gor"
- Orijinal: "Featured Articles", "View all"
- Islem: Hardcoded metinler Ingilizce orijinale cekilecek

---

### Teknik Detaylar

Duzenlenecek dosyalar:
1. `src/templates/natural/components/NaturalHeader.tsx` - Dark mode toggle ekleme, Ingilizce nav, "Join Now"
2. `src/templates/natural/components/NaturalFooter.tsx` - Orijinal Ingilizce footer kategorileri
3. `src/templates/natural/sections/HeroSection.tsx` - Varsayilan Ingilizce icerik
4. `src/templates/natural/sections/IntroSection.tsx` - Varsayilan Ingilizce icerik
5. `src/templates/natural/sections/ArticleCard.tsx` - `<a>` wrapper ve `size` prop
6. `src/templates/natural/sections/NewsletterSection.tsx` - Ingilizce varsayilanlar
7. `src/templates/natural/data/articles.ts` - Tam zengin veri (subtitle, author, content, tags)
8. `src/templates/natural/pages/FullLandingPage.tsx` - "Featured Articles" basligi

