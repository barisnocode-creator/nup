import { EditableField } from '@/components/website-preview/EditableField';
import { cn } from '@/lib/utils';

interface AboutInlineSectionProps {
  story: {
    title: string;
    content: string;
  };
  values: Array<{
    title: string;
    description: string;
  }>;
  aboutImage?: string;
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function AboutInlineSection({
  story,
  values,
  aboutImage,
  isDark,
  isNeutral,
  isEditable,
  onFieldEdit,
}: AboutInlineSectionProps) {
  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-900' : isNeutral ? 'bg-stone-50' : 'bg-white'
    )} id="about">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            About Us
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            {story.title}
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Image */}
          <div className={cn(
            'relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl',
            isDark ? 'bg-slate-800' : 'bg-gray-200'
          )}>
            {aboutImage ? (
              <img
                src={aboutImage}
                alt="About Us"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={cn(
                'w-full h-full flex items-center justify-center',
                isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-primary/20 to-primary/30'
              )}>
                <span className={cn(
                  'text-6xl',
                  isDark ? 'text-slate-600' : 'text-primary/40'
                )}>
                  👨‍⚕️
                </span>
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <EditableField
              value={story.content}
              fieldPath="pages.about.story.content"
              isEditable={isEditable}
              onSave={onFieldEdit}
              as="p"
              className={cn(
                'text-lg leading-relaxed whitespace-pre-line',
                isDark ? 'text-slate-300' : isNeutral ? 'text-stone-700' : 'text-gray-700'
              )}
            />
          </div>
        </div>

        {/* Values Grid */}
        {values && values.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.slice(0, 6).map((value, index) => (
              <div
                key={index}
                className={cn(
                  'p-6 rounded-xl border transition-all duration-300 hover:shadow-lg',
                  isDark 
                    ? 'bg-slate-800 border-slate-700 hover:border-primary/50' 
                    : isNeutral 
                      ? 'bg-stone-100 border-stone-200 hover:border-primary/50' 
                      : 'bg-gray-50 border-gray-200 hover:border-primary/50'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">
                    {['💡', '🎯', '❤️', '🔒', '⭐', '🤝'][index % 6]}
                  </span>
                </div>
                <h3 className={cn(
                  'text-lg font-semibold mb-2',
                  isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
                )}>
                  {value.title}
                </h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
                )}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
