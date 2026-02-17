

## Natural Template Bloklarinin Diger Templatelerle Esitlenmesi

### Sorun

Natural template'in 6 blogu (NaturalHeader, NaturalHero, NaturalIntro, NaturalArticleGrid, NaturalNewsletter, NaturalFooter), diger template bloklarinda (HeroSplit, HeroOverlay, ServicesGrid vb.) bulunan **stil ozellestirme seceneklerinden** yoksun. Bu durum:

1. **Gorsel duzensizlik**: Gorseller `containerClassName` olmadan render ediliyor, boyut/konum kontrolu zayif
2. **Stil paneli eksik**: Baslik boyutu, kalinligi, rengi, arka plan, bosluklari gibi ayarlar Natural bloklarda yok
3. **Tutarsizlik**: Diger templateler `commonStyleSchemaProps` ve `resolveStyles` kullaniyor, Natural bloklar kullanmiyor

### Cozum

Natural template'in tum bloklarini, diger template bloklarinin kullandigi standart stil sistemine (`commonStyleSchemaProps` + `resolveStyles`) entegre etmek.

### Dosya Degisiklikleri

| Dosya | Islem |
|-------|-------|
| `src/components/chai-builder/blocks/hero/NaturalHero.tsx` | `commonStyleSchemaProps` ve `resolveStyles` eklenmesi, gorsel `containerClassName` duzeltmesi |
| `src/components/chai-builder/blocks/hero/NaturalHeader.tsx` | `commonStyleSchemaProps` eklenmesi (arka plan, bosluklari) |
| `src/components/chai-builder/blocks/about/NaturalIntro.tsx` | `commonStyleSchemaProps` ve `resolveStyles` eklenmesi |
| `src/components/chai-builder/blocks/gallery/NaturalArticleGrid.tsx` | `commonStyleSchemaProps` eklenmesi, gorsel `containerClassName` duzeltmesi, `hover:scale-110` kaldirilmasi |
| `src/components/chai-builder/blocks/cta/NaturalNewsletter.tsx` | `commonStyleSchemaProps` ve `resolveStyles` eklenmesi |
| `src/components/chai-builder/blocks/contact/NaturalFooter.tsx` | `commonStyleSchemaProps` eklenmesi (arka plan, bosluklari) |

### Teknik Detay

Her Natural blokta yapilacak degisiklikler:

1. **Import**: `resolveStyles`, `commonStyleSchemaProps`, `CommonStyleProps` import edilecek
2. **Props tipi**: `& CommonStyleProps` eklenerek stil proplari desteklenecek
3. **Schema**: `...commonStyleSchemaProps({ bgColor: "...", textAlign: "..." })` eklenerek editorde stil secenekleri gorunecek
4. **Render**: Sabit CSS siniflari yerine `resolveStyles` ile dinamik siniflar kullanilacak (baslik boyutu, rengi, arka plan vb.)
5. **Gorseller**: `EditableChaiImage` bilesenine `containerClassName` eklenerek gorsel alanlari duzenlenecek (orn. `containerClassName="aspect-[4/3] rounded-2xl overflow-hidden"`)

Bu degisiklikler sonrasinda Natural template bloklari, editordeki "Stil" sekmesinde ayni ozellestirme seceneklerini sunacak:
- Baslik Boyutu (Buyuk / Cok Buyuk / Dev / En Buyuk)
- Baslik Kalinligi (Normal / Orta / Kalin / Ekstra Kalin)
- Baslik Rengi (Varsayilan / Ana Renk / Beyaz vb.)
- Metin Hizalama (Sola / Ortala / Saga)
- Aciklama Boyutu ve Rengi
- Arka Plan Rengi (Seffaf / Varsayilan / Kart vb.)
- Bolum Boslugu (Dar / Normal / Genis / Cok Genis)

Ayni standart, bundan sonra eklenecek tum yeni template bloklari icin de uygulanacak.

