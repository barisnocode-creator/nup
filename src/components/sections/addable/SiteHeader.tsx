import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SiteSection } from '../types';

interface SiteHeaderProps {
  section: SiteSection;
  sections?: SiteSection[];
  isEditing?: boolean;
}

const sectionNavMap: Record<string, { label: string; anchor: string }> = {
  'ServicesGrid': { label: 'Hizmetler', anchor: 'services' },
  'services-grid': { label: 'Hizmetler', anchor: 'services' },
  'AboutSection': { label: 'Hakkımızda', anchor: 'about' },
  'about-section': { label: 'Hakkımızda', anchor: 'about' },
  'FAQAccordion': { label: 'SSS', anchor: 'faq' },
  'faq-accordion': { label: 'SSS', anchor: 'faq' },
  'AddableFAQ': { label: 'SSS', anchor: 'faq' },
  'ContactForm': { label: 'İletişim', anchor: 'contact' },
  'contact-form': { label: 'İletişim', anchor: 'contact' },
  'TestimonialsCarousel': { label: 'Yorumlar', anchor: 'testimonials' },
  'testimonials-carousel': { label: 'Yorumlar', anchor: 'testimonials' },
  'PricingTable': { label: 'Fiyatlar', anchor: 'pricing' },
  'pricing-table': { label: 'Fiyatlar', anchor: 'pricing' },
  'AppointmentBooking': { label: 'Randevu', anchor: 'appointment' },
  'appointment-booking': { label: 'Randevu', anchor: 'appointment' },
  'AddableAppointment': { label: 'Randevu', anchor: 'appointment' },
};

export function SiteHeader({ section, sections = [] }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const siteName = section.props?.siteName || section.props?.title || 'Site';
  const phone = section.props?.phone || '';
  const ctaLabel = section.props?.ctaLabel || 'Randevu Al';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Build nav items from existing sections
  const navItems = [
    { label: 'Ana Sayfa', anchor: 'hero' },
    ...sections
      .filter(s => sectionNavMap[s.type] && !s.type.toLowerCase().includes('hero') && !s.type.toLowerCase().includes('footer') && !s.type.toLowerCase().includes('header'))
      .reduce<{ label: string; anchor: string }[]>((acc, s) => {
        const item = sectionNavMap[s.type];
        if (item && !acc.find(a => a.anchor === item.anchor)) acc.push(item);
        return acc;
      }, [])
      .slice(0, 4),
  ];

  const handleAnchor = (anchor: string) => {
    setMobileOpen(false);
    const el = document.getElementById(anchor) || document.querySelector(`[data-section="${anchor}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: anchor === 'hero' ? 0 : 200, behavior: 'smooth' });
    }
  };

  const hasAppointment = sections.some(s =>
    ['AppointmentBooking', 'appointment-booking', 'AddableAppointment'].includes(s.type)
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => handleAnchor('hero')}
            className="font-bold text-lg text-foreground hover:text-primary transition-colors"
          >
            {siteName}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.anchor}
                onClick={() => handleAnchor(item.anchor)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {phone}
              </a>
            )}
            {hasAppointment && (
              <button
                onClick={() => handleAnchor('appointment')}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
              >
                {ctaLabel}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/98 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.anchor}
                onClick={() => handleAnchor(item.anchor)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
              >
                {item.label}
              </button>
            ))}
            {hasAppointment && (
              <button
                onClick={() => handleAnchor('appointment')}
                className="mt-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
