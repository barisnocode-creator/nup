

# Sektör Seçimi ve AI Soru Güncellemesi

## Mevcut Durum

| Bileşen | Mevcut |
|---------|--------|
| Sektör Seçenekleri | Doctor, Dentist, Pharmacist (sadece sağlık) |
| Soru Sayısı | 10 |
| Soru Tipi | Mesleğe özel (sağlık odaklı) |

## Yapılacak Değişiklikler

### 1. Yeni Sektör Seçenekleri

Sağlık sektörü yerine tüm sektörleri kapsayan genel kategoriler:

| Sektör ID | Etiket | Açıklama | İkon |
|-----------|--------|----------|------|
| `service` | Hizmet Sektörü | Danışmanlık, eğitim, tamir vb. | Briefcase |
| `retail` | Perakende & Satış | Mağaza, e-ticaret, showroom | ShoppingBag |
| `food` | Yiyecek & İçecek | Restoran, kafe, catering | UtensilsCrossed |
| `creative` | Kreatif & Medya | Tasarım, fotoğraf, video | Palette |
| `technology` | Teknoloji | Yazılım, IT, dijital hizmetler | Monitor |
| `other` | Diğer | Diğer tüm sektörler | Building2 |

### 2. Soru Sayısı: 10 → 5

Yarıya indirilmiş, daha detaylı ve genel sorular:

| # | Konu | Soru İçeriği |
|---|------|--------------|
| 1 | İşletme Kimliği | İşletme adı, sektör detayı, konum, deneyim süresi |
| 2 | Sunulan Değer | Ana hizmetler/ürünler, hedef kitle, rakiplerden fark |
| 3 | İletişim & Erişim | Telefon, e-posta, çalışma saatleri, adres |
| 4 | Marka Hikayesi | Kuruluş hikayesi, vizyon, değerler, başarılar |
| 5 | Site Hedefleri | Web sitesinden beklentiler, öne çıkarılacak öğeler, CTA'lar |

### 3. Dosya Değişiklikleri

| Dosya | Değişiklik |
|-------|------------|
| `src/types/wizard.ts` | Profession tipi güncelleme (6 yeni sektör) |
| `src/components/wizard/steps/ProfessionStep.tsx` | Yeni sektör seçenekleri ve ikonlar |
| `supabase/functions/wizard-chat/index.ts` | 5 soruluk yeni sistem prompt |

## Teknik Detaylar

### Yeni Profession Tipi

```typescript
export type Profession = 'service' | 'retail' | 'food' | 'creative' | 'technology' | 'other';
```

### Yeni AI Sistem Promptu

AI artık mesleğe özel değil, kurulacak siteye yönelik sorular soracak:

```text
SORU 1/5: İşletme Kimliği
- İşletmenizin adı nedir?
- Tam olarak hangi sektörde/alanda faaliyet gösteriyorsunuz?
- Hangi şehir/ülkede bulunuyorsunuz?
- Kaç yıldır bu alanda faaliyet gösteriyorsunuz?

SORU 2/5: Sunulan Değer
- Ana ürün veya hizmetleriniz nelerdir? (en az 3 tane)
- Hedef kitleniz kimler? (yaş, gelir düzeyi, ilgi alanları)
- Sizi rakiplerinizden ayıran en önemli 2-3 özellik nedir?

SORU 3/5: İletişim & Erişim
- Telefon numaranız?
- E-posta adresiniz?
- Çalışma günleri ve saatleriniz?
- Fiziksel adresiniz var mı? (varsa detay)

SORU 4/5: Marka Hikayesi
- İşletmeniz nasıl kuruldu? (kısa hikaye)
- Vizyonunuz ve değerleriniz neler?
- Elde ettiğiniz önemli başarılar veya sertifikalar var mı?

SORU 5/5: Site Hedefleri
- Web sitenizden ne bekliyorsunuz? (bilgilendirme, satış, randevu vb.)
- Ziyaretçilerin sitede yapmasını istediğiniz en önemli aksiyon nedir?
- Öne çıkarmak istediğiniz ek bilgiler var mı?
```

### Güncel ExtractedData Formatı

```json
{
  "businessName": "...",
  "sector": "...",
  "city": "...",
  "country": "...",
  "yearsExperience": "...",
  "services": ["...", "...", "..."],
  "targetAudience": "...",
  "uniqueValue": "...",
  "phone": "...",
  "email": "...",
  "workingHours": "...",
  "address": "...",
  "story": "...",
  "vision": "...",
  "achievements": "...",
  "siteGoals": "...",
  "mainCTA": "...",
  "additionalInfo": "..."
}
```

## UI Değişiklikleri

### ProfessionStep Başlık Değişikliği

Mevcut:
> "What's your profession?"

Yeni:
> "Hangi sektörde faaliyet gösteriyorsunuz?"

