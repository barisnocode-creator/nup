import { UserCircle, FileEdit, Rocket } from 'lucide-react';

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
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium mb-4 text-foreground">
            Nasıl Çalışır?
          </h2>
          <p className="text-muted-foreground text-lg">
            3 basit adımda profesyonel web sitenize kavuşun
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.step}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {step.step}
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
