import { ArrowRight } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultPairs = [
  { before: '', after: '', label: 'Saç Bakımı Öncesi & Sonrası' },
  { before: '', after: '', label: 'Cilt Bakımı Öncesi & Sonrası' },
  { before: '', after: '', label: 'Fitness Dönüşümü' },
];

export function BeforeAfterSection({ section }: SectionComponentProps) {
  const { title = 'Önce & Sonra', pairs = defaultPairs } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(pairs as Array<{ before: string; after: string; label: string }>).map((pair, i) => (
            <div key={i} className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-sm">
              <div className="flex items-stretch h-48">
                <div className="flex-1 bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  {pair.before ? <img src={pair.before} alt="Önce" className="w-full h-full object-cover" /> : 'Önce'}
                </div>
                <div className="flex items-center px-1 bg-muted/30">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  {pair.after ? <img src={pair.after} alt="Sonra" className="w-full h-full object-cover" /> : 'Sonra'}
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="font-medium text-foreground text-sm">{pair.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
