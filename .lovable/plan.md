

# Domain Onerisi Secme Ozelligi

## Ozet
Kullanicilara sunulan 3 ucretsiz domain onerisinden birini sectiklerinde, o domain otomatik olarak "Domain Ekle" formuna yazilacak ve baglama sureci baslatilacak.

## Nasil Calisacak

1. Kullanici yayinla sonrasi success ekraninda 3 domain onerisi gorur
2. Bir oneriye tiklarsa (su an Namecheap'e yonlendiriyor), bunun yerine DomainSettingsModal acilacak ve secilen domain otomatik olarak "Yeni Domain Ekle" formuna yazilacak
3. Kullanici DNS ayarlarini yapip dogrulamayi tamamlar

## Teknik Detaylar

### 1. `DomainSuggestionCard.tsx` Guncelleme
- `onSelectDomain(domain: string)` callback'i eklenecek
- Domain'e tiklandiginda Namecheap yerine bu callback cagirilacak
- Namecheap linki kucuk bir "Satin Al" ikonu olarak kalabilir (opsiyonel)

### 2. `DomainSettingsModal.tsx` Guncelleme
- `initialDomain?: string` prop'u eklenecek
- Modal acildiginda `initialDomain` varsa, otomatik olarak "Yeni Domain Ekle" formu acilacak ve domain alani onceden doldurulacak

### 3. `AddDomainForm.tsx` Guncelleme
- `initialValue?: string` prop'u eklenecek
- Input alani bu deger ile onceden doldurulacak

### 4. `PublishModal.tsx` Guncelleme
- `DomainSuggestionCard`'a `onSelectDomain` handler eklenecek
- Secilen domain state'e kaydedilecek
- `DomainSettingsModal`'a `initialDomain` olarak aktarilacak
- Modal acildiginda secilen domain ile form otomatik doldurulacak

## Kullanici Akisi

```text
Yayinla Success Ekrani
  |
  v
3 Domain Onerisi (ornek: drahmetkaya.com)
  |
  [Kullanici birine tiklar]
  |
  v
DomainSettingsModal acilir
  -> "Yeni Domain Ekle" formu otomatik acik
  -> Secilen domain (drahmetkaya.com) onceden yazili
  |
  [Kullanici "Ekle" butonuna basar]
  |
  v
DNS talimatlari gosterilir
  -> Kullanici DNS'i yapilandirir
  -> "Dogrula" butonuna basar
```

