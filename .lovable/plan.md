

## Template Temizliği ve Natural Ekleme Planı

### Adim 1 - Gereksiz Sablonlari Silme

Silinecek template klasorleri:
- `src/templates/temp1/` (tum alt dosyalari ile birlikte)
- `src/templates/temp2/` (Bold Agency)
- `src/templates/temp3/` (Elegant)
- `src/templates/temp4-video-studio/` (Video Studio)
- `src/templates/gith1/` (SaaS)
- `src/templates/gith2/` (Corporate)
- `src/templates/gith3/` (Minimal)

Kalacak template klasorleri:
- `src/templates/pilates/` (Wellness Studio)
- `src/templates/lawyer/` (Hukuk Burosu)

### Adim 2 - Katalog Tanimlari Temizligi

`src/templates/catalog/definitions.ts` dosyasinda sadece 2 tanim kalacak:
- `wellnessStudio`
- `lawyerFirm`

Silinecek tanimlar: `corporateServices`, `medicalClinic`, `creativeAgency`, `restaurantCafe`, `videoStudio`, `modernSaas`, `retailBoutique`

`allDefinitions` dizisi sadece bu 2 kaydi icerecek.

### Adim 3 - Ana Registry Guncelleme

`src/templates/index.ts` dosyasinda:
- Silinen sablonlara ait import ve mapping kayitlari kaldirilacak
- `selectTemplate` fonksiyonundaki meslek-sablon eslestirmeleri sadece pilates ve lawyer icin kalacak, diger meslekler varsayilan sablona yonlendirilecek

### Adim 4 - Kullanilmayan Preview Gorsellerini Koruma

`src/assets/` altindaki tum preview gorselleri (showcase-*.jpg, template-*.jpg, gith*-preview.jpg) silinmeyecek - galeri sayfasinda kullanilmaya devam edecek.

### Adim 5 - Natural Sablonu Ekleme (Kod Bekleniyor)

`remix-of-my-perspective-lifestyle` repo'su GitHub'da hala erisime kapali (404). Repo'daki kodlari dogrudan sohbete yapistirmaniz gerekiyor:
- `src/pages/Index.tsx` (veya ana sayfa dosyasi)
- `src/components/` altindaki tum bilesenler
- `src/index.css` (animasyonlar ve ozel stiller)

Kod geldiginde:
- `src/templates/natural/` klasoru olusturulacak
- Sablonun tum bilesenleri, animasyonlari ve stilleri entegre edilecek
- Galeri'de "Natural" ismiyle gorunecek
- Katalog ve registry dosyalarina kaydedilecek

### Teknik Detaylar

**Etkilenen dosyalar:**
- `src/templates/catalog/definitions.ts` - 7 sablon tanimi silinecek
- `src/templates/catalog/index.ts` - Degisiklik yok (allDefinitions'a bagli)
- `src/templates/index.ts` - Import'lar ve mapping azaltilacak
- `src/components/chai-builder/themes/presets.ts` - Kullanilmayan tema preset'leri kalabilir (zarar vermez)
- 7 template klasoru ve tum alt dosyalari silinecek

**Dikkat edilecekler:**
- `deploy-to-netlify` edge function'daki renderer mantigi da temizlenecek (silinen sablonlarin HTML render kodlari)
- Mevcut kullanicilarin silinen sablonlarla olusturulmus siteleri varsa, fallback olarak pilates1'e yonlendirilecek (mevcut davranis zaten bu)

