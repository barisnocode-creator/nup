

## Natural Template - Birebir Calisir Hale Getirme (4 Adimli Plan)

Temel sorun: Natural sablonu secildiginde veya onizlendiginde, sistem gercek `NaturalTemplate` React bilesenini **gostermiyor**. Bunun yerine `ChaiBuilderWrapper.handlePreviewTemplate` (satir 154-199) jenerik ChaiBuilder bloklari (`HeroCentered` + `CTABanner`) uretiyor ve bunlari ChaiBuilder editoru icinde render ediyor. Sonuc: ekranda sadece 2 jenerik blok gorunuyor, Natural sablonunun header'i, makale kartlari, newsletter bolumu, footer'i hic yok.

Ikinci sorun: CSS degiskenleri orijinal repo ile eslesmiyor. Orijinal repo'da `--primary: 0 0% 18%` (siyah), `--background: 36 44% 96%` (sicak krem), `--accent: 140 20% 50%` (yesil) iken, mevcut Natural CSS'de `--primary: 30 25% 35%` (kahverengi) gibi farkli degerler var.

---

### Adim 1: ChaiBuilderWrapper'da Bilesen Tabanli Sablon Onizleme

**Dosya:** `src/components/chai-builder/ChaiBuilderWrapper.tsx`

**Sorun:** `handlePreviewTemplate` fonksiyonu TUM sablonlar icin jenerik bloklar uretiyor. Natural, Lawyer, Pilates gibi kendi React bileseni olan sablonlar icin bu yanlis.

**Cozum:**
- `src/templates/index.ts`'ye `isComponentTemplate(id: string): boolean` fonksiyonu ekle - template registry'de bilesen var mi kontrol eder
- `ChaiBuilderWrapper`'a yeni state ekle: `previewComponentTemplate: string | null`
- `handlePreviewTemplate` icinde: eger `isComponentTemplate(selectedTemplateId)` true ise, blok uretme, sadece `previewComponentTemplate` state'ini set et
- Ana render alaninda: `previewComponentTemplate` aktifse, `ChaiBuilderEditor` yerine dogrudan `TemplateComponent`'i goster (preview banner ile birlikte)
- `handleApplyTemplate` icinde: bilesen tabanli sablonlar icin blok kaydi yerine sadece `template_id` ve `chai_theme` guncelle, `chai_blocks`'u bos dizi olarak ayarla (boylece sayfa yenilendiginde `convertAndSaveChaiBlocks` tetiklenir)

Render mantigi:
```text
previewComponentTemplate set mi?
  EVET -> ChaiBuilderEditor GIZLE, TemplateComponent'i tam ekran goster
         + Preview banner (Uygula / Iptal)
  HAYIR -> Normal ChaiBuilderEditor gorunumu
```

---

### Adim 2: CSS Degiskenlerini Orijinal Repo ile Birebir Eslestirme

**Dosya:** `src/templates/natural/styles/natural.css`

Orijinal repo'daki renk paletini birebir kopyala:

- Light mod:
  - `--background: 36 44% 96%` (sicak krem - orijinal)
  - `--foreground: 0 0% 18%` (koyu siyah)
  - `--primary: 0 0% 18%` (siyah - butonlar ve vurgular icin)
  - `--primary-foreground: 36 44% 96%`
  - `--card: 33 40% 94%`
  - `--muted: 33 30% 88%`
  - `--muted-foreground: 0 0% 40%`
  - `--accent: 140 20% 50%` (yesil ton)
  - `--accent-foreground: 36 44% 96%`
  - `--border: 33 25% 85%`
  - `--ring: 0 0% 18%`
  - Ozel tokenlar: `--cream: 40 40% 90%`, `--surface-elevated: 36 44% 98%`

- Dark mod (`.natural-template.dark`):
  - `--background: 0 0% 10%`
  - `--foreground: 36 44% 96%`
  - `--primary: 36 44% 96%`
  - `--primary-foreground: 0 0% 18%`
  - `--card: 0 0% 14%`
  - `--muted: 0 0% 20%`
  - `--muted-foreground: 0 0% 60%`
  - `--accent: 140 20% 45%`
  - `--border: 0 0% 20%`

