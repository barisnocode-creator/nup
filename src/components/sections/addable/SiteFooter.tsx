import { Phone, Mail, MapPin } from 'lucide-react';
import type { SiteSection } from '../types';

interface SiteFooterProps {
  section: SiteSection;
  sections?: SiteSection[];
  isEditing?: boolean;
}

const sectionNavMap: { types: string[]; label: string }[] = [
  { types: ['about-section', 'AboutSection'], label: 'Hakkımızda' },
  { types: ['services-grid', 'ServicesGrid', 'DentalServices', 'dental-services'], label: 'Hizmetler' },
  { types: ['contact-form', 'ContactForm'], label: 'İletişim' },
  { types: ['faq-accordion', 'AddableFAQ'], label: 'Sık Sorulan Sorular' },
  { types: ['AddableBlog'], label: 'Blog' },
  { types: ['appointment-booking', 'AddableAppointment', 'DentalBooking', 'dental-booking'], label: 'Randevu' },
  { types: ['pricing-table', 'PricingTable'], label: 'Fiyatlar' },
  { types: ['image-gallery', 'ImageGallery', 'CafeGallery', 'cafe-gallery'], label: 'Galeri' },
];

export function SiteFooter({ section, sections = [] }: SiteFooterProps) {
  const p = section.props || {};

  // Auto-extract data from other sections
  const heroSection = sections.find(s => s.type.toLowerCase().includes('hero'));
  const contactSection = sections.find(s => s.type.toLowerCase().includes('contact'));
  const servicesSection = sections.find(s =>
    s.type.includes('services') || s.type.includes('Services') ||
    s.type.includes('DentalServices') || s.type.includes('dental-services')
  );

  const siteName = p.siteName || heroSection?.props?.siteName || heroSection?.props?.title || 'Site Adı';
  const tagline = p.tagline || heroSection?.props?.subtitle || heroSection?.props?.tagline || '';
  const phone = p.phone || contactSection?.props?.phone || heroSection?.props?.phone || '';
  const email = p.email || contactSection?.props?.email || '';
  const address = p.address || contactSection?.props?.address || '';

  // Services from props or services section
  const services: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const key = `service${i}`;
    const val = p[key] || servicesSection?.props?.[key] || servicesSection?.props?.services?.[i - 1]?.title;
    if (val) services.push(val);
  }

  // Dynamic nav links based on active sections
  const navLinks: string[] = ['Ana Sayfa'];
  sectionNavMap.forEach(({ types, label }) => {
    if (sections.some(s => types.includes(s.type))) {
      navLinks.push(label);
    }
  });

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-xl font-bold mb-2">{siteName}</h3>
            {tagline && <p className="text-blue-400 text-sm mb-3 font-medium">{tagline}</p>}
            <p className="text-gray-400 text-sm leading-relaxed">
              Profesyonel hizmetlerimizle yanınızdayız. Kaliteli ve güvenilir çözümler sunmak için çalışıyoruz.
            </p>
          </div>

          {/* Site Map Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Site Haritası</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link}>
                  <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-default">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hizmetlerimiz</h4>
            {services.length > 0 ? (
              <ul className="space-y-2">
                {services.slice(0, 4).map((service, i) => (
                  <li key={i}>
                    <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-default">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {['Hizmet 1', 'Hizmet 2', 'Hizmet 3', 'Hizmet 4'].map((s) => (
                  <li key={s}>
                    <span className="text-gray-500 text-sm italic">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-3">
              {phone ? (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">{phone}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm italic">Telefon girilmemiş</span>
                </li>
              )}
              {email ? (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm break-all">{email}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm italic">E-posta girilmemiş</span>
                </li>
              )}
              {address ? (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">{address}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm italic">Adres girilmemiş</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {year} {siteName}. Tüm hakları saklıdır.
          </p>
          <p className="text-gray-600 text-xs">
            Powered by <span className="text-gray-500">Open Lucius</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
