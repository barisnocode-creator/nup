import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function PricingTable({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const plans = [
    { name: props.plan1Name, price: props.plan1Price, period: props.plan1Period, features: props.plan1Features, buttonText: props.plan1ButtonText, popular: props.plan1Popular },
    { name: props.plan2Name, price: props.plan2Price, period: props.plan2Period, features: props.plan2Features, buttonText: props.plan2ButtonText, popular: props.plan2Popular },
    { name: props.plan3Name, price: props.plan3Price, period: props.plan3Period, features: props.plan3Features, buttonText: props.plan3ButtonText, popular: props.plan3Popular },
  ].filter(p => p.name && p.price);

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        {(props.title || props.subtitle) && (
          <div className={`text-${s.textAlign} mb-12`}>
            {props.subtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>{props.subtitle}</span>}
            {props.title && <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>{props.title}</h2>}
          </div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-${plans.length} gap-8 max-w-5xl mx-auto`}>
          {plans.map((plan, index) => {
            const featureList = plan.features ? plan.features.split('\n').filter((f: string) => f.trim()) : [];
            return (
              <div key={index} className={`relative rounded-2xl p-8 ${plan.popular ? 'bg-primary text-primary-foreground shadow-2xl scale-105' : 'bg-card text-card-foreground shadow-lg'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">Popüler</span></div>}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className={plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {featureList.map((feature: string, fIndex: number) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className={plan.popular ? '' : 'text-muted-foreground'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href={isEditing ? "#" : "#contact"} className={`block w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${plan.popular ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>{plan.buttonText || "Başla"}</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
