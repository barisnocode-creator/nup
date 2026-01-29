import { EditableText } from '@/components/website-preview/EditableText';
import { EditableImage } from '@/components/website-preview/EditableImage';
import { cn } from '@/lib/utils';
import type { HeroProps } from './types';
import type { ImageData } from '@/components/website-preview/EditorSidebar';

export function HeroOverlay({
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
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {/* Image */}
        {heroImage ? (
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'w-full h-full',
            isDark 
              ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' 
              : 'bg-gradient-to-br from-primary/30 via-primary/20 to-primary/40'
          )} />
        )}
        
        {/* Dark overlay for text readability */}
        <div className={cn(
          'absolute inset-0',
          isDark 
            ? 'bg-gradient-to-t from-black/90 via-black/60 to-black/40'
            : 'bg-gradient-to-t from-black/80 via-black/50 to-black/30'
        )} />
      </div>

      {/* Clickable Image Edit Button - positioned in bottom-left corner */}
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleImageSelect({
              type: 'hero',
              imagePath: 'images.heroHome',
              currentUrl: heroImage || '',
              altText: 'Hero Background',
              positionX: 50,
              positionY: 50,
            });
          }}
          className={cn(
            'absolute bottom-24 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all duration-200',
            'backdrop-blur-sm border border-white/50 hover:scale-105',
            isImageSelected && 'ring-2 ring-primary'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Edit Background</span>
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
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
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg font-display"
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
            className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90"
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
            className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto"
          />

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg bg-white text-gray-900 hover:bg-gray-100">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
