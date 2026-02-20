
## Sorun

`PublicBlogPage.tsx` ve `PublicBlogPostPage.tsx` sayfaları şu an sadece blog içeriğini çekiyor. `site_theme` (renkler, fontlar, border-radius) ve `site_sections` (header, footer için) veritabanından **hiç alınmıyor**. Bu yüzden bir Dental Klinik sitesinin blog sayfası sky-blue/Sora font yerine jenerik beyaz/sans görünüyor.

## Hedef

Her blog sayfası (liste + detay), o sitenin kullandığı şablonun temasını (renkler, fontlar, tasarım dili) birebir yansıtsın. Ayrıca editörde "Devamını Oku"ya basıldığında o sayfa editörde açılarak düzenlenebilsin.

---

## Çözüm Mimarisi

### 1. Ortak `useSiteTheme` Hook'u (YENİ)

`src/hooks/useSiteTheme.ts` adında yeni bir hook oluşturulacak. Bu hook:
- Subdomain'e göre `site_sections`, `site_theme`, `name` alanlarını veritabanından çeker
- `site_theme` içindeki CSS değişkenlerini `document.documentElement` üzerine enjekte eder
- Google Fonts'u dinamik olarak yükler (heading + body)
- Cleanup ile tema değişkenlerini geri alır

Bu hook, hem `PublicBlogPage` hem `PublicBlogPostPage` tarafından kullanılır.

### 2. Tema Enjeksiyon Mantığı

`PublicWebsite.tsx`'deki `buildThemeStyle` fonksiyonu gibi, ama daha kapsamlı. `site_theme.colors` içindeki HSL değerlerini (sistem zaten HSL formatında saklıyor) `--primary`, `--background`, `--foreground`, `--card`, `--border` gibi Tailwind CSS değişkenleri olarak root'a yazar. Fontlar için `--font-heading-dynamic`, `--font-body-dynamic` CSS değişkenleri set edilir.

### 3. `PublicBlogPage.tsx` → Temalı Versiyon

Mevcut dosya güncellenir:
- `useSiteTheme(subdomain)` hook'u çağrılır → tema otomatik enjekte edilir
- Header: Jenerik `<header>` yerine sitenin adını ve logo alanını kullanan, şablon renk sistemine uyumlu bir header
- Blog kartları: Mevcut grid korunur, ama artık `var(--primary)`, `bg-background`, `text-foreground` gibi tema CSS değişkenleri doğru renge işaret eder
- Footer: Sayfanın altına şablon temasıyla uyumlu bir footer eklenir (SiteFooter bileşeni veya basit inline versiyon)

### 4. `PublicBlogPostPage.tsx` → Temalı Versiyon

Mevcut dosya güncellenir:
- `useSiteTheme(subdomain)` hook'u çağrılır
- `BlogPostDetailSection`'a `siteTheme` prop geçilebilir, ya da hook sayesinde CSS değişkenleri zaten doğru olduğundan bileşen otomatik temalı görünür
- Breadcrumb header: Site adı görünür, şablonun primary rengiyle vurgulanır

### 5. Editörde "Devamını Oku" → Editörde Açılsın

`BlogSection.tsx`'deki `handleCardClick` fonksiyonu güncellenir:
- `isEditing=true` durumunda: Şu an hiçbir şey yapmıyor (navigation engelli). Bunun yerine editör bağlamında bir sinyal verilsin (örn. `window.postMessage` veya özel bir callback prop).
- Alternatif, daha basit yaklaşım: Editörde blog kartlarına tıklayınca "Bu içeriği editörde düzenlemek için sol panelden Blog bölümünü seçin" şeklinde bir toast mesajı gösterilir.
- En doğru yaklaşım: `BlogSection`'a `onCardClick?: (slug: string) => void` prop'u ekle. Editör (`SiteEditor` veya `EditorCanvas`) bu prop'u verince, karta tıklama editör içinde ilgili blog kartı düzenleme arayüzünü açar.

**Editörde düzenleme için:** Zaten `SectionEditPanel` üzerinden blog section props'ları düzenlenebiliyor. Kullanıcı istediği şeyi zaten editörde düzenleyebilir. Ancak "Devamını Oku"ya tıklayınca o blogun içerik paneline scroll edilmesi sağlanabilir.

