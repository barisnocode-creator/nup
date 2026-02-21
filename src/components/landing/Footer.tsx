import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-10 bg-foreground text-background/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <span className="text-lg font-extrabold text-background tracking-tight">
            N<span className="text-primary-foreground/60">Uppel</span>
          </span>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-background transition-colors">Ana Sayfa</Link>
            <Link to="/dashboard" className="hover:text-background transition-colors">Dashboard</Link>
            <span className="text-background/40">Gizlilik</span>
            <span className="text-background/40">Kullanım Şartları</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} NUppel. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
