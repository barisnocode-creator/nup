import type { EditorSelection } from '@/components/website-preview/EditorSidebar';
import { Statistic } from '@/types/generated-website';

interface HeroElegantProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  statistics?: Statistic[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function HeroElegant({
  title,
  subtitle,
  description,
  ctaText,
  statistics = [],
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: HeroElegantProps) {
  return (
    <section id="hero" className="min-h-[90vh] bg-[#F7F5F3] relative flex items-center justify-center overflow-hidden">
      {/* Decorative diagonal pattern on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 opacity-30 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 flex flex-col">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full border-b border-[rgba(55,50,47,0.08)] origin-left"
              style={{ transform: 'rotate(-45deg) translateX(-50%)' }}
            />
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 opacity-30 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 flex flex-col">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full border-b border-[rgba(55,50,47,0.08)] origin-right"
              style={{ transform: 'rotate(45deg) translateX(50%)' }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[rgba(55,50,47,0.08)] shadow-sm mb-8">
          <div className="w-2 h-2 rounded-full bg-[#37322F]" />
          <span className="text-xs font-medium text-[#49423D]">{subtitle}</span>
        </div>

        {/* Main Headline - Serif */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-normal leading-tight text-[#37322F] mb-6">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-[#605A57] max-w-xl mx-auto leading-relaxed mb-10">
          {description}
        </p>

        {/* CTA Button - Pill Shape */}
        <button className="px-10 py-4 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#4a433f] transition-all duration-300 hover:shadow-lg hover:shadow-[#37322F]/20">
          {ctaText}
        </button>

        {/* Statistics */}
        {statistics.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[rgba(55,50,47,0.1)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.slice(0, 4).map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-serif font-normal text-[#37322F] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#605A57] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none" />
    </section>
  );
}
