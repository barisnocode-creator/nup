

# Fix: Editör Sayfasından Landing Sayfasına Geri Dönme Sorunu

## Problem

Auth context'te bir race condition var. `onAuthStateChange` callback'i ve `getSession()` promise'i ayni anda calisiyor. `onAuthStateChange` ilk tetiklendiginde henuz session bilgisi gelmemis olabiliyor, `user=null` ve `loading=false` set ediliyor. Bu durumda `ProtectedRoute` kullaniciyi aninda `"/"` sayfasina yonlendiriyor.

## Cozum

`AuthContext.tsx` dosyasindaki state yonetimini duzeltmek:

1. Bir `initialized` ref kullanarak ilk session kontrolunun tamamlanmasini bekle
2. `onAuthStateChange` callback'inde, ilk session kontrolu tamamlanmadan `loading=false` yapma
3. Sadece `getSession()` tamamlandiktan sonra `loading=false` yap

## Dosya Degisiklikleri

### 1. MODIFY: `src/contexts/AuthContext.tsx`

`useEffect` icindeki auth state yonetimini guncelle:

- Bir `initializedRef` ekle (`useRef(false)`)
- `onAuthStateChange` callback'inde: sadece `initializedRef.current === true` ise state'i guncelle
- `getSession()` tamamlandiginda: `initializedRef.current = true` yap ve state'i set et
- Bu sayede ilk yukleme sirasinda yanlis yonlendirme onlenir

```text
Onceki akis:
  onAuthStateChange fires (user=null, loading=false) --> ProtectedRoute redirects to "/"
  getSession resolves (user=X, loading=false) --> Too late, already redirected

Yeni akis:
  onAuthStateChange fires --> initialized=false, skip state update
  getSession resolves --> initialized=true, set user & loading=false
  onAuthStateChange fires again --> initialized=true, update state normally
```

| Dosya | Degisiklik |
|-------|-----------|
| `src/contexts/AuthContext.tsx` | useEffect icinde race condition duzeltmesi |

