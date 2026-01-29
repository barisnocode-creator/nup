
# Durable.co Tarzı Customize, Pages ve Add Menüleri

## Hedef

Durable.co ekran görüntülerindeki 3 ana sidebar/panel sistemini implement etmek:
1. **Customize** - Site geneli ayarlar (Colors, Fonts, Buttons, Corners, Animations, vb.)
2. **Pages** - Sayfa ayarları (Title, Label, SEO, Social image)
3. **Add** - Yeni sayfa/blog post/folder ekleme

## Durable.co Referans Analizi

### 1. Customize Panel (Screenshot 2)
```
+------------------------+
| Customize         X    |
+------------------------+
| > Colors               |
| > Fonts                |
| > Buttons              |
| > Corners              |
| > Animations           |
| > Browser icon         |
| > Manage widgets       |
| > Regenerate text      |
| > Regenerate website   |
| > Keywords             |
+------------------------+
```

### 2. Page Settings Panel (Screenshot 3)
```
+------------------------+
| Page              X    |
+------------------------+
| Title  [Regenerate ✨] |
| [Experience Affordable]|
| (SEO title, 50-60 chars)|
|                        |
| Label                  |
| [Home]                 |
| (Navigation label)     |
|                        |
| Show link              |
| [o] Header [o] Footer  |
|                        |
| --- SEO ---            |
| Description, keywords  |
|                        |
| --- Image ---          |
| Social media share img |
| [Image thumbnail]      |
+------------------------+
```

### 3. Add Panel (Screenshot 4)
```
+------------------------+
| Add               X    |
+------------------------+
| > Page                 |
|   Select page type...  |
|                        |
| + Blog post            |
|   Educate visitors...  |
|                        |
| + Folder               |
|   Add folder to group  |
+------------------------+
```

## Yeni Bileşenler

### 1. CustomizeSidebar.tsx
Site geneli özelleştirme paneli:
- Colors: Renk paleti seçimi
- Fonts: Heading/Body font seçimi
- Buttons: Köşe stili (rounded/sharp)
- Corners: Global border radius
- Animations: Sayfa geçiş animasyonları
- Browser icon: Favicon ayarı
- Regenerate text: Tüm metinleri yeniden oluştur
- Regenerate website: Tüm siteyi yeniden oluştur

### 2. PageSettingsSidebar.tsx
Sayfa bazlı ayarlar:
- Title: SEO başlığı + Regenerate butonu
- Label: Navigasyonda görünen isim
- Show link: Header/Footer toggle'ları
- SEO section: Meta description
- Social image: OG image seçimi

### 3. AddContentSidebar.tsx
Yeni içerik ekleme:
- Page: Sayfa tipi seçimi (About, Services, Contact, vb.)
- Blog post: Yeni blog yazısı oluştur
- Folder: Sayfa grupları (Phase 2)

## Dosya Yapısı

```
src/components/website-preview/
├── EditorSidebar.tsx (mevcut - element editing)
├── CustomizeSidebar.tsx (YENİ - site settings)
├── PageSettingsSidebar.tsx (YENİ - page settings)
├── AddContentSidebar.tsx (YENİ - add content)
└── EditorToolbar.tsx (güncelleme - sidebar bağlantıları)
```

## State Yönetimi

```typescript
// Project.tsx'e eklenecek state'ler
const [customizeSidebarOpen, setCustomizeSidebarOpen] = useState(false);
const [pageSettingsSidebarOpen, setPageSettingsSidebarOpen] = useState(false);
const [addContentSidebarOpen, setAddContentSidebarOpen] = useState(false);

// Site ayarları (GeneratedContent'e eklenecek)
interface SiteSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  corners: 'rounded' | 'sharp' | 'pill';
  animations: boolean;
  favicon?: string;
}

// Sayfa ayarları
interface PageSettings {
  [pageName: string]: {
    title: string;        // SEO title
    label: string;        // Nav label
    showInHeader: boolean;
    showInFooter: boolean;
    seoDescription?: string;
    socialImage?: string;
  };
}
```

## GeneratedContent Güncellemesi

