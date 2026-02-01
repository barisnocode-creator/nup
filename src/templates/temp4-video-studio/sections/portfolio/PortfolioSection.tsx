import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface PortfolioItem {
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
}

interface PortfolioSectionProps {
  title: string;
  subtitle: string;
  items?: PortfolioItem[];
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const defaultItems: PortfolioItem[] = [
  { 
    title: 'Brand Story Film', 
    category: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80'
  },
  { 
    title: 'Product Launch', 
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80'
  },
  { 
    title: 'Documentary', 
    category: 'Film',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80'
  },
];

export function PortfolioSection({
  title = 'Featured Work',
  subtitle = 'Our latest projects that showcase our creative excellence',
  items = defaultItems,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: PortfolioSectionProps) {
  return (
    <EditableSection
      sectionId="portfolio"
      sectionName="Portfolio"
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
              className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4"
            >
              Portfolio
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
          </div>

          {/* Featured Video - Large */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={items[0]?.thumbnail}
                alt={items[0]?.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Play Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </motion.div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-blue-400 text-sm font-medium uppercase tracking-wider">
                  {items[0]?.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                  {items[0]?.title}
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Grid of Smaller Videos */}
          <div className="grid md:grid-cols-2 gap-8">
            {items.slice(1, 3).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              View All Projects
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
