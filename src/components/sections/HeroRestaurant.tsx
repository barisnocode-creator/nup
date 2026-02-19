import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

export function HeroRestaurant({ section, isEditing }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || 'Lezzetin Sanatla Buluştuğu Yer';
  const description = p.description || 'Şefimizin özenle hazırladığı menümüzle unutulmaz bir gastronomi deneyimi yaşayın.';
  const badge = p.badge || '★ Fine Dining';
  const primaryBtn = p.primaryButtonText || 'Rezervasyon';
  const secondaryBtn = p.secondaryButtonText || 'Menü';
  const image = p.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block px-5 py-2 text-sm font-medium tracking-[0.2em] uppercase text-primary border border-primary/40 rounded-full mb-8 font-body-dynamic"
        >
          {badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight font-heading-dynamic mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-body-dynamic mb-10"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href={isEditing ? '#' : (p.primaryButtonLink || '#reservation')}
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body-dynamic"
          >
            {primaryBtn}
          </a>
          <a
            href={isEditing ? '#' : (p.secondaryButtonLink || '#menu')}
            className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 font-body-dynamic"
          >
            {secondaryBtn}
          </a>
        </motion.div>

        {/* Info strip */}
        {p.infoItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {(p.infoItems as string[]).map((item: string, i: number) => (
              <span key={i} className="text-white/50 text-sm font-medium tracking-widest uppercase font-body-dynamic">{item}</span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
