import { heroTitleSizeMap, resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';

export function HeroOverlay({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });
  const overlayOpacity = props.overlayOpacity ?? 60;

  return (
    <section className="relative min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: props.backgroundImage
            ? `url(${props.backgroundImage})`
            : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
        }}
      />
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }} />
      <div className={`relative container mx-auto px-6 ${s.sectionPadding}`}>
        <div className="max-w-2xl">
          {props.subtitle && (
            <span className={`inline-block px-4 py-2 bg-white/10 backdrop-blur text-white rounded-full text-sm font-medium mb-6 ${s.subtitleTransform}`}>{props.subtitle}</span>
          )}
          <h1 className={`${s.titleSize(heroTitleSizeMap)} ${s.titleWeight} leading-tight ${s.titleColor} mb-6 text-${s.textAlign}`}>{props.title}</h1>
          <p className={`${s.descSize} ${s.descColor} mb-10 max-w-xl`}>{props.description}</p>
          {props.buttonText && (
            <a href={isEditing ? "#" : props.buttonLink} className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors text-lg">
              {props.buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
