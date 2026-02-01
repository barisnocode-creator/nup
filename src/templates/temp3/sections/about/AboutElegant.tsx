import type { EditorSelection } from '@/components/website-preview/EditorSidebar';
import { Sparkles, Target, Heart, Shield } from 'lucide-react';

interface Value {
  title: string;
  description: string;
}

interface AboutElegantProps {
  title: string;
  content: string;
  values: Value[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

const iconMap = [Sparkles, Target, Heart, Shield];

export function AboutElegant({
  title,
  content,
  values,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: AboutElegantProps) {
  return (
    <section id="about" className="py-24 bg-[#F7F5F3]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[rgba(55,50,47,0.08)] shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#37322F]" />
            <span className="text-xs font-medium text-[#49423D]">About Us</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[#37322F] mb-6">
            {title}
          </h2>
          <p className="text-[#605A57] leading-relaxed">
            {content}
          </p>
        </div>

        {/* Values Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {values.slice(0, 4).map((value, index) => {
            const Icon = iconMap[index % iconMap.length];
            const isLarge = index === 0 || index === 3;
            
            return (
              <div
                key={index}
                className={`
                  group relative bg-white rounded-3xl p-8 border border-[rgba(55,50,47,0.06)]
                  hover:border-[rgba(55,50,47,0.12)] hover:shadow-lg hover:shadow-[#37322F]/5
                  transition-all duration-300
                  ${isLarge ? 'md:row-span-2' : ''}
                `}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#F7F5F3] flex items-center justify-center mb-6 group-hover:bg-[#37322F] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#37322F] group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-semibold text-[#37322F] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[#605A57] leading-relaxed">
                  {value.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[rgba(55,50,47,0.06)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
