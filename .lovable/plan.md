
# AI İçerik Üretimi - Sektör Bilgisi Düzeltme Planı

## Problem Tanımı

AI sohbetinde kullanıcıdan toplanan sektör bilgisi (restoran, kafe, hukuk bürosu vb.) `generate-website` edge function'ına doğru şekilde aktarılmıyor. Bu nedenle AI, kullanıcının gerçek sektörü yerine varsayılan veya sağlık sektörü için içerik üretiyor.

## Mevcut Durum Analizi

### Veri Akışı

```text
AIChatStep.tsx
    ↓ extractedData (sector: "food")
CreateWebsiteWizard.tsx
    ↓ form_data: { extractedData: { sector: "food", ... } }
projects tablosu
    ↓ form_data JSON
generate-website edge function
    ↓ HATA: formData.sector aramak yerine formData.extractedData.sector olmalı
```

### Sorunlu Kod (generate-website/index.ts satır 667)

```typescript
// ŞU AN:
const extractedSector = (formData as any)?.sector;

// OLMASI GEREKEN:
const extractedSector = (formData as any)?.extractedData?.sector || (formData as any)?.sector;
```

### Neden Çalışmıyor?

1. `CreateWebsiteWizard.tsx` sektör bilgisini `form_data.extractedData.sector` yolunda kaydediyor
2. `generate-website` fonksiyonu `form_data.sector` yolunda arıyor
3. Bulamadığında `profession` değerine (service, other) dönüyor
4. Sektör spesifik içerik üretilmiyor

---

## Çözüm Planı

### Değişiklik 1: generate-website/index.ts

**Satır 666-669 civarı güncellenecek:**

```typescript
// MEVCUT:
const formData = project.form_data as FormData;
const profession = project.profession;
const extractedSector = (formData as any)?.sector;

// YENİ:
const formData = project.form_data as FormData;
const profession = project.profession;

// Check multiple possible locations for sector data
const extractedSector = 
  (formData as any)?.extractedData?.sector || 
  (formData as any)?.sector || 
  profession;

console.log("Form data extractedData:", (formData as any)?.extractedData);
console.log("Detected sector:", extractedSector);
```

### Ek İyileştirmeler

1. **Loglama Geliştirmesi**: Hangi sektörün algılandığını net görmek için daha detaylı log
2. **Fallback Zinciri**: `extractedData.sector` → `sector` → `profession` sıralaması

---

## Etkilenen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `supabase/functions/generate-website/index.ts` | Sektör algılama mantığını düzelt |

---

## Beklenen Sonuç

1. Kullanıcı "restoran" dediğinde → `food` sektörü algılanacak
2. Görsel aramaları restoran/yemek temalı olacak
3. İçerik metinleri sektöre uygun olacak
4. Blog yazıları sektöre özel konularda olacak

---

## Test Senaryosu

1. Wizard'da "Botanik Cafe" gibi bir restoran/kafe işletmesi oluştur
2. AI sohbetinde sektörün `food` olarak algılandığını doğrula
3. Üretilen içeriğin yemek/kafe temalı olduğunu kontrol et
4. Görsellerin restoran/kafe ile ilgili olduğunu doğrula
