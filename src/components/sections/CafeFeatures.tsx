import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

export function CafeFeatures({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  const features = props.features || [];

  if (!features.length) return null;

  return (
    <section className="py-24 lg:py-32 bg-foreground">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          {(props.subtitle) && (
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-body-dynamic">
              {props.subtitle}
            </motion.span>
          )}
          {(props.title) && (
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-background font-heading-dynamic">
              {props.title}
            </motion.h2>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl group-hover:bg-primary/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-background mb-3 font-heading-dynamic">{feature.title}</h3>
              <p className="text-background/60 text-sm leading-relaxed font-body-dynamic">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
