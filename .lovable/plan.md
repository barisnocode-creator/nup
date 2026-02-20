
## Blog Sayfaları Tema Uyumu — Kök Sorun ve Düzeltme Planı

### Gerçek Sorunun Teşhisi

Veritabanı incelemesinde `site_theme.colors` değerlerinin **HEX formatında** saklandığı görüldü:

```json
{
  "primary": "#f97316",
  "background": "#ffffff",
  "foreground": "#1a1a1a"
}
```

Ancak Tailwind CSS değişken sistemi **HSL formatında** bekliyor:

```css
:root {
  --primary: 24 95% 53%;   /* HSL, NOT #f97316 */
}
```

Tailwind'in `bg-primary`, `text-foreground`, `border-border` gibi sınıfları `hsl(var(--primary))` olarak hesaplandığı için, `--primary: #f97316` şeklinde set edildiğinde **renk hiç uygulanmıyor** — site SaaS dashboardın varsayılan turuncu temasıyla görünüyor.

Bu sorun 3 yerde aynı anda var:
1. `useSiteTheme.ts` — blog sayfaları için (HEX doğrudan inject ediliyor)
2. `PublicWebsite.tsx` → `buildThemeStyle()` — ana public site için (aynı hata)
3. Font injection — `--font-heading` / `--font-body` doğrudan değişkenlere yazılıyor, bunlar doğru ama sadece `font-heading-dynamic` / `font-body-dynamic` CSS class'ları kullanan elementlerde geçerli oluyor

### Neden Blog Sayfaları Özellikle Etkileniyor?

`PublicWebsite.tsx`, sitedeki `SectionRenderer` bileşenlerini render ediyor ve bu bileşenler zaten inline `style` prop'larıyla ya da kendi CSS class'larıyla render edilebiliyor. Blog sayfaları ise tamamen Tailwind CSS variable'larına dayandığından (bg-background, text-foreground, text-primary vb.) tema uygulanmadığında SaaS'ın kendi renkleriyle görünüyor.

### Çözüm Planı — 3 Dosya Değişikliği

---

#### Değişiklik 1: `src/hooks/useSiteTheme.ts` — HEX→HSL Dönüşümü

`loadGoogleFont` import'unun yanına `hexToHsl` ve `isValidHex` da `useThemeColors.ts`'den import edilip kullanılacak:

```typescript
// Şu an (YANLIŞ):
root.style.setProperty(`--${key}`, val);  // val = "#f97316" → CSS'de çalışmaz

// Düzeltme (DOĞRU):
const converted = isValidHex(val) ? hexToHsl(val) : val;
root.style.setProperty(`--${key}`, converted);  // "24 95% 53%" → çalışır
```

Ek olarak font değişkenleri ayarlanırken `--font-heading-dynamic` ve `--font-body-dynamic` yerine doğrudan `--font-heading` / `--font-body` set ediliyor (bu zaten doğru). Cleanup kısmına `--font-heading` ve `--font-body` de eklenmeli.

---

#### Değişiklik 2: `src/pages/PublicWebsite.tsx` — `buildThemeStyle()` Fonksiyonu Düzeltme

`buildThemeStyle()` fonksiyonu da HEX değerleri doğrudan `<style>` tag'ına yazıyor:

```typescript
// Şu an (YANLIŞ):
vars[`--${key}`] = val;  // "--primary: #f97316"

// Düzeltme (DOĞRU):
import { hexToHsl, isValidHex } from '@/hooks/useThemeColors';
vars[`--${key}`] = isValidHex(val) ? hexToHsl(val) : val;  // "--primary: 24 95% 53%"
```

Bu, ana public sitede de (`/site/:subdomain`) tema renklerinin doğru yansımasını sağlar — blog sayfaları bunun "yan etkisi" değil, bağımsız bir düzeltme.

---

#### Değişiklik 3: `src/pages/PublicBlogPage.tsx` — Header ve Footer'ı Site Temasıyla Uyumlu Hale Getirme

Blog liste sayfası zaten `useSiteTheme` hook'unu kullanıyor ve Tailwind CSS variable sınıfları kullanıyor (bg-background, text-primary vb.). HEX→HSL düzeltmesi yapıldıktan sonra bu sayfa otomatik olarak doğru renkleri alacak.

Ek iyileştirmeler:
- **Header navigasyonu**: Sitenin `AddableSiteFooter` section'ından alınan logoya/isme göre header'ı zenginleştir
- **"Tüm Yazıları Gör" butonu** yerine sitedeki blog section başlığını kullan
- **Back navigasyonu**: `/site/:subdomain` yerine sitenin kendisine dönme linki düzelt (şu an doğru ama görsel iyileştirme yapılacak)

---

#### Değişiklik 4: `src/components/sections/addable/BlogPostDetailSection.tsx` — Tema Desteği

Blog yazı detay sayfası da aynı Tailwind değişkenlerini kullanıyor. HEX→HSL düzeltmesi yapıldıktan sonra otomatik çalışacak, ancak:
- **Sitenin footer bilgilerini** `AddableSiteFooter`'dan okuyarak sayfanın altına basit bir navigasyon ekle
- **Meta title** içinde site adını daha iyi kulllan

---

### Değişiklik Özeti

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/hooks/useSiteTheme.ts` | HEX→HSL dönüşümü ekle, `hexToHsl` + `isValidHex` import et, cleanup'a font değişkenlerini ekle |
| 2 | `src/pages/PublicWebsite.tsx` | `buildThemeStyle()` içinde HEX→HSL dönüşümü, `hexToHsl` import et |
| 3 | `src/pages/PublicBlogPage.tsx` | Header'da siteName daha belirgin göster, `theme` objesinden `sections` array'ini de al, siteFooter'dan contact bilgilerini çek |
| 4 | `src/pages/PublicBlogPostPage.tsx` | Hata yoksa değişiklik yok — useSiteTheme düzeltmesi yeterli |

---

### Beklenen Sonuç

**Önce (şu an):**
- Blog sayfaları açıldığında SaaS'ın turuncu teması görünüyor
- `--primary: #f97316` şeklinde set ediliyor → Tailwind bunu `hsl(#f97316)` olarak yorumlamaya çalışıyor → geçersiz → varsayılan renk kullanılıyor

**Sonra (düzeltme sonrası):**
- Blog sayfaları açıldığında sitenin kendi tema renkleri (örn. Dental Klinik → mavi, Restoran → altın, Kafe → terrakota) doğru uygulanıyor
- `--primary: 24 95% 53%` → `hsl(24 95% 53%)` → tam olarak ayarlanan renk gösteriliyor
- Fontlar (Playfair Display, Lora, Space Grotesk vb.) Google Fonts'tan yüklenip doğru uygulanıyor
- Border radius temanın `borderRadius` değerini yansıtıyor
