

# Durable Benzeri Dashboard Arayüzü Planı

## Genel Bakış

Mevcut basit Dashboard'u, Durable'ın profesyonel arayüzüne benzer şekilde yeniden tasarlayacağız. Sizin ürününüz sağlık profesyonelleri için web sitesi oluşturucu olduğundan, bazı özellikleri uyarlayacağız.

## Durable Dashboard Analizi (Ekran Görüntüsünden)

| Bileşen | Durable'da | Open Lucius'ta Karşılığı |
|---------|-----------|-------------------------|
| Sol Sidebar | Home, Website, Contacts, Invoices, Studio, Chats | Home, Website, Settings, Help |
| Üst Karşılama | "Good afternoon, welcome to Durable" | "Günaydın, Open Lucius'a hoş geldiniz" |
| Website Önizleme | Preview kartı + durum badge + Edit butonu | Aynı yapı |
| Get Started Checklist | 5 adımlı checklist | "Başlangıç Rehberi" |
| Latest Contacts | Kişi listesi | (Şimdilik dahil etmeyeceğiz) |
| Alt Kartlar | Invoices, Chats, Assets | (Open Lucius'a uygun değil) |
| Upgrade Kartı | Sol sidebar altı | Aynı yapı |

## Uyarlanmış Open Lucius Dashboard Yapısı

```text
+------------------+--------------------------------+------------------+
|                  |                                |                  |
|   SOL SIDEBAR    |        ANA IÇERIK              |   SAĞ SIDEBAR    |
|                  |                                |                  |
|  - Logo          |  "Günaydın, [isim]"            |  Başlangıç       |
|  - Home          |  "Open Lucius'a hoş geldiniz"  |  Rehberi         |
|  - Website       |                                |                  |
|  - Analytics     |  +-------------------------+   |  [x] Website     |
|  - Settings      |  | Website Preview Card    |   |  [ ] Yayınla     |
|  - Help          |  | [Durumu] [Edit butonu]  |   |  [ ] Analitik    |
|                  |  +-------------------------+   |  [ ] Özelleştir  |
|  --------------- |                                |                  |
|  Upgrade Card    |                                |                  |
+------------------+--------------------------------+------------------+
```

## Uygulama Adımları

### Adım 1: Yeni Dashboard Layout Bileşeni
Sidebar + Main + Right Panel içeren ana layout oluşturma.

**Yeni dosyalar:**
- `src/components/dashboard/DashboardLayout.tsx` - Ana layout wrapper
- `src/components/dashboard/DashboardSidebar.tsx` - Sol sidebar
- `src/components/dashboard/DashboardRightPanel.tsx` - Sağ panel (Get Started)
- `src/components/dashboard/WebsitePreviewCard.tsx` - Website önizleme kartı
- `src/components/dashboard/GettingStartedChecklist.tsx` - Başlangıç rehberi

### Adım 2: Dashboard Sayfası Güncelleme
`src/pages/Dashboard.tsx` dosyasını yeni layout kullanacak şekilde güncelleme.

### Adım 3: Sidebar Navigasyon Öğeleri

| Icon | Etiket | Route |
|------|--------|-------|
| Home | Home | /dashboard |
| Globe | Website | /project/:id (aktif proje) |
| BarChart | Analytics | /project/:id/analytics |
| Settings | Settings | /settings (yeni sayfa) |
| HelpCircle | Help | Modal veya sayfa |

### Adım 4: Get Started Checklist

Kullanıcının tamamlaması gereken adımlar:
1. Website oluştur (mevcut wizard)
2. Bilgileri düzenle (proje sayfası)
3. Görselleri ekle (AI images)
4. Yayınla (publish)
5. Analitik kontrol (analytics)

Bu adımların tamamlanıp tamamlanmadığını projeden kontrol edeceğiz.

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `src/components/dashboard/DashboardLayout.tsx` | Yeni |
| `src/components/dashboard/DashboardSidebar.tsx` | Yeni |
| `src/components/dashboard/DashboardRightPanel.tsx` | Yeni |
| `src/components/dashboard/WebsitePreviewCard.tsx` | Yeni |
| `src/components/dashboard/GettingStartedChecklist.tsx` | Yeni |
| `src/pages/Dashboard.tsx` | Güncelle |
| `src/pages/Settings.tsx` | Yeni (opsiyonel) |
| `src/App.tsx` | Güncelle (yeni route) |

## Teknik Notlar

- Shadcn/ui `Sidebar` bileşeni zaten projede mevcut, kullanılacak
- Responsive tasarım: Mobilde sidebar drawer olarak açılacak
- Dark/Light mode desteği korunacak
- Mevcut authentication sistemi aynen kullanılacak
- `NavLink` bileşeni active route styling için kullanılacak

## Eksik Özellikler (Durable'da olup Open Lucius'ta olmayan)

Şu özellikler Durable'da var ama sizin ürün için gerekli olmayabilir:
- **Contacts**: İletişim yönetimi (CRM)
- **Invoices**: Fatura kesimi
- **Studio**: Asset oluşturma
- **Chats**: AI sohbet kategorileri (General, Marketing, Finance)

Bu özellikler daha sonra eklenebilir ama temel dashboard için gerekli değil.

## Sonraki Adımlar

Detaylı ekran görüntülerini paylaştığınızda:
1. Her bileşenin pixel-perfect tasarımını yapabiliriz
2. Animasyonları ve geçişleri ekleyebiliriz
3. Eksik özellikleri belirleyebiliriz

**Not**: Durable'ın tüm özelliklerini birebir kopyalayamayız çünkü:
- Bazıları sizin ürün kapsamı dışında (invoices, CRM)
- Bazıları backend altyapı gerektirir (AI chats)
- Ancak görsel tasarım ve UX akışını çok benzer yapabiliriz

