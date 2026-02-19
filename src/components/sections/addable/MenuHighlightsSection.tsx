import { UtensilsCrossed } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultItems = [
  { name: 'Özel Kahvaltı Tabağı', description: 'Taze peynirler, zeytin, bal, kaymak ve simit', price: '₺180' },
  { name: 'Izgara Levrek', description: 'Mevsim sebzeleri ve tereyağı sos eşliğinde', price: '₺320' },
  { name: 'Künefe', description: 'Antep fıstığı ile servis edilen sıcak künefe', price: '₺120' },
  { name: 'Türk Kahvesi', description: 'Geleneksel yöntemle pişirilen Türk kahvesi', price: '₺60' },
];

export function MenuHighlightsSection({ section }: SectionComponentProps) {
  const { title = 'Öne Çıkan Lezzetler', items = defaultItems } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(items as Array<{ name: string; description: string; price: string; image?: string }>).map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-[var(--radius)] p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-8 h-8 text-primary/60" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-primary font-bold whitespace-nowrap">{item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
