import { EditableText } from '@/components/website-preview/EditableText';
import { EditableImage } from '@/components/website-preview/EditableImage';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface HeroBoldProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  heroImage?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function HeroBold({
  title,
  subtitle,
  description,
  ctaText,
  heroImage,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: HeroBoldProps) {
  const isTitleSelected = editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.headline');
  const isSubtitleSelected = editorSelection?.fields.some(f => f.fieldPath === 'pages.home.hero.subheadline');

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Accent Gradient Blob */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-pink-600/20 to-orange-600/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Tagline */}
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-sm font-bold uppercase tracking-widest text-gray-300 border border-white/10">
              {subtitle}
            </span>
          </div>

          {/* Main Title */}
          <EditableText
            value={title}
            fieldPath="pages.home.hero.headline"
            fieldLabel="Headline"
            sectionTitle="Hero Section"
            sectionId="hero"
            as="h1"
            isEditable={isEditable}
            isSelected={isTitleSelected}
            onSelect={onEditorSelect}
            additionalFields={[
              {
                label: 'Subheadline',
                fieldPath: 'pages.home.hero.subheadline',
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
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none mb-8"
          />

          {/* Description */}
          <EditableText
            value={description}
            fieldPath="pages.home.hero.description"
            fieldLabel="Description"
            sectionTitle="Hero Section"
            sectionId="hero"
            as="p"
            isEditable={isEditable}
            isSelected={isSubtitleSelected}
            onSelect={onEditorSelect}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
          />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-5 bg-white text-gray-950 font-bold text-lg uppercase tracking-wide hover:bg-gray-200 transition-all hover:scale-105">
              {ctaText}
            </button>
            <button className="px-10 py-5 border-2 border-white/30 text-white font-bold text-lg uppercase tracking-wide hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>

          {/* Stats Row */}
          <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-3 gap-8 max-w-2xl">
            {[
              { number: '500+', label: 'Projects' },
              { number: '98%', label: 'Satisfaction' },
              { number: '12+', label: 'Years' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
}
