import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { cn } from '@/lib/utils';

export function NaturalIntro({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className={cn("natural-block max-w-4xl mx-auto px-4", s.bgColor, s.sectionPadding)}>
      <div className={cn("space-y-6", `text-${s.textAlign}`)}>
        <h2 className={cn(s.titleSize(), s.titleWeight, s.titleColor, "leading-tight")} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{props.title}</h2>
        <p className={cn(s.descSize, s.descColor, "leading-relaxed max-w-3xl mx-auto")}>{props.description}</p>
      </div>
    </section>
  );
}
