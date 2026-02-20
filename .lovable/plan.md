
## Sektöre Göre Buton ve Başlık Metinleri — Tam Düzeltme

### Sorunun Tam Tespiti

Sorun iki farklı yerde yaşanıyor:

---

#### Sorun A — `HeroRestaurant.tsx` İçinde Hardcoded Fallback

`HeroRestaurant.tsx` satır 9-10:
```ts
const primaryBtn = p.primaryButtonText || 'Rezervasyon';
const secondaryBtn = p.secondaryButtonText || 'Menü';
```

`definitions.ts`'de `primaryButtonText: ''` (boş string) set edildi — bu doğru bir yaklaşım. Ancak JavaScript'te boş string **falsy** kabul edilir. Bu yüzden `'' || 'Rezervasyon'` ifadesi her zaman `'Rezervasyon'` döndürüyor. Mapper'ın yazdığı sektöre özel değer (`'Randevu Al'`) bu fallback yüzünden gösterilemiyor.

#### Sorun B — `definitions.ts`'deki AppointmentBooking Section'larında Sabit Metinler

Her şablondaki `AppointmentBooking` section'ları hâlâ yiyecek/restoran odaklı sabit değerlere sahip:

```ts
// specialtyCafe şablonunda — doktor için tamamen yanlış:
sectionTitle: 'Rezervasyon',
sectionSubtitle: 'Masa Ayırın',
submitButtonText: 'Rezervasyon Yap',

// restaurantElegant şablonunda da aynı:
sectionTitle: 'Rezervasyon',
sectionSubtitle: 'Masa Ayırın',
submitButtonText: 'Rezervasyon Yap',
```

`mapAppointmentSection.ts` bu değerleri sektöre göre override ediyor — ama sektör profili alias sistemi üzerinden çözülüyor ve bazı durumlar atlanıyor (örn. `'doctor'` alias'ı `sectorProfiles` içinde doğrudan karşılık bulsa da, `sectorKey` hesaplama hatası olabilir).

---

### Değişecek Dosyalar

#### Dosya 1 — `src/components/sections/HeroRestaurant.tsx`

`||` (OR) operatörü yerine `??` (nullish coalescing) kullanılacak — `??` yalnızca `null` veya `undefined` için fallback devreye girer, boş string için girmez:

```ts
// ÖNCESİ (hatalı):
const primaryBtn = p.primaryButtonText || 'Rezervasyon';
const secondaryBtn = p.secondaryButtonText || 'Menü';

// SONRASI (doğru):
const primaryBtn = p.primaryButtonText ?? 'Rezervasyon';
const secondaryBtn = p.secondaryButtonText ?? 'Menü';
```

#### Dosya 2 — `src/templates/catalog/definitions.ts`

Her şablondaki `AppointmentBooking` section'larının `defaultProps`'unu nötr/jenerik hale getir. Sektöre özgü metinler `mapAppointmentSection.ts` tarafından zaten yazılıyor — bu yüzden başlangıç değerleri nötr olmalı:

```ts
// specialtyCafe → AppointmentBooking defaultProps:
sectionTitle: 'Randevu / Rezervasyon',
sectionSubtitle: 'Hemen Başlayın',
submitButtonText: 'Gönder',

// restaurantElegant → AppointmentBooking defaultProps:
sectionTitle: 'Randevu / Rezervasyon',
sectionSubtitle: 'Hemen Başlayın',
submitButtonText: 'Gönder',
```

Bu sayede `mapAppointmentSection.ts` her sektörde kendi sektör profilini override edebilecek.

#### Dosya 3 — `src/templates/catalog/mappers/mapAppointmentSection.ts`

Mevcut `subtitleMap` içindeki sektör anahtarlarını genişlet ve `sectionTitle` için de sektöre özel başlıklar ekle:

```ts
const titleMap: Record<string, string> = {
  doctor: 'Randevu Al',
  dentist: 'Randevu Al',
  lawyer: 'Ücretsiz Danışma',
  restaurant: 'Rezervasyon',
  cafe: 'Rezervasyon',
  hotel: 'Oda Rezervasyonu',
  beauty_salon: 'Randevu Al',
  gym: 'Ücretsiz Deneme',
  veterinary: 'Randevu Al',
  pharmacy: 'Bize Ulaşın',
};

const submitMap: Record<string, string> = {
  doctor: 'Randevu Oluştur',
  dentist: 'Randevu Oluştur',
  lawyer: 'Danışma Talep Et',
  restaurant: 'Rezervasyon Yap',
  cafe: 'Rezervasyon Yap',
  hotel: 'Oda Ayırt',
  beauty_salon: 'Randevu Oluştur',
  gym: 'Deneme Dersi Al',
  veterinary: 'Randevu Oluştur',
};
```

Bu genişletme, `sectionTitle`, `sectionSubtitle` ve `submitButtonText`'in tamamının sektöre göre doğru değerlerle doldurulmasını sağlar.

---

### Sonuç

Bu 3 dosya değişikliği sonrasında:

- Doktor → "Randevu Al", "Randevu Oluştur"
- Restoran → "Rezervasyon", "Rezervasyon Yap"
- Kafe → "Rezervasyon", "Rezervasyon Yap"
- Otel → "Oda Rezervasyonu", "Oda Ayırt"
- Avukat → "Ücretsiz Danışma", "Danışma Talep Et"
- Güzellik Salonu → "Randevu Al", "Randevu Oluştur"
- Spor Salonu → "Ücretsiz Deneme", "Deneme Dersi Al"
- Veteriner → "Randevu Al", "Randevu Oluştur"

Her sektör için hero butonları ve appointment section başlıkları doğru şekilde gösterilecek.

### Değişecek Dosyalar Özeti

| Dosya | Değişiklik |
|---|---|
| `src/components/sections/HeroRestaurant.tsx` | `\|\|` → `??` operatörü (2 satır) |
| `src/templates/catalog/definitions.ts` | AppointmentBooking defaultProps'u nötr yap |
| `src/templates/catalog/mappers/mapAppointmentSection.ts` | titleMap ve submitMap ekle, tüm alanları override et |
