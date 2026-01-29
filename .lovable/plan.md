
# Website Yayınlama (Publish) Sistemi Planı

## Mevcut Durum

Şu anda "Publish" butonu tıklandığında sadece bir upgrade modal açılıyor. Gerçek bir yayınlama sistemi mevcut değil:
- Database'de yayınlama ile ilgili alanlar yok
- Subdomain sistemi yok
- Public erişim mekanizması yok

---

## Önerilen Yayınlama Sistemi

### Yayınlama Seçenekleri

| Seçenek | Açıklama | Örnek URL |
|---------|----------|-----------|
| **Platform Subdomain** | Her site benzersiz bir subdomain alır | `klinik-adi.openlucius.app` |
| **Custom Domain** (Premium) | Kullanıcı kendi domain'ini bağlar | `www.klinikadi.com` |

---

## Teknik Uygulama

### 1. Database Değişiklikleri

```sql
ALTER TABLE projects ADD COLUMN subdomain TEXT UNIQUE;
ALTER TABLE projects ADD COLUMN is_published BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE projects ADD COLUMN custom_domain TEXT;
```

### 2. Yeni Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/pages/PublicWebsite.tsx` | Yayınlanmış siteyi gösteren public sayfa |
| `src/components/website-preview/PublishModal.tsx` | Yayınlama ayarları modal'ı |
| `supabase/functions/check-subdomain/index.ts` | Subdomain müsaitlik kontrolü |

### 3. Güncellenen Dosyalar

| Dosya | Değişiklik |
|-------|------------|
| `src/pages/Project.tsx` | Publish butonunu gerçek işleve bağla |
| `src/App.tsx` | Public website route'u ekle |
| `src/components/website-preview/UpgradeModal.tsx` | Premium özellikler için güncelle |

---

## Yayınlama Akışı

```text
1. Kullanıcı "Publish" butonuna tıklar
        |
        v
2. PublishModal açılır
   - Subdomain girişi (benzersizlik kontrolü ile)
   - Site önizleme linki
   - Yayınla butonu
        |
        v
3. Subdomain müsait mi kontrolü (edge function)
        |
        v
4. Database güncellenir:
   - subdomain = kullanıcının seçtiği
   - is_published = true
   - published_at = now()
        |
        v
5. Kullanıcıya paylaşılabilir link gösterilir
   - Kopyala butonu
   - Yeni sekmede aç butonu
```

---

## Public Website Görüntüleme

### URL Yapısı

```
https://[subdomain].openlucius.app
```

veya (mevcut domain üzerinden):

```
https://yourapp.com/site/[subdomain]
```

### Public Sayfa Özellikleri

- Giriş gerektirmez
- WebsitePreview componentini read-only kullanır
- SEO meta tagları
- Analytics tracking devam eder

---

## Publish Modal Tasarımı

```
┌────────────────────────────────────────┐
│  🌐 Publish Your Website               │
├────────────────────────────────────────┤
│                                        │
│  Choose your website address:          │
│                                        │
│  ┌──────────────────┐.openlucius.app  │
│  │ clinic-name      │                  │
│  └──────────────────┘                  │
│  ✓ Available                           │
│                                        │
│  Your website will be live at:         │
│  https://clinic-name.openlucius.app    │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │         🚀 Publish Now          │   │
│  └─────────────────────────────────┘   │
│                                        │
│  🔒 Want a custom domain?              │
│  Upgrade to Premium →                  │
│                                        │
└────────────────────────────────────────┘
```

---

## Dosya Detayları

### PublishModal.tsx

```typescript
// Özellikler:
- Subdomain input (auto-slug from business name)
- Real-time availability check (debounced)
- Validation (3-50 karakter, sadece harf/rakam/tire)
- Publish butonu
- Başarılı yayınlama sonrası share options
```

### PublicWebsite.tsx

```typescript
// URL: /site/:subdomain
// Özellikler:
- Subdomain'den projeyi çek (is_published = true)
- WebsitePreview'i render et (isEditable = false)
- 404 if not found or not published
- Analytics tracking
```

### check-subdomain Edge Function

```typescript
// Input: { subdomain: string }
// Output: { available: boolean, suggestion?: string }
// Kontroller:
- Mevcut subdomain'lerle çakışma
- Reserved keywords (admin, www, api, etc.)
- Format validation
```

---

## Premium Özellikler (Gelecek)

| Özellik | Free | Premium |
|---------|------|---------|
| Platform subdomain | ✓ | ✓ |
| Custom domain | ✗ | ✓ |
| Remove "Powered by" badge | ✗ | ✓ |
| Analytics export | ✗ | ✓ |
| Priority support | ✗ | ✓ |

---

## Güvenlik Önlemleri

### RLS Policies

```sql
-- Public okuma (yayınlanmış siteler için)
CREATE POLICY "Anyone can view published websites"
ON projects FOR SELECT
USING (is_published = true);

-- Sadece site sahibi yayınlayabilir/güncelleyebilir
CREATE POLICY "Owners can publish their websites"
ON projects FOR UPDATE
USING (auth.uid() = user_id);
```

### Subdomain Kuralları

- Minimum 3, maksimum 50 karakter
- Sadece küçük harf, rakam ve tire
- Tire ile başlayamaz/bitemez
- Reserved keywords engellenir: admin, api, www, mail, ftp, etc.

---

## Uygulama Sırası

1. **Database migration** - Yeni kolonlar ekle
2. **check-subdomain edge function** - Müsaitlik kontrolü
3. **PublishModal component** - Kullanıcı arayüzü
4. **PublicWebsite page** - Public görüntüleme
5. **Project.tsx güncelleme** - Publish akışını bağla
6. **App.tsx routing** - Public route ekle
7. **Dashboard güncelleme** - Yayınlanmış siteleri göster

---

## Beklenen Sonuç

Bu implementasyon sonrasında:

1. Kullanıcılar sitelerini tek tıkla yayınlayabilecek
2. Her site benzersiz bir subdomain alacak (örn: `dr-ahmet.openlucius.app`)
3. Yayınlanan siteler herkese açık olacak
4. Dashboard'da yayın durumu görünecek
5. Premium kullanıcılar custom domain bağlayabilecek (gelecek faz)
