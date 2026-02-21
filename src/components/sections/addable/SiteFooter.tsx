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

  const siteName = p.siteName || heroSection?.props?.siteName || heroSection?.props?.title || heroSection?.props?.badge || 'Site Adı';
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
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-background text-xl font-bold mb-2 font-heading-dynamic">{siteName}</h3>
            {tagline && <p className="text-primary/80 text-sm mb-3 font-medium">{tagline}</p>}
            {(p.description) && (
              <p className="text-background/60 text-sm leading-relaxed font-body-dynamic">
                {p.description}
              </p>
            )}
          </div>

          {/* Site Map Column */}
          <div>
            <h4 className="text-background font-semibold mb-4 text-sm uppercase tracking-wider">Site Haritası</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link}>
                  <span className="text-background/60 hover:text-background text-sm transition-colors cursor-default font-body-dynamic">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-background font-semibold mb-4 text-sm uppercase tracking-wider">Hizmetlerimiz</h4>
            {services.length > 0 ? (
              <ul className="space-y-2">
                {services.slice(0, 4).map((service, i) => (
                  <li key={i}>
                    <span className="text-background/60 hover:text-background text-sm transition-colors cursor-default font-body-dynamic">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {['Hizmet 1', 'Hizmet 2', 'Hizmet 3', 'Hizmet 4'].map((s) => (
                  <li key={s}>
                    <span className="text-background/40 text-sm italic">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-background font-semibold mb-4 text-sm uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-3">
              {phone ? (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-background/70 text-sm font-body-dynamic">{phone}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-background/30 mt-0.5 flex-shrink-0" />
                  <span className="text-background/30 text-sm italic">Telefon girilmemiş</span>
                </li>
              )}
              {email ? (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-background/70 text-sm break-all font-body-dynamic">{email}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-background/30 mt-0.5 flex-shrink-0" />
                  <span className="text-background/30 text-sm italic">E-posta girilmemiş</span>
                </li>
              )}
              {address ? (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-background/70 text-sm font-body-dynamic">{address}</span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-background/30 mt-0.5 flex-shrink-0" />
                  <span className="text-background/30 text-sm italic">Adres girilmemiş</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-background/40 text-xs font-body-dynamic">
            © {year} {siteName}. Tüm hakları saklıdır.
          </p>
          <p className="text-background/30 text-xs">
            Powered by <span className="text-background/50">Open Lucius</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
