import { heroTitleSizeMap, resolveStyles } from './styleUtils';
import type { SectionComponentProps } from './types';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NaturalHero({ section, isEditing }: SectionComponentProps) {
  const { props, style } = section;
  const s = resolveStyles({ ...style });

  return (
    <section className={cn("natural-block relative rounded-[2.5rem] overflow-hidden my-12 max-w-7xl mx-auto", s.bgColor === "bg-transparent" ? "bg-muted" : s.bgColor)}>
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 lg:p-16">
        <div className="relative rounded-[2rem] overflow-hidden">
          <div className="aspect-[4/3] md:aspect-auto rounded-[2rem] overflow-hidden">
            <img src={props.image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80"} alt={props.title} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h1 className={cn(s.titleSize(heroTitleSizeMap), s.titleWeight, s.titleColor, "leading-[1.1] tracking-tight")} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{props.title}</h1>
            <p className={cn(s.descSize, s.descColor, "leading-relaxed max-w-xl")}>{props.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4">
            <a href={isEditing ? "#" : "#contact"} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 md:px-10 md:py-6 text-base font-medium transition-all hover:scale-105 w-full sm:w-auto">{props.buttonText}</a>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
