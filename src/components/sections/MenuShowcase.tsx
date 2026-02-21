import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

export function MenuShowcase({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  const items = props.items || [];

  if (!items.length) return null;

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          {props.subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-body-dynamic"
            >
              {props.subtitle}
            </motion.span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading-dynamic"
          >
            {props.title || ''}
          </motion.h2>
          {props.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto font-body-dynamic"
            >
              {props.description}
            </motion.p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary tracking-wide uppercase font-body-dynamic">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground font-heading-dynamic">{item.name}</h3>
                  <span className="text-primary font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-muted-foreground text-sm font-body-dynamic">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
