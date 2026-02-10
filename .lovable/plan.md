

# Durable Tarzı Üst Toolbar Ekleme

## Mevcut Durum

Şu anda ChaiBuilder editöründe üst toolbar yok. Sadece sol üstte floating "Geri" ve "Görsel Ara" butonları var. Referans görseldeki Durable editöründe ise tam genişlikte bir üst bar bulunuyor:

```text
[🏠] | [🔗 Customize] [📄 Pages] [+ Add] [? Help]     Home ⚙     [▶ Preview] | [🌐 Publish]
```

## Yapılacak Değişiklikler

### 1. DesktopEditorLayout.tsx - Üst Toolbar Ekleme

Layout yapısını değiştirerek üstte 56px yüksekliğinde sabit bir toolbar eklenecek:

```text
+----------------------------------------------------------+
| 🏠 | Customize  Pages  + Add  ? Help | Home ⚙ | Preview | Publish |
+----+-----------------------------------+--------+--------+
| L  |                                   | Panel  |
| e  |         Canvas                    | 320px  |
| f  |                                   |        |
| t  |                                   |        |
+----+-----------------------------------+--------+
```

Toolbar içeriği:
- **Sol**: Home (dashboard'a dön), ayırıcı, Customize (tema paneli açar), Pages (dropdown), + Add (blok ekle paneli açar), Help
- **Orta**: Proje adı + ayarlar ikonu
- **Sağ**: Preview butonu, ayırıcı, Publish butonu

### 2. ChaiBuilderWrapper.tsx - Floating Butonları Kaldırma

Mevcut floating "Geri" ve "Görsel Ara" butonları (satır 156-176) kaldırılacak çünkü artık üst toolbar'a taşınacaklar.

### 3. DesktopEditorLayout Props Güncelleme

DesktopEditorLayout'a aşağıdaki prop'lar eklenecek (ChaiBuilderWrapper'dan geçirilecek):
- `onDashboard` - Dashboard'a yönlendirme
- `onPublish` - Yayınlama
- `onPreview` - Önizleme
- `onImageSearch` - Pixabay açma
- `projectName` - Proje adı gösterimi

### 4. Sol Sidebar Butonlarının Toolbar'a Taşınması

Mevcut sol dikey sidebar'daki Layers ve Add butonları toolbar'a taşınacak. Sol sidebar (w-12 dikey bar) kaldırılacak, yerine toolbar üzerinden kontrol edilecek.

## Teknik Detaylar

**Değiştirilecek dosyalar:**
1. `src/components/chai-builder/DesktopEditorLayout.tsx` - Üst toolbar ekleme, sol sidebar kaldırma, layout yeniden düzenleme
2. `src/components/chai-builder/ChaiBuilderWrapper.tsx` - Floating butonları kaldırma, DesktopEditorLayout'a prop geçirme

**Toolbar buton eşlemeleri:**
- Home butonu -> `navigate('/dashboard')`
- Customize -> sağ panelde tema/stil sekmesini açar
- Pages -> dropdown menü (sayfa listesi)
- + Add -> sol paneli "add" modunda açar
- Help -> yardım sayfasına yönlendirme
- Preview -> yeni sekmede önizleme
- Publish -> yayınlama modal'ı

