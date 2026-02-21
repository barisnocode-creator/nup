import { useEffect, useRef, useState } from 'react';
import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function StatisticsCounter({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats = (Array.isArray(props.stats) && props.stats.length > 0
    ? props.stats
    : [
        { value: props.stat1Value, label: props.stat1Label },
        { value: props.stat2Value, label: props.stat2Label },
        { value: props.stat3Value, label: props.stat3Label },
        { value: props.stat4Value, label: props.stat4Label },
      ]
  ).filter((st: any) => st.value && st.label);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${s.sectionPadding} ${s.bgColor} text-primary-foreground`}>
      <div className="container mx-auto px-6">
        {(props.title || props.subtitle) && (
          <div className={`text-${s.textAlign} mb-12`}>
            {props.subtitle && <span className={`inline-block px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium mb-4 ${s.subtitleTransform} font-body-dynamic`}>{props.subtitle}</span>}
            {props.title && <h2 className={`${s.titleSize()} ${s.titleWeight} font-heading-dynamic`}>{props.title}</h2>}
          </div>
        )}
        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-8 text-center`}>
          {stats.map((stat, index) => (
            <div key={index} className={`space-y-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading-dynamic">{stat.value}</div>
              <div className="text-primary-foreground/80 text-sm md:text-base font-body-dynamic">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
