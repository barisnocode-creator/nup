

# Tüm Sektörler için Özelleştirilmiş İçerik Üretimi - Geliştirme Planı

## Problem Özeti

AI chatbot'tan toplanan zengin işletme bilgileri (hizmetler, hikaye, hedef kitle, çalışma saatleri vb.) `generate-website` edge function'ında kullanılmıyor. Prompt sadece temel bilgileri içeriyor ve sektöre özgü içerik üretmiyor.

**Mevcut Durum (Eksik):**
```text
BUSINESS INFORMATION:
- Business Name: X Giyim
- Business Type/Sector: retail
- Location: İstanbul, Türkiye
- Contact Phone: 555 55 55
- Contact Email: xgiyim@gmail.com
```

**Olması Gereken (Zengin):**
```text
BUSINESS INFORMATION:
- Business Name: X Giyim
- Sector: retail (Perakende/Mağaza)
- Location: İstanbul, Türkiye
- Contact: 555 55 55 / xgiyim@gmail.com

DETAILED BUSINESS CONTEXT:
- Services/Products: Online kıyafet satışı
- Target Audience: 18-40 yaş arası kadınlar
- Business Story: 2020'de kuruldu, modern ve şık tasarımlar sunuyor.
- Website Goals: Doğrudan satış
- Working Hours: Online satış
```

---

## Çözüm Planı

### Değişiklik 1: generate-website/index.ts - buildPrompt Fonksiyonu Güncelleme

`buildPrompt` fonksiyonunda `extractedData` parametresi eklenecek ve tüm zengin veriler AI prompt'una dahil edilecek.

**Güncel fonksiyon imzası:**
```typescript
function buildPrompt(profession: string, formData: FormData, sector?: string): string
```

**Yeni fonksiyon imzası:**
```typescript
function buildPrompt(
  profession: string, 
  formData: FormData, 
  sector?: string,
  extractedData?: ExtractedBusinessData
): string
```

### Değişiklik 2: Prompt İçeriğini Zenginleştirme

Prompt'a eklenmesi gereken yeni bölüm:

```text
DETAILED BUSINESS CONTEXT (use this information to make content highly specific):
- Services/Products Offered: ${extractedData?.services?.join(', ') || 'Not specified'}
- Target Audience: ${extractedData?.targetAudience || 'General audience'}
- Business Story: ${extractedData?.story || 'A dedicated business serving customers.'}
- Unique Value Proposition: ${extractedData?.uniqueValue || 'Quality and reliability'}
- Website Goals: ${extractedData?.siteGoals || 'Inform and connect with customers'}
- Working Hours: ${extractedData?.workingHours || 'Standard business hours'}
- Years of Experience: ${extractedData?.yearsExperience || 'Established business'}

IMPORTANT: Use this specific business context to generate AUTHENTIC content that reflects THIS business, not generic sector content.
```

### Değişiklik 3: Fonksiyon Çağrısını Güncelleme

**Satır 691 civarı değişiklik:**
```typescript
// MEVCUT:
content: buildPrompt(profession, formData, extractedSector),

// YENİ:
content: buildPrompt(profession, formData, extractedSector, (formData as any)?.extractedData),
```

### Değişiklik 4: FormData Interface Güncelleme

Edge function içinde ExtractedBusinessData tipi tanımlanacak:

```typescript
interface ExtractedBusinessData {
  businessName?: string;
  sector?: string;
  city?: string;
  country?: string;
  services?: string[];
  targetAudience?: string;
  uniqueValue?: string;
  story?: string;
  siteGoals?: string;
  workingHours?: string;
  yearsExperience?: string;
  phone?: string;
  email?: string;
}

interface FormData {
  businessInfo?: { ... };
  professionalDetails?: { ... };
  websitePreferences?: { ... };
  extractedData?: ExtractedBusinessData;  // YENİ
}
```

---

## Dosya Değişiklikleri Özeti

| Dosya | Değişiklik |
|-------|-----------|
| `supabase/functions/generate-website/index.ts` | buildPrompt fonksiyonunu güncelle, extractedData kullan |

---

## Örnek Senaryo - Öncesi ve Sonrası

### Senaryo: "X Giyim" Online Moda Mağazası

**ÖNCESİ (Jenerik İçerik):**
```text
Hero: "Discover Our Quality Products"
About: "We are a retail business serving customers..."
Services: "Product Display, Customer Service, Shopping Experience"
```

**SONRASI (İşletmeye Özel İçerik):**
```text
Hero: "Tarzınızı Yansıtan Modern Tasarımlar"
About: "2020'den bu yana 18-40 yaş arası şık kadınlara modern ve trend kıyafetler sunuyoruz..."
Services: "Online Kıyafet Satışı, Hızlı Teslimat, Kolay İade"
```

---

## Teknik Notlar

1. **Fallback Mantığı**: extractedData yoksa veya alanlar boşsa, mevcut jenerik değerler kullanılacak
2. **Dil Desteği**: Prompt içindeki dil tercihi korunacak (Türkçe/İngilizce)
3. **Geriye Uyumluluk**: Eski projelerde extractedData olmayabilir, bu durumda mevcut mantık çalışacak
4. **Blog Konuları**: İşletmenin hizmetlerine ve hedef kitlesine göre dinamik olacak

---

## Beklenen Sonuçlar

1. Restoran → yemek/menü temalı içerik
2. Hukuk bürosu → hukuki danışmanlık temalı içerik  
3. Moda mağazası → kıyafet/trend temalı içerik
4. Yazılım şirketi → teknoloji/çözüm temalı içerik
5. Her işletme kendi hikayesi, hedef kitlesi ve hizmetleriyle özelleştirilmiş içerik alacak

