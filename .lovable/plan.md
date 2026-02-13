

# SaaS Renk Sifirlama - DashboardLayout'a Tasima

## Sorun

`useLayoutEffect` ile CSS degisken temizligi sadece `Dashboard.tsx` sayfasina eklendi. Ancak kullanici editordan cikinca her zaman Dashboard'a gitmeyebilir -- Analytics, Appointments, Settings, Help, Studio veya WebsiteDashboard sayfasina gidebilir. Bu sayfalarda reset olmadigi icin renkler bozuk kaliyor.

## Cozum

Tum SaaS sayfalari `DashboardLayout` bilesenini kullaniyor. CSS degisken temizligini `DashboardLayout.tsx` icine tasiyarak tek bir noktada tum sayfalari kapsayacagiz.

## Teknik Detaylar

### 1. `src/components/dashboard/DashboardLayout.tsx`

`useLayoutEffect` eklenerek mount aninda tum proje tema degiskenlerini temizler:

```text
--primary, --ring, --accent, --sidebar-primary, --sidebar-ring,
--color-secondary-custom, --color-accent-custom,
--font-heading, --font-body, --radius
```

Ayrica `reduce-motion` sinifini da kaldirir.

### 2. `src/pages/Dashboard.tsx`

Artik gereksiz olan `useLayoutEffect` blogu ve `useLayoutEffect` import'u kaldirilir (DashboardLayout zaten yapacagi icin).

### Etki

- Editordan herhangi bir SaaS sayfasina geciste renkler otomatik turuncu temaya doner
- Tek bir yerde yonetim, tekrar yok
- Mevcut `useThemeColors` hook'undaki cleanup da yedek olarak calisir