```typescript
export interface GeneratedContent {
  // ... mevcut alanlar
  
  // YENİ: Site geneli ayarlar
  siteSettings?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    corners?: 'rounded' | 'sharp' | 'pill';
    animations?: boolean;
    favicon?: string;
  };
  
  // YENİ: Sayfa ayarları
  pageSettings?: {
    [key: string]: {
      title?: string;
      label?: string;
      showInHeader?: boolean;
      showInFooter?: boolean;
      seoDescription?: string;
      socialImage?: string;
    };
  };
}
```

## EditorToolbar Güncellemesi

```typescript
// Mevcut butonların yeni fonksiyonları
<Button onClick={() => setCustomizeSidebarOpen(true)}>
  <Palette /> Customize
</Button>

<DropdownMenu>
  <DropdownMenuTrigger>
    <Layout /> Pages
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {/* Her sayfa için */}
    <DropdownMenuItem onClick={() => openPageSettings('home')}>
      Home
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => openPageSettings('about')}>
      About
    </DropdownMenuItem>
    {/* ... */}
  </DropdownMenuContent>
</DropdownMenu>

<Button onClick={() => setAddContentSidebarOpen(true)}>
  <Plus /> Add
</Button>
```

## CustomizeSidebar UI

```
+-----------------------------------+
| Customize                      X  |
+-----------------------------------+
| > Colors                      >   |
|   Primary, secondary, accent      |
|                                   |
| > Fonts                       >   |
|   Heading: Inter                  |
|   Body: Inter                     |
|                                   |
| > Buttons                     >   |
|   Rounded corners                 |
|                                   |
| > Corners                     >   |
|   Border radius                   |
|                                   |
| > Animations                  >   |
|   Page transitions                |
|                                   |
| > Browser icon                >   |
|   Upload favicon                  |
|                                   |
+-----------------------------------+
| [Sparkles] Regenerate text        |
+-----------------------------------+
| [Sparkles] Regenerate website     |
+-----------------------------------+
| > Keywords                    >   |
|   SEO keywords                    |
+-----------------------------------+
```

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/components/website-preview/CustomizeSidebar.tsx` | YENİ |
| `src/components/website-preview/PageSettingsSidebar.tsx` | YENİ |
| `src/components/website-preview/AddContentSidebar.tsx` | YENİ |
| `src/components/website-preview/EditorToolbar.tsx` | Güncelle - sidebar açma fonksiyonları |
| `src/pages/Project.tsx` | Yeni state'ler ve sidebar render |
| `src/types/generated-website.ts` | siteSettings ve pageSettings ekle |

## Implementasyon Aşamaları

### Aşama 1: Temel Yapı
1. GeneratedContent type'ını güncelle
2. Üç yeni sidebar bileşeni oluştur (boş iskelet)
3. EditorToolbar'ı güncelle
4. Project.tsx'e state'leri ekle

### Aşama 2: Customize Sidebar
1. Collapsible menü listesi
2. Colors alt paneli (renk seçici)
3. Fonts alt paneli (dropdown)
4. Corners alt paneli (seçenekler)
5. Regenerate butonları

### Aşama 3: Page Settings Sidebar
1. Title input + Regenerate
2. Label input
3. Show link toggle'ları
4. SEO section
5. Social image uploader

### Aşama 4: Add Content Sidebar
1. Page type seçici
2. Blog post oluşturucu
3. Folder sistemi (Phase 2)

## UI/UX Detayları

### Sidebar Stili
- Width: 320px
- Sağdan slide-in animasyonu
- Koyu tema desteği
- Accordion/collapsible menüler

### Renk Seçici
- Önceden tanımlı renk paletleri
- Custom color picker
- Renk preview'ı

### Font Seçici
- Google Fonts listesi
- Font preview
- Heading/Body ayrımı

## Beklenen Sonuç

1. Customize butonuna tıklandığında site geneli ayarlar açılır
2. Pages menüsünden sayfa seçildiğinde o sayfanın ayarları açılır
3. Add butonuna tıklandığında yeni içerik ekleme paneli açılır
4. Tüm paneller Durable.co tarzında, modern ve kullanıcı dostu
5. Dark mode desteği
