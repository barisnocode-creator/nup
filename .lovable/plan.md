

# Domain Onerisi Ozelligi - Yayinla Modalinda

## Ozet
Kullanici "Yayinla" butonuna basip site basariyla yayinlandiginda, success ekraninda isletme adina ve meslege gore 3 adet domain onerisi gosterilecek. Ornekler: `drahmetkaya.com`, `ahmetkaya-hukuk.com`, `ahmetkayaklinik.com` gibi.

## Nasil Calisacak

1. Kullanici yayinla butonuna basar ve site Netlify'a deploy edilir
2. Success ekraninda mevcut bilgilerin altina yeni bir "Domain Onerileri" karti eklenir
3. Bu kart, projenin `name`, `profession` ve `form_data.businessName` bilgilerinden otomatik olarak 3 domain onerisi uretir
4. Her oneri yaninda ".com" ve tahmini fiyat bilgisi (ornegin "~$10/yil") gosterilir
5. Kullanici bir oneriye tiklarsa, domain satin alma icin Namecheap/GoDaddy arama sayfasina yonlendirilir veya dogrudan "Domain Ayarlari" modalini acar

## Domain Onerisi Mantigi

Isletme adi ve meslek bilgisinden su formatlarda oneriler uretilecek:

| Meslek | Ornek Isletme | Oneriler |
|--------|--------------|----------|
| Doktor | Ahmet Kaya | drahmetkaya.com, ahmetkayaklinik.com, drkaya.com |
| Avukat | Yakut Hukuk | yakuthukuk.com, avyakut.com, yakut-hukuk.com |
| Restoran | Lezzet Cafe | lezzetcafe.com, lezzet-cafe.com.tr, cafelezzet.com |
| Genel | Dijital Ajans | dijitalajans.com, dijitalajans.com.tr, dijital-ajans.com |

Meslek bazli on ekler (prefix):
- Doktor: `dr`
- Dis Hekimi: `dt`, `dis`
- Avukat: `av`
- Eczane: `eczane`
- Diger: on ek yok

## Teknik Detaylar

### Degistirilecek Dosyalar

**1. `src/components/website-preview/PublishModal.tsx`**
- Success ekranina "Domain Onerileri" karti eklenmesi
- Proje bilgilerinden (name, profession, form_data) domain onerileri ureten bir `generateDomainSuggestions` fonksiyonu
- Her oneri icin tiklanabilir kart: domain adi, uzanti (.com, .com.tr), tahmini fiyat
- "Domain Ayarlari" modaline yonlendirme butonu

**2. Yeni bilesen: `src/components/website-preview/DomainSuggestionCard.tsx`**
- Domain onerilerini gosteren kucuk kart bileseni
- Her oneri icin: domain adi, fiyat etiketi, tiklanabilir link
- "Kendi domaininizi baglayın" butonu ile DomainSettingsModal'a gecis

### Domain Onerisi Uretme Algoritmasi (Frontend)
```text
Girdi: businessName = "Ahmet Kaya", profession = "doctor"

1. Ismi slug'a cevir: "ahmetkaya"
2. Meslek prefix'i belirle: "dr"
3. Oneriler:
   - dr + slug + .com -> "drahmetkaya.com"
   - slug + meslek_suffix + .com -> "ahmetkayaklinik.com" 
   - prefix + soyisim + .com -> "drkaya.com"
```

### Veri Kaynaklari
- `projectName` (zaten PublishModal'a prop olarak geliyor)
- `profession` (projects tablosundan cekilecek, projectId ile)
- `form_data.businessName` (projects tablosundan cekilecek)

Bu ozellik tamamen frontend'de calisacak, ek bir API veya edge function gerektirmeyecek. Domain uygunluk kontrolu yapilmayacak - sadece oneri olarak sunulacak.

