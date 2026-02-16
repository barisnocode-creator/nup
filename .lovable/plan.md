
## Natural Template Duzeltmesi: Editing + Proje Icerigine Uyarlama

### Sorun 1: Editing Paneli Bos Gorunuyor

ChaiBuilder SDK'nin ozellik paneli (`ChaiBlockPropsEditor`) bos gorunuyor. Bu durum, `blockProps` icindeki `className` degerinin blok bilesenleri tarafindan ezilmesinden (override) kaynaklanmaktadir.

Tum Natural bloklarda su hata mevcut:
```jsx
<section {...blockProps} className="natural-block ...">
```

Bu soz diziminde, `blockProps` icindeki SDK tarafindan eklenen `className` (secim/hover isaretcileri, data attributeleri iceren) tamamen eziliyor. Cozum:

```jsx
<section {...blockProps} className={cn(blockProps.className, "natural-block ...")}>
```

`cn()` (tailwind-merge) ile SDK'nin siniflarini koruyarak kendi siniflarimizi eklememiz gerekiyor.

**Etkilenen dosyalar:**
- `NaturalHeader.tsx` — header elementinde
- `NaturalHero.tsx` — section elementinde
- `NaturalIntro.tsx` — section elementinde
- `NaturalArticleGrid.tsx` — section elementinde
- `NaturalNewsletter.tsx` — section elementinde
- `NaturalFooter.tsx` — footer elementinde

Her dosyada `cn` import edilip, `blockProps.className` mevcut siniflarla birlestirilecek.

---

### Sorun 2: Icerik Projeye Uygun Degil

Proje: **Yakut Hukuki Danismanlik ve Avukatlik Burosu** (hukuk burosu, Turkiye, Turkce, profesyonel ton)

Ancak Natural template icerigi Ingilizce "Perspective" lifestyle blog iceriginde. Natural sablonunu hukuk burosuna uyarlamak icin `definitions.ts` iceriginin guncellenmesi gerekiyor:

| Blok | Mevcut | Yeni |
|------|--------|------|
| NaturalHeader | siteName: "Perspective", Join Now | siteName: "Yakut Hukuk", Randevu Al |
| NaturalHero | "Journey Through Life's Spectrum" | "Haklarinizi Kararliliklailk Savunuyoruz" |
| NaturalIntro | Lifestyle blog aciklamasi | Hukuk burosu tanitimi |
| NaturalArticleGrid | Lifestyle makaleler (Wellness, Travel...) | Hukuk alanlari (Is Hukuku, Ceza Hukuku, Aile Hukuku...) |
| NaturalNewsletter | "Stay inspired" | "Ucretsiz Hukuki Danismanlik" |
| NaturalFooter | siteName: "Perspective" | siteName: "Yakut Hukuk" |

Ancak onemli bir karar: Bu sablon **genel catalog taniminda** mi degismeli yoksa **sadece bu projeye ozel** mi olmali?

- Catalog tanimini degistirirsek, bundan sonra natural template secen herkes Yakut Hukuk icerigi gorecek — bu yanlis olur.
- Dogru yaklasim: Catalog tanimini genel/sektore uyarlanabilir birakip, **mevcut projenin `chai_blocks` veritabanindan direkt guncellenmesi** (SQL ile).

Bu nedenle:
1. `definitions.ts`'deki varsayilan icerik sektore bagli olarak dinamik hale getirilecek (opsiyonel)
2. Mevcut projenin bloklari Turkce hukuk icerigine uyarlanarak veritabaninda guncellenecek

---

### Teknik Uygulama Plani

**Adim 1: className birlesim duzeltmesi (6 dosya)**

Her Natural blogun JSX'inde `cn` import edip className birlesimi yapilacak:

```tsx
// Oncesi:
<section {...blockProps} className="natural-block ...">

// Sonrasi:
<section {...blockProps} className={cn(blockProps.className, "natural-block ...")}>
```

Dosyalar:
- `src/components/chai-builder/blocks/hero/NaturalHeader.tsx`
- `src/components/chai-builder/blocks/hero/NaturalHero.tsx`
- `src/components/chai-builder/blocks/about/NaturalIntro.tsx`
- `src/components/chai-builder/blocks/gallery/NaturalArticleGrid.tsx`
- `src/components/chai-builder/blocks/cta/NaturalNewsletter.tsx`
- `src/components/chai-builder/blocks/contact/NaturalFooter.tsx`

**Adim 2: Proje icerigini Turkce hukuk burosuna uyarlama (SQL)**

Veritabanindaki `chai_blocks` alani dogrudan guncellenerek her blogun props'u Turkce hukuk burosu icerigine cevrilecek:

- Header: siteName="Yakut Hukuk", buttonText="Randevu Al"
- Hero: title="Haklarinizi Kararliliklailk Savunuyoruz", Turkce aciklama
- Intro: Hukuk burosu tanitim metni
- ArticleGrid: 6 hukuk alani (Is Hukuku, Ceza Hukuku, Aile Hukuku, Gayrimenkul, Icra-Iflas, Ticaret Hukuku) uygun gorsellerle
- Newsletter: "Ucretsiz Ilk Gorusme", "Hukuki sorulariniz icin hemen bize ulasin"
- Footer: siteName="Yakut Hukuk"

**Adim 3: Veritabani sifirlama**

Guncellenmis chai_blocks JSON'i dogrudan SQL UPDATE ile kaydedilecek.

---

### Dosya Degisiklikleri

| Dosya | Islem | Aciklama |
|-------|-------|----------|
| `blocks/hero/NaturalHeader.tsx` | GUNCELLE | cn import + className birlesimi |
| `blocks/hero/NaturalHero.tsx` | GUNCELLE | cn import + className birlesimi |
| `blocks/about/NaturalIntro.tsx` | GUNCELLE | cn import + className birlesimi |
| `blocks/gallery/NaturalArticleGrid.tsx` | GUNCELLE | cn import + className birlesimi |
| `blocks/cta/NaturalNewsletter.tsx` | GUNCELLE | cn import + className birlesimi |
| `blocks/contact/NaturalFooter.tsx` | GUNCELLE | cn import + className birlesimi |
| Veritabani (projects.chai_blocks) | SQL UPDATE | Turkce hukuk burosu icerigi |

Editore (ChaiBuilderWrapper, DesktopEditorLayout, Project.tsx) dokunulmuyor. Toplam 6 dosya guncelleme + 1 SQL sorgusu.
