
# Adım 2: Fonts System - Tam Entegrasyon

## Mevcut Durum Analizi

### Zaten Hazır Olanlar
1. `useThemeColors.ts` hook'u font değişikliklerini işleyebiliyor
2. `CustomizeSidebar.tsx` font seçimi UI'ı mevcut (heading/body)
3. CSS'de `--font-heading` ve `--font-body` değişkenleri tanımlı
4. `.font-heading-dynamic` ve `.font-body-dynamic` utility class'ları var
5. Google Fonts yükleme fonksiyonu çalışıyor

### Eksikler
1. Template bileşenleri CSS değişkenlerini kullanmıyor (sabit font-family)
2. Heading elementleri `--font-heading` değişkenine bağlı değil
3. Body text `--font-body` değişkenini kullanmıyor
4. Font önizlemesi sidebar'da çalışıyor ama gerçek siteye yansımıyor

## Yapılacaklar

### 1. Tailwind Config'e Font Değişkenleri Ekle
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
  serif: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
  display: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
}
```

### 2. index.css'de Varsayılan Font Değişkenlerini Tanımla
```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### 3. Template Bileşenlerini Güncelle
Tüm başlık elementlerinde `font-serif` veya `font-display` kullan:
- Hero başlıkları
- Section başlıkları
- Card başlıkları

Body text için `font-sans` kullan (varsayılan olarak zaten uygulanıyor).

## Teknik Detaylar

### Etkilenecek Dosyalar

| Dosya | Değişiklik |
|-------|------------|
| `tailwind.config.ts` | fontFamily tanımlarını CSS değişkenlerine bağla |
| `src/index.css` | Varsayılan font değişkenlerini :root'a ekle |
| `src/templates/temp1/sections/hero/*.tsx` | Başlıklara `font-display` ekle |
| `src/templates/temp1/sections/*.tsx` | Section başlıklarına `font-display` ekle |
| `src/templates/temp1/components/TemplateHeader.tsx` | Logo text'e font uygula |

### Font Değişkeni Akışı
```
CustomizeSidebar (font seçimi)
    ↓
Project.tsx (handleSiteSettingsChange)
    ↓
useThemeColors hook
    ↓
CSS Variables (--font-heading, --font-body)
    ↓
Tailwind (font-sans, font-serif, font-display)
    ↓
Template Components (h1, h2, p, etc.)
```

## Beklenen Sonuç

1. Customize > Fonts > Heading değiştirildiğinde tüm başlıklar anında güncellenir
2. Customize > Fonts > Body değiştirildiğinde tüm paragraflar anında güncellenir
3. Sayfa yenilendiğinde seçilen fontlar korunur (veritabanına kaydediliyor)
4. Google Fonts otomatik yüklenir
