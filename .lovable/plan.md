

# MedCare Pro Template Yeniden Tasarimi

## Mevcut Sorunlar

1. **Preview gorseli yanlis** — `template-preview-dental.jpg` kullaniliyor, kendi ozel preview gorseli yok
2. **HeroMedical icinde hardcoded fallback'ler** — "Uzman Klinik", "Sagliginiz Icin Profesyonel Bakim", "12K+", "Hasta Puani" gibi sabit Turkce metinler var. Kullanicinin sektoru ne olursa olsun bu metinler gorunuyor
3. **StatisticsCounter bos geliyor** — defaultProps'ta tum stat degerleri `""`, mapper yok, sonuc: istatistik bolumu tamamen bos kalabiliyor
4. **ServicesGrid icinde hardcoded fallback** — Bilesenin kendi icinde "Hizli Teslimat", "Yaratici Cozumler" gibi generic default servisler var (satir 7-14)
5. **Template gorselleri generic** — Unsplash URL'leri sabit, sektore gore degismiyor

---

## Yapilacak Degisiklikler

### 1. HeroMedical.tsx — Hardcoded fallback'leri kaldir

Tum sabit metin fallback'leri bos string'e cekilecek. Icerik mapper'dan gelecek.

| Satir | Onceki | Sonraki |
|-------|--------|---------|
| 18 | `p.badge \|\| 'Uzman Klinik'` | `p.badge \|\| ''` |
| 19 | `p.title \|\| 'Sagliginiz Icin...'` | `p.title \|\| ''` |
| 20 | `p.description \|\| 'Deneyimli uzman...'` | `p.description \|\| ''` |
| 21 | `p.primaryButtonText \|\| 'Randevu Al'` | `p.primaryButtonText \|\| ''` |
| 23 | `p.secondaryButtonText \|\| 'Hizmetlerimiz'` | `p.secondaryButtonText \|\| ''` |
| 26 | `p.floatingBadge \|\| 'Ucretsiz Ilk Muayene'` | `p.floatingBadge \|\| ''` |
| 28-33 | `'12K+'`, `'Mutlu Hasta'`, `'%95'` vb. | `''` (bos string) |
| 35-39 | `['Modern Ekipman', 'Uzman Kadro', '7/24 Destek']` | `[]` |
| 211 | `'Hasta Puani'` | `p.statCardLabel \|\| ''` |

Bos olan alanlar render edilmeyecek (zaten cogu `{x && <Element>}` kontrolune sahip, olmayanlara da bu kontrol eklenecek).

### 2. ServicesGrid.tsx — Generic default servisleri kaldir

Satir 7-14'teki `defaultServices` dizisini bos diziye cevir:

```typescript
const defaultServices: any[] = [];
```

Servisler tamamen mapper'dan veya sectorProfile'dan gelecek.

### 3. StatisticsCounter icin mapper ekle (mappers/index.ts)

MedCare Pro'daki `StatisticsCounter` icin yeni bir mapper register edilecek:

```typescript
register(['StatisticsCounter'], (props, data) => {
  const profile = getSectorProfile(data.sector);
  // generatedContent'ten veya sectorProfile'dan istatistikleri doldur
  // Ornek: Hasta sayisi, memnuniyet orani, yil deneyim, uzman sayisi
}, []);
```

### 4. sectorProfiles.ts — Her sektore stats verisi ekle

`SectorProfile` interface'ine `stats` alani eklenir:

```typescript
stats?: Array<{ value: string; label: string }>;
```

Ornek (doctor):
```typescript
stats: [
  { value: '10.000+', label: 'Mutlu Hasta' },
  { value: '%98', label: 'Memnuniyet' },
  { value: '15+', label: 'Yil Deneyim' },
  { value: '25+', label: 'Uzman Hekim' },
]
```

Her sektore uygun stats verileri eklenecek (cafe: "Gunluk Fincan", restoran: "Yillik Misafir" vb.).

### 5. HeroMedical — Stat card icin sektore duyarli gosterim

Sabit "4.9/5" ve "Hasta Puani" yerine, sektore gore degisen floating stat card:

- doctor/dentist: "4.9/5 Hasta Puani"
- restaurant: "4.8/5 Misafir Puani"  
- lawyer: "4.9/5 Musteri Puani"
- cafe: "4.9/5 Musteri Puani"

Bu veri `floatingBadge` ve `statCardLabel` prop'larindan gelecek.

### 6. definitions.ts — MedCare Pro gorsel URL'lerini guncelle

About section icindeki sabit gorsel URL'lerini daha profesyonel/genel olanlarla degistir. Mevcut gorunum dental/doktor odakli — daha generic profesyonel gorseller kullanilacak.

### 7. mappers/index.ts — HeroMedical'a stat mapping ekle

Hero mapper'da `stat1Value`, `stat1Label` vb. alanlari sectorProfile'daki stats verisinden doldur:

```typescript
// HeroMedical stat mapping
if (profile?.stats && sectionProps.stat1Value !== undefined) {
  profile.stats.forEach((stat, i) => {
    overrides[`stat${i+1}Value`] = stat.value;
    overrides[`stat${i+1}Label`] = stat.label;
  });
}
```

---

## Degistirilecek Dosyalar

| Dosya | Degisiklik |
|---|---|
| `src/components/sections/HeroMedical.tsx` | Hardcoded fallback'ler kaldirilir, bos alan kontrolu eklenir |
| `src/components/sections/ServicesGrid.tsx` | `defaultServices` bos diziye cekilir |
| `src/templates/catalog/sectorProfiles.ts` | `SectorProfile`'a `stats` alani + her sektore stats verisi eklenir |
| `src/templates/catalog/mappers/index.ts` | `StatisticsCounter` mapper eklenir, hero mapper'a stat mapping eklenir |
| `src/templates/catalog/mappers/mapHeroSection.ts` | stat1/2/3 Value/Label mapping eklenir |
| `src/templates/catalog/definitions.ts` | MedCare Pro gorsel URL'leri guncellenir |

---

## Beklenen Sonuc

- MedCare Pro template'i acildiginda: sektore uygun icerikler (basliklar, servisler, istatistikler) otomatik dolar
- "Uzman Klinik", "12K+ Mutlu Hasta" gibi hardcoded metinler hicbir zaman gorunmez
- Template farkli bir sektore (cafe, restoran, avukat) uygulandiginda bile icerik dogru gelir
- ServicesGrid'de generic "Hizli Teslimat" metinleri yerine gercek servis verileri gorulur

