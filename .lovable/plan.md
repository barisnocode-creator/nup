

# Vercel'i Sistemden Tamamen Kaldir

## Ozet

Vercel ile ilgili tum kodlari, edge function'lari ve referanslari projeden temizleyecegiz.

## Degisiklikler

### 1. Edge Function Sil: `deploy-to-vercel`

`supabase/functions/deploy-to-vercel/index.ts` dosyasi tamamen silinecek.

`supabase/config.toml`'dan ilgili bolum kaldirilacak:
```
[functions.deploy-to-vercel]
verify_jwt = false
```

### 2. Edge Function Guncelle: `verify-domain`

`supabase/functions/verify-domain/index.ts` dosyasindaki Vercel domain kayit mantigi kaldirilacak:
- `getVercelToken()`, `getVercelTeamId()`, `registerVercelDomain()` fonksiyonlari silinecek
- Domain dogrulama sonrasi Vercel'e domain ekleme blogu kaldirilacak
- `vercel_project_id` sorgusu kaldirilacak
- Domain basariyla dogrulandiginda sadece DB'deki status guncellenmesiyle yetinilecek

### 3. UI Metinlerini Guncelle

| Dosya | Degisiklik |
|---|---|
| `src/components/website-dashboard/DomainTab.tsx` (satir 265) | "SSL sertifikasi Vercel tarafindan otomatik olarak saglanir" → "SSL sertifikasi otomatik olarak saglanir (Let's Encrypt)." |
| `src/components/website-preview/DomainSettingsModal.tsx` (satir 102) | "Domain dogrulandi, Vercel'e baglandi ve SSL aktif!" → "Domain dogrulandi ve SSL aktif!" |

### 4. Dokunulmayan Dosyalar

- `src/integrations/supabase/types.ts` — Bu dosya otomatik uretiliyor, elle degistirilmez. Veritabanindaki `vercel_*` sutunlari kalsa da kod artik bunlari okumayacak/yazmayacak.
- `remove-domain/index.ts`, `add-custom-domain/index.ts` — Bunlarda Vercel referansi yok, degisiklik gerekmez.

## Kaldirilan Dosyalar

- `supabase/functions/deploy-to-vercel/index.ts`

## Toplam Etkilenen Dosyalar

| Dosya | Islem |
|---|---|
| `supabase/functions/deploy-to-vercel/index.ts` | SIL |
| `supabase/config.toml` | `deploy-to-vercel` bolumu kaldir |
| `supabase/functions/verify-domain/index.ts` | Vercel fonksiyonlarini ve entegrasyon blogunu kaldir |
| `src/components/website-dashboard/DomainTab.tsx` | "Vercel" metnini kaldir |
| `src/components/website-preview/DomainSettingsModal.tsx` | "Vercel" metnini kaldir |

