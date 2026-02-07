

# Sihirbazı 3 Soruya İndirme ve Renk Sistemi Entegrasyonu

## Mevcut Durum

Şu an web sitesi oluşturma süreci 2 adımdan oluşuyor:
1. AI sohbet: 10 soru soruyor (isim, sektör, konum, hizmetler, hedef kitle, iletişim, hikaye, site amacı, renk, dil)
2. Tasarım Tercihleri sayfası: Dil, ton, renk tonu, tema modu seçimi

Sorun: Renk tercihleri toplanmasına rağmen siteye yansıtılmıyor - her site aynı "Modern Profesyonel" temasıyla oluşuruluyor.

---

## Planlanan Degisiklikler

### 1. AI Sohbeti 3 Soruya Indirilecek

Yeni soru akisi:

```text
Soru 1: Isletmenizin adi nedir ve ne is yapiyorsunuz?
  (Isim + sektor + konum + hizmetler tek cevaptan cikarilacak)

Soru 2: Sitenizde neler olmali? Iletisim bilgilerinizi paylasir misiniz?
  (Site amaci + telefon + email + calisma saatleri)

Soru 3: Sitenizin renk ve tasarim tercihi ne olsun?
  (Sicak/soguk/notr renkler + acik/koyu tema)
```

AI yine akilli cikarim yapacak - tek bir cevaptan birden fazla bilgi cikartacak. Eksik bilgiler icin makul varsayimlar kullanilacak.

### 2. Adim 2 (PreferencesStep) Kaldirilacak

Renk ve dil tercihleri artik AI sohbetinde soruldugu icin ayri bir "Tasarim Tercihleri" adimina gerek kalmayacak. Wizard tek adimli olacak - sohbet bitince direkt site olusturulacak.

### 3. Renk Tercihlerinin Temaya Yansitilmasi

Kullanicinin sectigi renk kombinasyonu gercek bir ChaiBuilder tema presetine eslenecek:

| Renk Tonu | Tema Modu | Atanan Tema Preseti |
|-----------|-----------|---------------------|
| Sicak     | Acik      | Modern Profesyonel (turuncu aksan, beyaz zemin) |
| Sicak     | Koyu      | Video Studyo (lime aksan, koyu zemin) |
| Soguk     | Acik      | Kurumsal Mavi (mavi aksan, beyaz zemin) |
| Soguk     | Koyu      | Modern SaaS (mor aksan, koyu zemin) |
| Notr      | Acik      | Zarif Minimal (bej tonlar, acik zemin) |
| Notr      | Koyu      | Minimal Koyu (monokrom, koyu zemin) |
| Notr      | Notr      | Cesur Ajans (siyah-beyaz dramatik) |
| Sicak     | Notr      | Canli Yaratici (mor/cyan aksan) |
| Soguk     | Notr      | Kurumsal Mavi |

---

## Teknik Degisiklikler

### Dosya: `supabase/functions/wizard-chat/index.ts`
- `TOTAL_QUESTIONS` 10'dan 3'e dusurulecek
- System prompt tamamen yeniden yazilacak:
  - 3 soru odakli yeni akis
  - Daha fazla akilli cikarim (tek cevaptan maksimum bilgi)
  - Renk/tasarim tercihini son soruda soracak
  - Eksik bilgiler icin makul varsayimlar kullanacak
  - JSON ciktisi ayni formatta kalacak (geriye uyumluluk)

### Dosya: `src/components/wizard/steps/AIChatStep.tsx`
- `TOTAL_QUESTIONS` 10'dan 3'e
- Ilk mesaj guncelleme: "3 kisa soru" olarak
- Progress bar orantisi guncellenecek

### Dosya: `src/components/wizard/CreateWebsiteWizard.tsx`
- `TOTAL_STEPS` 2'den 1'e indirilecek
- PreferencesStep tamamen kaldirilacak
- Adim 2 butonlari yerine dogrudan "Web Sitesi Olustur" butonu
- Sohbet tamamlaninca otomatik olarak varsayilan dil ve ton atanacak
- Renk tercihleri AI sohbetinden gelecek

### Dosya: `src/components/chai-builder/utils/convertToChaiBlocks.ts`
- Yeni fonksiyon: `getThemeFromColorPreferences(colorTone, colorMode)` 
- `getThemeForTemplate` fonksiyonu renk tercihlerini de alacak
- Renk esleme tablosu eklenecek (yukaridaki tablo)

### Dosya: `src/pages/Project.tsx`
- `convertAndSaveChaiBlocks` fonksiyonu guncellenecek
- Tema secimi icin `form_data.websitePreferences` veya `form_data.extractedData` renk bilgilerini kullanacak
- `getThemeForTemplate` yerine `getThemeFromColorPreferences` once kontrol edilecek

### Dosya: `src/types/wizard.ts`
- Gerekli tip guncellemeleri (minimal)

### Dosya: `src/components/wizard/steps/PreferencesStep.tsx`
- Dosya korunacak ama CreateWebsiteWizard'dan import kaldirilacak (ileride kullanilabilir)

---

## Renk Akisi (Uctan Uca)

```text
Kullanici: "Mavi tonlarda, koyu temali bir site istiyorum"
    |
    v
wizard-chat: colorTone="cool", colorMode="dark" olarak cikarir
    |
    v
AIChatStep: extractedData'ya kaydeder
    |
    v
CreateWebsiteWizard: form_data.websitePreferences'a yazar
    |
    v
Supabase projects tablosu: form_data JSON olarak saklanir
    |
    v
Project.tsx: convertAndSaveChaiBlocks cagirilir
    |
    v
convertToChaiBlocks: getThemeFromColorPreferences("cool", "dark")
    |
    v
Sonuc: "Modern SaaS" preseti (mor aksan, koyu zemin) uygulanir
    |
    v
ChaiBuilder editoru: Site dogru renklerle goruntulenir
```

---

## Test Senaryolari

1. Yeni site olusturma: 3 soru ile hizlica tamamlanmali
2. Renk tercihi: "Sicak renkler, acik tema" secince turuncu aksanli site olusturulmali
3. Renk tercihi: "Koyu tema" secince koyu arka planli tema gelmeli
4. Eksik bilgi: Kullanici kisa cevap verse bile AI makul varsayimlarla tamamlamali
5. Geriye uyumluluk: Mevcut projeler etkilenmemeli

