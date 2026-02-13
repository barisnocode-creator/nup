import React, { useEffect, useRef, useState } from 'react';
import { 
  registerChaiBlock,
  StylesProp,
} from "@chaibuilder/sdk/runtime";
import type { ChaiBlockComponentProps, ChaiStyles } from "@chaibuilder/sdk/types";
import { resolveStyles, commonStyleSchemaProps, type CommonStyleProps } from "../shared/styleUtils";
import { builderProp } from "@chaibuilder/sdk/runtime";
import { EditableChaiImage } from "../shared/EditableChaiImage";

interface ServiceItem {
  icon?: string;
  image?: string;
  title: string;
  description: string;
}

export type ServicesGridProps = {
  styles: ChaiStyles;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  services: ServiceItem[];
} & CommonStyleProps;

const defaultServices: ServiceItem[] = [
  { icon: "🚀", title: "Hızlı Teslimat", description: "Projelerinizi belirlenen sürede tamamlıyor, zamanında teslim ediyoruz." },
  { icon: "💡", title: "Yaratıcı Çözümler", description: "Her proje için özel ve yaratıcı çözümler sunuyoruz." },
  { icon: "🛡️", title: "Güvenilir Hizmet", description: "Kaliteli ve güvenilir hizmet anlayışı ile çalışıyoruz." },
  { icon: "📱", title: "Mobil Uyumlu", description: "Tüm cihazlarda mükemmel görünen tasarımlar oluşturuyoruz." },
  { icon: "🔧", title: "Teknik Destek", description: "7/24 teknik destek ile her zaman yanınızdayız." },
  { icon: "📈", title: "SEO Optimizasyonu", description: "Arama motorlarında üst sıralarda yer almanızı sağlıyoruz." },
];

const ServicesGridBlock = (props: ChaiBlockComponentProps<ServicesGridProps>) => {
  const { 
    blockProps, 
    sectionTitle,
    sectionSubtitle,
    sectionDescription,
    services = defaultServices,
    ...styleProps
  } = props;

  const s = resolveStyles(styleProps);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleCards(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [services]);

  return (
    <section {...blockProps} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6" ref={sectionRef}>
        <div className={`text-${s.textAlign} max-w-3xl mx-auto mb-16`}>
          {sectionSubtitle && (
            <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>
              {sectionSubtitle}
            </span>
          )}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} mb-6 font-serif`}>
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className={`${s.descSize} ${s.descColor}`}>
              {sectionDescription}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isVisible = visibleCards.has(index);
            return (
              <div 
                key={index}
                data-index={index}
                className="group relative overflow-hidden rounded-2xl transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {service.image ? (
                  /* Image-forward card */
                  <div className="relative aspect-[3/4]">
                    <EditableChaiImage 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      containerClassName="w-full h-full"
                      inBuilder={props.inBuilder}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{service.description}</p>
                    </div>
                  </div>
                ) : (
                  /* Icon card fallback */
                  <div className="p-8 bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 rounded-2xl h-full">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      {service.icon || '⭐'}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

registerChaiBlock(ServicesGridBlock, {
  type: "ServicesGrid",
  label: "Hizmetler - Grid",
  category: "services",
  group: "sections",
  inlineEditProps: ['sectionTitle', 'sectionSubtitle', 'sectionDescription'],
  schema: {
    properties: {
      styles: StylesProp("py-20 bg-background"),
      sectionTitle: builderProp({
        type: "string",
        title: "Bölüm Başlığı",
        default: "Hizmetlerimiz",
      }),
      sectionSubtitle: builderProp({
        type: "string",
        title: "Bölüm Alt Başlığı",
        default: "Neler Yapıyoruz",
      }),
      sectionDescription: builderProp({
        type: "string",
        title: "Bölüm Açıklaması",
        default: "Size en iyi hizmeti sunmak için buradayız.",
        ui: { "ui:widget": "textarea" },
      }),
      services: builderProp({
        type: "array",
        title: "Hizmetler",
        default: defaultServices as any,
      }),
      ...commonStyleSchemaProps({ bgColor: "background", textAlign: "center" }),
    },
  },
});

export { ServicesGridBlock };
