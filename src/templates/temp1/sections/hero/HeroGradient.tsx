import { EditableText } from '@/components/website-preview/EditableText';
import { cn } from '@/lib/utils';
import type { HeroProps } from './types';

export function HeroGradient({
  title,
  subtitle,
  description,
  isDark,
  isNeutral,
  isEditable,
  editorSelection,
  onEditorSelect,
}: HeroProps) {
  const isTitleSelected = editorSelection?.sectionId === 'hero' && 
    editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.title');

  return (
    <section className={cn(
      'relative min-h-[100vh] flex items-center justify-center overflow-hidden',
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-primary/30 to-slate-950'
        : isNeutral
          ? 'bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300'
          : 'bg-gradient-to-br from-primary/20 via-background to-primary/30'
    )}>
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          'absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse',
          isDark ? 'bg-primary/20' : 'bg-primary/30'
        )} />
        <div className={cn(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000',
          isDark ? 'bg-primary/15' : 'bg-primary/25'
        )} />
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-50',
          isDark ? 'bg-primary/10' : 'bg-primary/20'
        )} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border',
            isDark 
              ? 'bg-white/5 text-primary border-white/10' 
              : 'bg-primary/10 text-primary border-primary/20'
          )}>
            ✨ Welcome to our practice
          </div>

          <EditableText
            value={title}
            fieldPath="pages.home.hero.title"
            fieldLabel="Headline"
            sectionTitle="Hero"
            sectionId="hero"
            as="h1"
            isEditable={isEditable}
            isSelected={isTitleSelected}
            onSelect={onEditorSelect}
            additionalFields={[
              {
                label: 'Subtitle',
                fieldPath: 'pages.home.hero.subtitle',
                value: subtitle,
                type: 'text',
                canRegenerate: true,
              },
              {
                label: 'Description',
                fieldPath: 'pages.home.hero.description',
                value: description,
                type: 'textarea',
                canRegenerate: true,
              },
            ]}
            className={cn(
              'text-4xl md:text-5xl lg:text-7xl font-bold leading-tight',
              isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
            )}
          />

          <EditableText
            value={subtitle}
            fieldPath="pages.home.hero.subtitle"
            fieldLabel="Subtitle"
            sectionTitle="Hero"
            sectionId="hero"
            as="p"
            isEditable={isEditable}
            isSelected={editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.subtitle')}
            onSelect={onEditorSelect}
            className={cn(
              'text-xl md:text-2xl lg:text-3xl font-medium',
              isDark ? 'text-slate-300' : isNeutral ? 'text-stone-700' : 'text-gray-700'
            )}
          />

          <EditableText
            value={description}
            fieldPath="pages.home.hero.description"
            fieldLabel="Description"
            sectionTitle="Hero"
            sectionId="hero"
            as="p"
            multiline
            isEditable={isEditable}
            isSelected={editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.description')}
            onSelect={onEditorSelect}
            className={cn(
              'text-lg md:text-xl leading-relaxed max-w-2xl mx-auto',
              isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
            )}
          />

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button className={cn(
              'px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg',
              'bg-primary text-primary-foreground hover:bg-primary/90'
            )}>
              Get Started
            </button>
            <button className={cn(
              'px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border-2 backdrop-blur-sm',
              isDark 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            )}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
