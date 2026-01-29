

# AI Sohbet Sorularını Azaltma ve Hata Düzeltme Planı

## Tespit Edilen Hatalar

| Sorun | Neden | Çözüm |
|-------|-------|-------|
| `null profession` hatası | AI'ın döndürdüğü `sector` değeri ("web tasarım", "danışmanlık" vb.) geçerli enum değerlerle (`service`, `retail`, `food`, `creative`, `technology`, `other`) eşleşmiyor | AI'a sektörü İngilizce ve belirli değerlerden biri olarak döndürmesini söyle + frontend'de mapping yap |
| Çok fazla soru (20+) | Her soruda 4-5 alt soru var | Toplam 8-10 soru olacak şekilde sadeleştir |
| Renk tonu sorusu yok | PreferencesStep'te basit seçim var | AI sohbetine detaylı renk tonu sorusu ekle |
| Dil seçimi çok fazla | 11 dil seçeneği var | Sadece Türkçe ve İngilizce (çoklu seçim) |

## Yapılacak Değişiklikler

### 1. AI Sohbet Sorularını Azalt (8-10 soru)

Yeni soru yapısı:

| # | Konu | Soru |
|---|------|------|
| 1 | İşletme Adı | İşletmenizin adı nedir? |
| 2 | Sektör | Hangi sektörde faaliyet gösteriyorsunuz? (hizmet, perakende, yiyecek, yaratıcı, teknoloji, diğer) |
| 3 | Konum | Hangi şehir ve ülkede bulunuyorsunuz? |
| 4 | Hizmetler | Ana ürün veya hizmetleriniz nelerdir? (kısa liste) |
| 5 | Hedef Kitle | Hedef kitleniz kimler? (tek cümle) |
| 6 | İletişim | Telefon, e-posta ve çalışma saatleriniz? |
| 7 | Kısa Hikaye | İşletmenizi bir cümleyle tanımlayın |
| 8 | Site Hedefi | Web sitenizden ne bekliyorsunuz? |
| 9 | Renk Tercihi | Hangi renk tonlarını tercih edersiniz? (sıcak/soğuk/nötr, açık/koyu) |
| 10 | Dil | Web siteniz hangi dillerde olsun? (Türkçe, İngilizce veya ikisi) |

### 2. AI Prompt Güncelleme

```text
SORU KONULARI (sırayla, HER SORU TEK CÜMLE):

1. İşletme adınız nedir?
2. Hangi sektörde faaliyet gösteriyorsunuz? 
   (Lütfen şunlardan birini seçin: hizmet, perakende, yiyecek/içecek, yaratıcı/tasarım, teknoloji, diğer)
3. Hangi şehir ve ülkede bulunuyorsunuz?
4. Ana hizmetleriniz veya ürünleriniz neler? (3-4 tane yeterli)
5. Hedef kitleniz kimler? (kısa tanım)
6. İletişim bilgileriniz? (telefon, e-posta, çalışma saatleri)
7. İşletmenizi tek cümleyle nasıl tanımlarsınız?
8. Web sitenizin amacı ne? (bilgilendirme, satış, randevu vb.)
9. Hangi renk tonlarını tercih edersiniz?
   (örn: sıcak renkler/soğuk renkler, açık tema/koyu tema)
10. Web siteniz hangi dillerde olsun? (Türkçe, İngilizce veya ikisi birden)
```

### 3. Sektör Eşleme (Sector Mapping)

AI'dan gelen Türkçe sektör → İngilizce enum:

```typescript
const sectorMapping: Record<string, Profession> = {
  // Türkçe
  'hizmet': 'service',
  'danışmanlık': 'service',
  'perakende': 'retail',
  'mağaza': 'retail',
  'yiyecek': 'food',
  'restoran': 'food',
  'kafe': 'food',
  'yaratıcı': 'creative',
  'tasarım': 'creative',
  'teknoloji': 'technology',
  'yazılım': 'technology',
  // İngilizce
  'service': 'service',
  'retail': 'retail',
  'food': 'food',
  'creative': 'creative',
  'technology': 'technology',
  'other': 'other',
};

function mapSectorToProfession(sector: string): Profession {
  const normalized = sector.toLowerCase().trim();
  for (const [key, value] of Object.entries(sectorMapping)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return 'other'; // Fallback
}
```

### 4. ExtractedBusinessData Güncelleme

```typescript
interface ExtractedBusinessData {
  // Mevcut alanlar
  businessName: string;
  sector: string; // AI'dan gelen ham değer
  city: string;
  country: string;
  services: string[];
  targetAudience: string;
  phone: string;
  email: string;
  workingHours: string;
  story: string;
  siteGoals: string;
  
  // YENİ: Website Preferences (AI'dan)
  colorTone: 'warm' | 'cool' | 'neutral';
  colorMode: 'light' | 'dark' | 'neutral';
  languages: string[]; // ['Turkish', 'English'] veya ['Turkish']
}
```

### 5. PreferencesStep Basitleştirme

- Dil seçimi: Sadece Türkçe ve İngilizce (checkbox ile çoklu seçim)
- Renk ve ton: AI sohbetinden gelen değerler kullanılır (isteğe bağlı override)
- Tone of Voice: Kalabilir (professional, friendly, premium)

## Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `supabase/functions/wizard-chat/index.ts` | Yeni 10 sorulu prompt, JSON formatı güncelleme |
| `src/components/wizard/steps/AIChatStep.tsx` | İlk mesaj güncelleme, sektör mapping |
| `src/types/wizard.ts` | ExtractedBusinessData güncelleme, LANGUAGES sadeleştirme |
| `src/components/wizard/steps/PreferencesStep.tsx` | Dil çoklu seçim, renk override |
| `src/components/wizard/CreateWebsiteWizard.tsx` | Profession mapping düzeltmesi |

## Teknik Detaylar

### Yeni JSON Formatı (AI Output)

```json
{
  "businessName": "ABC Danışmanlık",
  "sector": "service",
  "city": "İstanbul",
  "country": "Türkiye",
  "services": ["Yönetim Danışmanlığı", "Eğitim", "Koçluk"],
  "targetAudience": "KOBİ sahipleri ve yöneticiler",
  "phone": "+90 555 123 4567",
  "email": "info@abc.com",
  "workingHours": "Hafta içi 09:00-18:00",
  "story": "10 yıldır işletmelere büyüme stratejileri sunuyoruz",
  "siteGoals": "Danışmanlık randevusu almak",
  "colorTone": "cool",
  "colorMode": "light",
  "languages": ["Turkish", "English"]
}
```

### Dil Seçimi UI (Checkbox)

```tsx
const languageOptions = [
  { value: 'Turkish', label: 'Türkçe' },
  { value: 'English', label: 'İngilizce' },
];

// Checkbox ile çoklu seçim
<Checkbox 
  checked={localData.languages.includes('Turkish')} 
  onCheckedChange={(checked) => toggleLanguage('Turkish')}
/>
```

## Beklenen Sonuç

- Toplam 10 kısa soru (mevcut 20+ yerine)
- Renk tonu tercihi AI sohbetinde sorulur
- Dil seçimi: Türkçe ve/veya İngilizce
- `profession` hatası düzeltilir (sektör mapping)
- Daha hızlı ve odaklı kullanıcı deneyimi

