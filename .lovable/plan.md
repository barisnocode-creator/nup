
## Netlify'dan Vercel'e Geçiş Planı

### Neden Vercel?

Vercel, Netlify gibi statik HTML deploy etmeyi REST API üzerinden tam olarak destekler. Deploy akışı çok benzer: dosyayı inline olarak gönderir, Vercel bir deployment URL'si döner. Custom domain eklemek de aynı şekilde API ile yapılır. İkisi arasındaki temel fark **API endpoint yapısı** ve **authentication yöntemi**dir.

---

### Değişiklik Kapsamı

Sistemde Netlify'a bağımlı olan **3 yer** var:

| # | Bileşen | Değişiklik |
|---|---|---|
| 1 | `supabase/functions/deploy-to-netlify/` | Yeni `deploy-to-vercel` edge function oluşturulacak |
| 2 | `supabase/functions/verify-domain/index.ts` | Netlify domain kayıt kodu → Vercel domain kayıt koduna çevrilecek |
| 3 | `src/components/website-preview/PublishModal.tsx` | `deploy-to-netlify` çağrısı → `deploy-to-vercel` olarak güncellenecek |

Veritabanında `netlify_site_id`, `netlify_url`, `netlify_custom_domain` sütunları var. Bunları `vercel_project_id`, `vercel_url`, `vercel_custom_domain` olarak yeniden adlandırmak gerekecek — ya da mevcut sütunları "yeniden amaçlandırarak" kullanmaya devam edebiliriz. Temizlik açısından yeniden adlandırmak daha doğru olur.

---

### Teknik Detaylar

#### Vercel Deploy Akışı (Netlify'dan Farkı)

**Netlify:**
```
POST /sites → site_id alınır
POST /sites/{id}/deploys → deploy_id alınır (SHA-1 ile)
PUT /deploys/{id}/files/index.html → dosya yüklenir
```

**Vercel:**
```
POST /v11/projects → project_id alınır
POST /v13/deployments → files[] içinde base64 HTML inline gönderilir → deployment URL hemen döner
```

Vercel daha basit: tek bir API çağrısıyla dosyayı da gönderip deployment URL'sini alabilirsiniz. SHA-1 hesabına gerek yok.

#### Vercel Custom Domain:
```
POST /v9/projects/{projectId}/domains
Body: { "name": "example.com" }
```

---

### Adım Adım Uygulama

**Adım 1: Vercel API Token Secret'ı ekle**

`VERCEL_API_TOKEN` adında yeni bir secret eklenecek. Bunun için Vercel dashboard → Settings → Tokens'tan token üretilmesi gerekiyor.

**Adım 2: Veritabanı migration — sütunları yeniden adlandır**

```sql
ALTER TABLE projects
  RENAME COLUMN netlify_site_id TO vercel_project_id;
ALTER TABLE projects
  RENAME COLUMN netlify_url TO vercel_url;
ALTER TABLE projects
  RENAME COLUMN netlify_custom_domain TO vercel_custom_domain;
```

Bu sayede mevcut veri korunur, sadece sütun isimleri değişir.

**Adım 3: Yeni `deploy-to-vercel` edge function yaz**

`supabase/functions/deploy-to-netlify/` klasörü silinip yerine `supabase/functions/deploy-to-vercel/` oluşturulacak.

Ana deploy mantığı (HTML üretimi — ~1300 satır render kodu) **aynen korunacak**, sadece Netlify API çağrıları Vercel API çağrılarıyla değiştirilecek:

```typescript
// Vercel'de proje oluşturma
POST https://api.vercel.com/v11/projects
{ name: "openlucius-{subdomain}" }

// Vercel'de deployment (inline base64 HTML)
POST https://api.vercel.com/v13/deployments
{
  name: "openlucius-{subdomain}",
  files: [{ file: "index.html", data: "<base64 HTML>", encoding: "base64" }],
  projectId: vercelProjectId,
  target: "production"
}
```

**Adım 4: `verify-domain/index.ts` güncelle**

Netlify domain registration kodu kaldırılıp yerine Vercel domain API'si kullanılacak:

```typescript
// Vercel'e domain ekle
POST https://api.vercel.com/v9/projects/{projectId}/domains
Authorization: Bearer VERCEL_API_TOKEN
{ "name": "example.com" }
```

SSL Vercel'de otomatik — ayrıca poll etmeye gerek yok.

**Adım 5: `PublishModal.tsx` güncelle**

`deploy-to-netlify` → `deploy-to-vercel` function adı değişir. `netlify_url` / `netlify_custom_domain` referansları → `vercel_url` / `vercel_custom_domain` olarak güncellenir.

---

### Önkoşul: Vercel API Token

Bu değişiklikleri uygulamadan önce sizden **Vercel API token**'ı almanız gerekiyor:

1. [vercel.com/account/tokens](https://vercel.com/account/tokens) adresine gidin
2. "Create Token" ile yeni bir token oluşturun
3. Token'ı bana bildirin, sisteme ekleyeceğim

---

### Etkilenmeyen Şeyler

- HTML render mantığı (tüm section renderer'lar) birebir korunacak
- Domain doğrulama (DNS TXT kontrolü) değişmeyecek
- Kullanıcı arayüzü (PublishModal görünümü) değişmeyecek
- Mevcut yayınlanmış siteler etkilenmez (sadece yeni yayınlamalar Vercel'e gidecek)

---

### Özet

| Değişiklik | Etki |
|---|---|
| `deploy-to-netlify` → `deploy-to-vercel` | Yeni yayınlamalar Vercel'e gider |
| `verify-domain` Netlify kodu → Vercel | Custom domain bağlama Vercel üzerinden çalışır |
| DB sütunları yeniden adlandırılır | Temiz bir veri modeli |
| `PublishModal.tsx` function adı güncellenir | UI doğru function'ı çağırır |

**Başlamadan önce:** Vercel API token'ınızı paylaşmanız ya da sisteme eklemeniz gerekiyor.
