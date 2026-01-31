import { EditableText } from '@/components/website-preview/EditableText';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface AboutCardsProps {
  title: string;
  description: string;
  mission: string;
  values: string[];
  aboutImage?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function AboutCards({
  title,
  description,
  mission,
  values,
  aboutImage,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: AboutCardsProps) {
  const isTitleSelected = editorSelection?.fields.some(f => f.fieldPath === 'pages.about.headline');

  return (
    <section id="about" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-block px-3 py-1 bg-white/5 text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-l-4 border-white">
            About Us
          </span>
          
          <EditableText
            value={title}
            fieldPath="pages.about.headline"
            fieldLabel="About Title"
            sectionTitle="About Section"
            sectionId="about"
            as="h2"
            isEditable={isEditable}
            isSelected={isTitleSelected}
            onSelect={onEditorSelect}
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Story */}
          <div className="space-y-8">
            <EditableText
              value={description}
              fieldPath="pages.about.story"
              fieldLabel="Our Story"
              sectionTitle="About Section"
              sectionId="about"
              as="p"
              isEditable={isEditable}
              onSelect={onEditorSelect}
              className="text-lg text-gray-400 leading-relaxed"
            />

            {/* Mission Card */}
            <div className="p-8 bg-gray-950 border border-gray-800 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-4">Our Mission</h3>
              <EditableText
                value={mission}
                fieldPath="pages.about.mission"
                fieldLabel="Mission"
                sectionTitle="About Section"
                sectionId="about"
                as="p"
                isEditable={isEditable}
                onSelect={onEditorSelect}
                className="text-gray-400"
              />
            </div>
          </div>

          {/* Right: Values Grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  <span className="text-2xl font-black text-white">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <EditableText
                  value={value}
                  fieldPath={`pages.about.values[${index}]`}
                  fieldLabel={`Value ${index + 1}`}
                  sectionTitle="About Section"
                  sectionId="about"
                  as="p"
                  isEditable={isEditable}
                  onSelect={onEditorSelect}
                  className="text-sm font-bold uppercase tracking-wide text-gray-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image with overlay */}
        {aboutImage && (
          <div className="mt-16 relative h-96 overflow-hidden">
            <img
              src={aboutImage}
              alt="About us"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
