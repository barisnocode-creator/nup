import { motion } from 'framer-motion';
import { Star, TrendingUp, Users } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultPlatforms = [
  { name: 'Google', emoji: '🔍', stars: 4.9, count: 248 },
  { name: 'Facebook', emoji: '📘', stars: 4.8, count: 134 },
  { name: 'Trustpilot', emoji: '⭐', stars: 4.9, count: 89 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <span key={i} className={`text-sm ${filled ? 'text-yellow-400' : partial ? 'text-yellow-300' : 'text-muted-foreground/30'}`}>★</span>
        );
      })}
    </div>
  );
}

export function SocialProofSection({ section }: SectionComponentProps) {
  const {
    title = 'Müşterilerimiz Bizi Seviyor',
    subtitle = 'Binlerce memnun müşterimizin güveniyle hizmet veriyoruz.',
    rating = 4.9,
    reviewCount = 471,
    platforms = defaultPlatforms,
    badge = 'Doğrulanmış Yorumlar',
  } = section.props;

  const parsedPlatforms = Array.isArray(platforms) ? platforms : defaultPlatforms;

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Big rating display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10"
        >
          <div className="text-center">
            <div className="text-7xl font-black text-foreground leading-none">{rating}</div>
            <div className="mt-2 flex justify-center">
              <StarRating rating={rating} />
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              {reviewCount.toLocaleString('tr-TR')} değerlendirme
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-24 bg-border" />

          {/* Platform breakdown */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {parsedPlatforms.map((p) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3 rounded-[var(--radius)] border border-border bg-card hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl leading-none">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="text-sm font-bold text-foreground">{p.stars}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <StarRating rating={p.stars} />
                    <span className="text-xs text-muted-foreground">{p.count} yorum</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom trust row */}
        <div className="flex flex-wrap justify-center gap-6 text-center">
          {[
            { icon: '✅', label: 'Doğrulanmış Yorumlar' },
            { icon: '🏆', label: 'Sektör Lideri' },
            { icon: '💬', label: '5 Yıldızlı Hizmet' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
