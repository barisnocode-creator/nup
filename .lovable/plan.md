
# Editoru Modern ve Sikliga Kavusturmak (Mobil + Masaustu)

## Mevcut Durum

Editordeki sidebarlar (Katmanlar, Ekle, Ozellikler, Stiller) ve alt gezinti cubugu basit, duz bir gorunume sahip. SDK'nin varsayilan form kontrolleri (input, label, select) stillenmemis, eski gorunumlu. Mobilde sheet panelleri sade border-b ile ayrilmis basliklar, standart scrollbar ve derinlik hissi olmayan bir arayuz sunuyor.

## Yapilacak Degisiklikler

### 1. Mobil Editör Layout Modernizasyonu (`MobileEditorLayout.tsx`)

**Ust toolbar:**
- Glassmorphism efekti (backdrop-blur-xl, bg-background/80)
- Daha belirgin buton stilleri, rounded-xl
- Logo/proje ismi gosterimi

**Alt gezinti cubugu:**
- Daha buyuk ikonlar (w-6 h-6)
- Aktif durum icin alt cizgi (underline indicator) animasyonu
- Pill seklinde aktif gosterge (rounded-2xl, scale efekti)
- Hafif gradient arka plan

**Sheet panelleri:**
- Baslik bolumunde gradient accent cizgisi (top border gradient)
- Panel icerik alanlari icin daha iyi bosluklar (padding)
- Ozel scrollbar stilleri (ince, rounded, tema renklerinde)
- Baslik fontunu daha buyuk ve bold yapma

### 2. ChaiBuilder SDK Form Stillerini Override Etme (`chaibuilder.tailwind.css`)

SDK icerisindeki RJSF (React JSON Schema Form) elementleri icin modern CSS override'lar:

**Input alanlari:**
- Rounded-lg, focus ring, transition efektleri
- Placeholder rengi ve boyutu
- Input group gorunumu (label + input birlikte)

**Label'lar:**
- Uppercase tracking-wide, kucuk font, muted renk
- Daha iyi bosluklandirma

**Select/Dropdown:**
- Ozel ok ikonu
- Hover ve focus durumlari

**Checkbox/Radio:**
- Primary renginde, rounded
- Animasyonlu check isareti

**Butonlar:**
- SDK icerisindeki butonlar icin modern stiller
- Ghost variant icin hover efektleri

**Genel panel alani:**
- Bolum ayiricilari icin gradient veya subtle border
- Kart bazli gruplama (her ozellik grubu icin hafif bg)
- Accordion basliklari icin modern gorunum

### 3. Bottom Nav Bar Yeniden Tasarimi

Mevcut duz buton gorunumu yerine:
- Floating bar stili (mx-4, rounded-2xl, shadow-lg)
- Aktif sekme icin pill indicator
- Framer-motion ile smooth gecis animasyonu
- Daha genis dokunma alani (min-h-[52px])

### 4. Sheet Panel Header Modernizasyonu

Her panelin baslik bolumu:
- Sol kenarda 3px kalinliginda primary renkli accent bar
- Baslik yani sira kisa aciklama metni (ornegin "Blok ozelliklerini duzenleyin")
- Kapatma butonu icin modern X ikonu

## Teknik Detaylar

### Degistirilecek Dosyalar

**1. `src/components/chai-builder/MobileEditorLayout.tsx`**
- Top toolbar: glassmorphism + proje ismi
- Bottom navbar: floating pill tasarimi, rounded-2xl, shadow-lg, daha buyuk ikonlar
- Sheet panel header: accent bar, daha buyuk baslik, kisa aciklama metni
- Panel icerik wrapperlarina modern class ekleme
- Aktif tab icin scale ve spring animasyonu (framer-motion zaten yuklu)

**2. `src/styles/chaibuilder.tailwind.css`**
- SDK form elementleri icin kapsamli CSS override:
  - `input, select, textarea` icin modern stiller
  - `.rjsf` form wrapper icin kart stili
  - Label'lar icin tipografi iyilestirmeleri
  - Scrollbar ozellestirmeleri (webkit + Firefox)
  - Accordion/collapsible basliklari icin modern gorunum
  - Color picker icin rounded stiller
  - SDK panel arka planlarini koyu/acik tema uyumlu yapma
  - Blok kartlari icin hover efektleri (SDK add blocks paneli)

**3. `src/components/chai-builder/ChaiBuilderWrapper.tsx`**
- Masaustu gorunum icin de ust toolbar stilini guncelleme (glassmorphism)
- Geri butonu ve gorsel ara butonunu pill seklinde yapma

### Tasarim Referanslari

Hedeflenen modern gorunum:
- Figma, Framer, Webflow editoru benzeri temiz sidebar'lar
- iOS tarzinda alt gezinti cubugu (floating, rounded)
- Notion/Linear tarzinda form kontrolleri (ince border, buyuk radius, net tipografi)
- Glassmorphism toolbar (bulanik arka plan, yari saydam)
