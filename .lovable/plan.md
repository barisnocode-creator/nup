
## Mevcut Durum — Ne Yapıldı, Ne Eksik

### ✅ Tamamlananlar
- `VERCEL_API_TOKEN` secret eklendi
- DB sütunları `vercel_project_id`, `vercel_url`, `vercel_custom_domain` olarak yeniden adlandırıldı
- `deploy-to-vercel` Edge Function oluşturuldu (1387 satır, tam render mantığı içeriyor)
- `verify-domain` Edge Function Vercel'e güncellendi
- `PublishModal.tsx` — `handlePublish` artık `deploy-to-vercel` çağırıyor ✅
- `supabase/config.toml` güncellendi

### ❌ Eksik — 2 Sorun Var

**Sorun 1: `handleUpdate` hâlâ Netlify çağırıyor (satır 275-287)**
```typescript
// YANLIŞ — hâlâ Netlify:
const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-netlify', {
  body: { projectId },
});
if (!deployError && deployData?.netlifyUrl) {   // netlifyUrl kontrolü de yanlış
```

**Sorun 2: `handleUpdate` başarı kontrolü `netlifyUrl` bekliyor**
Vercel fonksiyonu `vercelUrl` döndürüyor ama eski kod `netlifyUrl` arıyor — güncelleme her zaman "başarısız" görünüyor.

---

## Yapılacak Değişiklik — Tek Dosya, 2 Satır

**Dosya:** `src/components/website-preview/PublishModal.tsx`

**Satır 275:** `'deploy-to-netlify'` → `'deploy-to-vercel'`  
**Satır 279:** `deployData?.netlifyUrl` → `deployData?.vercelUrl`

### Technical Detail
```typescript
// ÖNCE (satır 275-285):
const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-netlify', {
  body: { projectId },
});
if (!deployError && deployData?.netlifyUrl) {
  toast({ title: '✅ Site güncellendi!', ... });

// SONRA:
const { data: deployData, error: deployError } = await supabase.functions.invoke('deploy-to-vercel', {
  body: { projectId },
});
if (!deployError && deployData?.vercelUrl) {
  toast({ title: '✅ Site güncellendi!', ... });
```

---

## Sonuç

Bu küçük ama kritik düzeltme ile:
- Yeni yayınlama → `deploy-to-vercel` ✅ (zaten düzgün)
- Mevcut site güncelleme → `deploy-to-vercel` ✅ (bu düzeltmeyle)
- Başarı kontrolü → `vercelUrl` ✅ (bu düzeltmeyle)

Netlify'a hiçbir çağrı kalmayacak. `deploy-to-netlify` Edge Function silinebilir (isteğe bağlı, şimdilik zarar vermez).
