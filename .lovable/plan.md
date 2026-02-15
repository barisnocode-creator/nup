
# Katmanlar Panelini Kaldirma

## Yapilacak Degisiklikler

### 1. Desktop Editor (`DesktopEditorLayout.tsx`)
- `tools` dizisinden `outline` girisi kaldirilacak (satir 29: `{ key: 'outline', icon: Layers, label: 'Sayfalar' }`)
- `ToolKey` tipinden `'outline'` kaldirilacak
- Sol paneldeki `leftPanel === 'outline'` kosulu ve `ChaiOutline` renderini kaldirmak
- `ChaiOutline` importunu kaldirmak
- Kullanilmayan `Layers` icon importunu kaldirmak

### 2. Mobile Editor (`MobileEditorLayout.tsx`)
- `panels` dizisinden `outline` girisi kaldirilacak (satir 39)
- `PanelType` tipinden `'outline'` kaldirilacak
- Sheet icerigindeki `key === 'outline'` kosulu ve `ChaiOutline` renderini kaldirmak
- `ChaiOutline` importunu kaldirmak
- Kullanilmayan `Layers` icon importunu kaldirmak

### Korunacaklar
- Ozellistir, Ekle, Ozellikler, Stiller panelleri aynen kalacak
- Toolbar yapisi, animasyonlar, z-index hiyerarsisi degismeyecek
- Alt navigasyon cubugu (mobil) aynen kalacak, sadece Katmanlar butonu olmayacak
