import { motion } from 'framer-motion';
import { Award, Trophy, Medal, Star, Crown, Gem } from 'lucide-react';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface AwardItem {
  title: string;
  organization: string;
  year: string;
}

interface AwardsSectionProps {
  title?: string;
  subtitle?: string;
  awards?: AwardItem[];
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const defaultAwards: AwardItem[] = [
  { title: 'Best Visual Effects', organization: 'Film Academy Awards', year: '2024' },
  { title: 'Creative Excellence', organization: 'Cannes Lions', year: '2024' },
  { title: 'Innovation in AI', organization: 'Tech Awards', year: '2023' },
  { title: 'Best Commercial', organization: 'Clio Awards', year: '2023' },
  { title: 'Platinum Winner', organization: 'Muse Awards', year: '2023' },
  { title: 'Grand Prize', organization: 'SIGGRAPH', year: '2022' },
];

const awardIcons = [Award, Trophy, Medal, Star, Crown, Gem];

export function AwardsSection({
  title = 'Awards & Recognition',
  subtitle = 'Industry recognition for our creative excellence',
  awards = defaultAwards,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: AwardsSectionProps) {
  return (
    <EditableSection
      sectionId="awards"
      sectionName="Awards"
      isEditable={isEditable}
      onMoveUp={() => onMoveSection?.('up')}
      onMoveDown={() => onMoveSection?.('down')}
      onDelete={onDeleteSection}
      isFirst={isFirst}
      isLast={isLast}
    >
      <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-4"
            >
              Recognition
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {awards.map((award, index) => {
              const IconComponent = awardIcons[index % awardIcons.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 text-center border border-slate-700 hover:border-yellow-500/50 transition-colors">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-transparent transition-colors" />
                    
                    {/* Icon */}
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: 'easeInOut'
                      }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/25"
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Award Info */}
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                      {award.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-2 line-clamp-1">
                      {award.organization}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
                      {award.year}
                    </span>

                    {/* Sparkle Effect */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
