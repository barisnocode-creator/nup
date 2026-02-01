import { motion } from 'framer-motion';
import { FileText, MessageSquare, Film, Sparkles, CheckCircle } from 'lucide-react';
import { EditableText } from '@/components/website-preview/EditableText';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface AboutProcessProps {
  title: string;
  content: string;
  steps?: ProcessStep[];
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const defaultSteps: ProcessStep[] = [
  { step: 1, title: 'Discovery', description: 'We learn about your vision and goals' },
  { step: 2, title: 'Storyboard', description: 'Crafting the perfect narrative' },
  { step: 3, title: 'Production', description: 'AI-powered video creation' },
  { step: 4, title: 'Refinement', description: 'Polishing every detail' },
  { step: 5, title: 'Delivery', description: 'Your masterpiece is ready' },
];

const stepIcons = [FileText, MessageSquare, Film, Sparkles, CheckCircle];

export function AboutProcess({
  title,
  content,
  steps = defaultSteps,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: AboutProcessProps) {
  const isTitleSelected = editorSelection?.sectionId === 'about' &&
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.about.story.title');

  return (
    <EditableSection
      sectionId="about"
      sectionName="About / Process"
      isEditable={isEditable}
      onMoveUp={() => onMoveSection?.('up')}
      onMoveDown={() => onMoveSection?.('down')}
      onDelete={onDeleteSection}
      isFirst={isFirst}
      isLast={isLast}
    >
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4"
            >
              Our Process
            </motion.span>
            <EditableText
              value={title}
              fieldPath="pages.about.story.title"
              fieldLabel="About Title"
              sectionTitle="About Section"
              sectionId="about"
              as="h2"
              isEditable={isEditable}
              isSelected={isTitleSelected}
              onSelect={onEditorSelect}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            />
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{content}</p>
          </div>

          {/* Storyboard Process */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {steps.map((step, index) => {
                const IconComponent = stepIcons[index] || CheckCircle;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative lg:flex items-center gap-8 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content Card */}
                    <div className={`lg:w-5/12 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 transition-colors"
                      >
                        {/* Film Strip Effect */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-2 h-3 bg-slate-700 rounded-sm" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 font-mono">SCENE {step.step}</span>
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-2 h-3 bg-slate-700 rounded-sm" />
                            ))}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400">{step.description}</p>
                      </motion.div>
                    </div>

                    {/* Center Icon */}
                    <div className="hidden lg:flex lg:w-2/12 justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/25 z-10"
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    {/* Empty Space for Alternating Layout */}
                    <div className="hidden lg:block lg:w-5/12" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
