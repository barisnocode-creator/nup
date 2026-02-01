import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface TeamMember {
  name: string;
  role: string;
  reward: string;
  image?: string;
}

interface TeamWantedProps {
  title: string;
  description: string;
  members?: TeamMember[];
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const defaultMembers: TeamMember[] = [
  { name: 'Alex Director', role: 'Creative Director', reward: '$10,000' },
  { name: 'Sam Editor', role: 'Lead Editor', reward: '$8,000' },
  { name: 'Jordan VFX', role: 'VFX Artist', reward: '$9,500' },
  { name: 'Taylor Motion', role: 'Motion Designer', reward: '$7,500' },
];

export function TeamWanted({
  title,
  description,
  members = defaultMembers,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: TeamWantedProps) {
  return (
    <EditableSection
      sectionId="team"
      sectionName="Team"
      isEditable={isEditable}
      onMoveUp={() => onMoveSection?.('up')}
      onMoveDown={() => onMoveSection?.('down')}
      onDelete={onDeleteSection}
      isFirst={isFirst}
      isLast={isLast}
    >
      <section className="py-24 bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Meet The Outlaws</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{description}</p>
          </div>

          {/* Wanted Posters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
                className="group cursor-pointer"
              >
                {/* Wanted Poster */}
                <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg p-6 shadow-xl">
                  {/* Aged Paper Effect */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50 rounded-lg" />
                  
                  {/* Decorative Border */}
                  <div className="absolute inset-2 border-2 border-amber-800/30 rounded pointer-events-none" />

                  <div className="relative">
                    {/* WANTED Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-3xl font-black text-amber-900 tracking-widest" style={{ fontFamily: 'serif' }}>
                        WANTED
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="h-px flex-1 bg-amber-800/30" />
                        <Star className="w-3 h-3 text-amber-700 fill-amber-700" />
                        <div className="h-px flex-1 bg-amber-800/30" />
                      </div>
                    </div>

                    {/* Photo Area */}
                    <div className="aspect-[3/4] bg-amber-300/50 rounded mb-4 flex items-center justify-center overflow-hidden border-4 border-amber-800/20">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale sepia" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-400/50 to-amber-600/50 flex items-center justify-center">
                          <span className="text-6xl font-bold text-amber-800/30">?</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="text-center">
                      <p className="text-amber-900 font-bold text-lg">{member.name}</p>
                      <p className="text-amber-700 text-sm italic">{member.role}</p>
                    </div>

                    {/* Reward */}
                    <div className="mt-4 text-center">
                      <p className="text-amber-800 text-xs uppercase tracking-wider">Reward</p>
                      <p className="text-2xl font-black text-amber-900">{member.reward}</p>
                    </div>

                    {/* Dead or Alive */}
                    <p className="text-center text-amber-800/60 text-xs mt-3 tracking-widest uppercase">
                      Creative Genius
                    </p>
                  </div>

                  {/* Corner Pins */}
                  {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-4 h-4 bg-slate-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
