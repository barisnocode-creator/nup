import type { Editor } from 'grapesjs';

export function registerSectionBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // CTA Banner
  bm.add('cta-banner', {
    label: 'CTA Banner',
    category: 'CTA',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <line x1="6" y1="12" x2="14" y2="12"/>
      <rect x="16" y="10" width="4" height="4" rx="1"/>
    </svg>`,
    content: `
      <section class="cta-banner py-20 bg-primary" data-gjs-name="CTA Banner">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-foreground mb-6" data-gjs-editable="true">
            Projenizi Hayata Geçirmeye Hazır mısınız?
          </h2>
          <p class="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto" data-gjs-editable="true">
            Hemen bizimle iletişime geçin ve projelerinizi birlikte gerçekleştirelim.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Hemen Başla
            </button>
            <button class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-bullhorn' },
  });

  // Statistics Section
  bm.add('statistics', {
    label: 'İstatistikler',
    category: 'Genel',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="12" width="4" height="8"/>
      <rect x="10" y="8" width="4" height="12"/>
      <rect x="17" y="4" width="4" height="16"/>
    </svg>`,
    content: `
      <section class="statistics py-20 bg-muted/30" data-gjs-name="İstatistikler">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center" data-gjs-name="İstatistik Öğesi">
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2" data-gjs-editable="true">15+</div>
              <div class="text-muted-foreground" data-gjs-editable="true">Yıllık Deneyim</div>
            </div>
            <div class="text-center" data-gjs-name="İstatistik Öğesi">
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2" data-gjs-editable="true">500+</div>
              <div class="text-muted-foreground" data-gjs-editable="true">Mutlu Müşteri</div>
            </div>
            <div class="text-center" data-gjs-name="İstatistik Öğesi">
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2" data-gjs-editable="true">1000+</div>
              <div class="text-muted-foreground" data-gjs-editable="true">Tamamlanan Proje</div>
            </div>
            <div class="text-center" data-gjs-name="İstatistik Öğesi">
              <div class="text-4xl md:text-5xl font-bold text-primary mb-2" data-gjs-editable="true">30+</div>
              <div class="text-muted-foreground" data-gjs-editable="true">Uzman Ekip</div>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-bar-chart' },
  });

  // Testimonials Grid
  bm.add('testimonials-grid', {
    label: 'Yorumlar (Grid)',
    category: 'Yorumlar',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`,
    content: `
      <section class="testimonials py-20" data-gjs-name="Yorumlar">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Müşteri Yorumları</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
              Müşterilerimiz Ne Diyor?
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-background p-8 rounded-2xl shadow-sm border border-border" data-gjs-name="Yorum Kartı">
              <div class="flex gap-1 mb-4">
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
              </div>
              <p class="text-muted-foreground mb-6 italic" data-gjs-editable="true">
                "Harika bir deneyim yaşadık. Profesyonel ekip, kaliteli hizmet. Kesinlikle tavsiye ederim."
              </p>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-lg font-bold text-primary">AY</span>
                </div>
                <div>
                  <div class="font-semibold text-foreground" data-gjs-editable="true">Ahmet Yılmaz</div>
                  <div class="text-sm text-muted-foreground" data-gjs-editable="true">CEO, ABC Şirketi</div>
                </div>
              </div>
            </div>
            
            <div class="bg-background p-8 rounded-2xl shadow-sm border border-border" data-gjs-name="Yorum Kartı">
              <div class="flex gap-1 mb-4">
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
              </div>
              <p class="text-muted-foreground mb-6 italic" data-gjs-editable="true">
                "İşimizi çok kolaylaştırdılar. Süreç boyunca her adımda yanımızda oldular."
              </p>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-lg font-bold text-primary">MK</span>
                </div>
                <div>
                  <div class="font-semibold text-foreground" data-gjs-editable="true">Mehmet Kaya</div>
                  <div class="text-sm text-muted-foreground" data-gjs-editable="true">Müdür, XYZ Ltd.</div>
                </div>
              </div>
            </div>
            
            <div class="bg-background p-8 rounded-2xl shadow-sm border border-border" data-gjs-name="Yorum Kartı">
              <div class="flex gap-1 mb-4">
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
                <span class="text-yellow-500">★</span>
              </div>
              <p class="text-muted-foreground mb-6 italic" data-gjs-editable="true">
                "Beklentilerimizin çok üzerinde bir sonuç aldık. Teşekkürler!"
              </p>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-lg font-bold text-primary">ZD</span>
                </div>
                <div>
                  <div class="font-semibold text-foreground" data-gjs-editable="true">Zeynep Demir</div>
                  <div class="text-sm text-muted-foreground" data-gjs-editable="true">Kurucu, StartUp Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-comments' },
  });

  // FAQ Section
  bm.add('faq', {
    label: 'SSS',
    category: 'Genel',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    content: `
      <section class="faq py-20 bg-muted/30" data-gjs-name="SSS">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">SSS</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
              Sık Sorulan Sorular
            </h2>
          </div>
          
          <div class="max-w-3xl mx-auto space-y-4">
            <div class="bg-background p-6 rounded-xl border border-border" data-gjs-name="SSS Öğesi">
              <h3 class="text-lg font-semibold text-foreground mb-2" data-gjs-editable="true">
                Hizmetlerinizi nasıl alabilirim?
              </h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Bizimle iletişim formu, telefon veya e-posta yoluyla iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız.
              </p>
            </div>
            
            <div class="bg-background p-6 rounded-xl border border-border" data-gjs-name="SSS Öğesi">
              <h3 class="text-lg font-semibold text-foreground mb-2" data-gjs-editable="true">
                Fiyatlandırma nasıl yapılıyor?
              </h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Her proje özelinde fiyatlandırma yapıyoruz. İhtiyaçlarınızı dinledikten sonra size özel bir teklif sunuyoruz.
              </p>
            </div>
            
            <div class="bg-background p-6 rounded-xl border border-border" data-gjs-name="SSS Öğesi">
              <h3 class="text-lg font-semibold text-foreground mb-2" data-gjs-editable="true">
                Proje süreci nasıl işliyor?
              </h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Önce ihtiyaç analizi yapıyoruz, ardından planlama ve uygulama aşamalarına geçiyoruz. Süreç boyunca sizi bilgilendiriyoruz.
              </p>
            </div>
            
            <div class="bg-background p-6 rounded-xl border border-border" data-gjs-name="SSS Öğesi">
              <h3 class="text-lg font-semibold text-foreground mb-2" data-gjs-editable="true">
                Destek hizmeti sunuyor musunuz?
              </h3>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Evet, proje tesliminden sonra da destek hizmeti sunuyoruz. 7/24 müşteri destek hattımızla yanınızdayız.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-question-circle' },
  });

  // Gallery Section
  bm.add('gallery', {
    label: 'Galeri',
    category: 'Genel',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>`,
    content: `
      <section class="gallery py-20" data-gjs-name="Galeri">
        <div class="container mx-auto px-6">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Galeri</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
              Çalışmalarımız
            </h2>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop" 
                alt="Galeri 1"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop" 
                alt="Galeri 2"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop" 
                alt="Galeri 3"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop" 
                alt="Galeri 4"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop" 
                alt="Galeri 5"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
            <div class="aspect-square rounded-xl overflow-hidden" data-gjs-name="Galeri Öğesi">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop" 
                alt="Galeri 6"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                data-gjs-type="image"
              />
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-picture-o' },
  });

  // Footer Section
  bm.add('footer', {
    label: 'Alt Bilgi',
    category: 'Genel',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="14" width="20" height="7" rx="2"/>
      <line x1="6" y1="17" x2="10" y2="17"/>
      <line x1="14" y1="17" x2="18" y2="17"/>
    </svg>`,
    content: `
      <footer class="py-16 bg-foreground text-background" data-gjs-name="Alt Bilgi">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 class="text-xl font-bold mb-4" data-gjs-editable="true">Şirket Adı</h3>
              <p class="opacity-80 mb-4" data-gjs-editable="true">
                Profesyonel hizmet anlayışımızla yanınızdayız.
              </p>
              <div class="flex gap-3">
                <a href="#" class="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                  <span>f</span>
                </a>
                <a href="#" class="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                  <span>t</span>
                </a>
                <a href="#" class="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors">
                  <span>in</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 class="font-semibold mb-4" data-gjs-editable="true">Hızlı Bağlantılar</h4>
              <ul class="space-y-2 opacity-80">
                <li><a href="#" class="hover:opacity-100">Ana Sayfa</a></li>
                <li><a href="#" class="hover:opacity-100">Hakkımızda</a></li>
                <li><a href="#" class="hover:opacity-100">Hizmetler</a></li>
                <li><a href="#" class="hover:opacity-100">İletişim</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-semibold mb-4" data-gjs-editable="true">Hizmetler</h4>
              <ul class="space-y-2 opacity-80">
                <li><a href="#" class="hover:opacity-100">Danışmanlık</a></li>
                <li><a href="#" class="hover:opacity-100">Tasarım</a></li>
                <li><a href="#" class="hover:opacity-100">Geliştirme</a></li>
                <li><a href="#" class="hover:opacity-100">Destek</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-semibold mb-4" data-gjs-editable="true">İletişim</h4>
              <ul class="space-y-2 opacity-80">
                <li data-gjs-editable="true">📍 Kadıköy, İstanbul</li>
                <li data-gjs-editable="true">📞 +90 (212) 555 00 00</li>
                <li data-gjs-editable="true">✉️ info@orneksite.com</li>
              </ul>
            </div>
          </div>
          
          <div class="pt-8 border-t border-background/10 text-center opacity-60">
            <p data-gjs-editable="true">© 2024 Şirket Adı. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    `,
    attributes: { class: 'fa fa-window-minimize' },
  });
}
