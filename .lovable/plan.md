

## Natural Template - ChaiBuilder'a Ozel Blok Olusturma Plani

### Neden Gerekli?

Mevcut jenerik bloklar (HeroCentered, ServicesGrid, AboutSection) Natural template'in tasarimini yansitamiyor. Natural'in kendine ozgu bilesenleri var: split hero, makale kartlari, newsletter, pill-nav header. Bu bilesenlerin ChaiBuilder bloku olarak yeniden yazilmasi gerekiyor.

### Yaklasim

Editore hic dokunmuyoruz. Sadece yeni blok tipleri olusturup, Natural template definition'ini bu bloklari kullanacak sekilde guncelliyoruz.

---

### Adim 1: NaturalHero Bloku

**Dosya:** `src/components/chai-builder/blocks/hero/NaturalHero.tsx`

Mevcut `HeroSection.tsx`'in ChaiBuilder blok versiyonu. registerChaiBlock ile kaydedilecek.

- 2 kolonlu split layout (sol: gorsel, sag: baslik + aciklama)
- Sosyal medya ikonlari (Instagram, Facebook, LinkedIn)
- Yuvarlak koseli gorsel alani (rounded-2rem)
- "Join Now" butonu
- Serif font basliklar
- Animasyonlar (scale-in, slide-down, slide-up)
- Props: title, description, buttonText, image
- inlineEditProps: title, description, buttonText

```text
Blok Yapisi:
+----------------------------------+
|  [Gorsel]  |  Baslik            |
|  rounded   |  Aciklama          |
|  4/3 ratio |  [Button] [Icons]  |
+----------------------------------+
```

---

### Adim 2: NaturalIntro Bloku

**Dosya:** `src/components/chai-builder/blocks/about/NaturalIntro.tsx`

Basit ortalanmis metin blogu. Mevcut `IntroSection.tsx`'in birebir kopyasi.

- Ortalanmis baslik ve aciklama
- max-w-4xl container
- Props: title, description
- inlineEditProps: title, description

---

### Adim 3: NaturalArticleGrid Bloku

**Dosya:** `src/components/chai-builder/blocks/gallery/NaturalArticleGrid.tsx`

Mevcut `ArticleCard.tsx` + `FullLandingPage.tsx` articles section'inin birlesitirilmis hali.

- 3+3 grid layout (ilk satir large, ikinci satir normal)
- Her kart: gorsel, gradient overlay, kategori etiketi, tarih badge, baslik
- Floating arrow butonu
- 6 ayri gorsel ve baslik prop'u
- Props: article1Title, article1Image, article1Category, article1Date, ... (x6)
- Yuvarlak koseli kartlar (rounded-2.5rem)
- Hover efekti (scale 1.02, shadow)

```text
Blok Yapisi:
+--------+--------+--------+
| Card 1 | Card 2 | Card 3 |
| large  | large  | large  |
+--------+--------+--------+
| Card 4 | Card 5 | Card 6 |
| normal | normal | normal |
+--------+--------+--------+
```

---

### Adim 4: NaturalNewsletter Bloku

**Dosya:** `src/components/chai-builder/blocks/cta/NaturalNewsletter.tsx`

Mevcut `NewsletterSection.tsx`'in ChaiBuilder blok versiyonu.

- Yuvarlak koseli kart (rounded-2.5rem)
- bg-card arka plan
- Baslik, aciklama, email input + subscribe butonu
- Props: title, description, buttonText
- inlineEditProps: title, description, buttonText

---

### Adim 5: Natural CSS'in ChaiBuilder iframe'ine Enjeksiyonu

**Dosya:** `src/styles/chaibuilder.tailwind.css`

Natural template'in ozel stilleri (krem renkler, serif fontlar, animasyonlar, kart hover efektleri, tag renkleri) ChaiBuilder'in tailwind CSS dosyasina eklenmeli. Tum stiller `.natural-block` scope'u altinda olacak (`.natural-template` yerine) boylece sadece Natural bloklari etkiler.

