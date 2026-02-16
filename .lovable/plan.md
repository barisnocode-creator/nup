

## Natural Template Onizleme ve Galeri Duzeltmesi

Natural sablonunun galeri kartinda ve onizlemede kotu gorunmesinin 3 temel nedeni var:

---

### Sorun 1: Icerik Uyumsuzlugu
Galeri onizlemesinde kullanilan `defaultDemoContent` Turkce is yeri icerigi iceriyor ("Hos Geldiniz", "Profesyonel Hizmet"). Natural sablonu ise Ingilizce yasam tarzi/blog icerigi bekliyor. Sonuc: Hero basliginda "Hos Geldiniz", about bolumunde "Hikayemiz" gibi uyumsuz metinler gorunuyor.

**Cozum:** `NaturalFullLandingPage` bilesenine icerik kontrolu eklenecek - gelen icerik sablona uygun degilse (ornegin hero basligi cok kisa veya varsayilan demo icerigi ise), sablonun kendi varsayilan Ingilizce icerigi kullanilacak.

---

### Sorun 2: Dark Mode Toggle Global Etkisi
`NaturalHeader` icerisindeki dark mode toggle butonu `document.documentElement.classList` uzerinde islem yapiyor. Bu, galeri onizlemesinde veya editorde tiklandiginda tum sayfayi etkiliyor - sadece sablonu degil.

**Cozum:** Dark mode toggle'i `document.documentElement` yerine sablonun kendi `.natural-template` wrapper'i uzerinde calisacak sekilde scope'lanacak. Boylece sadece sablon icindeki renkler degisecek.

---

### Sorun 3: CSS Degiskenleri Sablona Ozel Degil
Natural sablonu `bg-background`, `text-foreground`, `bg-muted` gibi global CSS degiskenlerini kullaniyor. Galeri onizlemesinde dashboard'un turuncu temasi (`--primary: 24 95% 53%`) uygulandiginda, sablonun kendi renk paleti (krem/bej tonlari) gorunmuyor.

**Cozum:** `.natural-template` wrapper'ina sablona ozel CSS degiskenleri inline style veya scoped CSS olarak enjekte edilecek. Boylece sablon kendi renk paletini her ortamda koruyacak.

---

### Uygulama Adimlari

**1. NaturalTemplate (index.tsx)** - Wrapper'a sablona ozel CSS degiskenleri ekleme
- `.natural-template` div'ine inline style ile `--background`, `--foreground`, `--primary`, `--muted`, `--card`, `--border` degiskenlerini krem/bej tonlarinda set etme
- Dark mode state'ini bu bilesenin icinde yonetme (global degil)

**2. NaturalHeader.tsx** - Dark mode scope duzeltmesi
- `document.documentElement` yerine `.natural-template` wrapper'ina `ref` ile erisip sinif ekleme/cikarma
- Ya da dark mode state'ini parent'tan (NaturalTemplate) prop olarak alma

**3. NaturalFullLandingPage.tsx** - Icerik fallback mantigi
- `content.pages.home.hero.title` cok kisa veya varsayilan demo icerigi ise, sablonun kendi varsayilan baslik/aciklamasini kullanma
- Boylece galeri onizlemesinde her zaman guzel gorunecek

**4. natural.css** - Scoped CSS degiskenleri
- `.natural-template` icin ozel CSS degiskenleri tanimlanacak (hem light hem dark mod icin)
- `.natural-template.dark` sinifi icin dark mod renkleri

---

### Teknik Detaylar

Duzenlenecek dosyalar:
1. `src/templates/natural/index.tsx` - CSS degiskenleri enjeksiyonu, dark mode state yonetimi
2. `src/templates/natural/components/NaturalHeader.tsx` - Dark mode toggle scope duzeltmesi, prop ile state alma
3. `src/templates/natural/pages/FullLandingPage.tsx` - Icerik fallback mantigi
4. `src/templates/natural/styles/natural.css` - Scoped CSS degiskenleri (light/dark)

Bu degisikliklerle Natural sablonu:
- Galeri kartinda kendi renk paleti ve icerigiyle gorunecek
- Onizlemede dashboard temasini degil kendi temasini kullanacak
- Dark mode toggle sadece sablonu etkileyecek, tum sayfayi degil

