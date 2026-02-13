
# Hero Gorsel Alaka Sorununu Cozme Plani

## Sorun Analizi

Uc temel sorun tespit edildi:

1. **Jenerik sektor eslestirme**: "Psikoloji", "Hukuk Bürosu" gibi isletmeler `service` sektorune dusüyor ve "professional business consulting office" gibi alakasiz arama terimleriyle gorsel cekiliyor
2. **`fetch-images` fonksiyonu AI terimlerini yok sayiyor**: `generate-website` AI'dan isletmeye ozel gorsel arama terimleri (`imageSearchTerms`) uretiyor, ancak `fetch-images` bunlari kullanmiyor - sadece sabit sektor mapping'i kullaniyor
3. **Eski projeler**: Bazi projelerde hala ~1.8MB base64 gorsel verisi DB'de sakli (eski AI gorsel uretiminden kalan)

## Cozum Plani

### Adim 1: `generate-website` Prompt'unu Güclendirme

AI'nin urettigi `imageSearchTerms` icin prompt'a daha guclu yonergeler eklenmeli:
- Isletme adi, sektoru ve sunduğu hizmetleri dogrudan arama terimine dahil etmesini sagla
- Ornekler: "psychology therapy counseling office calm", "law office legal books professional", "turkish kebab restaurant grilled meat"

### Adim 2: `fetch-images` Fonksiyonunu Guncelleme

`fetch-images` edge function'i su sekilde guncellenecek:
- Projenin `generated_content` icerisindeki `imageSearchTerms` verisini oku
- Eger AI-uretilmis terimler varsa onlari kullan
- Yoksa sektor bazli fallback'e dus
- Ek olarak, isletme adi + sektorden dinamik arama terimi olustur

### Adim 3: Sektor-Meslek Eslestirmesi Iyilestirme

`generate-website` ve `fetch-images` fonksiyonlarina daha spesifik meslek eslestirmeleri eklenmeli:

```text
"service" sektoru alt kategorileri:
  - psikolog/psikoloji -> "psychology therapy counseling calm modern office"
  - avukat/hukuk      -> "law office legal books courtroom professional"
  - muhasebeci        -> "accounting finance office calculator professional"
  - mimar             -> "architecture design blueprint modern building"
  - danismanlik       -> "consulting meeting boardroom professional"
```

Bu, `extractedData.services` alanindaki anahtar kelimelere bakarak daha hassas eslestirme yapmayi saglar.

### Adim 4: Deploy Fonksiyonunda Gorsel Kontrolu

`deploy-to-netlify` fonksiyonunda hero bloklerinin gorsellerinin dogru render edildigini dogrula. Base64 gorsel kontrolu ekle - eger base64 ise atla veya placeholder goster.

## Teknik Detaylar

### Degisecek Dosyalar:

1. **`supabase/functions/generate-website/index.ts`**
   - `buildPrompt()` fonksiyonuna daha guclu imageSearchTerms yonergeleri ekle
   - Isletme hizmetlerinden (services) otomatik anahtar kelime cikarma mantigi ekle
   - `fetchAllImages()` icinde hizmet adlarindan dinamik arama terimi olusturma

2. **`supabase/functions/fetch-images/index.ts`**
   - `generated_content.imageSearchTerms` verisini projeden oku ve kullan
   - Isletme adi + hizmetlerinden dinamik arama terimi fallback'i ekle
   - Hizmet listesindeki kelimelerden (orn. "Psikolojik Danismanlik") Ingilizce karsilik ureterek Pixabay aramasinda kullan

3. **`supabase/functions/deploy-to-netlify/index.ts`**
   - Hero gorsellerinde base64 veri kontrolu ekle (base64 ise gorsel render etme, yerine gradient kullan)

### Yeni Eklenen Mantik:

- **Hizmet-bazli anahtar kelime cikarma**: `extractedData.services` dizisindeki kelimeleri Ingilizce karsiliklarina cevir (basit mapping tablosu ile) ve Pixabay aramasinda kullan
- **Turkce-Ingilizce meslek mapping**: Yaygin Turkce meslek/hizmet adlari icin Ingilizce Pixabay arama terimleri tablosu

```text
Ornek mapping:
  psikoloji/psikolog    -> "psychology therapy counseling session"
  hukuk/avukat          -> "law office lawyer legal justice"
  kebap/restoran        -> "turkish kebab restaurant grilled meat dining"
  guzellik/kuafor       -> "beauty salon hairdresser styling"
  dis/dishekimi         -> "dental clinic modern teeth"
  eczane                -> "pharmacy drugstore medicine"
  cafe/kahve            -> "coffee cafe barista latte art"
  insaat/mimarlik       -> "architecture construction building modern"
```

### Sonuc

Bu degisikliklerle:
- Yeni olusturulan sitelerin hero gorselleri isletmenin gercek faaliyet alaniyla dogrudan iliskili olacak
- "Psikoloji" icin terapi/danismanlik gorselleri, "Hukuk" icin adalet/ofis gorselleri gelecek
- `fetch-images` ayrı cagirildiginda bile dogru gorseller donecek
- Eski base64 gorseller yayinlanan sitelerde sorun yaratmayacak
