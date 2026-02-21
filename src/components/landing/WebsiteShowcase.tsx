import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import showcaseRestaurant from '@/assets/showcase-restaurant.jpg';
import showcaseLawOffice from '@/assets/showcase-law-office.jpg';
import showcaseDigitalAgency from '@/assets/showcase-digital-agency.jpg';
import showcaseBoutique from '@/assets/showcase-boutique.jpg';

const showcaseSites = [
  { title: 'Restoran & Kafe', description: 'Modern yeme-içme işletmesi sitesi', image: showcaseRestaurant },
  { title: 'Hukuk Bürosu', description: 'Profesyonel avukatlık web sitesi', image: showcaseLawOffice },
  { title: 'Dijital Ajans', description: 'Yaratıcı tasarım ajansı sitesi', image: showcaseDigitalAgency },
  { title: 'Butik Mağaza', description: 'Şık perakende mağaza sitesi', image: showcaseBoutique },
];

export function WebsiteShowcase() {
  return (
    <section id="showcase" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Örnekler</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4 text-foreground tracking-tight">
            AI ile oluşturulmuş web siteleri
          </h2>
          <p className="text-muted-foreground">Her sektöre özel profesyonel tasarımlar</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseSites.map((site, index) => (
            <motion.div
              key={site.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img src={site.image} alt={site.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{site.title}</h3>
                  <p className="text-sm text-muted-foreground">{site.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
