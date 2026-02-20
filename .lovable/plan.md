
## Sorunun Kök Nedeni

Kullanıcının paylaştığı URL `https://...lovableproject.com/site/deneme-kafe` — bu **Lovable'ın kendi önizleme sunucusu**, Vercel değil. Vercel'e hiç deploy gitmemiş çünkü:

1. **Edge function eski versiyon çalışıyor** — loglar açıkça `vercelCreateOrGetProject` hatası gösteriyor. "Projectless" deploy kodumuzu yazdık ama edge function deploy edilmedi (önbellek sorunu).
2. **VERCEL_API_TOKEN yetersiz izin** — Vercel "You don't have permission to create the project" diyor. Token proje oluşturma yetkisi olmayan bir hesaba ait.
3. **`vercel_url` veritabanında `null`** — Deneme Kafe hiç Vercel'e ulaşamadı.

"Lavable Project" ifadesi, kullanıcının Vercel token'ının bağlı olduğu hesapta mevcut olan varsayılan bir proje adından kaynaklanıyor — bizim kodumuzdaki bir şey değil.

---

## Çözüm Planı

### Adım 1 — Edge Function Yeniden Deploy (Zorunlu)

`deploy-to-vercel` edge function'ı zorla yeniden deploy edilecek. Loglar eski versiyonun (`vercelCreateOrGetProject` içeren) hâlâ çalıştığını gösteriyor — yani son yaptığımız "projectless" değişiklik production'a yansımamış.

### Adım 2 — Vercel Token İzin Sorununu Çöz

Vercel `v13/deployments` API'si **scope/team** bilgisi gerektiriyor. Mevcut token proje oluşturma yetkisi olmayan kişisel bir token gibi görünüyor.

Çözüm: Deploy isteğine kullanıcının Vercel **Team ID** veya **slug**'ını `teamId` parametresi olarak eklemek. Bu parametre olmadan Vercel token'ın bağlı olduğu hesabı bulamıyor.

Edge function'da Vercel API'ye gönderilen request'e `teamId` parametresi eklenerek:

```typescript
// Deploy isteğine teamId eklenir (eğer varsa)
const VERCEL_TEAM_ID = Deno.env.get("VERCEL_TEAM_ID");
const deployUrl = VERCEL_TEAM_ID
  ? `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`
  : "https://api.vercel.com/v13/deployments";
```

Bu sayede kullanıcı kendi Vercel team'ine deploy edebilecek.

### Adım 3 — VERCEL_TEAM_ID Secret Eklenmesi

Kullanıcıdan Vercel Team ID alınacak. Vercel dashboard'unda:
- Settings → General → Team ID (örn: `team_xxxxxxxxxxxx`)

Bu bilgi `VERCEL_TEAM_ID` adıyla secret olarak eklenecek.

### Adım 4 — PublishModal'da URL Gösterimi Düzeltme

Şu an `publishedUrl` boş kaldığında modal `window.location.origin/site/subdomain` URL'ini gösteriyor. Vercel URL başarıyla gelirse bunu göster, gelmezse kullanıcıya açıkça belirt.

---

## Teknik Değişiklikler

### `supabase/functions/deploy-to-vercel/index.ts`

```typescript
// ÖNCE:
const res = await fetch("https://api.vercel.com/v13/deployments", {

// SONRA:
const VERCEL_TEAM_ID = Deno.env.get("VERCEL_TEAM_ID");
const deployEndpoint = VERCEL_TEAM_ID
  ? `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`
  : "https://api.vercel.com/v13/deployments";

const res = await fetch(deployEndpoint, {
```

### `supabase/config.toml`

```toml
[functions.deploy-to-vercel]
verify_jwt = false
```

(Zaten mevcut — değişiklik yok)

---

## Özet

| Sorun | Nedeni | Çözüm |
|-------|--------|-------|
| "Lavable Project" görünüyor | Vercel'e hiç ulaşılamadı, Lovable önizleme URL'i gösteriliyor | Vercel deploy'u çalıştır |
| Forbidden hatası | Token team scope'u bilmiyor | `VERCEL_TEAM_ID` ekle |
| Eski kod çalışıyor | Edge function deploy edilmedi | Zorla yeniden deploy |

Bu değişikliklerden sonra kullanıcının kendi Vercel hesabına deploy edilecek ve "Lavable Project" görünmeyecek — site kullanıcının Vercel'inde `openlucius-deneme-kafe` projesi altında yayınlanacak.
