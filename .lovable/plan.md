

# Floating Edit Kartinin Duzeltilmesi ve Inline Duzenleme

## Sorunlar
1. Sag taraftaki floating kart hala cok buyuk ve sidebar gibi gorunuyor
2. Blok secildiginde kart otomatik acilmiyor (her zaman acik)
3. Yazi dogrudan canvas uzerinden degistirilemiyor (inlineEditProps tanimli ama SDK overlay'i engelliyor olabilir)

## Cozum

### 1. DesktopEditorLayout.tsx - Kart Davranisini Iyilestir

- `showRight` varsayilan degeri `false` olsun (kart kapali baslasın)
- Canvas tiklamalarini dinle: bir bloga tiklandiginda floating karti otomatik ac
- Canvas'a `onClick` handler ekle, `[data-block-id]` elementi aranarak blok secimini algila
- Bos alana tiklandiginda karti kapat

### 2. CSS ile SDK Ic Overlay/Sidebar Gizleme

SDK'nin kendi ic mekanizmasinda acilan overlay/dark-backdrop'u CSS ile tamamen gizle:
- `div[data-radix-overlay]`, `.chai-overlay` zaten override ediliyor ama yeterli degil
- SDK'nin iframe disinda render ettigi koyu arkaplan overlay elementlerini hedefle
- `iframe + div` gibi secicilerle secim karanligini kaldir

### 3. Inline Duzenleme Akisini Iyilestir

Bloklar zaten `inlineEditProps` ile yapilandirilmis. SDK, canvas iframe'i icinde contentEditable desteği saglıyor. Sorun, tıklandığında panel odağı alması. Panel'in iframe'i kaplamaması ve inline edit'i engellemesi icin:
- Floating kartı canvas'ın `div` elemanından ayır, sayfanın en üst seviyesine (portal-like) taşı
- Canvas alanına `pointer-events` müdahalesi yapma

### Degistirilecek Dosyalar

**`src/components/chai-builder/DesktopEditorLayout.tsx`**:
- `showRight` varsayilan: `true` -> `false`
- Canvas div'ine `onClick` handler ekle: bloğa tıklandığında `setShowRight(true)`, boş alana tıklandığında `setShowRight(false)`
- Floating kart konumunu canvas div'in içinden çıkarıp ana container'a taşı (absolute positioning düzgün çalışsın)

**`src/styles/chaibuilder.tailwind.css`**:
- SDK'nın iç panellerinin yarattığı koyu overlay/backdrop'u CSS override ile tamamen şeffaf yap
- `iframe` yanında çıkan seçim overlay elementlerini hedefle
- Sağ panel sidebar olarak açılıyorsa CSS ile gizle (SDK'nın kendi sidebar'ını)
