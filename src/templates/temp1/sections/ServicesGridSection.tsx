import { 
  Heart, Shield, Clock, Star, Users, Award, 
  Stethoscope, Pill, Smile, Activity, Microscope, 
  Syringe, Brain, Eye 
} from 'lucide-react';
import { EditableItem } from '@/components/website-preview/EditableItem';
import { cn } from '@/lib/utils';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface ServicesGridSectionProps {
  intro: {
    title: string;
    content: string;
  };
  services: ServiceItem[];
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  shield: Shield,
  clock: Clock,
  star: Star,
  users: Users,
  award: Award,
  stethoscope: Stethoscope,
  pill: Pill,
  smile: Smile,
  activity: Activity,
  microscope: Microscope,
  syringe: Syringe,
  brain: Brain,
  eye: Eye,
};

export function ServicesGridSection({
  intro,
  services,
  isDark,
  isNeutral,
  isEditable,
  editorSelection,
  onEditorSelect,
}: ServicesGridSectionProps) {
  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-800' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'
    )} id="services">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            Our Services
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-6',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            {intro.title}
          </h2>
          <p className={cn(
            'text-lg',
            isDark ? 'text-slate-300' : isNeutral ? 'text-stone-600' : 'text-gray-600'
          )}>
            {intro.content}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.slice(0, 8).map((service, index) => {
            const IconComponent = iconMap[service.icon.toLowerCase()] || Heart;
            const isSelected = editorSelection?.sectionId === 'services' && 
              editorSelection?.itemIndex === index;
            
            return (
              <EditableItem
                key={index}
                itemType="service"
                itemIndex={index}
                sectionId="services"
                itemData={{
                  title: service.title,
                  titlePath: `pages.services.servicesList[${index}].title`,
                  description: service.description,
                  descriptionPath: `pages.services.servicesList[${index}].description`,
                }}
                isEditable={isEditable}
                isSelected={isSelected}
                onSelect={onEditorSelect}
                className={cn(
                  'group p-6 rounded-xl border transition-all duration-300',
                  'hover:shadow-xl hover:-translate-y-1 hover:border-primary/50',
                  isDark 
                    ? 'bg-slate-900 border-slate-700' 
                    : isNeutral 
                      ? 'bg-white border-stone-200' 
                      : 'bg-white border-gray-200'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300',
                  'bg-primary/10 group-hover:bg-primary/20'
                )}>
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className={cn(
                  'text-lg font-semibold mb-3',
                  isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
                )}>
                  {service.title}
                </h3>
                
                <p className={cn(
                  'text-sm leading-relaxed',
                  isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
                )}>
                  {service.description}
                </p>
              </EditableItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
