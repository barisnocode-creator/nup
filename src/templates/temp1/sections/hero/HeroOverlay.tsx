import { EditableText } from '@/components/website-preview/EditableText';
import { EditableImage } from '@/components/website-preview/EditableImage';
import { cn } from '@/lib/utils';
import type { HeroProps } from './types';
import type { ImageData } from '@/components/website-preview/EditorSidebar';
import { ImageIcon } from 'lucide-react';

// Dynamic style helpers
const getTextSizeClass = (size?: string) => {
  const sizeMap: Record<string, string> = {
    sm: 'text-3xl md:text-4xl lg:text-5xl',
    base: 'text-4xl md:text-5xl lg:text-7xl',
    lg: 'text-5xl md:text-6xl lg:text-8xl',
    xl: 'text-6xl md:text-7xl lg:text-9xl',
    '2xl': 'text-7xl md:text-8xl lg:text-[10rem]',
  };
  return sizeMap[size || 'base'] || sizeMap.base;
};

const getTextAlignClass = (align?: string) => {
  const alignMap: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };
  return alignMap[align || 'center'] || alignMap.center;
};

export function HeroOverlay({
  title,
  subtitle,
  description,
  heroImage,
  heroImagePosition,
  isDark,
  isNeutral,
  isEditable,
  editorSelection,
  onEditorSelect,
  sectionStyle,
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

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();
    handleImageSelect({
      type: 'hero',
      imagePath: 'images.heroHome',
      currentUrl: heroImage || '',
      altText: 'Hero Background',
      positionX: 50,
      positionY: 50,
    });
  };

  // Apply dynamic styles from sectionStyle
  const titleSizeClass = getTextSizeClass(sectionStyle?.fontSize);
  const textAlignClass = getTextAlignClass(sectionStyle?.textAlign);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Container - Clickable when editable */}
      <div 
        className={cn(
          "absolute inset-0",
          isEditable && "cursor-pointer group"
        )}
        onClick={handleBackgroundClick}
      >
        {/* Image */}
        {heroImage ? (
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
            style={{
              objectPosition: heroImagePosition 
                ? `${heroImagePosition.x}% ${heroImagePosition.y}%` 
                : '50% 50%'
            }}
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

        {/* Hover overlay - subtle visual indicator (no text) */}
        {isEditable && (
          <div className={cn(
            "absolute inset-0 transition-all duration-200",
            isImageSelected 
              ? "bg-black/20 ring-4 ring-primary ring-inset" 
              : "bg-black/0 group-hover:bg-black/10"
          )} />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className={cn('max-w-4xl mx-auto space-y-8 flex flex-col', textAlignClass)}>
          <EditableText
            value="Welcome to our practice"
            fieldPath="pages.home.welcome.title"
            fieldLabel="Welcome Badge"
            sectionTitle="Welcome"
            sectionId="welcome"
            as="span"
            isEditable={isEditable}
            isSelected={editorSelection?.fields.some(f => f.fieldPath === 'pages.home.welcome.title')}
            onSelect={onEditorSelect}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20"
          />

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
            className={cn(titleSizeClass, 'font-bold leading-tight text-white drop-shadow-lg font-display')}
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
            <EditableText
              value="Get Started"
              fieldPath="pages.home.hero.ctaButton"
              fieldLabel="Primary Button"
              sectionTitle="Hero Buttons"
              sectionId="hero"
              as="button"
              isEditable={isEditable}
              isSelected={editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.ctaButton')}
              onSelect={onEditorSelect}
              additionalFields={[
                {
                  label: 'Secondary Button',
                  fieldPath: 'pages.home.hero.secondaryButton',
                  value: 'Learn More',
                  type: 'text',
                  canRegenerate: false,
                },
              ]}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg bg-white text-gray-900 hover:bg-gray-100"
            />
            <EditableText
              value="Learn More"
              fieldPath="pages.home.hero.secondaryButton"
              fieldLabel="Secondary Button"
              sectionTitle="Hero Buttons"
              sectionId="hero"
              as="button"
              isEditable={isEditable}
              isSelected={editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.secondaryButton')}
              onSelect={onEditorSelect}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
            />
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
