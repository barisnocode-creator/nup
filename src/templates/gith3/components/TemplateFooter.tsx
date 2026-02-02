import { Mail, ArrowUpRight } from 'lucide-react';

interface Gith3FooterProps {
  siteName: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export function Gith3Footer({ siteName, contactInfo }: Gith3FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-light tracking-widest uppercase mb-6">
              {siteName}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Minimalist tasarım ve yaratıcı çözümlerle markanızı öne çıkarıyoruz.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">
              Navigasyon
            </h4>
            <ul className="space-y-4">
              {['Çalışmalar', 'Hakkımda', 'İletişim'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">
              İletişim
            </h4>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-zinc-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
            >
              <Mail className="w-4 h-4" />
              {contactInfo.email}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} {siteName}
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'Dribbble'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-zinc-600 hover:text-white text-xs uppercase tracking-widest transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
