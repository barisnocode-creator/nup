import type { EditorSelection } from '@/components/website-preview/EditorSidebar';
import { ArrowRight, Briefcase } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface ServicesElegantProps {
  title: string;
  description: string;
  services: Service[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function ServicesElegant({
  title,
  description,
  services,
  isEditable = false,
  onFieldEdit,
  editorSelection,
  onEditorSelect,
}: ServicesElegantProps) {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F5F3] rounded-full border border-[rgba(55,50,47,0.08)] mb-6">
              <Briefcase className="w-3.5 h-3.5 text-[#37322F]" />
              <span className="text-xs font-medium text-[#49423D]">Our Services</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[#37322F] mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-[#605A57] leading-relaxed mb-8">
              {description}
            </p>

            {/* CTA */}
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#4a433f] transition-colors group">
              View All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Side - Services List */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 bg-[#F7F5F3] rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-[#37322F]/5 border border-transparent hover:border-[rgba(55,50,47,0.08)] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Number */}
                    <div className="text-xs text-[#605A57] mb-2">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[#37322F] mb-2 group-hover:text-[#49423D] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#605A57] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-[#37322F] transition-colors">
                    <ArrowRight className="w-4 h-4 text-[#37322F] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
