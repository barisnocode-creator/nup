interface NaturalFooterProps {
  siteName: string;
  tagline?: string;
}

export function NaturalFooter({ siteName, tagline }: NaturalFooterProps) {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Keşfet</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#articles" className="hover:text-accent transition-colors">Makaleler</a></li>
              <li><a href="#about" className="hover:text-accent transition-colors">Hakkımızda</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#contact" className="hover:text-accent transition-colors">Bize Ulaşın</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Takip Et</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Facebook</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
