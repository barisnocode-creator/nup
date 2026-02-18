import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

/**
 * Menu/Showcase section — displays cafe menu items in an elegant grid
 * Matches pencil.dev cafe design language
 */
export function MenuShowcase({ section, isEditing }: SectionComponentProps) {
  const { props } = section;

  const items = props.items || [
    { name: 'Espresso', description: 'Rich, bold, and full-bodied', price: '₺45', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80', category: 'Coffee' },
    { name: 'Cappuccino', description: 'Perfectly steamed milk and espresso', price: '₺55', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', category: 'Coffee' },
    { name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: '₺65', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80', category: 'Specialty' },
    { name: 'Croissant', description: 'Freshly baked, buttery layers', price: '₺40', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80', category: 'Pastry' },
    { name: 'Pour Over', description: 'Single-origin, hand-poured', price: '₺70', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', category: 'Coffee' },
    { name: 'Sourdough Toast', description: 'With avocado and microgreens', price: '₺75', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', category: 'Food' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#F5EDE4]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          {props.subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C65D3E] text-sm font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {props.subtitle}
            </motion.span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {props.title || "Our Menu"}
          </motion.h2>
          {props.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#6B5B50] max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {props.description}
            </motion.p>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#C65D3E] tracking-wide uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</h3>
                  <span className="text-[#C65D3E] font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-[#6B5B50] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
