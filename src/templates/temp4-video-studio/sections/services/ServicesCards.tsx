import { motion } from 'framer-motion';
import { Film, Video, Sparkles, Camera, Palette, Music } from 'lucide-react';
import { EditableText } from '@/components/website-preview/EditableText';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

const iconMap: Record<string, React.ElementType> = {
  film: Film,
  video: Video,
  sparkles: Sparkles,
  camera: Camera,
  palette: Palette,
  music: Music,
};

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface ServicesCardsProps {
  title: string;
  subtitle: string;
  services: Service[];
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ServicesCards({
  title,
  subtitle,
  services,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: ServicesCardsProps) {
  const isTitleSelected = editorSelection?.sectionId === 'services' &&
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.services.hero.title');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <EditableSection
      sectionId="services"
      sectionName="Services"
      isEditable={isEditable}
      onMoveUp={() => onMoveSection?.('up')}
      onMoveDown={() => onMoveSection?.('down')}
      onDelete={onDeleteSection}
      isFirst={isFirst}
      isLast={isLast}
    >
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4"
            >
              What We Do
            </motion.span>
            <EditableText
              value={title}
              fieldPath="pages.services.hero.title"
              fieldLabel="Services Title"
              sectionTitle="Services Section"
              sectionId="services"
              as="h2"
              isEditable={isEditable}
              isSelected={isTitleSelected}
              onSelect={onEditorSelect}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            />
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
          </div>

          {/* Polaroid-style Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.slice(0, 6).map((service, index) => {
              const IconComponent = iconMap[service.icon.toLowerCase()] || Sparkles;
              const rotations = [-3, 2, -2, 3, -1, 2];
              
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 0,
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                  style={{ rotate: rotations[index] }}
                >
                  <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                    {/* Polaroid Image Area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <IconComponent className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    {/* Polaroid Caption */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {service.description}
                    </p>
                    
                    {/* Tape Effect */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-200/80 rotate-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
