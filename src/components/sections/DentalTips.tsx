import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Droplets, Clock, Apple, ShieldCheck } from 'lucide-react';
import type { SectionComponentProps } from './types';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Droplets, Clock, Apple, ShieldCheck,
};

const defaultTips: any[] = [];

export function DentalTips({ section }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || '';
  const subtitle = p.subtitle || '';
  const tips = p.tips || defaultTips;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tips.length) return null;

  return (
    <section className="py-20 md:py-28 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 space-y-3"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">{subtitle}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 max-w-4xl mx-auto">
          {/* Tab buttons */}
          <div className="flex md:flex-col gap-2">
            {tips.map((tip: any, i: number) => {
              const Icon = iconMap[tip.icon] || Lightbulb;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeIndex === i
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card hover:bg-card/80 text-foreground border border-border'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{tip.title}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const Icon = iconMap[tips[activeIndex]?.icon] || Lightbulb;
                    return <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>;
                  })()}
                  <h3 className="text-xl font-heading font-semibold text-foreground">{tips[activeIndex]?.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{tips[activeIndex]?.content}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