Ayrica `h1, h2, h3, h4, h5, h6` icin `font-serif tracking-tight` stilleri `.natural-template` scope'u icine ekle.

---

### Adim 3: Icerik ve Bilesen Duzeltmeleri

**3a. HeroSection.tsx** - Orijinal repo'daki hardcoded aciklama metni farkli:
- Mevcut: "Explore the vibrant tapestry of modern living..."
- Orijinal: "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery. Where Words Illuminate Paths of Meaning and Thoughts Unravel the Mysteries of Life's Spectrum."
- Duzelt

**3b. IntroSection.tsx** - Orijinal repo'daki metin farkli:
- Mevcut: "Perspective is a space for exploring ideas that shape our world"
- Orijinal: "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world."
- Aciklama metni de farkli - duzelt

**3c. ArticleCard.tsx** - Orijinal repo'da `aspect-ratio` sabit `aspect-[4/3]` (size prop yok):
- Mevcut kodda `size === "large" ? "aspect-[3/4]" : "aspect-[4/3]"` var
- Orijinal: sadece `aspect-[4/3]` ve `size === "large"` durumunda ek col-span sinifi
- Kucuk fark ama duzeltilecek

**3d. articles.ts** - Orijinal repo'daki makale verileri cok farkli:
- Makale ID'leri: "001", "002", "003", "W001", "T001", "G001" (orijinal)
- Mevcut: "001"-"006" 
- Basliklar: "Whispers of Wisdom", "Ink-Stained Insights", "Musings in Grayscale", "Finding Balance...", "The Art of Slow Travel...", "Minimalist Living..." (orijinal)
- Mevcut: "Whispers of Wisdom", "The Art of Slow Living", "Building Bridges", ... (farkli)
- Gorseller de farkli URL'ler
- Orijinal `content` yapisi farkli: `{ introduction, sections[], conclusion }` vs mevcut basit `string`
- Tamamen orijinal veriyle degistirilecek

**3e. FullLandingPage.tsx** - Newsletter bolumu orijinalde ayri bilesen degil, inline:
- Orijinal: Newsletter dogrudan `<section>` olarak Index.tsx icinde
- Mevcut: `NewsletterSection` bilesen olarak ayri dosyada - bu sorun degil, ayni kalabilir
- Ama `NewsletterSection`'daki aciklama metni farkli:
  - Orijinal: "Subscribe to receive our latest articles and insights directly in your inbox."
  - Mevcut: "Get the latest articles and insights delivered straight to your inbox."
  - Duzelt

---

### Adim 4: Template Uygulama (Apply) Sonrasi Sayfa Yukleme

**Dosya:** `src/components/chai-builder/ChaiBuilderWrapper.tsx`

Bilesen tabanli sablon uygulandiginda:
1. DB'de `template_id = 'natural'`, `chai_blocks = []`, `chai_theme = naturalTheme` olarak guncelle
2. Sayfa yeniden yuklensin (`window.location.reload()` veya state reset)
3. `Project.tsx`'deki `convertAndSaveChaiBlocks` tetiklenecek ama bilesen tabanli sablonlar icin bu fonksiyonun davranisi kontrol edilmeli

**Dosya:** `src/templates/index.ts`
- `isComponentTemplate(id)` fonksiyonu ekle

---

### Teknik Detaylar - Duzenlenecek Dosyalar

1. `src/templates/index.ts` - `isComponentTemplate()` yardimci fonksiyon
2. `src/components/chai-builder/ChaiBuilderWrapper.tsx` - Bilesen tabanli onizleme render modu, apply mantigi
3. `src/templates/natural/styles/natural.css` - Orijinal repo ile birebir CSS degiskenleri
4. `src/templates/natural/sections/HeroSection.tsx` - Orijinal aciklama metni
5. `src/templates/natural/sections/IntroSection.tsx` - Orijinal baslik ve aciklama
6. `src/templates/natural/sections/ArticleCard.tsx` - aspect-ratio ve col-span duzeltmesi
7. `src/templates/natural/sections/NewsletterSection.tsx` - Orijinal aciklama metni
8. `src/templates/natural/data/articles.ts` - Orijinal repo'daki 6 makale verisi (farkli basliklar, ID'ler, gorseller, zengin content yapisi)

