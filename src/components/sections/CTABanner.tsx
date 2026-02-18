import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function CTABanner({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className={`${s.sectionPadding} ${s.bgColor}`}>
      <div className="container mx-auto px-6">
        <div className={`max-w-4xl mx-auto text-${s.textAlign}`}>
          <h2 className={`${s.titleSize()} ${s.titleWeight} ${s.titleColor} mb-6`}>{props.title}</h2>
          <p className={`${s.descSize} ${s.descColor} mb-10 max-w-2xl mx-auto`}>{props.description}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {props.buttonText && (
              <a href={isEditing ? "#" : props.buttonLink} className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors text-lg">
                {props.buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            )}
            {props.secondaryButtonText && (
              <a href={isEditing ? "#" : props.secondaryButtonLink} className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-primary-foreground rounded-lg font-medium hover:bg-white/10 transition-colors text-lg">{props.secondaryButtonText}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
