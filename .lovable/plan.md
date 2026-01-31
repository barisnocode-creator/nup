
# AI Studio - Görsel Tasarım Merkezi

Bu plan, Durable.co benzeri bir "Studio" özelliği ekleyecek. Kullanıcılar logo, sosyal medya görselleri, posterler ve yaratıcı içerikler oluşturabilecek. Ayrıca oluşturulan görselleri web sitelerinde (logo, favicon, OG image) kullanabilecekler.

---

## Genel Bakış

### Ana Özellikler:
1. **Logo Oluştur**: İşletme için profesyonel logo tasarımı
2. **Sosyal Medya Görseli**: Instagram, Facebook, Twitter için paylaşım görselleri
3. **Poster Oluştur**: Etkinlik, kampanya afişleri
4. **Yaratıcı Ol**: Serbest prompt ile herhangi bir görsel

### Akış:
```text
[Kategori Seç] → [Prompt Yaz] → [AI Görsel Üret]
      ↓
[Önizleme ve Revizyon]
      ↓
[Kaydet / Web Sitesine Uygula]
```

---

## Veritabanı Değişiklikleri

### Yeni Tablo: `studio_images`
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | uuid | Primary key |
| user_id | uuid | Kullanıcı referansı |
| project_id | uuid | İlişkili proje (opsiyonel) |
| type | text | 'logo', 'social', 'poster', 'creative' |
| prompt | text | Kullanıcının yazdığı prompt |
| image_url | text | Oluşturulan görsel URL |
| status | text | 'generating', 'completed', 'failed' |
| created_at | timestamp | Oluşturma zamanı |
| metadata | jsonb | Ekstra bilgiler (boyut, format vs.) |

---

## Dosya Yapısı

```text
src/pages/
  Studio.tsx                    <- Ana Studio sayfası

src/components/studio/
  StudioLayout.tsx              <- Studio için özel layout
  ImageTypeCards.tsx            <- Logo, Social, Poster, Creative kartları
  PromptInput.tsx               <- Prompt girişi ve gönderme
  ImagePreview.tsx              <- Oluşturulan görsel önizleme
  RevisionPanel.tsx             <- Revizyon seçenekleri
  ImageGallery.tsx              <- Oluşturulmuş görseller galerisi
  ApplyToWebsiteModal.tsx       <- Görseli siteye uygulama modalı

supabase/functions/
  studio-generate-image/        <- AI görsel oluşturma edge function
    index.ts
```

---

## UI Tasarımı

### 1. Ana Sayfa (4 Kategori Kartı)
```text
┌─────────────────────────────────────────────────────┐
│  Studio                                    [0/5 ✨] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────┐  │
│  │  ★ Logo  │  │ 📱Social │  │ 📄Poster │  │ ✨  │  │
│  │ Oluştur  │  │  Paylaşım│  │ Oluştur  │  │Yara-│  │
│  └──────────┘  └──────────┘  └──────────┘  │tıcı │  │
│                                            └─────┘  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│              Henüz görsel yok                       │
│    Oluşturmak istediğiniz görseli tanımlayın...     │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Oluşturmak istediğiniz görseli tanımlayın..│    │
│  │                                    [Auto ▼] │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 2. Görsel Oluşturulduktan Sonra
```text
┌─────────────────────────────────────────────────────┐
│  Studio                                    [1/5 ✨] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │            [Oluşturulan Görsel]             │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────┐ ┌───────────────┐ ┌──────────────┐     │
│  │ ↻ Tekrar│ │ ✏️ Düzenle    │ │ 💾 Kaydet    │     │
│  └─────────┘ └───────────────┘ └──────────────┘     │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🌐 Web Sitesine Uygula                       │   │
│  │   • Logo olarak kullan                       │   │
│  │   • Favicon olarak kullan                    │   │
│  │   • Hero görseli olarak kullan               │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Bileşen Detayları

### 1. Studio Sayfası (`src/pages/Studio.tsx`)
- 4 kategori kartı gösterimi
- Seçili kategoriye göre özelleştirilmiş prompt önerileri
- Oluşturulmuş görseller galerisi
- DashboardLayout kullanımı

### 2. Prompt Girişi (`PromptInput.tsx`)
- Text input alanı
- "Auto" modu - seçili kategoriye göre otomatik öneriler
- Karakter limiti göstergesi
- Gönder butonu

### 3. Revizyon Paneli (`RevisionPanel.tsx`)
- "Tekrar Oluştur" - aynı prompt ile yeni görsel
- "Düzenle" - prompt'u değiştirip yeniden oluştur
- "Stil Değiştir" - minimal, modern, klasik seçenekleri
- Görsel düzenleme talimatı girişi (renk değiştir, metin ekle vs.)

