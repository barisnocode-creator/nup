
# Analytics Sistemi — Tamamlandı ✅

## Yapılan Değişiklikler

1. ✅ `src/pages/Project.tsx` — `usePageView(id, '/preview')` kaldırıldı
2. ✅ `supabase/functions/track-analytics/index.ts` — Sadece `is_published=true` projeler için tracking
3. ✅ `get_project_analytics` SQL fonksiyonu oluşturuldu (server-side aggregation)
4. ✅ `src/hooks/useAnalytics.ts` — RPC çağrısına geçirildi
5. ✅ Eski `/preview` kayıtları silindi
6. ✅ `WebsiteDashboardTab` — Sample data kaldırıldı, boş durum eklendi
7. ✅ `Analytics.tsx` — Tarih formatı `tr-TR` olarak düzeltildi
