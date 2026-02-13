interface PilatesFooterProps {
  siteName: string;
  tagline?: string;
}

export function PilatesFooter({ siteName, tagline }: PilatesFooterProps) {
  return (
    <footer className="bg-foreground py-16 border-t border-background/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <span className="font-serif text-xl text-background">{siteName}</span>
            </div>
            <p className="text-background/50 text-sm max-w-sm leading-relaxed">
              {tagline || 'Benzersiz stüdyomuzda hareketin en otantik halini deneyimleyin.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-background font-semibold text-sm uppercase tracking-wider mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              {['Hizmetler', 'Stüdyomuz', 'Ekibimiz', 'İletişim'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/50 text-sm hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-background font-semibold text-sm uppercase tracking-wider mb-4">Bizi Takip Edin</h4>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/50 hover:border-primary hover:text-primary transition-all text-xs"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/30 text-xs">
            © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-background/30 text-xs hover:text-background/60 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="text-background/30 text-xs hover:text-background/60 transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
