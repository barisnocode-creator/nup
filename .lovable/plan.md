

# AI Chatbot Hızlandırma Planı

## Mevcut Durum Analizi

| Sorun | Neden |
|-------|-------|
| Yavaş ilk mesaj | Her seferinde AI Gateway'e istek atılıyor |
| Yavaş yanıtlar | Tam yanıt beklenip sonra gösteriliyor (streaming yok) |
| Büyük sistem promptu | ~2000 karakter prompt her istekte gönderiliyor |
| Model seçimi | `gemini-3-flash-preview` kullanılıyor |

## Hızlandırma Stratejileri

### 1. Streaming Yanıtlar (En Etkili)

Mevcut durumda AI'ın tüm yanıtı tamamlanana kadar bekliyoruz. Streaming ile karakterler geldiği anda gösterilecek.

**Kullanıcı deneyimi farkı:**
- Mevcut: 5-8 saniye bekleme → tam mesaj
- Streaming: 0.5 saniye → kelimeler akıyor

### 2. İlk Mesajı Önceden Hazırlama

İlk karşılama mesajı her zaman aynı olduğu için bunu hardcode edebiliriz:

```text
"Merhaba! Ben profesyonel web sitesi danışmanınızım. 
İşletmeniz için harika bir web sitesi oluşturmak üzere 
size 5 soru soracağım.

Soru 1/5: İşletme Kimliği
- İşletmenizin adı nedir?
- Hangi sektörde faaliyet gösteriyorsunuz?
- Hangi şehirde bulunuyorsunuz?
- Kaç yıldır bu alanda çalışıyorsunuz?"
```

Bu sayede wizard açıldığında **anında** mesaj görünür, AI çağrısı yapılmaz.

### 3. Daha Hızlı Model

| Model | Hız | Kalite |
|-------|-----|--------|
| `gemini-3-flash-preview` (mevcut) | Orta | Yüksek |
| `gemini-2.5-flash-lite` | **Çok Hızlı** | İyi |

`flash-lite` modeli basit sohbet için yeterli ve çok daha hızlı.

### 4. max_tokens Azaltma

Mevcut: `max_tokens: 1000`
Önerilen: `max_tokens: 500`

Kısa sorular için 500 token fazlasıyla yeterli.

## Uygulama Planı

### Adım 1: İlk Mesajı Hardcode Et

`AIChatStep.tsx` - İlk mesaj anında gösterilecek, AI çağrısı yapılmayacak

### Adım 2: Streaming Ekle

**Edge Function değişiklikleri:**
- `stream: true` parametresi ekle
- SSE (Server-Sent Events) formatında yanıt döndür

**Frontend değişiklikleri:**
- ReadableStream ile yanıtı oku
- Her chunk geldiğinde mesajı güncelle

### Adım 3: Model ve Token Optimizasyonu

- Model: `gemini-2.5-flash-lite`
- max_tokens: 500
- temperature: 0.5 (daha tutarlı yanıtlar)

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `supabase/functions/wizard-chat/index.ts` | Streaming desteği, model değişikliği |
| `src/components/wizard/steps/AIChatStep.tsx` | Hardcode ilk mesaj, streaming okuma |

## Beklenen İyileştirmeler

| Metrik | Önce | Sonra |
|--------|------|-------|
| İlk mesaj süresi | 5-8 sn | **0 sn** (anında) |
| Sonraki yanıtlar | 5-8 sn bekleme | **0.3 sn**'de başlama |
| Kullanıcı deneyimi | Bekle → Oku | Anında okumaya başla |

## Teknik Detaylar

### Streaming Edge Function

```typescript
// Stream modunu aç
body: JSON.stringify({
  model: 'google/gemini-2.5-flash-lite',
  messages: conversationMessages,
  stream: true,
  max_tokens: 500,
}),

// SSE olarak döndür
return new Response(response.body, {
  headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
});
```

### Frontend Streaming Okuma

```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Her chunk'ı parse et ve mesajı güncelle
  updateMessage(chunk);
}
```

