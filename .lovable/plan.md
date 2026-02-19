

## ChangeTemplateModal — Durable-Style Horizontal Carousel Redesign

Mevcut dikey grid gorunumunu, yatay kaydirmali, uzun kartlardan olusan bir carousel tasarimina donusturuyoruz.

### Degisiklik Ozeti

| Dosya | Islem |
|-------|-------|
| `src/components/website-preview/ChangeTemplateModal.tsx` | **Tam yeniden yazim** — yatay carousel, alt aksiyon cubugu, sektor filtreleme |

Ayri bir `TemplateCard.tsx` dosyasina gerek yok — kartlar yeterince basit ve tek dosyada temiz kalir.

### Tasarim Detaylari

#### Modal Kabuk

- Genislik: `w-[90vw] max-w-[1200px]`
- Yukseklik: `h-[85vh]`
- `flex flex-col` yapisi: Header (sabit) + Carousel (flex-1) + Alt Bar (sabit)
- Radix Dialog kullanilmaya devam eder

#### Header Bolumu (~100px)

Sol taraf:
- Baslik: "Sablon Degistir" (text-2xl font-bold)
- Alt yazi: "Mevcut gorsel ve metinleriniz korunur, yeni duzene uyarlanir." (text-sm text-muted-foreground)

Sag taraf:
- "Karistir" butonu (RefreshCw ikonu, outlined)
- Kapat butonu (Dialog'un kendi X butonu)

#### Carousel Konteyneri

```text
display: flex
flex-direction: row
gap: 16px
overflow-x: auto
overflow-y: hidden
scroll-snap-type: x mandatory
padding: 16px 32px 24px 32px
padding-right: 80px (son kartin arkasinda bosluk)
scrollbar-width: none
scroll-behavior: smooth
```

Sektor filtreleme aktifse carousel ustunde kucuk bir etiket:
"Isletme turune ozel sablonlar gosteriliyor" (text-xs text-muted-foreground)

#### Kart Tasarimi

- Boyut: `w-[340px] h-[560px] flex-shrink-0`
- Border-radius: `rounded-xl` (12px)
- `overflow-hidden`, `cursor-pointer`
- Hover: `hover:scale-[1.01]` (transition 150ms)
- Varsayilan border: `border-2 border-transparent`
- Secili border: `border-2 border-primary`
- Mevcut template: "Your template" / "Mevcut sablon" pill badge (absolute top-3 left-3, bg-zinc-900 text-white rounded-full px-3 py-1 text-xs)

Kart icerigi:
- Thumbnail gorseli tum karti kaplar (`object-cover w-full h-full`)
- Hover'da: alt kisimda koyu gradient overlay + template adi (beyaz yazi)
- Gorsel yuklenemezse fallback unsplash gorseli

#### Alt Aksiyon Cubugu (~72px)

```text
┌─────────────────────────────────────────────────────────────┐
│  [Iptal]                              [Sablonu Uygula →]    │
└─────────────────────────────────────────────────────────────┘
```

- "Iptal": `variant="outline"`, modal'i kapatir
- "Sablonu Uygula": `bg-primary text-primary-foreground`
  - `disabled` eger `selectedTemplateId === currentTemplateId`
  - Tiklaninca `onSelectTemplate(selectedTemplateId)` cagirilir ve modal kapanir
- Ust sinir cizgisi: `border-t border-border`

#### State Yonetimi

```text
selectedTemplateId: baslangicta currentTemplateId
shuffleKey: karistirma icin (mevcut mantik korunur)
```

Kart tiklaninca → `setSelectedTemplateId(template.id)`
Mevcut template'e tiklaninca → hicbir sey olmaz (zaten secili)

#### Sektor Filtreleme

`projectData?.sector` mevcutsa:
1. `template.supportedProfessions` icerisinde `sector` gecen template'ler one alinir
2. Geri kalanlar sona eklenir (tamamen gizlenmez, sadece siralama degisir)

Sektor yoksa → mevcut siralama korunur (tum template'ler gosterilir)

#### Canli Onizleme Modu

Mevcut preview modu (previewTemplateId ile) KORUNUR. Kart uzerine gelindiginde gosterilen overlay'e "Onizle" butonu eklenir. Tiklaninca tam sayfa canli onizleme acilir (mevcut davranis).

#### Animasyonlar

- Modal acilis: Dialog'un mevcut animasyonu yeterli
- Kart secimi: `transition-all duration-200` (border renk gecisi)
- Scroll: `scroll-behavior: smooth` + `scroll-snap-align: start`

### Korunan Davranislar

- `onSelectTemplate` ve `onPreview` callback imzalari degismez
- `applyTemplate` mantigi dokunulmaz
- Template verileri/tanimlamalari degismez
- Modal acma/kapama tetiklenmesi ayni kalir
- Canli onizleme modu (previewTemplateId) korunur
- Karistir (shuffle) islevi korunur

