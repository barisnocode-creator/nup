import { Shield } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultInsurances = [
  { name: 'Anadolu Sigorta' }, { name: 'Allianz' }, { name: 'Axa Sigorta' },
  { name: 'Mapfre' }, { name: 'Acıbadem Sigorta' }, { name: 'Groupama' },
  { name: 'Sompo Japan' }, { name: 'HDI Sigorta' },
];

export function InsuranceSection({ section }: SectionComponentProps) {
  const { title = 'Anlaşmalı Sigorta Şirketleri', insurances = defaultInsurances } = section.props;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(insurances as Array<{ name: string; logo?: string }>).map((ins, i) => (
            <div key={i} className="bg-card border border-border rounded-[var(--radius)] p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              {ins.logo ? (
                <img src={ins.logo} alt={ins.name} className="h-10 object-contain" />
              ) : (
                <Shield className="w-8 h-8 text-primary/60" />
              )}
              <span className="text-sm font-medium text-foreground">{ins.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
