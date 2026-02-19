import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionComponentProps } from './types';

const defaultCategories = [
  {
    name: 'Başlangıçlar',
    items: [
      { name: 'Ahtapot Salatası', description: 'Izgara ahtapot, roka, nar ekşili sos', price: '₺180', image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&q=80' },
      { name: 'Humus Tabağı', description: 'Tahin, zeytinyağı, baharat', price: '₺95', image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&q=80' },
    ],
  },
  {
    name: 'Ana Yemekler',
    items: [
      { name: 'Kuzu Pirzola', description: 'Biberiye, sarımsak, mevsim sebzeleri', price: '₺380', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
      { name: 'Somon Fileto', description: 'Teriyaki sos, jasmine pirinç', price: '₺320', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
    ],
  },
  {
    name: 'Tatlılar',
    items: [
      { name: 'Lava Kek', description: 'Sıcak çikolata, vanilya dondurma', price: '₺120', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80' },
      { name: 'Künefe', description: 'Fıstıklı, şerbetli', price: '₺110', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80' },
    ],
  },
];

export function RestaurantMenu({ section }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || 'Menümüz';
  const title = p.title || 'Lezzetli Seçimler';
  const categories = (p.categories as typeof defaultCategories) || defaultCategories;
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body-dynamic">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 font-heading-dynamic">{title}</h2>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActive(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-body-dynamic ${
                active === i
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {categories[active]?.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-foreground font-heading-dynamic">{item.name}</h3>
                    <span className="text-primary font-bold font-heading-dynamic ml-2 flex-shrink-0">{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 font-body-dynamic">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
