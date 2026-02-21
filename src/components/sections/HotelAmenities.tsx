import { motion } from 'framer-motion';
import { Waves, Sparkles, UtensilsCrossed, Dumbbell, Car, Wifi } from 'lucide-react';
import type { SectionComponentProps } from './types';

const iconMap: Record<string, React.ElementType> = {
  Waves, Sparkles, UtensilsCrossed, Dumbbell, Car, Wifi,
};

const defaultAmenities: any[] = [];

export function HotelAmenities({ section }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || '';
  const title = p.title || '';
  const amenities = (p.amenities as any[]) || defaultAmenities;

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body-dynamic">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 font-heading-dynamic">{title}</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {amenities.map((a, i) => {
            const Icon = iconMap[a.icon] || Sparkles;
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-heading-dynamic">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-body-dynamic">{a.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
