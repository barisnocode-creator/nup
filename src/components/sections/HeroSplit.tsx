import { heroTitleSizeMap, resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function HeroSplit({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className={`relative min-h-[600px] flex items-center ${s.bgColor} ${s.sectionPadding}`}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {props.subtitle && (
              <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium ${s.subtitleTransform}`}>{props.subtitle}</span>
            )}
            <h1 className={`${s.titleSize(heroTitleSizeMap)} ${s.titleWeight} leading-tight ${s.titleColor} text-${s.textAlign}`}>{props.title}</h1>
            <p className={`${s.descSize} ${s.descColor} max-w-lg`}>{props.description}</p>
            {props.buttonText && (
              <a href={isEditing ? "#" : props.buttonLink} className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                {props.buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
            <img src={props.image || "/placeholder.svg"} alt={props.title} className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}
