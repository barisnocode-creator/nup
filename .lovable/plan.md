

# Editör Panellerini Tamamen Düzeltme

## Sorunun Kökeni

CSS'deki `.chai-canvas-area ~ div:not(...)` kuralı hala sorun yaratıyor. Bu kural "canvas'tan sonra gelen tüm div'leri gizle (bazıları hariç)" mantığında çalışıyor ama AnimatePresence bileşeni DOM'da dinamik olarak div ekleyip çıkardığı için, `not()` seçicileri her durumda doğru çalışmıyor. Ayrıca SDK kendi internal panellerini de bu bölgede render edebiliyor.

## Çözüm

### 1. CSS Kuralını Tamamen Değiştir (`src/styles/chaibuilder.tailwind.css`)

Mevcut "hepsini gizle, bazılarını hariç tut" yaklaşımı yerine, tam tersi bir yaklaşım kullanılacak: Bizim panellerimize özel class'lar verip, SDK'nın kendi panellerini spesifik bir seçiciyle hedeflemek.

Mevcut kural (satır 255-259) silinip yerine:
- SDK'nın varsayılan sağ sidebar'ını `data-` attribute veya yapısal seçiciyle hedefleyen daha dar bir kural
- Bizim panellerimize dokunmayan izole bir gizleme kuralı

### 2. Panel Yapısını Güçlendir (`src/components/chai-builder/DesktopEditorLayout.tsx`)

- Sağ ve sol panellerin `motion.div` elementlerine daha yüksek `z-index` (z-30) verilecek
- Panellere `data-editor-panel` attribute'u eklenecek (CSS izolasyonu için)
- Sol panelin (Katmanlar/Ekle) ve sağ panelin (Özellikler/Stiller) açılma/kapanma mantığı korunacak
- Sağ panel varsayılan olarak açık başlayacak (`showRight: true` - mevcut durum)

### 3. CSS Gizleme Stratejisi Değişikliği

Eski yaklaşım (sorunlu):
```text
.chai-canvas-area ~ div:not(.right-edit-panel):not(.editor-left-panel)... {
  display: none !important;
}
```

Yeni yaklaşım (güvenli):
```text
/* Sadece data-editor-panel attribute'u OLMAYAN, 
   canvas'ın kardeşi olan div'leri gizle */
.chai-canvas-area ~ div:not([data-editor-panel]) {
  display: none !important;
}
```

Bu sayede bizim panellerimize `data-editor-panel="right"` ve `data-editor-panel="left"` ekleyerek CSS'den tamamen korunmuş olacaklar.

## Teknik Detaylar

**Değiştirilecek dosyalar:**
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - Panellere `data-editor-panel` attribute'u ve z-30 eklenmesi
2. `src/styles/chaibuilder.tailwind.css` - CSS gizleme kuralının `data-editor-panel` tabanlı olarak yeniden yazılması

