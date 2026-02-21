import { UserCircle, FileEdit, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: UserCircle,
    step: '1',
    title: 'İşletmenizi Tanıtın',
    description: 'AI ile kısa bir sohbet yapın, işletmenizi tanıyalım.',
  },
  {
    icon: FileEdit,
    step: '2',
    title: 'Bilgilerinizi Girin',
    description: 'İsim, adres, hizmetler ve çalışma saatlerinizi paylaşın.',
  },
  {
    icon: Rocket,
    step: '3',
    title: 'Yayına Alın',
    description: 'AI sitenizi oluşturur, siz onaylayın ve anında yayına alın.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Nasıl Çalışır</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4 text-foreground tracking-tight">
            3 adımda web siteniz hazır
          </h2>
          <p className="text-muted-foreground text-lg">
            Basit adımlarla profesyonel web sitenize kavuşun
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
