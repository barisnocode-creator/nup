

# Özel Domain (Custom Domain) Desteği Planı

Bu plan, kullanıcılarınızın kendi alan adlarını (örn: `www.drklinik.com`) yayınladıkları web sitelerine bağlamalarını sağlayacak altyapıyı oluşturacak.

---

## Mevcut Durum

```text
+------------------------+
|    Şu anki sistem      |
+------------------------+
| subdomain: klinik-adi  |
| URL: /site/klinik-adi  |
| custom_domain: null    |
+------------------------+
```

Veritabanında `custom_domain` alanı zaten mevcut ancak kullanılmıyor.

---

## Çözüm Mimarisi

```text
                    ┌─────────────────────────────────────────┐
                    │           Kullanıcı Akışı               │
                    └─────────────────────────────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │   1. PublishModal'da Domain Ekle  │
                    │   (www.drklinik.com gir)          │
                    └─────────────────┬─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │   2. DNS Kayıtlarını Göster       │
                    │   A Record: 185.158.133.1         │
                    │   TXT: _lovable.drklinik.com      │
                    └─────────────────┬─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │   3. Doğrulama (verify-domain)    │
                    │   DNS TXT kaydını kontrol et      │
                    └─────────────────┬─────────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                  ┌──────▼──────┐           ┌──────▼──────┐
                  │  Başarılı   │           │  Beklemede  │
                  │  Domain     │           │  Status:    │
                  │  Aktif!     │           │  verifying  │
                  └─────────────┘           └─────────────┘
```

---

## Teknik Detaylar

### 1. Veritabanı Değişiklikleri

Yeni bir `custom_domains` tablosu oluşturulacak:

```text
+------------------------+
|    custom_domains      |
+------------------------+
| id (uuid)              |
| project_id (fk)        |
| domain (text, unique)  |
| verification_token     |
| status (enum)          |
|   - pending            |
|   - verifying          |
|   - verified           |
|   - failed             |
| is_primary (boolean)   |
| verified_at            |
| created_at             |
+------------------------+
```

### 2. Yeni Edge Functions

| Function | Görevi |
|----------|--------|
| `add-custom-domain` | Domain ekleme, token oluşturma |
| `verify-domain` | DNS TXT kaydını kontrol etme |
| `check-domain-status` | Domain durumunu sorgulama |

### 3. UI Değişiklikleri

**A. Publish Modal Güncellemesi:**
- "Custom Domain Ekle" butonu
- Domain giriş alanı
- DNS talimatları gösterimi
- Doğrulama durumu takibi

**B. Yeni Domain Yönetim Paneli:**
- Bağlı domainlerin listesi
- Primary domain seçimi
- Domain silme/yeniden doğrulama

### 4. Public Website Routing Güncellemesi

`PublicWebsite.tsx` dosyası hem subdomain hem custom domain ile çalışacak şekilde güncellenecek:

```text
/site/klinik-adi     -> Subdomain routing (mevcut)
www.drklinik.com     -> Custom domain routing (yeni)
```

---

## Uygulama Adımları

### Adım 1: Veritabanı Şeması
- `custom_domains` tablosu oluştur
- RLS politikaları ekle (kullanıcı sadece kendi projelerinin domainlerini görsün)
- `public_projects` view'ına domain bilgisi ekle

### Adım 2: Edge Functions
1. **add-custom-domain**: Domain ekleme ve verification token oluşturma
2. **verify-domain**: DNS TXT kaydını kontrol etme (Node.js `dns` modülü veya harici API)
3. **remove-domain**: Domain silme

### Adım 3: UI Bileşenleri
1. `PublishModal` içine "Connect Domain" bölümü ekle
2. DNS talimatları için `DomainInstructions` bileşeni
3. Domain yönetimi için `DomainSettings` sayfası

### Adım 4: Routing Güncellemesi
- Custom domain sorgusu için `public_projects` view güncelle
- Routing mantığını domain bazlı çalışacak şekilde genişlet

---

## DNS Talimatları (Kullanıcıya Gösterilecek)

Kullanıcıya şu kayıtları eklemesini söyleyeceğiz:

| Tip | Host | Değer |
|-----|------|-------|
| A | @ | 185.158.133.1 |
| A | www | 185.158.133.1 |
| TXT | _lovable | lovable_verify=ABC123 |

---

## Önemli Notlar

1. **SSL Sertifikası**: Lovable Cloud otomatik olarak Let's Encrypt ile SSL sağlar
2. **DNS Propagation**: 24-72 saat sürebilir
3. **Wildcard**: Subdomain desteği için wildcard DNS gerekli değil, her domain tek tek eklenir

---

## Tahmini Süre

| Görev | Süre |
|-------|------|
| Veritabanı şeması | 1 mesaj |
| Edge functions | 2 mesaj |
| UI bileşenleri | 2 mesaj |
| Routing güncellemesi | 1 mesaj |
| **Toplam** | **~6 mesaj** |

---

Bu planı onaylarsanız, veritabanı şeması ile başlayabilirim.

