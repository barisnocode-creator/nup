import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CalendarDays, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SectionComponentProps } from './types';

const steps = [
  { icon: User, label: 'Kişisel Bilgi' },
  { icon: CalendarDays, label: 'Tarih & Saat' },
  { icon: CheckCircle2, label: 'Onay' },
];

export function DentalBooking({ section }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || 'Online Randevu';
  const subtitle = p.subtitle || 'Hemen Başlayın';
  const description = p.description || 'Birkaç adımda kolayca randevunuzu oluşturun.';
  const [step, setStep] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-background" id="appointment">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 space-y-3"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">{subtitle}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Kişisel Bilgileriniz</h3>
                  <Input placeholder="Ad Soyad" className="bg-background" />
                  <Input placeholder="Telefon" type="tel" className="bg-background" />
                  <Input placeholder="E-posta" type="email" className="bg-background" />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Tarih ve Saat Seçin</h3>
                  <Input type="date" className="bg-background" />
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                      <button key={t} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-primary hover:text-primary-foreground transition-colors text-foreground">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground">Randevunuz Hazır!</h3>
                  <p className="text-muted-foreground">Bilgilerinizi kontrol edip gönderin.</p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </Button>
                <Button
                  onClick={() => setStep(s => Math.min(2, s + 1))}
                  className="gap-2"
                >
                  {step === 2 ? 'Gönder' : 'İleri'} {step < 2 && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
