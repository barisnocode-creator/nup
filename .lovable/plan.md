
## Natural Template - Tam Uyumluluk Iyilestirmesi

### Mevcut Durum

Editorde 4 blok (NaturalHero, NaturalIntro, NaturalArticleGrid, NaturalNewsletter) render ediliyor. Ancak orijinal template ile karsilastirildiginda sorunlar var:

1. **Container eksik** - Orijinal template tum icerigi `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` icinde sariyordu. Bloklar su an tam genislikte render ediliyor, orijinalden farkli gorunuyor.
2. **Header blogu yok** - Orijinalin kendine ozgu pill-nav header'i (Perspective logosu, Home/Articles/Wellness/Travel/About nav linkleri, Join Now butonu) eksik.
3. **Footer blogu yok** - Orijinalin 4 kolonlu footer'i (Explore, About, Resources, Legal) eksik.
4. **Arka plan rengi** - Sayfa genelinde krem/bej arka plan uygulanmiyor, bloklar izole renk icerisinde ama aralar beyaz kaliyor.

### Cozum Plani

---

### Adim 1: NaturalHeader Bloku Olustur

**Dosya:** `src/components/chai-builder/blocks/hero/NaturalHeader.tsx` (YENI)

Orijinal `NaturalHeader.tsx`'in ChaiBuilder blok versiyonu:
- Pill-shape navigation bar (rounded-full, blur arka plan)
- Site logosu (ilk harf + site adi)
- 5 navigasyon linki (Home, Articles, Wellness, Travel, About)
- Join Now butonu
- Mobil hamburger menu
- Props: siteName, navItems (veya sabit)
- Bu blok `required: true` olacak, silinemeyecek

---

### Adim 2: NaturalFooter Bloku Olustur

**Dosya:** `src/components/chai-builder/blocks/contact/NaturalFooter.tsx` (YENI)

Orijinal `NaturalFooter.tsx`'in ChaiBuilder blok versiyonu:
- 4 kolonlu link grid (Explore, About, Resources, Legal)
- Alt kisimda copyright metni
- border-top ayirici
- Props: siteName
- Bu blok `required: true` olacak

---

### Adim 3: Mevcut Bloklara Container Padding Ekle

Tum mevcut Natural bloklarin icerigini `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container icine al:

- **NaturalHero** - Zaten kendi padding'i var (p-6/p-12/p-16), sadece max-w-7xl ve mx-auto ekle
- **NaturalIntro** - max-w-4xl mx-auto zaten var, uyumlu
- **NaturalArticleGrid** - max-w-7xl mx-auto px-4 ekle
- **NaturalNewsletter** - max-w-7xl mx-auto px-4 ekle

---

### Adim 4: Sayfa Arka Plan Rengini Ayarla

`.natural-block` CSS'ine ek olarak, tum bloklar arasindaki bosluga da krem renk uygulanmasi icin `chaibuilder.tailwind.css` dosyasinda body-level bir kural ekle:

```css
/* Natural template sayfa arka plani */
body:has(.natural-block) {
  background-color: hsl(36 44% 96%);
}
```

---

### Adim 5: Catalog Definition Guncelle

**Dosya:** `src/templates/catalog/definitions.ts`

naturalLifestyle sections dizisini guncelle - basa NaturalHeader, sona NaturalFooter ekle:

```
sections: [
  { type: 'NaturalHeader', required: true, defaultProps: { siteName: 'Perspective' } },
  { type: 'NaturalHero', required: true, defaultProps: { ... } },
  { type: 'NaturalIntro', defaultProps: { ... } },
  { type: 'NaturalArticleGrid', defaultProps: { ... } },
  { type: 'NaturalNewsletter', defaultProps: { ... } },
  { type: 'NaturalFooter', required: true, defaultProps: { siteName: 'Perspective' } },
]
```

---

### Adim 6: Blok Registry Guncelle

**Dosya:** `src/components/chai-builder/blocks/index.ts`

Yeni bloklari import et:
```
import './hero/NaturalHeader';
import './contact/NaturalFooter';
```

---

### Adim 7: Veritabanini Sifirla (Test icin)

Mevcut projenin `chai_blocks`'unu NULL yaparak yeni bloklarin (6 blok) otomatik olusturulmasini tetikle.

---

### Dosya Listesi

| Dosya | Islem |
|-------|-------|
| `src/components/chai-builder/blocks/hero/NaturalHeader.tsx` | YENI |
| `src/components/chai-builder/blocks/contact/NaturalFooter.tsx` | YENI |
| `src/components/chai-builder/blocks/hero/NaturalHero.tsx` | GUNCELLE (container padding) |
| `src/components/chai-builder/blocks/gallery/NaturalArticleGrid.tsx` | GUNCELLE (container padding) |
| `src/components/chai-builder/blocks/cta/NaturalNewsletter.tsx` | GUNCELLE (container padding) |
| `src/components/chai-builder/blocks/index.ts` | GUNCELLE (2 import ekle) |
| `src/templates/catalog/definitions.ts` | GUNCELLE (header/footer sections ekle) |
| `src/styles/chaibuilder.tailwind.css` | GUNCELLE (body arka plan rengi) |

Toplam 2 yeni dosya, 6 guncelleme. Editore (ChaiBuilderWrapper, DesktopEditorLayout, Project.tsx) dokunulmuyor.

### Beklenen Sonuc

- Orijinal template'deki pill-nav header gorunecek
- Tum icerik max-w-7xl container icinde ortalanacak
- Krem/bej arka plan tum sayfaya uygulanacak
- 4 kolonlu footer gorunecek
- Toplam 6 blok: Header + Hero + Intro + ArticleGrid + Newsletter + Footer
- Editorde tum bloklar secilip duzenlenebilecek
