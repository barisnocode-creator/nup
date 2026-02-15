interface LawyerFooterProps {
  siteName: string;
  tagline?: string;
}

export function LawyerFooter({ siteName, tagline }: LawyerFooterProps) {
  return (
    <footer className="py-16 px-6" style={{ background: 'var(--lw-black)', borderTop: '1px solid var(--lw-gray-800)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--lw-white)', fontFamily: 'var(--font-heading)' }}>
              {siteName}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--lw-gray-500)' }}>
              {tagline || 'Adalet ve güven ile 30 yılı aşkın hukuki deneyim.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--lw-gray-400)' }}>
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2">
              {['Hakkımızda', 'Uygulama Alanları', 'Ekibimiz', 'SSS', 'İletişim'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--lw-gray-500)' }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--lw-gray-400)' }}>
              İletişim
            </h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--lw-gray-500)' }}>
              <p>📞 +90 212 555 0000</p>
              <p>📧 info@chambers.com.tr</p>
              <p>📍 Levent, İstanbul</p>
            </div>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid var(--lw-gray-800)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'var(--lw-gray-600)' }}>
              © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--lw-gray-600)' }}>Gizlilik Politikası</a>
              <a href="#" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--lw-gray-600)' }}>Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
