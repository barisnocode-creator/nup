

# Website Dashboard Sayfası - Tam Implementasyon

## Genel Bakış

Sol menüden "Website" tıklandığında Durable.co benzeri kapsamlı bir Website yönetim ve analitik dashboard'u açılacak. Bu sayfa 4 sekmeden oluşacak: Dashboard, Blog, Domain ve Settings.

---

## Sayfa Yapısı

```text
+------------------------------------------------------------------+
|  [Globe Icon] Website                    [Edit website] Button    |
+------------------------------------------------------------------+
|  [Dashboard]  [Blog]  [Domain]  [Settings]                       |
+------------------------------------------------------------------+
|  reskodis.openlucius.com   [• Unpublished/Published Badge]       |
+------------------------------------------------------------------+
|                                                                   |
|  [Analytics Warning Banner - if unpublished]                      |
|                                                                   |
|  +---------------------------------------------------+  +-------+|
|  |  Visits per day Chart (Area Chart)                |  | Most  ||
|  |  [30 days dropdown]                               |  | viewed||
|  |                                                   |  | pages ||
|  +---------------------------------------------------+  +-------+|
|                                                                   |
|  +-------------+ +-------------+ +-------------+                  |
|  | Online Users| | Unique      | | Page Views  |                  |
|  | 32          | | Visitors    | | 3,243       |                  |
|  |             | | 253         | |             |                  |
|  +-------------+ +-------------+ +-------------+                  |
|                                                                   |
|  +-------------+ +-------------+ +-------------+                  |
|  | Device Views| | Weekly      | | Most        |                  |
|  | Pie Chart   | | Keyword     | | Scrolled    |                  |
|  |             | | Ranking     | | Pages       |                  |
|  +-------------+ +-------------+ +-------------+                  |
|                                                                   |
|  +---------------------------------------------------+            |
|  | Peak Hours (Bar Chart - 24 hours)                 |            |
|  +---------------------------------------------------+            |
+------------------------------------------------------------------+
```

---

## Yeni Dosyalar

### 1. `src/pages/WebsiteDashboard.tsx`

Ana sayfa komponenti - tab yapısı ile 4 sekme yönetimi:

```typescript
interface WebsiteDashboardProps {}

// Tabs: dashboard, blog, domain, settings
// State: activeTab, project data
// Components: WebsiteDashboardTab, BlogTab, DomainTab, SettingsTab
```

### 2. `src/components/website-dashboard/WebsiteDashboardTab.tsx`

Dashboard sekmesi - tüm analitik kartları:

- **Header**: Subdomain + publish status badge
- **Warning Banner**: "Your website analytics will appear here once you publish"
- **Visits Chart**: 30 günlük area chart (recharts)
- **Most Viewed Pages**: Sayfa listesi + görüntülenme sayısı
- **Stat Cards**: Online users, Unique visitors, Page views
- **Device Views**: Pie chart (desktop/mobile)
- **Peak Hours**: 24 saatlik bar chart

### 3. `src/components/website-dashboard/BlogTab.tsx`

Blog yönetimi sekmesi:

- Blog yazısı listesi
- "Add Blog Post" butonu
- Düzenleme/silme aksiyonları

### 4. `src/components/website-dashboard/DomainTab.tsx`

Domain yönetimi sekmesi:

- Subdomain görüntüleme
- Custom domain ekleme
- DNS ayarları

### 5. `src/components/website-dashboard/SettingsTab.tsx`

Ayarlar sekmesi:

- Site meta bilgileri
- Favicon
- SEO ayarları

---

## Bileşen Detayları

### WebsiteDashboardTab - Analitik Kartları

| Kart | Veri Kaynağı | Görsel |
|------|-------------|--------|
| Visits per day | analytics_events (grouped by date) | AreaChart |
| Most viewed pages | analytics_events (grouped by page_path) | List with progress bars |
| Online users | Simulated / realtime | Number |
| Unique visitors | analytics_events (distinct visitor_id) | Number |
| Page views | analytics_events (count) | Number |
| Device views | analytics_events (device_type) | PieChart |
| Peak hours | analytics_events (grouped by hour) | BarChart |
| Most scrolled pages | analytics_events (page_path) | List with progress bars |

### Sample Data Badge

Yayınlanmamış siteler için tüm kartlarda "Sample Data" badge'i gösterilecek. Gerçek veri yoksa demo veriler gösterilecek.

---

## Routing Değişikliği

### App.tsx

Yeni route eklenecek:

```typescript
<Route
  path="/project/:id/website"
  element={
    <ProtectedRoute>
      <WebsiteDashboard />
    </ProtectedRoute>
  }
/>
```

### DashboardSidebar.tsx

"Website" linki güncellenecek:

```typescript
{ 
  title: 'Website', 
  url: activeProjectId ? `/project/${activeProjectId}/website` : '/dashboard', 
  icon: Globe,
  disabled: !activeProjectId 
}
```

---

## Teknik Detaylar

### useAnalytics Hook Genişletilecek

Yeni veri noktaları eklenecek:

```typescript
interface AnalyticsData {
  // Mevcut
  totalViews: number;
  viewsLast7Days: number;
  uniqueVisitors: number;
  deviceBreakdown: { mobile: number; desktop: number };
  viewsOverTime: { date: string; views: number }[];
  
  // Yeni
  pageViews: { path: string; views: number }[];
  hourlyViews: { hour: number; views: number }[];
}
```

### Sample Data Generator

Yayınlanmamış veya veri olmayan projeler için demo veriler:

```typescript
function generateSampleData(): AnalyticsData {
  return {
    totalViews: 3243,
    viewsLast7Days: 253,
    uniqueVisitors: 253,
    onlineUsers: 32,
    deviceBreakdown: { mobile: 2325, desktop: 3325 },
    // ... diğer örnek veriler
  };
}
```

---

## UI Bileşenleri

### Kullanılacak Mevcut Bileşenler

- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Badge`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Button`
- Recharts: `AreaChart`, `PieChart`, `BarChart`

### Yeni Küçük Bileşenler

- `StatCard`: Büyük sayı + alt açıklama
- `PageViewsList`: Progress bar'lı sayfa listesi
- `SampleDataBadge`: "Sample Data" badge overlay

---

## Değiştirilecek Dosyalar Özeti

| Dosya | Değişiklik |
|-------|------------|
| `src/pages/WebsiteDashboard.tsx` | Yeni dosya - ana sayfa |
| `src/components/website-dashboard/WebsiteDashboardTab.tsx` | Yeni dosya - analitik sekmesi |
| `src/components/website-dashboard/BlogTab.tsx` | Yeni dosya - blog sekmesi |
| `src/components/website-dashboard/DomainTab.tsx` | Yeni dosya - domain sekmesi |
| `src/components/website-dashboard/SettingsTab.tsx` | Yeni dosya - ayarlar sekmesi |
| `src/hooks/useAnalytics.ts` | Genişletme - yeni veri noktaları |
| `src/App.tsx` | Route ekleme |
| `src/components/dashboard/DashboardSidebar.tsx` | Link güncelleme |

---

## Görsel Tasarım Notları

- Durable.co'nun minimalist beyaz arka planlı tasarımı
- Mor/lavanta tonlarında grafikler (primary renk)
- "Sample Data" badge'leri sarı arka plan üzerinde siyah metin
- Kartlar arasında yeterli boşluk (gap-6)
- Responsive: mobilde tek sütun, desktop'ta grid

