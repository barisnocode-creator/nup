import { useEffect, useRef, useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

const defaultServices = [
  { icon: "🚀", title: "Hızlı Teslimat", description: "Projelerinizi belirlenen sürede tamamlıyoruz." },
  { icon: "💡", title: "Yaratıcı Çözümler", description: "Her proje için özel çözümler sunuyoruz." },
  { icon: "🛡️", title: "Güvenilir Hizmet", description: "Kaliteli ve güvenilir hizmet anlayışı ile çalışıyoruz." },
  { icon: "📱", title: "Mobil Uyumlu", description: "Tüm cihazlarda mükemmel görünen tasarımlar." },
  { icon: "🔧", title: "Teknik Destek", description: "7/24 teknik destek ile yanınızdayız." },
  { icon: "📈", title: "SEO Optimizasyonu", description: "Arama motorlarında üst sıralarda yer alın." },
];

export function ServicesGrid({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const services = props.services?.length ? props.services : defaultServices;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`text-${s.textAlign} max-w-3xl mx-auto mb-16`}>
          {props.sectionSubtitle && (
            <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform} font-body-dynamic`}>{props.sectionSubtitle}</span>
          )}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} mb-6 transition-all duration-1000 font-heading-dynamic ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {props.sectionTitle}
          </h2>
          {props.sectionDescription && <p className={`${s.descSize} ${s.descColor} font-body-dynamic`}>{props.sectionDescription}</p>}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {service.image ? (
                <div className="w-full aspect-[3/2] rounded-xl overflow-hidden mb-6 relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  {service.icon || '⭐'}
                </div>
              )}
              <h3 className="text-xl font-semibold text-foreground mb-3 font-heading-dynamic">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-body-dynamic">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
