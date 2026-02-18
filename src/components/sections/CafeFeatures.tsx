import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

/**
 * Cafe Features section — icon-based feature highlights
 * Matches pencil.dev cafe warmth and styling
 */
export function CafeFeatures({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  const features = props.features || [
    { icon: '☕', title: 'Single Origin', description: 'Ethically sourced beans from around the world' },
    { icon: '🌿', title: 'Organic', description: 'All our ingredients are 100% organic and fresh' },
    { icon: '🎨', title: 'Latte Art', description: 'Each cup is a work of art crafted by our baristas' },
    { icon: '🏠', title: 'Cozy Space', description: 'A warm atmosphere to work, read, or simply relax' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#2C1810]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C65D3E] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          >
            {props.subtitle || "Why Choose Us"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {props.title || "Crafted With Care"}
          </motion.h2>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C65D3E]/20 flex items-center justify-center text-3xl group-hover:bg-[#C65D3E]/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
