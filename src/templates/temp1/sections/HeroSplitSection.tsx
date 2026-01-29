import { EditableField } from '@/components/website-preview/EditableField';
import { cn } from '@/lib/utils';

interface HeroSplitSectionProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function HeroSplitSection({
  title,
  subtitle,
  description,
  heroImage,
  isDark,
  isNeutral,
  isEditable,
  onFieldEdit,
}: HeroSplitSectionProps) {
  return (
    <section className={cn(
      'min-h-[80vh] flex items-center',
      isDark ? 'bg-slate-900' : isNeutral ? 'bg-stone-100' : 'bg-gradient-to-br from-primary/5 to-primary/10'
    )}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6 py-12 lg:py-20">
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
            )}>
              ✨ Welcome to our practice
            </div>

            <EditableField
              value={title}
              fieldPath="pages.home.hero.title"
              isEditable={isEditable}
              onSave={onFieldEdit}
              as="h1"
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
                isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
              )}
            />

            <EditableField
              value={subtitle}
              fieldPath="pages.home.hero.subtitle"
              isEditable={isEditable}
              onSave={onFieldEdit}
              as="p"
              className={cn(
                'text-xl md:text-2xl font-medium',
                isDark ? 'text-slate-300' : isNeutral ? 'text-stone-700' : 'text-gray-700'
              )}
            />

            <EditableField
              value={description}
              fieldPath="pages.home.hero.description"
              isEditable={isEditable}
              onSave={onFieldEdit}
              as="p"
              className={cn(
                'text-lg leading-relaxed max-w-xl',
                isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
              )}
            />

            <div className="flex flex-wrap gap-4 pt-4">
              <button className={cn(
                'px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg',
                'bg-primary text-primary-foreground hover:bg-primary/90'
              )}>
                Get Started
              </button>
              <button className={cn(
                'px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border-2',
                isDark 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}>
                Learn More
              </button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative hidden lg:block">
            <div className={cn(
              'relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl',
              isDark ? 'bg-slate-800' : 'bg-gray-200'
            )}>
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Hero"
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
                    🏥
                  </span>
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
