import { Clock, MapPin } from 'lucide-react';
import type { SectionComponentProps } from '../types';

const defaultHours = [
  { day: 'Pazartesi', open: '09:00', close: '18:00' },
  { day: 'Salı', open: '09:00', close: '18:00' },
  { day: 'Çarşamba', open: '09:00', close: '18:00' },
  { day: 'Perşembe', open: '09:00', close: '18:00' },
  { day: 'Cuma', open: '09:00', close: '18:00' },
  { day: 'Cumartesi', open: '09:00', close: '14:00' },
  { day: 'Pazar', open: '', close: '', closed: true },
];

export function WorkingHoursMapSection({ section }: SectionComponentProps) {
  const {
    title = 'Çalışma Saatleri & Konum',
    hours = defaultHours,
    address = 'İstanbul, Türkiye',
    mapEmbedUrl,
  } = section.props;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground font-[family-name:var(--font-heading)] mb-10">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hours */}
          <div className="bg-card border border-border rounded-[var(--radius)] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Çalışma Saatleri</h3>
            </div>
            <div className="space-y-3">
              {(hours as Array<{ day: string; open: string; close: string; closed?: boolean }>).map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground">{h.day}</span>
                  <span className={h.closed ? 'text-destructive' : 'text-muted-foreground'}>
                    {h.closed ? 'Kapalı' : `${h.open} - ${h.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Map */}
          <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-sm">
            {mapEmbedUrl ? (
              <iframe src={mapEmbedUrl} className="w-full h-full min-h-[350px]" loading="lazy" title="Konum" />
            ) : (
              <div className="w-full h-full min-h-[350px] bg-muted/50 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <MapPin className="w-10 h-10" />
                <p className="text-sm font-medium">{address}</p>
                <p className="text-xs">Harita URL&apos;si ekleyerek konumunuzu gösterin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