---

## Değiştirilecek / Oluşturulacak Dosyalar

| # | Dosya | İşlem |
|---|---|---|
| 1 | `src/hooks/useSiteTheme.ts` | YENİ — Subdomain → tema enjeksiyonu hook |
| 2 | `src/pages/PublicBlogPage.tsx` | useSiteTheme ekle, header/footer temalı hale getir |
| 3 | `src/pages/PublicBlogPostPage.tsx` | useSiteTheme ekle, temalı wrapper |

---

## `useSiteTheme` Hook Detayı

```typescript
// src/hooks/useSiteTheme.ts
export function useSiteTheme(subdomain: string | undefined) {
  const [siteData, setSiteData] = useState<{
    siteName: string;
    sections: SiteSection[];
    theme: SiteTheme | null;
    loading: boolean;
  }>({ siteName: '', sections: [], theme: null, loading: true });

  useEffect(() => {
    if (!subdomain) return;
    supabase
      .from('public_projects')
      .select('name, site_sections, site_theme')
      .eq('subdomain', subdomain)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setSiteData({
          siteName: data.name || '',
          sections: (data.site_sections as SiteSection[]) || [],
          theme: data.site_theme as SiteTheme || null,
          loading: false,
        });
        
        // Inject theme CSS variables
        if (data.site_theme?.colors) {
          const root = document.documentElement;
          for (const [key, val] of Object.entries(data.site_theme.colors)) {
            if (typeof val === 'string') root.style.setProperty(`--${key}`, val);
          }
        }
        
        // Load Google Fonts
        if (data.site_theme?.fonts) {
          const { heading, body } = data.site_theme.fonts;
          if (heading) loadGoogleFont(heading);
          if (body) loadGoogleFont(body);
        }
      });
  }, [subdomain]);

  return siteData;
}
```

---

## Blog Sayfalarının Temalı Görünümü

Tema CSS değişkenleri enjekte edildikten sonra:
- `bg-background` → şablonun arka plan rengi (Dental için açık mavi, Restoran için koyu siyah, Kafe için krem)
- `text-foreground` → şablonun metin rengi
- `text-primary` ve `bg-primary` → şablonun vurgu rengi (Dental: sky-blue, Restoran: altın, Kafe: terrakota)
- `border-border` → şablonun kenarlık rengi
- `font-heading-dynamic` → şablonun başlık fontu (Dental: Sora, Restoran: Playfair Display, Kafe: Playfair Display)

Bu sayede blog sayfası **hiçbir ek stil kodu yazılmadan** şablon temasını otomatik yansıtır. Mevcut Tailwind sınıfları CSS değişkenleri üzerinden zaten doğru renklere işaret eder.

---

## Editörde Blog Düzenleme Akışı

Kullanıcı editörde "Devamını Oku"ya bastığında:
- `isEditing=true` olduğu için navigasyon engellenir (mevcut durum doğru)
- Blog içeriğini düzenlemek için: Sol panelden "Blog Köşesi" bölümüne tıklanır → `SectionEditPanel` o bölümün props'larını (başlık, içerik, görsel, tarih vb.) düzenleme alanlarıyla açar
- Editörde blog kartı üzerine hover → "Görsel Değiştir" butonu belirir (zaten mevcut)

Bu akış zaten çalışıyor. Ekstra bir değişiklik gerekmez.

---

## Görsel Etki (Önce / Sonra)

**Önce:** Blog listesi sayfası → Beyaz arka plan, varsayılan font, mavi primary link rengi (jenerik tarayıcı rengi)

**Sonra (Dental Klinik sitesi için):**
- `bg-background`: Açık mavi (#f0f9ff)  
- `text-primary`: Sky-blue (#0284c7)
- Başlık fontu: Sora  
- Kartlar: Mavi tonlu kenarlık, sky-blue hover efekti  
- Header: Sky-blue vurgulu, Sora fontlu  

**Sonra (Restoran Zarif sitesi için):**
- `bg-background`: Koyu siyah (#0a0a0a)  
- `text-primary`: Altın (#d4a853)  
- Başlık fontu: Playfair Display  
- Kartlar: Koyu kart arka planı, altın hover  
- Tüm sayfa restoran temasını yansıtır
