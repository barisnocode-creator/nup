

# Studio Edge Function - 404 Hatası Düzeltmesi

## Sorun Analizi

Edge function `404 Not Found` hatası döndürüyor çünkü Hono framework `app.post('/')` sadece tam olarak `/` path'ine cevap veriyor. Supabase Edge Function'ları farklı path yapısı kullanıyor.

**Kanıt:**
- Loglarda tüm POST istekleri 404 dönüyor
- Function boot ediyor ama hiç POST handler çalışmıyor
- Diğer çalışan edge function'lar `serve` pattern kullanıyor, Hono değil

---

## Çözüm

Edge function'ı Hono yerine standart `serve` pattern'ına çevirmek. Bu, projede kullanılan diğer edge function'larla tutarlı olacak.

---

## Değişiklik Detayları

### Dosya: `supabase/functions/studio-generate-image/index.ts`

**Değişiklikler:**
1. Hono importlarını kaldır
2. Standart `serve` fonksiyonu kullan
3. CORS headers'ı manuel handle et
4. Request handling'i standart pattern'a çevir

**Önceki yapı (Hono):**
```typescript
import { Hono } from '...';
const app = new Hono();
app.post('/', async (c) => { ... });
Deno.serve(app.fetch);
```

**Yeni yapı (Standart serve):**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, ...',
};

serve(async (req) => {
  // OPTIONS handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // POST handling
  if (req.method === 'POST') {
    // ... business logic
    return new Response(JSON.stringify({ success: true, ... }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

---

## Yardımcı Fonksiyonlar (Korunacak)

- `buildImagePrompt()` - Tip bazlı prompt oluşturma
- `getImageDimensions()` - Görsel boyutu hesaplama

Bu fonksiyonlar aynen kalacak, sadece request handling kısmı değişecek.

---

## Test Planı

1. Edge function güncelle ve deploy et
2. `curl_edge_functions` ile manuel test yap
3. Browser'da Studio sayfasından logo oluşturmayı test et
4. Görsel başarıyla oluşturulduğunu doğrula