Eklenecek stiller:
- Krem/bej renk paleti (CSS degiskenleri)
- Serif font kurallar
- Animasyonlar (fadeIn, slideUp, slideDown, scaleIn)
- Stagger gecikmeleri
- Kart hover efektleri
- Tag renkleri (financing, lifestyle, community, wellness, travel, creativity)
- Floating button stili
- Pill-nav stili (header icin degil, ama referans olarak)

---

### Adim 6: Template Definition Guncelleme

**Dosya:** `src/templates/catalog/definitions.ts`

`naturalLifestyle` tanimini yeni blok tiplerini kullanacak sekilde guncelle:

```text
sections: [
  { type: 'NaturalHero', required: true, defaultProps: { ... } },
  { type: 'NaturalIntro', defaultProps: { ... } },
  { type: 'NaturalArticleGrid', defaultProps: { ... (6 makale verisi) } },
  { type: 'NaturalNewsletter', defaultProps: { ... } },
]
```

---

### Adim 7: Blok Registry Guncelleme

**Dosya:** `src/components/chai-builder/blocks/index.ts`

Yeni bloklari import et:

```text
import './hero/NaturalHero';
import './about/NaturalIntro';
import './gallery/NaturalArticleGrid';
import './cta/NaturalNewsletter';
```

---

### Adim 8: Theme Preset Ekleme

**Dosya:** `src/components/chai-builder/themes/presets.ts`

Natural icin tema preset'i ekle veya guncelle:
- Font: Georgia, serif
- Primary: koyu gri (#2D2D2D)
- Background: krem (#F5EFE6)
- Accent: yesil (#6B9080)
- Border radius: 0.75rem

---

### Sinirlamalar ve Beklentiler

**Tam korunacaklar:**
- Krem/bej renk paleti
- Serif baslik fontlari
- 2 kolonlu hero layout
- Makale kartlarinin gorsel tasarimi (gradient overlay, kategori etiketleri, tarih badges)
- Newsletter kart tasarimi
- Hover animasyonlari

**Korunamayacaklar (ChaiBuilder sinirlamalari):**
- NaturalHeader (pill-nav): ChaiBuilder kendi header sistemini kullanir, ozel header blogu desteklenmez. Header editorden bagimsiz calisir.
- NaturalFooter: Ayni sekilde footer ChaiBuilder disinda kalir.
- Dark mode toggle: ChaiBuilder icinde calistirilabilir ama ek karmasiklik getirir.
- Stagger animasyonlari: Kismen korunabilir ama ChaiBuilder'in iframe'i icinde farkli davranabilir.

**Sonuc:** Natural template'in govde iceriginin ~%85-90'i orijinal haline sadik kalacak. Header/footer ve dark mode eksik kalacak ama ana icerik (hero, intro, makaleler, newsletter) orijinal tasarima cok yakin olacak.

---

### Dosya Listesi

1. `src/components/chai-builder/blocks/hero/NaturalHero.tsx` - YENI
2. `src/components/chai-builder/blocks/about/NaturalIntro.tsx` - YENI
3. `src/components/chai-builder/blocks/gallery/NaturalArticleGrid.tsx` - YENI
4. `src/components/chai-builder/blocks/cta/NaturalNewsletter.tsx` - YENI
5. `src/components/chai-builder/blocks/index.ts` - GUNCELLE (4 import ekle)
6. `src/templates/catalog/definitions.ts` - GUNCELLE (naturalLifestyle sections)
7. `src/styles/chaibuilder.tailwind.css` - GUNCELLE (natural-block stilleri ekle)
8. `src/components/chai-builder/themes/presets.ts` - GUNCELLE (natural tema)

Toplam 4 yeni dosya, 4 guncelleme. Editore (ChaiBuilderWrapper, DesktopEditorLayout, MobileEditorLayout, Project.tsx) hic dokunulmuyor.

