
# Editör Gerçek Zamanlı Stil Güncelleme Planı

## Mevcut Durum Analizi

Kod incelemesi sonucunda tespit edilen sorunlar:

1. **EditorSidebar'daki Style Tab değişiklikleri kaydedilmiyor**: Font boyutu, metin hizalaması ve metin rengi değişiklikleri sadece `useState` ile local state'te tutuluyor (`fontSize`, `textAlign`, `textColor`). Bu değerler hiçbir yere kaydedilmiyor ve template bileşenlerine iletilmiyor.

2. **Image Position düzgün çalışıyor**: `handleUpdateImagePosition` fonksiyonu `imagePositions` nesnesini güncelliyor ve template'ler bu değeri `heroImagePosition` olarak alıyor.

3. **EditorSidebar'da gerekli callback'ler eksik**: `onStyleChange` prop'u yok, bu yüzden stil değişiklikleri parent'a bildirilemiyor.

---

## Uygulama Adımları

### Adım 1: GeneratedContent Tipine SectionStyle Ekle

**Dosya:** `src/types/generated-website.ts`

Yeni interface ekle:
```typescript
export interface SectionStyle {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: 'primary' | 'secondary' | 'muted';
}
```

`GeneratedContent` interface'ine ekle:
```typescript
sectionStyles?: {
  [sectionId: string]: SectionStyle;
};
```

---

### Adım 2: EditorSidebar'a Style Callback Ekle

**Dosya:** `src/components/website-preview/EditorSidebar.tsx`

Yeni prop'lar ekle:
- `onStyleChange?: (sectionId: string, style: SectionStyle) => void`
- `currentSectionStyle?: SectionStyle`

Style tab'daki font size, text align ve text color değişikliklerinde `onStyleChange` callback'ini çağır. Mevcut stil değerlerini `currentSectionStyle` prop'undan oku.

---

### Adım 3: Project.tsx'e Style Handler Ekle

**Dosya:** `src/pages/Project.tsx`

Yeni handler fonksiyonu ekle:
```typescript
const handleSectionStyleChange = useCallback((sectionId: string, style: SectionStyle) => {
  // generated_content.sectionStyles'ı güncelle
  // debouncedSave ile kaydet
});
```

EditorSidebar'a bu prop'ları geçir:
- `onStyleChange={handleSectionStyleChange}`
- `currentSectionStyle={project.generated_content?.sectionStyles?.[editorSelection?.sectionId]}`

---

### Adım 4: TemplateProps'a SectionStyles Ekle

**Dosya:** `src/templates/types.ts`

```typescript
sectionStyles?: {
  [sectionId: string]: SectionStyle;
};
```

---

### Adım 5: Template Bileşenlerini Güncelle

Template'lerin section bileşenlerinde `sectionStyles` prop'unu al ve uygula.

**Örnek (HeroSplit):**
```typescript
const getTextSizeClass = (size?: string) => {
  const sizeMap = {
    sm: 'text-3xl md:text-4xl',
    base: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl',
    '2xl': 'text-7xl md:text-8xl',
  };
  return sizeMap[size] || sizeMap.base;
};
```

Güncellenecek dosyalar:
- `src/templates/temp1/pages/FullLandingPage.tsx` - sectionStyles prop'u al ve section'lara ilet
- `src/templates/temp1/sections/hero/*.tsx` - stil class'larını uygula
- `src/templates/temp2/pages/FullLandingPage.tsx`
- `src/templates/temp2/sections/hero/*.tsx`
- `src/templates/temp3/pages/FullLandingPage.tsx`
- `src/templates/temp3/sections/hero/*.tsx`
- `src/components/website-preview/WebsitePreview.tsx` - sectionStyles prop'unu template'e ilet

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/types/generated-website.ts` | `SectionStyle` interface ve `sectionStyles` alanı |
| `src/components/website-preview/EditorSidebar.tsx` | `onStyleChange`, `currentSectionStyle` prop'ları ve callback entegrasyonu |
| `src/pages/Project.tsx` | `handleSectionStyleChange` handler ve EditorSidebar prop geçişi |
| `src/templates/types.ts` | `sectionStyles` prop ekleme |
| `src/components/website-preview/WebsitePreview.tsx` | `sectionStyles` prop geçişi |
| `src/templates/temp1/pages/FullLandingPage.tsx` | `sectionStyles` prop alıp section'lara iletme |
| `src/templates/temp1/sections/hero/HeroSplit.tsx` | Dinamik stil class'ları |
| `src/templates/temp1/sections/hero/HeroOverlay.tsx` | Dinamik stil class'ları |
| `src/templates/temp1/sections/hero/HeroCentered.tsx` | Dinamik stil class'ları |
| `src/templates/temp1/sections/hero/HeroGradient.tsx` | Dinamik stil class'ları |
| `src/templates/temp1/sections/hero/types.ts` | `sectionStyle` prop ekleme |

---

## Beklenen Sonuçlar

1. Font boyutu değiştirildiğinde anında hero başlığında görülecek
2. Metin hizalaması değiştirildiğinde anında yansıyacak
3. Metin rengi değiştirildiğinde anında uygulanacak
4. Tüm değişiklikler otomatik olarak veritabanına kaydedilecek
5. Sayfa yenilendiğinde stiller korunacak
