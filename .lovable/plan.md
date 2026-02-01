

# extractedData Undefined Sorunu - Düzeltme Planı

## Tespit Edilen Sorunlar

### Sorun 1: AIChatStep - extractedData Null İse `onComplete` Çağrılmıyor

**Dosya:** `src/components/wizard/steps/AIChatStep.tsx`
**Satır 198-204:**
```typescript
if (isCompleteResponse) {
  setQuestionNumber(TOTAL_QUESTIONS);
  setIsComplete(true);
  onValidityChange(true);
  if (extractedData) {  // ❌ HATA: extractedData null ise onComplete çağrılmıyor!
    onComplete(extractedData);
  }
}
```

**Sonuç:** Kullanıcı "Devam Et" butonuna tıklayabiliyor ama `extractedData` hiç set edilmemiş oluyor.

### Sorun 2: JSON Parse Hatası Sessizce Yutulyor

**Dosya:** `src/components/wizard/steps/AIChatStep.tsx`
**Satır 117-130:**
```typescript
if (jsonMatch) {
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    extractedData = { ... };
  } catch (e) {
    console.error('Failed to parse extracted data:', e);  // ❌ Sadece console.error
  }
}
```

**Sonuç:** Kullanıcı hatadan habersiz, parse hatası olunca extractedData undefined kalıyor.

### Sorun 3: AI Bazen CHAT_COMPLETE Yazmadan Tamamlıyor

AI, 10 soru bitmeden veya JSON formatı bozuk şekilde cevap verebiliyor. Bu durumda `isComplete` false kalıyor ve kullanıcı sonsuz döngüye girebiliyor.

---

## Çözüm Planı

### Değişiklik 1: AIChatStep - extractedData Zorunlu Kontrolü

`processCompletedResponse` fonksiyonunda extractedData yoksa fallback oluştur:

```typescript
const processCompletedResponse = useCallback((content: string) => {
  const isCompleteResponse = content.includes('CHAT_COMPLETE');
  let cleanResponse = content;
  let extractedData: ExtractedBusinessData | null = null;
  let parseError = false;

  if (isCompleteResponse) {
    const jsonMatch = content.match(/CHAT_COMPLETE\s*(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        extractedData = {
          ...parsed,
          sector: mapSectorToProfession(parsed.sector),
        };
      } catch (e) {
        console.error('Failed to parse extracted data:', e);
        parseError = true;
      }
    } else {
      parseError = true;
    }
    
    cleanResponse = content.split('CHAT_COMPLETE')[0].trim();
    
    // Parse hatası varsa fallback oluştur
    if (parseError || !extractedData) {
      // Mesajlardan temel bilgileri çıkarmaya çalış
      extractedData = {
        businessName: 'Yeni İşletme',
        sector: 'other',
        city: 'Türkiye',
        country: 'Turkey',
        services: [],
        targetAudience: '',
        phone: '',
        email: '',
        workingHours: '',
        story: '',
        siteGoals: '',
        colorTone: 'neutral',
        colorMode: 'light',
        languages: ['Turkish'],
        uniqueValue: '',
        yearsExperience: '',
        address: '',
        vision: '',
        achievements: '',
        mainCTA: '',
        additionalInfo: '',
      };
      cleanResponse += '\n\n⚠️ Bazı bilgiler eksik kaldı. Devam edebilirsiniz, eksik bilgileri daha sonra düzenleyebilirsiniz.';
    } else {
      cleanResponse += '\n\n✨ Harika! Tüm bilgileri topladım. Şimdi web sitenizi oluşturmaya hazırız!';
    }
  }

  return { isCompleteResponse, cleanResponse, extractedData };
}, []);
```

### Değişiklik 2: onComplete Her Zaman Çağrılsın

```typescript
// MEVCUT (satır 198-204):
if (isCompleteResponse) {
  setQuestionNumber(TOTAL_QUESTIONS);
  setIsComplete(true);
  onValidityChange(true);
  if (extractedData) {
    onComplete(extractedData);
  }
}

// YENİ:
if (isCompleteResponse && extractedData) {
  setQuestionNumber(TOTAL_QUESTIONS);
  setIsComplete(true);
  onValidityChange(true);
  onComplete(extractedData);  // extractedData artık her zaman var (fallback ile)
}
```

### Değişiklik 3: CreateWebsiteWizard - extractedData Kontrolü

`handleNext` fonksiyonunda extractedData yoksa uyarı göster:

```typescript
const handleNext = () => {
  // AI chat adımından çıkarken extractedData kontrolü
  if (currentStep === 1 && !formData.extractedData) {
    toast({
      title: 'Dikkat',
      description: 'Sohbet tamamlanmadan devam edilemez. Lütfen AI asistan ile sohbeti tamamlayın.',
      variant: 'destructive',
    });
    return;
  }
  
  if (currentStep < TOTAL_STEPS) {
    setCurrentStep((prev) => prev + 1);
  }
};
```

### Değişiklik 4: wizard-chat Edge Function - Daha Sağlam JSON Çıkarımı

System prompt'a daha kesin JSON formatı talimatı ekle:

```typescript
// JSON format talimatını güçlendir
JSON FORMATI (tüm bilgiler toplandığında):
CHAT_COMPLETE
\`\`\`json
{
  "businessName": "...",
  "sector": "service|retail|food|creative|technology|other",
  ...
}
\`\`\`

ÖNEMLİ: JSON mutlaka geçerli olmalı. Tırnak işaretlerini doğru kullan!
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|-----------|
| `src/components/wizard/steps/AIChatStep.tsx` | Fallback extractedData oluştur, hata mesajı göster |
| `src/components/wizard/CreateWebsiteWizard.tsx` | extractedData yoksa devam ettirme |
| `supabase/functions/wizard-chat/index.ts` | JSON format talimatını güçlendir |

---

## Beklenen Sonuçlar

1. **Parse hatası olursa:** Fallback extractedData ile devam edilir, kullanıcı bilgilendirilir
2. **extractedData boşsa:** "Devam Et" butonu çalışmaz, kullanıcı uyarılır
3. **Sohbet tamamlandığında:** extractedData her zaman dolu olur (fallback veya gerçek data)
4. **Sektör doğru algılanır:** "Kebapçı Halil" → food sektörü → restoran görselleri

