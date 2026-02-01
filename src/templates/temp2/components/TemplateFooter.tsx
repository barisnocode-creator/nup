interface BoldFooterProps {
  siteName: string;
  tagline: string;
}

export function BoldFooter({ siteName, tagline }: BoldFooterProps) {
  return (
    <footer className="py-16 border-t border-gray-800 bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Top section with logo and links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center">
              <span className="text-gray-950 font-black text-xl">
                {siteName.charAt(0)}
              </span>
            </div>
            <span className="text-xl font-black uppercase tracking-widest text-white">
              {siteName}
            </span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8">
            {['Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'Çalışmalar', 'İletişim'].map((item, index) => {
              const hrefs = ['home', 'about', 'services', 'gallery', 'contact'];
              return (
                <a
                  key={item}
                  href={`#${hrefs[index]}`}
                  className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-600 max-w-md">
            {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
