import { Video, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SectionComponentProps } from '../types';

export function OnlineConsultationSection({ section }: SectionComponentProps) {
  const {
    title = 'Online Konsültasyon',
    description = 'Evinizden çıkmadan, görüntülü görüşme ile uzman hekimlerimizden danışmanlık alın.',
    buttonText = 'Online Randevu Al',
    features = ['Görüntülü görüşme', 'Reçete yazılabilir', '7/24 destek', 'Güvenli bağlantı'],
  } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-[var(--radius)] p-10 flex flex-col md:flex-row gap-8 items-center shadow-sm">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">{title}</h2>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(features as string[]).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{buttonText}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
