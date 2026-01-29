import { EditableText } from '@/components/website-preview/EditableText';
import { EditableImage } from '@/components/website-preview/EditableImage';
import { cn } from '@/lib/utils';
import type { HeroProps } from './types';
import type { ImageData } from '@/components/website-preview/EditorSidebar';

export function HeroSplit({
  title,
  subtitle,
  description,
  heroImage,
  isDark,
  isNeutral,
  isEditable,
  editorSelection,
  onEditorSelect,
  selectedImage,
  onImageSelect,
}: HeroProps) {
  const isImageSelected = selectedImage?.imagePath === 'images.heroHome' || 
    editorSelection?.imageData?.imagePath === 'images.heroHome';
  
  const isTitleSelected = editorSelection?.sectionId === 'hero' && 
    editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.title');

  const handleImageSelect = (data: ImageData) => {
    if (onEditorSelect) {
      onEditorSelect({
        type: 'image',
        title: 'Hero Image',
        sectionId: 'hero',
        imageData: data,
        fields: [],
      });
    }
    if (onImageSelect) {
      onImageSelect(data);
    }
  };

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
                'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
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
                'text-xl md:text-2xl font-medium',
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
          <div className="relative">
            <div className={cn(
              'relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl',
              isDark ? 'bg-slate-800' : 'bg-gray-200'
            )}>
              <EditableImage
                src={heroImage || ''}
                alt="Hero"
                type="hero"
                imagePath="images.heroHome"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                isEditable={isEditable}
                isSelected={isImageSelected}
                onSelect={handleImageSelect}
                fallback={
                  <div className={cn(
                    'w-full h-full flex items-center justify-center',
                    isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-primary/20 to-primary/30'
                  )}>
                    <div className="text-center space-y-3">
                      <span className={cn(
                        'text-6xl block',
                        isDark ? 'text-slate-600' : 'text-primary/40'
                      )}>
                        🏥
                      </span>
                      {isEditable && (
                        <p className={cn(
                          'text-sm',
                          isDark ? 'text-slate-500' : 'text-gray-500'
                        )}>
                          Click to add image
                        </p>
                      )}
                    </div>
                  </div>
                }
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl hidden lg:block" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