### 4. Web Sitesine Uygula (`ApplyToWebsiteModal.tsx`)
- Proje seçimi (birden fazla proje varsa)
- Uygulama hedefi seçimi:
  - Logo (header'da görünür)
  - Favicon (browser sekmesi)
  - OG Image (sosyal medya paylaşım görseli)
  - Hero Image (ana sayfa arka planı)
- Önizleme ve onay

---

## Edge Function: `studio-generate-image`

### İstek Yapısı:
```typescript
interface StudioGenerateRequest {
  type: 'logo' | 'social' | 'poster' | 'creative';
  prompt: string;
  style?: 'minimal' | 'modern' | 'classic' | 'bold';
  projectId?: string;  // Bağlam için
  businessName?: string;
  editInstruction?: string;  // Revizyon için
  previousImageUrl?: string; // Düzenleme için
}
```

### Yanıt:
```typescript
interface StudioGenerateResponse {
  success: boolean;
  imageUrl?: string;
  imageId?: string;
  error?: string;
}
```

### Prompt Şablonları:
```text
Logo: "Professional logo for {businessName}, {style} design, 
       clean vector style, suitable for website and print, 
       transparent background, {userPrompt}"

Social: "Social media post graphic, {dimensions} format, 
         modern design, eye-catching, {userPrompt}"

Poster: "Professional poster design, A4 format, 
         bold typography, {userPrompt}"

Creative: "{userPrompt}, high quality, professional design"
```

---

## Sidebar Entegrasyonu

### `DashboardSidebar.tsx` Güncellemesi
```typescript
const navItems = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Website', url: `/project/${activeProjectId}`, icon: Globe },
  { title: 'Studio', url: '/studio', icon: Wand2 },  // YENİ
  { title: 'Analytics', url: `/project/${activeProjectId}/analytics`, icon: BarChart3 },
  // ...
];
```

---

## Router Güncellemesi

### `App.tsx`
```typescript
<Route
  path="/studio"
  element={
    <ProtectedRoute>
      <Studio />
    </ProtectedRoute>
  }
/>
```

---

## Uygulama Adımları

1. **Veritabanı**: `studio_images` tablosu oluştur (SQL migration)
2. **Edge Function**: `studio-generate-image` fonksiyonu oluştur
3. **Sayfalar**: Studio sayfası ve bileşenleri oluştur
4. **Sidebar**: DashboardSidebar'a Studio linki ekle
5. **Router**: App.tsx'e Studio rotası ekle
6. **Entegrasyon**: ApplyToWebsiteModal ile proje görsellerini güncelle

---

## Revizyon Akışı (Detaylı)

```text
1. Kullanıcı "Düzenle" butonuna tıklar
   ↓
2. Düzenleme paneli açılır:
   ┌──────────────────────────────────────┐
   │ Görseli nasıl değiştirmek istersiniz?│
   │                                      │
   │ [________________________]           │
   │ Örn: "Rengi maviye çevir"           │
   │ Örn: "Alt tarafa metin ekle"        │
   │ Örn: "Daha minimalist yap"          │
   │                                      │
   │ [İptal]              [Uygula]       │
   └──────────────────────────────────────┘
   ↓
3. AI mevcut görseli + talimatı alıp düzenlenmiş versiyon üretir
   ↓
4. Yeni görsel gösterilir, kullanıcı beğenmezse tekrar düzenleyebilir
```

---

## Web Sitesine Uygulama Akışı

```text
1. "Web Sitesine Uygula" butonuna tıkla
   ↓
2. Modal açılır:
   ┌──────────────────────────────────────┐
   │ Görseli Nereye Uygulamak İstersiniz? │
   │                                      │
   │ Proje: [My Restaurant ▼]             │
   │                                      │
   │ ○ Logo (Header'da görünür)           │
   │ ○ Favicon (Browser sekmesi)          │
   │ ○ Sosyal Paylaşım Görseli            │
   │ ○ Hero Arka Planı                    │
   │                                      │
   │ [Önizleme]                           │
   │ ┌──────────────────────────────────┐ │
   │ │  Seçilen konumda görsel preview │ │
   │ └──────────────────────────────────┘ │
   │                                      │
   │ [İptal]              [Uygula]       │
   └──────────────────────────────────────┘
   ↓
3. Onaylandığında:
   - Logo: siteSettings.logo alanı güncellenir
   - Favicon: siteSettings.favicon alanı güncellenir
   - OG Image: pageSettings.home.socialImage güncellenir
   - Hero: images.heroHome alanı güncellenir
```

---

## Teknik Notlar

### Storage Kullanımı
- Oluşturulan görseller `user-images` bucket'ına kaydedilir
- Path: `{user_id}/studio/{type}/{timestamp}.png`

### Kredi Sistemi (Opsiyonel)
- Screenshot'ta "0/5" göstergesi var
- Her görsel oluşturma 1 kredi harcar
- Free kullanıcılar: 5 görsel/ay
- Pro kullanıcılar: Sınırsız

### Görsel Boyutları
| Tip | Boyut | Aspect Ratio |
|-----|-------|--------------|
| Logo | 512x512 | 1:1 |
| Social (Instagram) | 1080x1080 | 1:1 |
| Social (Facebook) | 1200x630 | 1.91:1 |
| Poster | 2480x3508 | A4 |
| Creative | Kullanıcı seçimi | Değişken |

### generated_content Güncellemesi
Logo ve favicon uygulandığında `siteSettings` güncellemesi:
```typescript
siteSettings: {
  ...existing,
  logo: 'https://storage.../logo.png',
  favicon: 'https://storage.../favicon.png',
}
```
