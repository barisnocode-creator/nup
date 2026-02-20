import { motion } from 'framer-motion';
import { Phone, MessageCircle, Clock, Shield, Award, HeadphonesIcon } from 'lucide-react';
import type { SectionComponentProps } from '../types';

export function CallUsSection({ section }: SectionComponentProps) {
  const {
    title = 'Uzman Ekibimizle Konuşun',
    subtitle = 'Sorularınızı yanıtlamak için buradayız. Sizi en kısa sürede arayalım.',
    phone = '+90 (212) 000 00 00',
    whatsapp = '905320000000',
    workingHours = 'Pzt–Cuma  09:00–18:00',
    workingHours2 = 'Cumartesi  10:00–14:00',
    ctaText = 'Hemen Arayın',
    whatsappText = 'WhatsApp\'tan Yazın',
    badge1 = '7/24 Acil Hat',
    badge2 = 'Hızlı Randevu',
    badge3 = 'Hızlı Dönüş',
  } = section.props;

  const phoneHref = `tel:${phone.replace(/\s|\(|\)|-/g, '')}`;
  const waHref = `https://wa.me/${whatsapp}`;

  return (
    <section className="py-16 px-4 bg-primary relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-foreground/20 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Top badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: HeadphonesIcon, label: badge1 },
            { icon: Award, label: badge2 },
            { icon: Shield, label: badge3 },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/15 border border-primary-foreground/25 text-primary-foreground text-xs font-medium backdrop-blur-sm">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left: Text + Phone icon */}
          <div className="flex items-start gap-5 lg:flex-1">
            {/* Animated phone icon */}
            <motion.div
              animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              className="shrink-0 w-16 h-16 rounded-2xl bg-primary-foreground/20 border border-primary-foreground/30 flex items-center justify-center shadow-lg"
            >
              <Phone className="w-8 h-8 text-primary-foreground" />
            </motion.div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground font-[family-name:var(--font-heading)] leading-tight">
                {title}
              </h2>
              <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base leading-relaxed max-w-md">
                {subtitle}
              </p>

              {/* Working hours */}
              <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary-foreground/75 text-sm">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{workingHours}</span>
                </div>
                {workingHours2 && (
                  <div className="flex items-center gap-2 text-primary-foreground/75 text-sm">
                    <Clock className="w-4 h-4 shrink-0 opacity-0" />
                    <span>{workingHours2}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: CTA buttons */}
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
            {/* Primary phone button */}
            <motion.a
              href={phoneHref}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-[var(--radius)] bg-primary-foreground text-primary font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Phone className="w-5 h-5" />
              </motion.div>
              <div className="text-left">
                <div className="text-xs font-normal opacity-70">{ctaText}</div>
                <div className="text-base font-bold leading-tight">{phone}</div>
              </div>
            </motion.a>

            {/* WhatsApp button */}
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-[var(--radius)] bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/25 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              {whatsappText}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
