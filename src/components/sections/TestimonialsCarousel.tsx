import { useEffect, useRef, useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

const defaultTestimonials = [
  { name: "Ahmet Yılmaz", role: "CEO, Tech Corp", content: "Harika bir deneyim yaşadık.", avatar: "" },
  { name: "Zeynep Kaya", role: "Pazarlama Müdürü", content: "Web sitemiz sayesinde satışlarımız arttı.", avatar: "" },
  { name: "Mehmet Demir", role: "Kurucu", content: "Hızlı teslimat ve kaliteli iş.", avatar: "" },
];

export function TestimonialsCarousel({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const testimonials = props.testimonials?.length ? props.testimonials : defaultTestimonials;
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
          {props.sectionSubtitle && <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 ${s.subtitleTransform}`}>{props.sectionSubtitle}</span>}
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor}`}>{props.sectionTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t: any, index: number) => (
            <div
              key={index}
              className={`p-8 rounded-2xl bg-card border border-border transition-all duration-700 hover:shadow-xl hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex gap-1 mb-4 text-primary">
                {'★★★★★'.split('').map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{t.name?.charAt(0)}</div>
                )}
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
