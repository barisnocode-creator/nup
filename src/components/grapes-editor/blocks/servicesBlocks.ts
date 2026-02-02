import type { Editor } from 'grapesjs';

export function registerServicesBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // Services Grid - 3 column grid
  bm.add('services-grid', {
    label: 'Hizmetler (Grid)',
    category: 'Hizmet Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="6" height="6" rx="1"/>
      <rect x="9" y="3" width="6" height="6" rx="1"/>
      <rect x="16" y="3" width="6" height="6" rx="1"/>
      <rect x="2" y="11" width="6" height="6" rx="1"/>
      <rect x="9" y="11" width="6" height="6" rx="1"/>
      <rect x="16" y="11" width="6" height="6" rx="1"/>
    </svg>`,
    content: `
      <section class="services-grid py-20 bg-muted/30" data-gjs-name="Hizmetler Grid">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Hizmetlerimiz</span>
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-foreground" data-gjs-editable="true">Size Sunduğumuz Hizmetler</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto text-lg" data-gjs-editable="true">
              Profesyonel ekibimizle sizlere en kaliteli hizmeti sunmak için buradayız.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">⚡</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">Hızlı Teslimat</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">Projelerinizi zamanında ve kaliteli bir şekilde teslim ediyoruz.</p>
            </div>
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">🎯</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">Uzman Kadro</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">Alanında uzman profesyonellerden oluşan ekibimizle hizmetinizdeyiz.</p>
            </div>
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">💎</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">Premium Kalite</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">En yüksek standartlarda kalite güvencesi sunuyoruz.</p>
            </div>
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">🔒</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">Güvenli Hizmet</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">Verileriniz ve projeleriniz bizimle güvende.</p>
            </div>
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">🚀</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">Hızlı Başlangıç</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">Projelerinize hızlı bir başlangıç yapmanızı sağlıyoruz.</p>
            </div>
            <div class="service-card bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1" data-gjs-name="Hizmet Kartı">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span class="text-3xl">📞</span>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-foreground" data-gjs-editable="true">7/24 Destek</h3>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">Her zaman yanınızda olan müşteri destek hattımız.</p>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-th' },
  });

  // Services List - Alternating layout
  bm.add('services-list', {
    label: 'Hizmetler (Liste)',
    category: 'Hizmet Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="4" width="20" height="4" rx="1"/>
      <rect x="2" y="10" width="20" height="4" rx="1"/>
      <rect x="2" y="16" width="20" height="4" rx="1"/>
    </svg>`,
    content: `
      <section class="services-list py-20" data-gjs-name="Hizmetler Liste">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-foreground" data-gjs-editable="true">Hizmetlerimiz</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto" data-gjs-editable="true">
              İhtiyaçlarınıza özel çözümler sunuyoruz.
            </p>
          </div>
          
          <!-- Service Item 1 -->
          <div class="flex flex-col lg:flex-row items-center gap-12 mb-20" data-gjs-name="Hizmet Öğesi">
            <div class="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
                alt="Hizmet 1"
                class="rounded-2xl shadow-lg w-full object-cover aspect-[3/2]"
                data-gjs-type="image"
              />
            </div>
            <div class="lg:w-1/2 space-y-4">
              <span class="text-primary font-medium" data-gjs-editable="true">01</span>
              <h3 class="text-2xl md:text-3xl font-bold text-foreground" data-gjs-editable="true">Danışmanlık Hizmetleri</h3>
              <p class="text-muted-foreground text-lg leading-relaxed" data-gjs-editable="true">
                Uzman ekibimizle işletmenizin ihtiyaçlarını analiz ediyor ve size özel stratejiler geliştiriyoruz.
              </p>
              <button class="inline-flex items-center text-primary font-medium hover:underline">
                Daha Fazla →
              </button>
            </div>
          </div>

          <!-- Service Item 2 -->
          <div class="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20" data-gjs-name="Hizmet Öğesi">
            <div class="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                alt="Hizmet 2"
                class="rounded-2xl shadow-lg w-full object-cover aspect-[3/2]"
                data-gjs-type="image"
              />
            </div>
            <div class="lg:w-1/2 space-y-4">
              <span class="text-primary font-medium" data-gjs-editable="true">02</span>
              <h3 class="text-2xl md:text-3xl font-bold text-foreground" data-gjs-editable="true">Dijital Dönüşüm</h3>
              <p class="text-muted-foreground text-lg leading-relaxed" data-gjs-editable="true">
                İşletmenizi dijital çağa taşıyoruz. Modern teknolojilerle iş süreçlerinizi optimize ediyoruz.
              </p>
              <button class="inline-flex items-center text-primary font-medium hover:underline">
                Daha Fazla →
              </button>
            </div>
          </div>

          <!-- Service Item 3 -->
          <div class="flex flex-col lg:flex-row items-center gap-12" data-gjs-name="Hizmet Öğesi">
            <div class="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
                alt="Hizmet 3"
                class="rounded-2xl shadow-lg w-full object-cover aspect-[3/2]"
                data-gjs-type="image"
              />
            </div>
            <div class="lg:w-1/2 space-y-4">
              <span class="text-primary font-medium" data-gjs-editable="true">03</span>
              <h3 class="text-2xl md:text-3xl font-bold text-foreground" data-gjs-editable="true">Eğitim ve Gelişim</h3>
              <p class="text-muted-foreground text-lg leading-relaxed" data-gjs-editable="true">
                Ekibinizin becerilerini geliştirmek için özelleştirilmiş eğitim programları sunuyoruz.
              </p>
              <button class="inline-flex items-center text-primary font-medium hover:underline">
                Daha Fazla →
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-list' },
  });

  // Services Cards - Icon focused cards
  bm.add('services-cards', {
    label: 'Hizmetler (Kartlar)',
    category: 'Hizmet Bölümleri',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="9" height="8" rx="2"/>
      <rect x="13" y="3" width="9" height="8" rx="2"/>
      <rect x="2" y="13" width="9" height="8" rx="2"/>
      <rect x="13" y="13" width="9" height="8" rx="2"/>
    </svg>`,
    content: `
      <section class="services-cards py-20 bg-gradient-to-b from-background to-muted/30" data-gjs-name="Hizmetler Kartlar">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-foreground" data-gjs-editable="true">Neler Yapıyoruz?</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto text-lg" data-gjs-editable="true">
              Kapsamlı hizmet yelpazamizle tüm ihtiyaçlarınızı karşılıyoruz.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="group relative bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-all" data-gjs-name="Hizmet Kartı">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div class="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="text-3xl">🎨</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-foreground" data-gjs-editable="true">Tasarım Hizmetleri</h3>
              <p class="text-muted-foreground mb-4" data-gjs-editable="true">
                Modern ve etkileyici tasarımlarla markanızı öne çıkarıyoruz. UI/UX, grafik tasarım ve marka kimliği çalışmaları.
              </p>
              <a href="#" class="text-primary font-medium hover:underline">Detaylar →</a>
            </div>
            <div class="group relative bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-all" data-gjs-name="Hizmet Kartı">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div class="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="text-3xl">💻</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-foreground" data-gjs-editable="true">Web Geliştirme</h3>
              <p class="text-muted-foreground mb-4" data-gjs-editable="true">
                Hızlı, güvenli ve ölçeklenebilir web uygulamaları geliştiriyoruz. E-ticaret, kurumsal siteler ve özel yazılımlar.
              </p>
              <a href="#" class="text-primary font-medium hover:underline">Detaylar →</a>
            </div>
            <div class="group relative bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-all" data-gjs-name="Hizmet Kartı">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div class="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="text-3xl">📱</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-foreground" data-gjs-editable="true">Mobil Uygulama</h3>
              <p class="text-muted-foreground mb-4" data-gjs-editable="true">
                iOS ve Android platformları için native ve cross-platform mobil uygulamalar geliştiriyoruz.
              </p>
              <a href="#" class="text-primary font-medium hover:underline">Detaylar →</a>
            </div>
            <div class="group relative bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-all" data-gjs-name="Hizmet Kartı">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
              <div class="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="text-3xl">📊</span>
              </div>
              <h3 class="text-xl font-bold mb-3 text-foreground" data-gjs-editable="true">Dijital Pazarlama</h3>
              <p class="text-muted-foreground mb-4" data-gjs-editable="true">
                SEO, sosyal medya yönetimi ve dijital reklam kampanyalarıyla markanızın görünürlüğünü artırıyoruz.
              </p>
              <a href="#" class="text-primary font-medium hover:underline">Detaylar →</a>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-th-large' },
  });
}
