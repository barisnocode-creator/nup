

## Dashboard Tema Kirlenmesini Onleme ve Template Onizleme/Kaydetme Akisi

### Problem 1: Dashboard Renk Kirlenmesi

SiteEditor, template temalarini `document.documentElement` uzerine CSS degiskeni olarak yaziyor (background, foreground, card, border, muted vb. TUMU). Editorden cikildiginda DashboardLayout sadece `--primary`, `--ring`, `--accent` degiskenlerini sifirliyor — diger 20+ degisken (ozellikle `--background`, `--foreground`, `--card`, `--border`) editordeki degerlerle kaliyor. Bu yuzden koyu temali bir template duzenledikten sonra dashboard koyu gorunuyor.

### Cozum 1: SiteEditor'da Tema Izolasyonu

SiteEditor'daki `useEffect` (satir 52-71) CSS degiskenlerini `document.documentElement` yerine editore ait bir **container div** uzerine yazacak. Boylece tema degiskenleri sadece editor alani icinde gecerli olur, dashboard'a hic bulasmaz.

Alternatif olarak (daha basit): SiteEditor unmount oldugunda (editorden cikildiginda) tum CSS degiskenlerini `index.css`'deki varsayilan degerlere geri dondurecek bir cleanup fonksiyonu eklenecek.

**Tercih edilen yaklasim:** SiteEditor'a bir `useEffect` cleanup eklemek:

```text
useEffect(() => {
  // ... mevcut tema uygulama kodu ...
  
  return () => {
    // Cleanup: tum tema degiskenlerini varsayilana dondur
    const root = document.documentElement;
    const defaults = {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 10%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 10%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 10%',
      '--primary': '24 95% 53%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 14% 96%',
      '--secondary-foreground': '0 0% 29%',
      '--muted': '220 14% 96%',
      '--muted-foreground': '220 9% 46%',
      '--accent': '24 95% 53%',
      '--accent-foreground': '0 0% 100%',
      '--border': '220 13% 91%',
      '--input': '220 13% 91%',
      '--ring': '24 95% 53%',
      '--radius': '0.5rem',
      '--font-heading': "'Playfair Display', Georgia, serif",
      '--font-body': "'Inter', system-ui, sans-serif",
    };
    Object.entries(defaults).forEach(([k, v]) => root.style.setProperty(k, v));
  };
}, [editor.theme]);
```

Ayrica DashboardLayout'daki `forceOrange` fonksiyonunu da ayni tam listeyle guncelleyerek yedek koruma saglanacak.

### Problem 2: Template Onizleme/Kaydetme Akisi

Kullanici template degistirdiginde secilen template'in ne oldugunu gormek, onizleyebilmek ve kaydedebilmek istiyor.

### Cozum 2: ChangeTemplateModal Gelistirmesi

Mevcut modal zaten "Onizle" ve "Bu Sablonu Kullan" butonlarina sahip. Ek olarak:

1. **Secili template gostergesi**: Mevcut template'in uzerine "Mevcut" badge'i zaten var. Buna ek olarak EditorToolbar'da veya editor ust cubugunda secili template adini gosteren kucuk bir bilgi etiketi eklenecek.

2. **Onizleme → Uygula akisi**: Mevcut "Bu Sablonu Kullan" butonu template'i hemen uyguluyor. Bunun yerine su akis:
   - "Onizle" tiklandiginda canli onizleme acilir (mevcut davranis)
   - Onizleme ekraninda "Uygula" ve "Iptal" butonlari olur
   - "Uygula" tiklandiginda template uygulanir ve auto-save tetiklenir
   - "Iptal" tiklandiginda geri donulur, hicbir sey degismez

3. **EditorToolbar'da template bilgisi**: Toolbar'a mevcut template adini gosteren kucuk bir badge/etiket eklenecek (orn. "Restoran Zarif" badge'i)

### Dosya Degisiklikleri

| Dosya | Islem |
|-------|-------|
| `src/components/editor/SiteEditor.tsx` | Tema CSS cleanup fonksiyonu ekleme (useEffect return) |
| `src/components/dashboard/DashboardLayout.tsx` | `forceOrange` fonksiyonunu tam degisken listesiyle guncelleme |
| `src/components/editor/EditorToolbar.tsx` | Template adi badge'i ekleme |
| `src/components/editor/SiteEditor.tsx` | Template ID state'i ve EditorToolbar'a aktarma |

### Uygulama Sirasi

1. SiteEditor.tsx — tema cleanup useEffect return'u ekle
2. DashboardLayout.tsx — forceOrange'a eksik degiskenleri ekle
3. EditorToolbar.tsx — template adi gostergesi ekle
4. SiteEditor.tsx — mevcut template ID izleme

