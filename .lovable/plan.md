
# CORS Hatası Düzeltme - Studio Edge Function

## Sorun Analizi

Edge function'da `c.json()` metodu kullanıldığında CORS başlıkları eklenmiyor. Bu nedenle tarayıcı istekleri CORS politikası nedeniyle bloklanıyor.

**Hata mesajı:**
```
Access to fetch at 'https://...supabase.co/functions/v1/studio-generate-image' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header 
is present on the requested resource.
```

---

## Çözüm

`supabase/functions/studio-generate-image/index.ts` dosyasında Hono middleware kullanarak tüm yanıtlara CORS başlıkları eklenecek.

### Değişiklikler:

**1. Hono CORS Middleware Ekleme**

```typescript
import { cors } from 'https://deno.land/x/hono@v3.12.0/middleware.ts';

const app = new Hono();

// CORS middleware - tüm isteklere uygulanır
app.use('*', cors({
  origin: '*',
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
  allowMethods: ['POST', 'OPTIONS'],
}));
```

**2. Manuel OPTIONS handler kaldırma**

Hono CORS middleware OPTIONS isteklerini otomatik olarak handle eder, bu yüzden manuel OPTIONS handler'a gerek yok.

**3. Yanıtlarda `c.json()` ile CORS**

Hono middleware tüm yanıtlara CORS başlıklarını otomatik ekleyeceğinden, mevcut `c.json()` çağrıları çalışmaya devam edecek.

---

## Değiştirilecek Dosya

| Dosya | İşlem |
|-------|-------|
| `supabase/functions/studio-generate-image/index.ts` | CORS middleware ekleme |

---

## Uygulama Detayı

```typescript
// ÖNCE (Satır 1-9):
import { Hono } from 'https://deno.land/x/hono@v3.12.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const app = new Hono();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SONRA:
import { Hono } from 'https://deno.land/x/hono@v3.12.0/mod.ts';
import { cors } from 'https://deno.land/x/hono@v3.12.0/middleware.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const app = new Hono();

// CORS middleware - tüm isteklere otomatik uygulanır
app.use('*', cors({
  origin: '*',
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
  allowMethods: ['POST', 'OPTIONS'],
}));
```

**Ek olarak:**
- Satır 62-64'teki manuel `app.options('*', ...)` handler'ı kaldırılacak
- `c.json()` kullanılan yerlerde CORS başlıkları middleware tarafından otomatik eklenecek

---

## Test Adımları

1. Edge function güncellenir ve deploy edilir
2. Studio sayfasında logo oluşturma tekrar denenir
3. Görsel başarıyla oluşturulup görüntülenir
