import { motion } from 'framer-motion';
import { heroTitleSizeMap, resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function HeroOverlay({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const overlayOpacity = props.overlayOpacity ?? 60;

  return (
    <section
      className="relative min-h-[600px] flex items-center"
      style={{
        backgroundImage: props.backgroundImage
          ? `url(${props.backgroundImage})`
          : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />

      <div className={`relative container mx-auto px-6 ${s.sectionPadding}`}>
        <div className="max-w-2xl">
          {props.subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`inline-block px-4 py-2 bg-white/10 backdrop-blur text-white rounded-full text-sm font-medium mb-6 tracking-wider uppercase ${s.subtitleTransform}`}
            >
              {props.subtitle}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${s.titleSize(heroTitleSizeMap)} ${s.titleWeight} leading-tight text-white mb-6 text-${s.textAlign}`}
          >
            {props.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`${s.descSize} text-white/80 mb-10 max-w-xl`}
          >
            {props.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            {props.buttonText && (
              <a
                href={isEditing ? '#' : props.buttonLink}
                className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all duration-300 text-lg"
              >
                {props.buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
            {props.primaryButtonText && (
              <a
                href={isEditing ? '#' : props.primaryButtonLink}
                className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all duration-300 text-lg"
              >
                {props.primaryButtonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
            {props.secondaryButtonText && (
              <a
                href={isEditing ? '#' : props.secondaryButtonLink}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300 text-lg"
              >
                {props.secondaryButtonText}
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest uppercase text-white/50">Keşfedin</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
