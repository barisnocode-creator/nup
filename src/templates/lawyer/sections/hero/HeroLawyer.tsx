import { motion } from 'framer-motion';

interface HeroLawyerProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function HeroLawyer({
  title,
  subtitle,
  description,
  heroImage,
}: HeroLawyerProps) {
  const bgImage = heroImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm tracking-[0.3em] uppercase mb-6"
          style={{ color: 'var(--lw-gray-300)', fontFamily: 'var(--font-body)' }}
        >
          {subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
          style={{ color: 'var(--lw-white)', fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--lw-gray-300)', fontFamily: 'var(--font-body)' }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#contact"
            className="px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-colors"
            style={{
              background: 'var(--lw-white)',
              color: 'var(--lw-black)',
            }}
          >
            İletişime Geçin
          </a>
          <a
            href="#practice"
            className="px-8 py-4 text-sm font-semibold tracking-wider uppercase border transition-colors hover:bg-white/10"
            style={{
              borderColor: 'var(--lw-white)',
              color: 'var(--lw-white)',
            }}
          >
            Uygulama Alanları
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="lawyer-scroll-indicator absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--lw-gray-400)' }}>
          Keşfedin
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lw-gray-400)" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
