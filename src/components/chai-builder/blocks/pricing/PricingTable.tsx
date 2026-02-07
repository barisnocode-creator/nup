import { 
  registerChaiBlock,
  StylesProp,
  builderProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";

export type PricingTableProps = {
  styles: ChaiStyles;
  title: string;
  subtitle: string;
  
  // Plan 1
  plan1Name: string;
  plan1Price: string;
  plan1Period: string;
  plan1Features: string;
  plan1ButtonText: string;
  plan1Popular: boolean;
  
  // Plan 2
  plan2Name: string;
  plan2Price: string;
  plan2Period: string;
  plan2Features: string;
  plan2ButtonText: string;
  plan2Popular: boolean;
  
  // Plan 3
  plan3Name: string;
  plan3Price: string;
  plan3Period: string;
  plan3Features: string;
  plan3ButtonText: string;
  plan3Popular: boolean;
};

const PricingTableBlock = (props: ChaiBlockComponentProps<PricingTableProps>) => {
  const { 
    blockProps, 
    title,
    subtitle,
    plan1Name, plan1Price, plan1Period, plan1Features, plan1ButtonText, plan1Popular,
    plan2Name, plan2Price, plan2Period, plan2Features, plan2ButtonText, plan2Popular,
    plan3Name, plan3Price, plan3Period, plan3Features, plan3ButtonText, plan3Popular,
    inBuilder,
  } = props;

  const plans = [
    { name: plan1Name, price: plan1Price, period: plan1Period, features: plan1Features, buttonText: plan1ButtonText, popular: plan1Popular },
    { name: plan2Name, price: plan2Price, period: plan2Period, features: plan2Features, buttonText: plan2ButtonText, popular: plan2Popular },
    { name: plan3Name, price: plan3Price, period: plan3Period, features: plan3Features, buttonText: plan3ButtonText, popular: plan3Popular },
  ].filter(p => p.name && p.price);

  return (
    <section 
      {...blockProps} 
      className="py-20 bg-secondary/30"
    >
      <div className="container mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-${plans.length} gap-8 max-w-5xl mx-auto`}>
          {plans.map((plan, index) => {
            const featureList = plan.features ? plan.features.split('\n').filter(f => f.trim()) : [];
            
            return (
              <div 
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-primary text-primary-foreground shadow-2xl scale-105' 
                    : 'bg-card text-card-foreground shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Popüler
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className={plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {featureList.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <svg 
                        className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.popular ? '' : 'text-muted-foreground'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={inBuilder ? "#" : "#contact"}
                  className={`block w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                    plan.popular
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {plan.buttonText || "Başla"}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(PricingTableBlock, {
  type: "PricingTable",
  label: "Fiyatlandırma",
  category: "pricing",
  group: "sections",
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-secondary/30"),
      title: builderProp({
        type: "string",
        title: "Başlık",
        default: "Fiyatlandırma",
      }),
      subtitle: builderProp({
        type: "string",
        title: "Alt Başlık",
        default: "Planlar",
      }),
      
      // Plan 1
      plan1Name: builderProp({
        type: "string",
        title: "Plan 1 - İsim",
        default: "Başlangıç",
      }),
      plan1Price: builderProp({
        type: "string",
        title: "Plan 1 - Fiyat",
        default: "₺299",
      }),
      plan1Period: builderProp({
        type: "string",
        title: "Plan 1 - Periyot",
        default: "ay",
      }),
      plan1Features: builderProp({
        type: "string",
        title: "Plan 1 - Özellikler",
        default: "5 Sayfa\nSSL Sertifikası\nE-posta Desteği",
        ui: { "ui:widget": "textarea" },
      }),
      plan1ButtonText: builderProp({
        type: "string",
        title: "Plan 1 - Buton",
        default: "Başla",
      }),
      plan1Popular: builderProp({
        type: "boolean",
        title: "Plan 1 - Popüler",
        default: false,
      }),
      
      // Plan 2
      plan2Name: builderProp({
        type: "string",
        title: "Plan 2 - İsim",
        default: "Profesyonel",
      }),
      plan2Price: builderProp({
        type: "string",
        title: "Plan 2 - Fiyat",
        default: "₺599",
      }),
      plan2Period: builderProp({
        type: "string",
        title: "Plan 2 - Periyot",
        default: "ay",
      }),
      plan2Features: builderProp({
        type: "string",
        title: "Plan 2 - Özellikler",
        default: "Sınırsız Sayfa\nSSL Sertifikası\n7/24 Destek\nSEO Optimizasyonu",
        ui: { "ui:widget": "textarea" },
      }),
      plan2ButtonText: builderProp({
        type: "string",
        title: "Plan 2 - Buton",
        default: "Başla",
      }),
      plan2Popular: builderProp({
        type: "boolean",
        title: "Plan 2 - Popüler",
        default: true,
      }),
      
      // Plan 3
      plan3Name: builderProp({
        type: "string",
        title: "Plan 3 - İsim",
        default: "Kurumsal",
      }),
      plan3Price: builderProp({
        type: "string",
        title: "Plan 3 - Fiyat",
        default: "₺999",
      }),
      plan3Period: builderProp({
        type: "string",
        title: "Plan 3 - Periyot",
        default: "ay",
      }),
      plan3Features: builderProp({
        type: "string",
        title: "Plan 3 - Özellikler",
        default: "Her şey dahil\nÖzel Domain\nÖncelikli Destek\nAnalitik Dashboard\nAPI Erişimi",
        ui: { "ui:widget": "textarea" },
      }),
      plan3ButtonText: builderProp({
        type: "string",
        title: "Plan 3 - Buton",
        default: "İletişime Geç",
      }),
      plan3Popular: builderProp({
        type: "boolean",
        title: "Plan 3 - Popüler",
        default: false,
      }),
      titleSize: builderProp({
        type: "string",
        title: "Başlık Boyutu",
        default: "2xl",
        enum: ["lg", "xl", "2xl", "3xl"],
      }),
      textAlign: builderProp({
        type: "string",
        title: "Metin Hizalama",
        default: "center",
        enum: ["left", "center", "right"],
      }),
    },
  },
});

export { PricingTableBlock };
