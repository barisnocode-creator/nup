import { resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { cn } from '@/lib/utils';

export function NaturalNewsletter({ section }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className="natural-block my-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("rounded-[2.5rem] p-12 md:p-16", s.bgColor === "bg-transparent" ? "bg-card" : s.bgColor, `text-${s.textAlign}`)}>
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className={cn(s.titleSize(), s.titleWeight, s.titleColor, "tracking-tight")} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{props.title}</h2>
            <p className={cn(s.descSize, s.descColor, "leading-relaxed")}>{props.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
              <button className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all">{props.buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
