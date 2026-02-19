

## ChaiBuilder Tamamen Kaldirma + Template'lerin Orijinal Gorunumuyle Editorde ve Yayinda Calismasi

### Yapilacaklar

#### 1. Silinen Dosyalar

- **`src/hooks/useMigrateSections.ts`** — Migration hook'u tamamen silinir
- **`supabase/functions/chai-ai-assistant/index.ts`** — Chai AI asistani silinir

#### 2. `src/pages/Project.tsx` Temizleme

- `chai_blocks`, `chai_theme` alanlarini `ProjectData` interface'inden cikar
- `useMigrateSections` import'unu ve `migrate` kullanimini kaldir
- `migrating` state'ini kaldir
- Supabase select sorgusundan `chai_blocks, chai_theme` kaldir
- "Priority 2: chai_blocks exist -> migrate" blogunu tamamen sil
- Sadece `site_sections` ve `generated_content` akisi kalir

#### 3. `src/pages/PublicWebsite.tsx` Temizleme

- `chai_blocks`, `chai_theme` alanlarini interface'den cikar
- Select sorgusundan `chai_blocks, chai_theme` cikar
- `extractColor` fonksiyonunu ve legacy `[light,dark]` dizi formatini kaldir
- `hasChaiBlocks`, `convertedSections` bloklarini tamamen sil
- `activeTheme` sadece `project?.site_theme` olur
- `sectionsToRender` sadece `siteSections` kullanir

#### 4. `supabase/functions/deploy-to-netlify/index.ts` Guncelleme

- `ChaiBlock` interface'ini `SiteSection` tabanli bir yapiya donustur:
```text
interface SiteSection {
  id: string;
  type: string;      // kebab-case: "hero-centered", "services-grid"
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
}
```
- Tum `renderXxx(b: ChaiBlock)` fonksiyonlarindaki parametre tipini degistir; iceride `b.title` yerine `b.props.title` kullanilacak sekilde guncelle (cunku artik props icinde)
- `renderBlock` switch'ini kebab-case type'lar ile calistir (`"hero-centered"` yerine `"HeroCentered"` degil)
- `blocksToHtml` fonksiyonunu `sectionsToHtml` olarak yeniden adlandir, parametre olarak `SiteSection[]` alsin
- Ana handler'da `chai_blocks` fallback mantigi kaldirilir; sadece `site_sections` kullanilir
- `site_sections -> ChaiBlock donusturme` kodu silinir

#### 5. `supabase/config.toml` Guncelleme

- `[functions.chai-ai-assistant]` blogu kaldirilir (dosya otomatik guncellenmez ama edge function silinecek)

#### 6. Deploy-to-Netlify'da Template Font/Stil Uyumu

- `blocksToHtml` (yeni: `sectionsToHtml`) icinde `theme.fonts.heading` ve `theme.fonts.body` alanlarini kullanarak dogru Google Fonts yukle (artik `fontFamily` degil `fonts` nesnesi)
- HSL renk degerleri icin hex-to-HSL donusumunu edge function'a da ekle (editordeki ile ayni)
- Boylece yayinlanan site editordeki ile birebir ayni gorunur

#### 7. Veritabani Notu

- `chai_blocks` ve `chai_theme` kolonlari veritabaninda kalacak (veri kaybi onlenmesi icin)
- Ancak hicbir frontend veya edge function bu kolonlari okumayacak/yazmayacak

### Teknik Detaylar

**Silinen dosyalar:**

| Dosya | Neden |
|-------|-------|
| `src/hooks/useMigrateSections.ts` | chai_blocks -> site_sections migration artik gereksiz |
| `supabase/functions/chai-ai-assistant/index.ts` | ChaiBuilder AI asistani artik kullanilmiyor |

**Guncellenen dosyalar:**

| Dosya | Degisiklik |
|-------|-----------|
| `src/pages/Project.tsx` | chai referanslari, migration kodu, migrating state kaldirilir |
| `src/pages/PublicWebsite.tsx` | chai fallback, convertedSections, extractColor kaldirilir |
| `supabase/functions/deploy-to-netlify/index.ts` | ChaiBlock -> SiteSection, tum render fonksiyonlari props.xxx erisimi, kebab-case switch, theme.fonts uyumu |

### Uygulama Sirasi

1. `useMigrateSections.ts` sil
2. `chai-ai-assistant/index.ts` sil + edge function'i sil
3. `Project.tsx` temizle
4. `PublicWebsite.tsx` temizle
5. `deploy-to-netlify/index.ts` SiteSection tabanina gecir + font/renk uyumu

### Sonuc

- ChaiBuilder'in sistemdeki tum izleri temizlenir
- Template'ler editorde ve yayinda ayni gorunur (font, renk, stil)
- Tek veri kaynagi: `site_sections` + `site_theme`
- Kod tabaninda gereksiz legacy donusturme mantiklari kalmaz

