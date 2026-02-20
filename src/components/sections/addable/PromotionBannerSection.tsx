import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Timer, Sparkles } from 'lucide-react';
import type { SectionComponentProps } from '../types';

function useCountdown(expiresAt?: string) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s, expired: false });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl sm:text-2xl font-black text-primary-foreground leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] text-primary-foreground/60 uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

export function PromotionBannerSection({ section }: SectionComponentProps) {
  const {
    emoji = '🎉',
    title = 'Özel Kampanya!',
    description = 'Sınırlı süre için özel fiyatlardan yararlanın. Hemen iletişime geçin.',
    buttonText = 'Fırsatı Kaçırma',
    buttonLink = '#',
    expiresAt = '',
    badgeText = 'Sınırlı Süre',
  } = section.props;

  const countdown = useCountdown(expiresAt || undefined);
  const showCountdown = !!expiresAt && !countdown.expired;

  return (
    <section className="py-12 px-4 bg-primary relative overflow-hidden">
      {/* Sparkle decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-4 left-[10%] opacity-20"
      >
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-4 right-[10%] opacity-20"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Text */}
          <div className="flex items-center gap-4 lg:flex-1">
            <span className="text-4xl sm:text-5xl">{emoji}</span>
            <div>
              {badgeText && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground px-2.5 py-0.5 rounded-full mb-2">
                  {badgeText}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-black text-primary-foreground font-[family-name:var(--font-heading)] leading-tight">
                {title}
              </h2>
              <p className="mt-1 text-primary-foreground/75 text-sm leading-relaxed max-w-sm">
                {description}
              </p>
            </div>
          </div>

          {/* Middle: Countdown */}
          {showCountdown && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-[var(--radius)] bg-primary-foreground/15 border border-primary-foreground/25">
              <Timer className="w-5 h-5 text-primary-foreground/70 shrink-0" />
              <div className="flex gap-3">
                <TimeUnit value={countdown.d} label="gün" />
                <div className="text-primary-foreground/50 text-xl font-bold self-start mt-0.5">:</div>
                <TimeUnit value={countdown.h} label="saat" />
                <div className="text-primary-foreground/50 text-xl font-bold self-start mt-0.5">:</div>
                <TimeUnit value={countdown.m} label="dak" />
                <div className="text-primary-foreground/50 text-xl font-bold self-start mt-0.5">:</div>
                <TimeUnit value={countdown.s} label="sn" />
              </div>
            </div>
          )}

          {/* Right: CTA button */}
          <motion.a
            href={buttonLink || '#'}
            onClick={buttonLink === '#' ? (e) => e.preventDefault() : undefined}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-[var(--radius)] bg-primary-foreground text-primary font-bold text-sm shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
