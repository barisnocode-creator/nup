
## CTABanner "Ücretsiz" Metni — Veritabanı Güncellemesi

### Durum Tespiti

Veritabanı kontrolü yapıldı. Projenin (`Dr. Barış Yakut Muayenehanesi`) `CTABanner` bölümünde hâlâ şu metin var:

> **"İlk muayeneniz ücretsiz. Randevunuzu hemen alın ve sağlığınızı güvence altına alın."**

Önceki onaylama adımında SQL güncellemesi çalışmadı — proje ID'sinde küçük bir yazım farkı (`a54f` vs `a45f`) soruna yol açtı. Kod dosyaları (`mapCtaSection.ts` ve `CallUsSection.tsx`) doğru şekilde güncellendi; sadece mevcut proje kaydı veritabanında eski metinle kalmış durumda.

---

### Tek Adımlık Düzeltme

**Proje ID:** `19c6eeea-548c-44ff-a54f-4ba481d04db3`

Aşağıdaki SQL komutu çalıştırılacak:

```sql
UPDATE projects
SET site_sections = (
  SELECT jsonb_agg(
    CASE
      WHEN (s->>'type') = 'CTABanner'
        AND (s->'props'->>'description') ILIKE '%ücretsiz%'
      THEN jsonb_set(s, '{props,description}',
        '"Randevunuzu hemen alın ve sağlığınızı güvence altına alın."')
      ELSE s
    END
  )
  FROM jsonb_array_elements(site_sections) AS s
)
WHERE id = '19c6eeea-548c-44ff-a54f-4ba481d04db3'
```

**Sonuç:**

| Alan | Önce | Sonra |
|---|---|---|
| CTABanner description | "İlk muayeneniz ücretsiz. Randevunuzu hemen alın..." | "Randevunuzu hemen alın ve sağlığınızı güvence altına alın." |

---

### Etki Alanı

- Yalnızca `Dr. Barış Yakut Muayenehanesi` projesi etkilenir
- Başka hiçbir bölüm değişmez
- Değişiklik anında görünür, yeniden yayınlamak gerekmez
