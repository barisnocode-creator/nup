

# Editör Panellerini Düzeltme - Durable Tarzı Sağ Panel

## Sorun

CSS'deki bu kural sağ paneli (ve muhtemelen sol paneli de) gizliyor:

```text
.chai-canvas-area ~ div:not([class*="z-30"]):not([class*="z-40"]) {
  display: none !important;
}
```

Bu kural SDK'nın kendi sidebar'ını gizlemek için yazılmıştı ama bizim özel panellerimizi de yok ediyor. Sonuç: Katmanlar, Ekle, Özellikler ve Stiller panellerinin hiçbiri açılmıyor.

## Çözüm

### 1. CSS Düzeltmesi (chaibuilder.tailwind.css)

Mevcut "herşeyi gizle" kuralını, sadece SDK'nın kendi internal panel'ini hedefleyen daha spesifik bir kuralla değiştir:

- `.chai-canvas-area ~ div` yerine, SDK'nın oluşturduğu belirli paneli hedefle
- Bizim `.right-edit-panel` ve sol panel divlerimize `display: none` uygulanmasını engelle

### 2. DesktopEditorLayout.tsx Güncellemesi

Referans görseldeki Durable editörüne benzer şekilde:

- Sağ panel 320px genişliğinde sabit sidebar olarak kalacak (zaten mevcut yapı)
- Sol panel (Katmanlar/Ekle) animasyonlu açılıp kapanacak (zaten mevcut yapı)
- Üst toolbar'da referanstaki gibi Customize, Pages, Add, Help menü yapısı yerine mevcut ikon butonları korunacak
- Sağ paneldeki Özellikler tab'ı SDK'nın `ChaiBlockPropsEditor`'ünü gösterecek - bu zaten bağlam duyarlı (seçilen bloğa göre otomatik olarak metin, görsel veya section alanlarını gösterir)

### 3. Panel İçerik Yapısı

Referans görselde görülen "Image" paneli gibi:
- SDK'nın `ChaiBlockPropsEditor` bileşeni zaten bu işlevselliği sağlıyor
- Görsel bloğu seçildiğinde: URL alanı, alt text alanı otomatik gösterilir
- Ek olarak sağ panel başlığına "Görsel Ara" (Pixabay) butonu eklenecek

## Teknik Detaylar

**Değiştirilecek dosyalar:**
1. `src/styles/chaibuilder.tailwind.css` - Satır 255-259 arasındaki CSS kuralını düzelt
2. `src/components/chai-builder/DesktopEditorLayout.tsx` - Sağ panele z-index class ekle, Pixabay butonu ekle

**CSS değişikliği:**
Mevcut kural:
```text
.chai-canvas-area ~ div:not([class*="z-30"]):not([class*="z-40"]) {
  display: none !important;
}
```

Yeni kural: `.right-edit-panel` ve sol panel animasyonlarını koruyan, sadece SDK'nın internal sidebar'ını gizleyen daha spesifik seçici.

**DesktopEditorLayout değişikliği:**
- AnimatePresence ile sarılmış sağ panele `.right-edit-panel` class'ı zaten var
- Panel header'a Pixabay "Görsel Ara" butonu eklenmesi (referans görseldeki "Change" butonuna benzer)

