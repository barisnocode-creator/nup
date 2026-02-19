import { motion } from 'framer-motion';
import type { SectionComponentProps } from './types';

export function ChefShowcase({ section }: SectionComponentProps) {
  const p = section.props;
  const subtitle = p.subtitle || 'Baş Şefimiz';
  const title = p.title || 'Chef Ahmet Yılmaz';
  const description = p.description || '15 yıllık deneyimiyle dünya mutfaklarını harmanlayan şefimiz, her tabağı bir sanat eserine dönüştürür.';
  const image = p.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80';
  const signatureDishes = p.signatureDishes || [
    { name: 'Truffle Risotto', description: 'İtalyan arborio pirinci, siyah trüf' },
    { name: 'Kuzu İncik', description: '12 saat pişirilmiş, kırmızı şarap soslu' },
    { name: 'Çikolata Fondü', description: 'Belçika çikolatası, vanilya dondurma' },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl border-2 border-primary/20" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body-dynamic">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground font-heading-dynamic">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-body-dynamic">{description}</p>

            <div className="pt-6 space-y-4">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-primary font-body-dynamic">İmza Yemekler</h3>
              {(signatureDishes as Array<{ name: string; description: string }>).map((dish, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-heading-dynamic">{dish.name}</p>
                    <p className="text-sm text-muted-foreground font-body-dynamic">{dish.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
