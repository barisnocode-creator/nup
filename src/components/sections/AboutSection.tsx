import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function AboutSection({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const featureList = props.features ? props.features.split('\n').filter((f: string) => f.trim()) : [];

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${props.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`space-y-6 ${props.imagePosition === 'left' ? 'lg:order-2' : ''}`}>
            {props.subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>{props.subtitle}</span>
            )}
            <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} text-${s.textAlign}`}>{props.title}</h2>
            <p className={`${s.descSize} ${s.descColor} leading-relaxed`}>{props.description}</p>
            {featureList.length > 0 && (
              <ul className="space-y-3">
                {featureList.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`relative ${props.imagePosition === 'left' ? 'lg:order-1' : ''}`}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-30" />
            <img src={props.image || "/placeholder.svg"} alt={props.title} className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}
