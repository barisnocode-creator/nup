import { EditableText } from '@/components/website-preview/EditableText';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface Service {
  name: string;
  description: string;
  features: string[];
}

interface ServicesShowcaseProps {
  services: Service[];
  headline: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function ServicesShowcase({
  services,
  headline,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: ServicesShowcaseProps) {
  const isTitleSelected = editorSelection?.fields.some(f => f.fieldPath === 'pages.services.headline');

  return (
    <section id="services" className="py-24 bg-gray-950 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-px h-96 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
        <div className="absolute top-1/3 right-0 w-px h-96 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 bg-white/5 text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border border-gray-800">
            What We Do
          </span>
          
          <EditableText
            value={headline}
            fieldPath="pages.services.headline"
            fieldLabel="Services Title"
            sectionTitle="Services Section"
            sectionId="services"
            as="h2"
            isEditable={isEditable}
            isSelected={isTitleSelected}
            onSelect={onEditorSelect}
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white"
          />
        </div>

        {/* Services List */}
        <div className="space-y-0">
          {services.slice(0, 4).map((service, index) => (
            <div
              key={index}
              className="group border-t border-gray-800 first:border-t-0"
            >
              <div className="py-12 flex flex-col lg:flex-row items-start lg:items-center gap-8 hover:bg-white/[0.02] transition-colors px-4 -mx-4">
                {/* Number */}
                <div className="w-20 flex-shrink-0">
                  <span className="text-6xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Service Name */}
                <div className="flex-1 min-w-0">
                  <EditableText
                    value={service.name}
                    fieldPath={`pages.services.services[${index}].name`}
                    fieldLabel="Service Name"
                    sectionTitle="Services Section"
                    sectionId="services"
                    as="h3"
                    isEditable={isEditable}
                    onSelect={onEditorSelect}
                    className="text-2xl md:text-3xl font-bold text-white group-hover:text-gray-200 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <EditableText
                    value={service.description}
                    fieldPath={`pages.services.services[${index}].description`}
                    fieldLabel="Description"
                    sectionTitle="Services Section"
                    sectionId="services"
                    as="p"
                    isEditable={isEditable}
                    onSelect={onEditorSelect}
                    className="text-gray-400 leading-relaxed"
                  />
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-gray-950 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-10 py-5 border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-gray-950 transition-all">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}
