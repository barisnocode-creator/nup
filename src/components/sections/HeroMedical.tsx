import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ImageIcon, CheckCircle2 } from 'lucide-react';
import { PixabayImagePicker } from './PixabayImagePicker';
import { getSectorImageQuery } from './sectorImageQueries';
import type { SectionComponentProps } from './types';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' as const },
});

export function HeroMedical({ section, isEditing, onUpdate }: SectionComponentProps) {
  const p = section.props;
  const sector = p._sector || 'doctor';

  const badge = p.badge || 'Uzman Klinik';
  const title = p.title || 'Sağlığınız İçin Profesyonel Bakım';
  const description = p.description || 'Deneyimli uzman kadromuz ve modern teknolojimizle, güvenilir ve konforlu sağlık hizmetleri sunuyoruz. Her hastaya özel tedavi yaklaşımı.';
  const primaryButtonText = p.primaryButtonText || 'Randevu Al';
  const primaryButtonLink = p.primaryButtonLink || '#appointment';
  const secondaryButtonText = p.secondaryButtonText || 'Hizmetlerimiz';
  const secondaryButtonLink = p.secondaryButtonLink || '#services';
  const image = p.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80';
  const floatingBadge = p.floatingBadge || 'Ücretsiz İlk Muayene';

  const stat1Value = p.stat1Value || '12K+';
  const stat1Label = p.stat1Label || 'Mutlu Hasta';
  const stat2Value = p.stat2Value || '%95';
  const stat2Label = p.stat2Label || 'Memnuniyet';
  const stat3Value = p.stat3Value || '20+';
  const stat3Label = p.stat3Label || 'Yıl Deneyim';

  const features = p.features || [
    'Modern Ekipman',
    'Uzman Kadro',
    '7/24 Destek',
  ];

  const [pickerOpen, setPickerOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: stat1Value, label: stat1Label },
    { value: stat2Value, label: stat2Label },
    { value: stat3Value, label: stat3Label },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-border/40 to-transparent -translate-x-1/2 hidden lg:block" />
      </div>

      <div className="relative container mx-auto px-6 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left Column ── */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide font-body-dynamic">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {badge}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              {...fadeUp(0.15)}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground font-heading-dynamic"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg font-body-dynamic"
            >
              {description}
            </motion.p>

            {/* Feature checklist */}
            {Array.isArray(features) && features.length > 0 && (
              <motion.ul {...fadeUp(0.4)} className="space-y-2">
                {features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-foreground font-body-dynamic">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Buttons */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-4">
              {primaryButtonText && (
                <a
                  href={isEditing ? '#' : primaryButtonLink}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 font-body-dynamic"
                >
                  {primaryButtonText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href={isEditing ? '#' : secondaryButtonLink}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold text-base hover:bg-muted transition-all duration-300 font-body-dynamic"
                >
                  {secondaryButtonText}
                </a>
              )}
            </motion.div>

            {/* Stats */}
            <div ref={statsRef} className="pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={statsVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.12, ease: 'easeOut' }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary font-heading-dynamic">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-body-dynamic">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column — Image ── */}
          <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            {/* Decorative ring */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-primary/5 rounded-[2.5rem] blur-2xl" />

            {/* Image container */}
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-[3/4] ${isEditing ? 'group' : ''}`}>
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Edit button — top right corner */}
              {isEditing && (
                <button
                  onClick={() => setPickerOpen(true)}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white hover:shadow-md transition-all backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Görseli Değiştir
                </button>
              )}

              {/* Floating badge — top left */}
              {floatingBadge && (
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute top-5 left-5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/30 font-body-dynamic"
                >
                  {floatingBadge}
                </motion.div>
              )}
            </div>

            {/* Floating stat card — bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -bottom-6 -right-4 lg:-right-8 bg-card border border-border rounded-2xl p-4 shadow-xl shadow-black/10 min-w-[160px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground font-heading-dynamic">4.9/5</div>
                  <div className="text-xs text-muted-foreground font-body-dynamic">Hasta Puanı</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative dot grid */}
            <div className="absolute -top-6 -left-6 w-24 h-24 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '8px 8px',
            }} />
          </motion.div>
        </div>
      </div>

      {/* Pixabay picker */}
      {isEditing && (
        <PixabayImagePicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => { onUpdate?.({ image: url }); setPickerOpen(false); }}
          defaultQuery={getSectorImageQuery('hero', sector)}
        />
      )}
    </section>
  );
}
