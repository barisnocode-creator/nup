import type { Editor } from 'grapesjs';

export function registerContactBlocks(editor: Editor) {
  const bm = editor.BlockManager;

  // Contact Form - Simple form layout
  bm.add('contact-form', {
    label: 'İletişim Formu',
    category: 'İletişim',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <line x1="6" y1="8" x2="18" y2="8"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
      <rect x="6" y="16" width="6" height="2" rx="1"/>
    </svg>`,
    content: `
      <section class="contact-form py-20 bg-muted/30" data-gjs-name="İletişim Formu">
        <div class="container mx-auto px-6">
          <div class="max-w-2xl mx-auto">
            <div class="text-center mb-12">
              <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">İletişim</span>
              <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
                Bize Ulaşın
              </h2>
              <p class="text-muted-foreground" data-gjs-editable="true">
                Sorularınız veya talepleriniz için bize mesaj gönderin.
              </p>
            </div>
            
            <form class="bg-background p-8 rounded-2xl shadow-sm border border-border">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2" data-gjs-editable="true">Adınız</label>
                  <input 
                    type="text" 
                    placeholder="Adınızı girin"
                    class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2" data-gjs-editable="true">Soyadınız</label>
                  <input 
                    type="text" 
                    placeholder="Soyadınızı girin"
                    class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-foreground mb-2" data-gjs-editable="true">E-posta</label>
                <input 
                  type="email" 
                  placeholder="ornek@email.com"
                  class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-foreground mb-2" data-gjs-editable="true">Telefon</label>
                <input 
                  type="tel" 
                  placeholder="0555 555 55 55"
                  class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div class="mb-6">
                <label class="block text-sm font-medium text-foreground mb-2" data-gjs-editable="true">Mesajınız</label>
                <textarea 
                  rows="5" 
                  placeholder="Mesajınızı buraya yazın..."
                  class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                class="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Mesaj Gönder
              </button>
            </form>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-envelope' },
  });

  // Contact Info - Contact details with icons
  bm.add('contact-info', {
    label: 'İletişim Bilgileri',
    category: 'İletişim',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/>
    </svg>`,
    content: `
      <section class="contact-info py-20" data-gjs-name="İletişim Bilgileri">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">İletişim</span>
              <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6" data-gjs-editable="true">
                Bizimle İletişime Geçin
              </h2>
              <p class="text-muted-foreground text-lg mb-8" data-gjs-editable="true">
                Sorularınız veya işbirliği teklifleriniz için bize ulaşabilirsiniz. En kısa sürede size dönüş yapacağız.
              </p>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4" data-gjs-name="İletişim Öğesi">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground" data-gjs-editable="true">Adres</h3>
                    <p class="text-muted-foreground" data-gjs-editable="true">
                      Örnek Mahallesi, Örnek Caddesi No: 123<br/>
                      Kadıköy, İstanbul 34000
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4" data-gjs-name="İletişim Öğesi">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">📞</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground" data-gjs-editable="true">Telefon</h3>
                    <p class="text-muted-foreground" data-gjs-editable="true">
                      +90 (212) 555 00 00<br/>
                      +90 (532) 555 00 00
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4" data-gjs-name="İletişim Öğesi">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground" data-gjs-editable="true">E-posta</h3>
                    <p class="text-muted-foreground" data-gjs-editable="true">
                      info@orneksite.com<br/>
                      destek@orneksite.com
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4" data-gjs-name="İletişim Öğesi">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-foreground" data-gjs-editable="true">Çalışma Saatleri</h3>
                    <p class="text-muted-foreground" data-gjs-editable="true">
                      Pazartesi - Cuma: 09:00 - 18:00<br/>
                      Cumartesi: 10:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="relative">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=500&fit=crop" 
                alt="Ofisimiz"
                class="rounded-2xl shadow-2xl w-full h-full object-cover min-h-[400px]"
                data-gjs-type="image"
              />
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-phone' },
  });

  // Contact with Map
  bm.add('contact-map', {
    label: 'İletişim (Haritalı)',
    category: 'İletişim',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 13 L12 17"/>
    </svg>`,
    content: `
      <section class="contact-map py-20 bg-muted/30" data-gjs-name="İletişim Haritalı">
        <div class="container mx-auto px-6">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4" data-gjs-editable="true">Konum</span>
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4" data-gjs-editable="true">
              Bizi Ziyaret Edin
            </h2>
            <p class="text-muted-foreground max-w-2xl mx-auto" data-gjs-editable="true">
              Ofisimize gelerek ekibimizle yüz yüze görüşebilirsiniz.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="rounded-2xl overflow-hidden shadow-lg h-[400px] bg-muted">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2755075671687!2d29.0280!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOcKwMDEnNDAuOCJF!5e0!3m2!1sen!2str!4v1234567890"
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy"
                  class="w-full h-full"
                ></iframe>
              </div>
            </div>
            
            <div class="bg-background p-8 rounded-2xl shadow-sm border border-border">
              <h3 class="text-xl font-bold mb-6 text-foreground" data-gjs-editable="true">İletişim Bilgileri</h3>
              
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="text-xl">📍</span>
                  <span class="text-muted-foreground" data-gjs-editable="true">Kadıköy, İstanbul</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xl">📞</span>
                  <span class="text-muted-foreground" data-gjs-editable="true">+90 (212) 555 00 00</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xl">✉️</span>
                  <span class="text-muted-foreground" data-gjs-editable="true">info@orneksite.com</span>
                </div>
              </div>
              
              <hr class="my-6 border-border" />
              
              <h4 class="font-semibold mb-4 text-foreground" data-gjs-editable="true">Çalışma Saatleri</h4>
              <div class="space-y-2 text-sm text-muted-foreground">
                <div class="flex justify-between">
                  <span data-gjs-editable="true">Pazartesi - Cuma</span>
                  <span data-gjs-editable="true">09:00 - 18:00</span>
                </div>
                <div class="flex justify-between">
                  <span data-gjs-editable="true">Cumartesi</span>
                  <span data-gjs-editable="true">10:00 - 14:00</span>
                </div>
                <div class="flex justify-between">
                  <span data-gjs-editable="true">Pazar</span>
                  <span data-gjs-editable="true">Kapalı</span>
                </div>
              </div>
              
              <button class="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Yol Tarifi Al
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: { class: 'fa fa-map-marker' },
  });
}
