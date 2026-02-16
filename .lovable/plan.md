

## Editoru Eski Haline Dondurme + Natural Template Uyumlulugu

### Sorun Analizi

Projenizin `template_id` degeri `natural` olarak ayarlanmis (muhtemelen test sirasinda degisti). Bu yuzden `Project.tsx` satir 1329'daki `isComponentTemplate('natural') === true` kontrolune giriyor ve ChaiBuilder editoru tamamen bypass ediliyor. Yerine yazilan ozel toolbar ("Ozellestir" / "Yayinla") eski editorden tamamen farkli.

**Asil sorun:** `isComponentTemplate()` fonksiyonu `'natural'` icin `true` donuyor ve bu da eski ChaiBuilder editoru yerine basit bir React render modu aciyor.

### Cozum (2 Adim)

---

### Adim 1: isComponentTemplate'i Devre Disi Birak

**Dosya:** `src/templates/index.ts`

`DIRECT_RENDER_TEMPLATES` setini bosalt. Boylece hicbir sablon ChaiBuilder'i bypass etmez ve tum projeler eski editoru kullanir.

```
// Mevcut (satir 130):
const DIRECT_RENDER_TEMPLATES = new Set(['natural']);

// Yeni:
const DIRECT_RENDER_TEMPLATES = new Set<string>();
```

Bu tek degisiklikle `isComponentTemplate()` her zaman `false` donecek ve `Project.tsx` satir 1329'daki if blogu hic calisayacak. Eski ChaiBuilder editoru aynen yuklenir.

---

### Adim 2: convertAndSaveChaiBlocks Natural icin Bloklari Uretsin

**Dosya:** `src/pages/Project.tsx`

Satir 293-294'te Natural icin blok donusumu atlaniyordu:

```
if (isComponentTemplate(projectData.template_id || '')) return;
```

Adim 1 ile `isComponentTemplate` artik `false` donecegi icin bu satir zaten atlanacak. Ama guvenlik icin bu erken return'u de kaldiralim.

---

### Beklenen Sonuc

- Eski ChaiBuilder editoru geri gelecek (SDK toolbar, blok sistemi, sidebar'lar)
- Natural template projesi ChaiBuilder icinde jenerik bloklar olarak gorunecek (HeroCentered, ServicesGrid vb.)
- Toolbar'da "Published", "Ozellestir" gibi eski butonlar aynen korunacak
- Hicbir baska dosya degismeyecek

### Not

Natural template'in orijinal React haliyle birebir gosterimi ileride ayri bir adimda ele alinabilir ama oncelik editoru eski calisir haline dondermektir.

