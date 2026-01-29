

# Lovable AI ile AI Chatbot Wizard Implementasyonu

## Mevcut Durum

| Bileşen | Durum |
|---------|-------|
| LOVABLE_API_KEY | Zaten tanımlı |
| AI Gateway | https://ai.gateway.lovable.dev/v1/chat/completions |
| Model | google/gemini-3-flash-preview (varsayılan) |

Ekstra API key eklemeye **GEREK YOK**!

## Yeni Wizard Akışı

```text
Adım 1: Meslek Seçimi (mevcut)
         ↓
Adım 2: AI Sohbet (10 soru) ← YENİ
         ↓
Adım 3: Tercihler (dil, ton, renk)
         ↓
     Website Oluştur
```

## Uygulama Adımları

### 1. Edge Function: wizard-chat

`supabase/functions/wizard-chat/index.ts`

- Lovable AI Gateway kullanacak
- Mesleğe göre 10 soru soracak
- Sohbet geçmişini takip edecek
- 10 soru sonunda extractedData JSON döndürecek

### 2. Chat UI Bileşeni

`src/components/wizard/steps/AIChatStep.tsx`

- Mesaj baloncukları (AI sol, kullanıcı sağ)
- İlerleme göstergesi (Soru 3/10)
- Metin girişi + Gönder butonu
- Loading durumu

### 3. Wizard Güncelleme

`src/components/wizard/CreateWebsiteWizard.tsx`

- Adım 2: BusinessInfoStep + ProfessionalDetailsStep → AIChatStep
- Toplam adım: 4 → 3

### 4. Config Güncelleme

`supabase/config.toml`

- wizard-chat function ekleme

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `supabase/functions/wizard-chat/index.ts` | Yeni |
| `src/components/wizard/steps/AIChatStep.tsx` | Yeni |
| `src/components/wizard/CreateWebsiteWizard.tsx` | Güncelle |
| `src/types/wizard.ts` | Güncelle |
| `supabase/config.toml` | Güncelle |

## AI Soru Stratejisi

AI şu 10 konuda soru soracak:

1. İşletme/Klinik Adı
2. Konum (Şehir, Ülke)
3. Uzmanlık Alanı
4. Deneyim Süresi
5. Sunulan Hizmetler
6. Hedef Müşteri Profili
7. Rekabet Avantajı
8. İletişim Bilgileri (Telefon, Email)
9. Çalışma Saatleri
10. Öne Çıkarılacak Özel Bilgiler

## Extracted Data Formatı

```json
{
  "businessName": "City Dental",
  "city": "İstanbul",
  "country": "Türkiye",
  "specialty": "Ortodonti",
  "yearsExperience": "15",
  "services": ["Diş Beyazlatma", "İmplant"],
  "targetAudience": "Yetişkinler ve aileler",
  "uniqueValue": "Ağrısız tedavi garantisi",
  "phone": "+90 555 123 4567",
  "email": "info@citydental.com",
  "workingHours": "Pazartesi-Cuma 09:00-18:00",
  "additionalInfo": "20 yıllık deneyimli ekip"
}
```

## Avantajlar

- Ek API key gerekmez (Lovable AI zaten mevcut)
- Doğal sohbet deneyimi
- Mesleğe özel dinamik sorular
- Daha detaylı bilgi toplama
- Kişiselleştirilmiş website içeriği

