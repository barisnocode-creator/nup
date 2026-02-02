import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface PricingSectionProps {
  services: Service[];
  isDark: boolean;
  isEditable?: boolean;
}

export function PricingSection({ services, isDark, isEditable }: PricingSectionProps) {
  // Convert services to pricing plans
  const plans = [
    {
      name: 'Başlangıç',
      price: 'Ücretsiz',
      description: 'Küçük projeler için ideal başlangıç',
      features: services.slice(0, 3).map(s => s.title),
      highlighted: false,
      cta: 'Ücretsiz Başla',
    },
    {
      name: 'Profesyonel',
      price: '₺299',
      period: '/ay',
      description: 'Büyüyen işletmeler için tam özellik',
      features: services.map(s => s.title),
      highlighted: true,
      cta: 'Hemen Başla',
      badge: 'Popüler',
    },
    {
      name: 'Kurumsal',
      price: 'Özel',
      description: 'Büyük ekipler için özelleştirilmiş çözüm',
      features: [...services.map(s => s.title), 'Öncelikli Destek', 'Özel Entegrasyonlar'],
      highlighted: false,
      cta: 'İletişime Geç',
    },
  ];

  return (
    <section className="py-20" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Fiyatlandırma
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Basit ve Şeffaf Fiyatlandırma
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            İhtiyacınıza uygun planı seçin. İstediğiniz zaman yükseltin veya iptal edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/25 scale-105 z-10'
                  : 'bg-background border hover:border-primary/30 hover:shadow-lg transition-all'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={`${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/90' : ''}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full ${
                  plan.highlighted
                    ? 'bg-background text-foreground hover:bg-background/90'
                    : ''
                }`}
                variant={plan.highlighted ? 'secondary' : 'default'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
