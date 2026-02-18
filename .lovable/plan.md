
## Editor UI/UX Iyilestirme ve Template Degistirme Ozelligi

### Mevcut Sorunlar (Ekran Goruntusunden Tespit Edilen)

1. **Template degistirme ozelligi yok** - Editorde "Ozelestir" butonuna basildiginda sadece renk/font paneli aciliyor, template secme/degistirme secenegi yok
2. **Seffaf/eksik UI elemanlari** - Paneller, butonlar ve overlay'ler seffaf gorunuyor, arka plan renkleri eksik
3. **SectionEditPanel** basliklari ham tip adlarini gosteriyor ("services-grid" gibi teknik isimler)
4. **Genel UI tutarsizligi** - Editor bilesenleri arasinda stil farkliliklari var

### Cozum Plani

#### 1. CustomizePanel'e Template Degistirme Bolumu Ekleme

`src/components/editor/CustomizePanel.tsx` dosyasinda:
- Panel basina **"Sablon Degistir"** bolumu eklenir
- Mevcut template'leri gosteren kucuk onizleme kartlari
- Tiklandiginda `ChangeTemplateModal` acilir
- Template secildiginde `site_sections` ve `site_theme` guncellenir

#### 2. SiteEditor'a Template Degistirme Akisi Ekleme

`src/components/editor/SiteEditor.tsx` dosyasinda:
- `ChangeTemplateModal` entegrasyonu
- `onChangeTemplate` callback'i: secilen template'in catalog tanimini yükler, sections ve theme'i gunceller
- Template degistiginde mevcut icerik korunup yeni yapiya aktarilir (baslik, aciklama vb.)

#### 3. EditorToolbar'a Template Butonu Ekleme

`src/components/editor/EditorToolbar.tsx` dosyasinda:
- "Ozelestir" butonunun yanina veya altina "Sablon" butonu eklenir
- Veya "Ozelestir" tiklandiginda acilan panelde ilk sirada template secimi olur

#### 4. Panel ve UI Seffaflik Duzeltmeleri

**CustomizePanel.tsx:**
- `bg-background` yerine `bg-card` veya solid beyaz arka plan
- Tum `backdrop-blur`'larin altinda solid bg katmani
- `border` renklerini belirginlestir
- Select/dropdown'larin z-index ve arka plan renklerini duzelt

**SectionEditPanel.tsx:**
- Ayni seffaflik duzeltmeleri
- `section.type` yerine Turkce etiket gosterimi (ornegin "services-grid" -> "Hizmetler")
- Input ve textarea alanlarinin arka plan renklerini solid yap

**EditorCanvas.tsx:**
- Secim overlay'lerinin solid arka planli olmasi
- Action butonlarinin arka plan renklerini net yap
- Section tip etiketinin okunakliligi arttirilir

**AddSectionPanel.tsx:**
- Solid arka plan ve net border
- Hover efektlerinin belirgin olmasi
- Kategori basliklarinin ayirt edilebilir olmasi

#### 5. Genel UI Iyilestirmeleri

**EditorToolbar.tsx:**
- `bg-background/95 backdrop-blur-xl` yerine `bg-white dark:bg-gray-950 border-b border-gray-200`
- Toggle butonlarinin daha belirgin ve tiklanabilir gorunmesi
- "Yayinla" butonunun daha gorse olmasi

**Tum panellerde:**
- `bg-background` CSS degiskeni yerine dogrudan solid renk kullanimina gecis (editorde tema degiskenleri sitenin renkleriyle cakisabiliyor)
- `bg-white dark:bg-zinc-900` gibi sabit renkler
- `shadow-2xl` yerine daha kontrollü golge (`shadow-lg`)
- z-index hiyerarsisi duzeltmesi: toolbar z-50, panels z-40, overlays z-30

#### 6. Template Degistirme Mantigi

`useEditorState.ts`'e yeni fonksiyon:
```text
applyTemplate(templateId: string)
  -> getCatalogTemplate(templateId) ile tanimlari al
  -> Mevcut icerik degerlerini koru (baslik, aciklama, telefon vb.)
  -> Yeni section yapisi olustur, eski degerleri eslestir
  -> Theme'i template preset'inden guncelle
  -> sections ve theme state'ini set et
```

### Teknik Detaylar

**Dosya Degisiklikleri:**

| Dosya | Degisiklik |
|-------|-----------|
| `src/components/editor/CustomizePanel.tsx` | Template degistir bolumu + solid arka planlar |
| `src/components/editor/SiteEditor.tsx` | ChangeTemplateModal entegrasyonu + template degistirme akisi |
| `src/components/editor/EditorToolbar.tsx` | Solid renkler, iyilestirilmis butonlar |
| `src/components/editor/SectionEditPanel.tsx` | Turkce etiketler + solid arka planlar |
| `src/components/editor/EditorCanvas.tsx` | Solid overlay'ler + belirgin aksiyon butonlari |
| `src/components/editor/AddSectionPanel.tsx` | Solid arka plan + cafe kategorisi etiketi |
| `src/components/editor/useEditorState.ts` | `applyTemplate` fonksiyonu eklenir |
| `src/components/website-preview/ChangeTemplateModal.tsx` | Turkce metinler + iyilestirilmis UI |

**Onemli Tasarim Karari:**
Editor panellerinde CSS degiskenleri (`bg-background`, `text-foreground` vb.) site temasinin renklerine gore degisebiliyor. Bu nedenle editor UI'da **sabit Tailwind renkleri** (`bg-white`, `text-gray-900`, `border-gray-200` vb.) kullanilacak. Boylece site temasinin editoru bozmasinin onune gecilecek.

### Uygulama Sirasi

1. `useEditorState.ts` -> `applyTemplate` fonksiyonu
2. `CustomizePanel.tsx` -> Template degistir + solid renkler
3. `SiteEditor.tsx` -> ChangeTemplateModal entegrasyonu
4. `EditorToolbar.tsx` -> Solid renkler
5. `SectionEditPanel.tsx` -> Turkce etiketler + solid renkler
6. `EditorCanvas.tsx` -> Solid overlay'ler
7. `AddSectionPanel.tsx` -> Solid renkler + cafe kategorisi
8. `ChangeTemplateModal.tsx` -> Turkce metinler
