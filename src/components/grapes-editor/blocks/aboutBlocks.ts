import type { Editor } from 'grapesjs';

export function registerAboutBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // About Inline - Side by side layout
  bm.add('about-inline', {
    label: 'Hakkımızda (Yan Yana)',
    category: 'Hakkımızda',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="4" width="9" height="16" rx="1"/>
      <line x1="14" y1="6" x2="22" y2="6"/>
      <line x1="14" y1="10" x2="22" y2="10"/>
      <line x1="14" y1="14" x2="20" y2="14"/>
    </svg>`,
    content: `
      <section class="about-inline py-20" data-gjs-name="Hakkımızda Yan Yana">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=700&fit=crop" 
                alt="Hakkımızda"
                class="rounded-2xl shadow-2xl w-full object-cover aspect-[5/6]"
                data-gjs-type="image"
              />
              <div class="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <div class="text-4xl font-bold" data-gjs-editable="true">15+</div>
                <div class="text-sm opacity-90" data-gjs-editable="true">Yıllık Deneyim</div>
              </div>
            </div>
            <div class="space-y-6">
              <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium" data-gjs-editable="true">Hakkımızda</span>
              <h2 class="text-3xl md:text-4xl font-bold text-foreground" data-gjs-editable="true">
                Hikayemiz ve Misyonumuz
              </h2>
              <p class="text-muted-foreground text-lg leading-relaxed" data-gjs-editable="true">
                2009 yılından bu yana sektörde öncü konumdayız. Müşteri memnuniyetini ön planda tutarak, kaliteli ve güvenilir hizmet sunmayı ilke edindik.
              </p>
              <p class="text-muted-foreground leading-relaxed" data-gjs-editable="true">
                Uzman kadromuz ve modern altyapımızla, her projede en iyi sonucu elde etmek için çalışıyoruz. Sizin başarınız, bizim başarımızdır.
              </p>
              <div class="grid grid-cols-2 gap-6 pt-4">
                <div class="text-center p-4 bg-muted/50 rounded-xl">
                  <div class="text-3xl font-bold text-primary" data-gjs-editable="true">500+</div>
                  <div class="text-sm text-muted-foreground" data-gjs-editable="true">Mutlu Müşteri</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-xl">
                  <div class="text-3xl font-bold text-primary" data-gjs-editable="true">1000+</div>
                  <div class="text-sm text-muted-foreground" data-gjs-editable="true">Tamamlanan Proje</div>
                </div>
              </div>
              <button class="mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-columns' },
  });

  // About Fullwidth - Full width with background
  bm.add('about-fullwidth', {
    label: 'Hakkımızda (Tam Genişlik)',
    category: 'Hakkımızda',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <line x1="6" y1="10" x2="18" y2="10"/>
      <line x1="6" y1="14" x2="16" y2="14"/>
    </svg>`,
    content: `
      <section class="about-fullwidth py-20 bg-muted/30" data-gjs-name="Hakkımızda Tam Genişlik">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Biz Kimiz?</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6" data-gjs-editable="true">
              Tutkuyla Çalışan, Sonuç Odaklı Bir Ekip
            </h2>
            <p class="text-muted-foreground text-lg leading-relaxed" data-gjs-editable="true">
              Müşterilerimizin başarısı için var gücümüzle çalışıyoruz. Her projede en iyisini sunmak, kaliteyi ve müşteri memnuniyetini ön planda tutmak temel ilkemizdir.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div class="text-center p-8 bg-background rounded-2xl shadow-sm" data-gjs-name="Değer Kartı">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">🎯</span>
              </div>
              <h3 class="text-xl font-bold mb-2 text-foreground" data-gjs-editable="true">Vizyonumuz</h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Sektörde öncü ve yenilikçi çözümler sunan lider kuruluş olmak.
              </p>
            </div>
            <div class="text-center p-8 bg-background rounded-2xl shadow-sm" data-gjs-name="Değer Kartı">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">💡</span>
              </div>
              <h3 class="text-xl font-bold mb-2 text-foreground" data-gjs-editable="true">Misyonumuz</h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Müşterilerimize değer katan, sürdürülebilir çözümler sunmak.
              </p>
            </div>
            <div class="text-center p-8 bg-background rounded-2xl shadow-sm" data-gjs-name="Değer Kartı">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">❤️</span>
              </div>
              <h3 class="text-xl font-bold mb-2 text-foreground" data-gjs-editable="true">Değerlerimiz</h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Dürüstlük, şeffaflık ve müşteri odaklılık temel değerlerimizdir.
              </p>
            </div>
          </div>

          <div class="relative rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=500&fit=crop" 
              alt="Ekibimiz"
              class="w-full h-[400px] object-cover"
              data-gjs-type="image"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div class="p-8 text-white">
                <h3 class="text-2xl font-bold mb-2" data-gjs-editable="true">Ekibimizle Tanışın</h3>
                <p class="opacity-90" data-gjs-editable="true">30+ profesyonelden oluşan uzman kadromuz</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-square' },
  });

  // About Timeline - Company history
  bm.add('about-timeline', {
    label: 'Hakkımızda (Zaman Çizelgesi)',
    category: 'Hakkımızda',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <circle cx="12" cy="6" r="2"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="12" cy="18" r="2"/>
      <line x1="14" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="10" y2="12"/>
      <line x1="14" y1="18" x2="20" y2="18"/>
    </svg>`,
    content: `
      <section class="about-timeline py-20" data-gjs-name="Hakkımızda Zaman Çizelgesi">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Tarihçemiz</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
              Yıllar İçindeki Yolculuğumuz
            </h2>
            <p class="text-muted-foreground max-w-2xl mx-auto" data-gjs-editable="true">
              Başlangıcından bugüne, sürekli gelişen ve büyüyen bir hikaye.
            </p>
          </div>

          <div class="relative max-w-4xl mx-auto">
            <!-- Timeline line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

            <!-- Timeline items -->
            <div class="relative mb-12" data-gjs-name="Zaman Çizelgesi Öğesi">
              <div class="flex items-center">
                <div class="w-1/2 pr-8 text-right">
                  <div class="bg-background p-6 rounded-xl shadow-sm border border-border">
                    <span class="text-primary font-bold text-lg" data-gjs-editable="true">2009</span>
                    <h3 class="text-xl font-bold mt-2 text-foreground" data-gjs-editable="true">Kuruluş</h3>
                    <p class="text-muted-foreground mt-2" data-gjs-editable="true">
                      Küçük bir ekiple hayallerimizi gerçekleştirmek için yola çıktık.
                    </p>
                  </div>
                </div>
                <div class="w-4 h-4 bg-primary rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div class="w-1/2 pl-8"></div>
              </div>
            </div>

            <div class="relative mb-12" data-gjs-name="Zaman Çizelgesi Öğesi">
              <div class="flex items-center">
                <div class="w-1/2 pr-8"></div>
                <div class="w-4 h-4 bg-primary rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div class="w-1/2 pl-8">
                  <div class="bg-background p-6 rounded-xl shadow-sm border border-border">
                    <span class="text-primary font-bold text-lg" data-gjs-editable="true">2015</span>
                    <h3 class="text-xl font-bold mt-2 text-foreground" data-gjs-editable="true">Büyüme</h3>
                    <p class="text-muted-foreground mt-2" data-gjs-editable="true">
                      Ekibimizi genişlettik ve yeni ofisimize taşındık.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative mb-12" data-gjs-name="Zaman Çizelgesi Öğesi">
              <div class="flex items-center">
                <div class="w-1/2 pr-8 text-right">
                  <div class="bg-background p-6 rounded-xl shadow-sm border border-border">
                    <span class="text-primary font-bold text-lg" data-gjs-editable="true">2020</span>
                    <h3 class="text-xl font-bold mt-2 text-foreground" data-gjs-editable="true">Dijital Dönüşüm</h3>
                    <p class="text-muted-foreground mt-2" data-gjs-editable="true">
                      Dijital hizmetlerimizi başlattık ve online varlığımızı güçlendirdik.
                    </p>
                  </div>
                </div>
                <div class="w-4 h-4 bg-primary rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div class="w-1/2 pl-8"></div>
              </div>
            </div>

            <div class="relative" data-gjs-name="Zaman Çizelgesi Öğesi">
              <div class="flex items-center">
                <div class="w-1/2 pr-8"></div>
                <div class="w-4 h-4 bg-primary rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>
                <div class="w-1/2 pl-8">
                  <div class="bg-primary p-6 rounded-xl shadow-lg text-primary-foreground">
                    <span class="font-bold text-lg" data-gjs-editable="true">2024</span>
                    <h3 class="text-xl font-bold mt-2" data-gjs-editable="true">Bugün</h3>
                    <p class="opacity-90 mt-2" data-gjs-editable="true">
                      500+ müşteri ve 1000+ projeyle sektörün liderlerinden biriyiz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-history' },
  });
}
