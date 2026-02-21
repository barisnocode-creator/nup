import { motion } from 'framer-motion';
import { Smile, Sparkles, ScanLine, Shield, Heart, Stethoscope } from 'lucide-react';
import type { SectionComponentProps } from './types';

const iconMap: Record<string, React.ElementType> = {
  Smile, Sparkles, ScanLine, Shield, Heart, Stethoscope,
};

const defaultServices: any[] = [];

export function DentalServices({ section }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || '';
  const subtitle = p.subtitle || '';
  const description = p.description || '';
  const services = p.services || defaultServices;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-3"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">{subtitle}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((svc: any, i: number) => {
            const Icon = iconMap[svc.icon] || Heart;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{svc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
