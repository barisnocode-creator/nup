
## Sorun: "Ücretsiz İlk Muayene" Metni Nereden Geliyor?

### Kök Neden

`src/templates/catalog/mappers/mapCtaSection.ts` dosyasında `ctaDescMap` adlı bir harita var. Site oluşturulurken sektör `doctor` olarak algılandığında bu harita devreye giriyor ve CTABanner bölümünün açıklama metnini şu şekilde dolduruyur:

```
"İlk muayeneniz ücretsiz. Randevunuzu hemen alın ve sağlığınızı güvence altına alın."
```

Aynı durum `veterinary` için de geçerli: `"İlk muayene ücretsizdir."`

Bu metinler site ilk oluşturulduğunda veritabanına yazılıyor. Şu an projenin `site_sections` içindeki `CTABanner` bölümünün `description` prop'unda bu metin saklı durumda.

### Etkilenen Yerler — 2 Değişiklik

---

#### Değişiklik 1: `mapCtaSection.ts` — Varsayılan CTA metinlerini düzelt

`ctaDescMap` içindeki hatalı varsayılan metinler güncellenir:

| Sektör | Önce | Sonra |
|---|---|---|
| `doctor` | "İlk muayeneniz ücretsiz. Randevunuzu hemen alın..." | "Randevunuzu hemen alın ve sağlığınızı güvence altına alın." |
| `dentist` | "İlk muayeneniz ücretsiz! Sağlıklı gülüşünüz..." | "Sağlıklı gülüşünüz için hemen randevu alın." |
| `veterinary` | "İlk muayene ücretsizdir..." | "Dostunuzun sağlığı için hemen randevu alın." |

Bu değişiklik yeni oluşturulacak siteler için geçerli olacak.

---

#### Değişiklik 2: `CallUsSection.tsx` — "Ücretsiz İlk Görüşme" rozeti

`CallUsSection` bileşeninde `badge2` değeri varsayılan olarak `'Ücretsiz İlk Görüşme'` olarak ayarlı. Bu rozet doktorlar için yanıltıcı olabilir:

```typescript
badge2 = 'Ücretsiz İlk Görüşme',  // ← değiştirilecek
```

→ `badge2 = 'Hızlı Randevu'` olarak değiştirilecek.

---

#### Değişiklik 3 (Kritik): Mevcut projedeki veritabanı kaydını düzelt

Proje veritabanında zaten yazılmış olan `CTABanner` bölümünün `description` prop'unu güncellemek gerekiyor. Bunun için bir SQL güncelleme sorgusu çalıştırılacak:

```sql
UPDATE projects
SET site_sections = (
  SELECT jsonb_agg(
    CASE
      WHEN (s->>'type') = 'CTABanner'
        AND (s->'props'->>'description') ILIKE '%ücretsiz%muayene%'
      THEN jsonb_set(s, '{props,description}',
        '"Randevunuzu hemen alın ve sağlığınızı güvence altına alın."')
      ELSE s
    END
  )
  FROM jsonb_array_elements(site_sections) AS s
)
WHERE user_id = (SELECT id FROM auth.users WHERE ... )
```

Bu sayede mevcut projenizde görünen metin anında düzeltilir, yeni proje oluşturmak gerekmez.

---

### Değişiklik Özeti

| # | Dosya | Değişiklik |
|---|---|---|
| 1 | `src/templates/catalog/mappers/mapCtaSection.ts` | `doctor`, `dentist`, `veterinary` için CTA açıklamalarındaki "ücretsiz muayene" ifadeleri kaldırılır |
| 2 | `src/components/sections/addable/CallUsSection.tsx` | `badge2` varsayılanı `'Hızlı Randevu'` olarak güncellenir |
| 3 | Veritabanı (SQL) | Mevcut projenin `CTABanner` `description` prop'u düzeltilir |

### Beklenen Sonuç

Sitenizdeki "Ücretsiz İlk Muayene" ifadesi kaldırılır, yerine randevu almayı teşvik eden nötr bir metin gelir. Yeni oluşturulacak doktor/diş hekimi/veteriner siteleri de artık bu yanıltıcı varsayılanla başlamaz.
