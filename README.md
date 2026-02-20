# Open Lucius — AI Destekli Website Builder

Sağlık profesyonelleri, avukatlar, güzellik salonları ve diğer hizmet sektörü için AI destekli web sitesi oluşturma platformu.

## Özellikler

- **AI Website Üretimi** — Meslek ve tercihlere göre otomatik içerik ve tasarım
- **Görsel Editör** — Sürükle-bırak ChaiBuilder tabanlı blok editörü
- **80+ Hazır Section** — Hero, Hizmetler, Galeri, Testimonials, SSS ve daha fazlası
- **Randevu Sistemi** — Takvim yönetimi, engellenen tarihler, bildirimler
- **Analitik** — Ziyaretçi takibi ve dönüşüm raporları
- **Özel Domain** — Subdomain ve özel alan adı desteği
- **Netlify Deploy** — Tek tıkla statik HTML yayınlama
- **AI Görsel Stüdyo** — Prompt ile görsel üretimi

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS + Framer Motion |
| Backend | Supabase (Auth, PostgreSQL, Edge Functions) |
| Editör | ChaiBuilder SDK v4 |
| AI | Google Gemini (içerik), Pixabay (görseller) |
| Deploy | Netlify |

## Kurulum

### Gereksinimler

- Node.js 18+ veya Bun
- Supabase hesabı
- Pixabay API key (ücretsiz)
- Google AI Studio API key (Gemini)
- Netlify hesabı + Personal Access Token

### 1. Repo'yu klonlayın

```bash
git clone <YOUR_GIT_URL>
cd nup
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
# ya da
bun install
```

### 3. Ortam değişkenlerini ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını açıp Supabase bilgilerinizi doldurun:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### 4. Veritabanını kurun

Supabase Dashboard > SQL Editor'da `supabase/migrations/` klasöründeki `.sql` dosyalarını sırasıyla çalıştırın.

Ya da Supabase CLI ile:

```bash
supabase db push
```

### 5. Edge Function Secret'larını ayarlayın

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key
supabase secrets set PIXABAY_API_KEY=your_pixabay_key
supabase secrets set NETLIFY_TOKEN=your_netlify_token
```

### 6. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Uygulama `http://localhost:8080` adresinde çalışır.

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run preview      # Build önizlemesi
npm run lint         # ESLint çalıştır
npm run test         # Testleri çalıştır
npm run test:watch   # Watch modunda test
```

## Proje Yapısı

```
src/
├── pages/          # 12 sayfa bileşeni (Dashboard, Project, Analytics…)
├── components/
│   ├── ui/         # shadcn/ui temel bileşenleri
│   ├── sections/   # 80+ website section bileşeni
│   ├── wizard/     # Proje oluşturma sihirbazı
│   ├── dashboard/  # Dashboard panelleri
│   └── editor/     # Website editörü
├── templates/      # Hazır şablonlar (lawyer, pilates, natural…)
├── contexts/       # Auth context
├── hooks/          # Custom hook'lar
├── utils/          # Yardımcı fonksiyonlar
└── types/          # TypeScript tipleri

supabase/
├── functions/      # 21 Edge Function
└── migrations/     # Veritabanı migration'ları
```

## Edge Functions

| Fonksiyon | Açıklama |
|-----------|----------|
| `generate-website` | AI ile website içeriği üretir |
| `wizard-chat` | Proje oluşturma sohbeti |
| `deploy-to-netlify` | Netlify'a statik HTML deploy |
| `fetch-images` / `search-pixabay` | Pixabay görsel arama |
| `book-appointment` | Randevu oluşturma |
| `track-analytics` | Ziyaretçi analytics kaydı |
| `add-custom-domain` | Özel domain ekleme |

Tam liste için `docs/claude-code-migration-briefing.md` dosyasına bakın.

## Yeni Blok Ekleme

1. `src/components/sections/` altında bileşeni oluştur
2. İlgili `index.ts`'ye export ekle
3. `supabase/functions/deploy-to-netlify/` içinde HTML renderer yaz

## Katkıda Bulunma

1. Branch oluştur: `git checkout -b feature/your-feature`
2. Değişiklikleri commit et
3. PR aç

## Lisans

MIT
