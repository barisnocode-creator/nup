
## Yapılacaklar

### 1. `deploy-to-vercel` — `teamId` desteği eklenir

Mevcut `vercelDeploy` fonksiyonunda deploy endpoint'i şu an sabit `https://api.vercel.com/v13/deployments`. `VERCEL_TEAM_ID` secret zaten eklenmiş. Endpoint şu şekilde güncellenecek:

```typescript
const VERCEL_TEAM_ID = Deno.env.get("VERCEL_TEAM_ID");
const deployEndpoint = VERCEL_TEAM_ID
  ? `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`
  : "https://api.vercel.com/v13/deployments";
```

Domain ekleme API çağrısı da (`/v9/projects/...domains`) `teamId` parametresiyle güncellenecek.

### 2. `verify-domain` — Netlify tamamen kaldırılır, Vercel'e alınır

`verify-domain/index.ts` hâlâ eski Netlify entegrasyonunu içeriyor (`registerNetlifyDomain`, `pollSslStatus`, `netlify_site_id`, `netlify_custom_domain` DB güncellemeleri vs.). Bunların tamamı kaldırılacak.

DNS doğrulaması başarılı olursa artık şunlar yapılacak:
- Domain `custom_domains` tablosunda `verified` olarak işaretlenir
- `projects.custom_domain` güncellenir
- `vercel_project_id` mevcutsa doğrudan `registerVercelDomain` çağrılır (zaten tanımlanmış)
- Netlify SSL poll mantığı → Vercel'de SSL otomatik gelir, poll gerekmez

### 3. `supabase/config.toml` — Netlify function girişi kaldırılır

```toml
# Kaldırılacak:
[functions.deploy-to-netlify]
verify_jwt = false
```

### 4. `PublishModal.tsx` — URL gösterimi iyileştirilir

Şu an `publishedUrl` Vercel URL başarısız olduğunda `window.location.origin/site/subdomain` yani Lovable önizleme URL'ini gösteriyor. Bu düzeltilecek:

- Vercel deploy başarılıysa → Vercel URL gösterilir
- Başarısız ise → kullanıcıya açık bir hata mesajı gösterilir, Lovable önizleme URL'i gösterilmez
- "Şu an canlı adresiniz" bölümü sadece gerçek Vercel URL'ini gösterir

---

## Teknik Değişiklikler Özeti

| Dosya | Değişiklik |
|---|---|
| `supabase/functions/deploy-to-vercel/index.ts` | `teamId` parametresi deploy ve domain endpoint'lerine eklenir |
| `supabase/functions/verify-domain/index.ts` | Netlify kodu tamamen kaldırılır, Vercel domain kaydı kullanılır |
| `supabase/config.toml` | `deploy-to-netlify` girişi kaldırılır |
| `src/components/website-preview/PublishModal.tsx` | URL gösterimi düzeltilir — Vercel URL yoksa Lovable URL gösterilmez |

---

## Beklenen Sonuç

Deploy tetiklendiğinde:
1. `https://api.vercel.com/v13/deployments?teamId=<VERCEL_TEAM_ID>` çağrılır
2. Vercel token artık team scope'unu tanır → `forbidden` hatası ortadan kalkar
3. Deployment oluşur, Vercel URL DB'ye yazılır
4. Modal'da gerçek Vercel URL'i gösterilir — "Lavable Project" ya da Lovable önizleme URL'i görünmez
