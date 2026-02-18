import { heroCenteredTitleSizeMap, resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function HeroCentered({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className={`relative min-h-[700px] flex items-center justify-center ${s.bgColor} overflow-hidden`}
      style={props.backgroundImage ? { backgroundImage: `url(${props.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {props.backgroundImage && <div className="absolute inset-0 bg-background/60" />}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className={`relative container mx-auto px-6 ${s.sectionPadding} text-${s.textAlign}`}>
        {props.subtitle && (
          <span className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 ${s.subtitleTransform}`}>
            {props.subtitle}
          </span>
        )}
        <h1 className={`${s.titleSize(heroCenteredTitleSizeMap)} ${s.titleWeight} ${s.titleColor} leading-tight max-w-4xl mx-auto mb-6`}>
          {props.title}
        </h1>
        <p className={`${s.descSize} ${s.descColor} max-w-2xl mx-auto mb-10`}>
          {props.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {props.primaryButtonText && (
            <a href={isEditing ? "#" : props.primaryButtonLink} className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg">
              {props.primaryButtonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
          {props.secondaryButtonText && (
            <a href={isEditing ? "#" : props.secondaryButtonLink} className="inline-flex items-center px-8 py-4 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-lg">
              {props.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
