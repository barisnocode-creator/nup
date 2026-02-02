import type { Editor } from 'grapesjs';

export function registerHeroBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // Hero Split - Two column layout
  bm.add('hero-split', {
    label: 'Hero (Bölünmüş)',
    category: 'Hero Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="8" height="18" rx="1"/>
      <rect x="14" y="3" width="8" height="18" rx="1"/>
    </svg>`,
    content: `
      <section class="hero-split min-h-[80vh] flex items-center py-16 lg:py-24" data-gjs-name="Hero Bölünmüş">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium" data-gjs-editable="true">Profesyonel Hizmet</span>
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground" data-gjs-editable="true">
                İşletmeniz İçin Profesyonel Çözümler
              </h1>
              <p class="text-lg md:text-xl text-muted-foreground leading-relaxed" data-gjs-editable="true">
                Deneyimli ekibimiz ve modern yaklaşımımızla işletmenizi bir adım öne taşıyoruz. Kaliteli hizmet anlayışımızla yanınızdayız.
              </p>
              <div class="flex flex-wrap gap-4 pt-4">
                <button class="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Hemen Başla
                </button>
                <button class="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                  Daha Fazla Bilgi
                </button>
              </div>
            </div>
            <div class="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop" 
                alt="Hero Görsel" 
                class="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                data-gjs-type="image"
              />
              <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-2xl -z-10"></div>
              <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-columns' },
  });

  // Hero Overlay - Full background image
  bm.add('hero-overlay', {
    label: 'Hero (Arka Plan)',
    category: 'Hero Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>`,
    content: `
      <section 
        class="hero-overlay relative min-h-[80vh] flex items-center justify-center text-center text-white"
        style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop') center/cover no-repeat"
        data-gjs-name="Hero Arka Plan"
      >
        <div class="container mx-auto px-6 max-w-4xl relative z-10">
          <span class="inline-block px-6 py-2 border-2 border-white/30 rounded-full text-sm font-medium mb-6" data-gjs-editable="true">
            Profesyonel Hizmet
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-gjs-editable="true">
            İşletmeniz İçin Profesyonel Çözümler Sunuyoruz
          </h1>
          <p class="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto" data-gjs-editable="true">
            Deneyimli ekibimizle kaliteli ve güvenilir hizmet anlayışıyla yanınızdayız.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-10 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Hemen Başlayın
            </button>
            <button class="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors">
              İletişime Geçin
            </button>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-image' },
  });

  // Hero Centered - Simple centered text
  bm.add('hero-centered', {
    label: 'Hero (Ortalı)',
    category: 'Hero Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="6" y1="14" x2="18" y2="14"/>
    </svg>`,
    content: `
      <section class="hero-centered min-h-[70vh] flex items-center justify-center py-20 bg-gradient-to-b from-background to-muted/30" data-gjs-name="Hero Ortalı">
        <div class="container mx-auto px-6 text-center max-w-4xl">
          <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6" data-gjs-editable="true">
            Hoş Geldiniz
          </span>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-gjs-editable="true">
            Modern ve Profesyonel Hizmet Anlayışı
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed" data-gjs-editable="true">
            Yılların deneyimi ve uzman kadromuzla işletmenize değer katıyoruz. Müşteri memnuniyeti odaklı yaklaşımımızla hizmetinizdeyiz.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              Randevu Al
            </button>
            <button class="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors">
              Hizmetlerimiz
            </button>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-align-center' },
  });

  // Hero Gradient - Gradient background
  bm.add('hero-gradient', {
    label: 'Hero (Gradyan)',
    category: 'Hero Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <path d="M2 8 L22 3 L22 21 L2 21 Z" fill="currentColor" opacity="0.2"/>
    </svg>`,
    content: `
      <section 
        class="hero-gradient min-h-[80vh] flex items-center py-20"
        style="background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.7) 50%, hsl(var(--secondary)) 100%)"
        data-gjs-name="Hero Gradyan"
      >
        <div class="container mx-auto px-6">
          <div class="max-w-3xl text-white">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-gjs-editable="true">
              Geleceğin Çözümleri Bugün Sizinle
            </h1>
            <p class="text-xl md:text-2xl opacity-90 mb-10 leading-relaxed" data-gjs-editable="true">
              İnovatif yaklaşımımız ve son teknoloji altyapımızla işletmenizi dijital çağa taşıyoruz.
            </p>
            <div class="flex flex-wrap gap-4">
              <button class="px-10 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl">
                Keşfet
              </button>
              <button class="px-10 py-4 bg-white/20 text-white border-2 border-white/50 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
                Demo İste
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-paint-brush' },
  });

  // Hero Video Background
  bm.add('hero-video', {
    label: 'Hero (Video)',
    category: 'Hero Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <polygon points="10,8 16,12 10,16" fill="currentColor"/>
    </svg>`,
    content: `
      <section class="hero-video relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden" data-gjs-name="Hero Video">
        <div class="absolute inset-0 bg-black/50 z-10"></div>
        <video 
          class="absolute inset-0 w-full h-full object-cover"
          autoplay 
          loop 
          muted 
          playsinline
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-702-large.mp4" type="video/mp4">
        </video>
        <div class="container mx-auto px-6 text-center relative z-20 max-w-4xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-gjs-editable="true">
            Görsel Hikayelerinizi Hayata Geçiriyoruz
          </h1>
          <p class="text-xl md:text-2xl opacity-90 mb-10" data-gjs-editable="true">
            Profesyonel video prodüksiyon hizmetlerimizle markanızı öne çıkarın.
          </p>
          <button class="px-12 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
            Portföyümüzü İnceleyin
          </button>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-video-camera' },
  });
}
