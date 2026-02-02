import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface Gith2FooterProps {
  siteName: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
}

export function Gith2Footer({ siteName, contactInfo }: Gith2FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {siteName.charAt(0)}
                </span>
              </div>
              <span className="font-bold text-xl">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Profesyonel hizmet anlayışımızla sizlere en iyi deneyimi sunmak için buradayız.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {['Hizmetler', 'Hakkımızda', 'Blog', 'SSS'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-3">
              {['Danışmanlık', 'Planlama', 'Uygulama', 'Destek'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                <a href={`tel:${contactInfo.phone}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                <a href={`mailto:${contactInfo.email}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-slate-400 text-sm">{contactInfo.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-slate-400 text-sm">{contactInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">
              Kullanım Şartları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
