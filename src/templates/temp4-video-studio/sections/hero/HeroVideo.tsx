import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/website-preview/EditableText';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface HeroVideoProps {
  title: string;
  subtitle: string;
  description: string;
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
}

export function HeroVideo({
  title,
  subtitle,
  description,
  isEditable = false,
  editorSelection,
  onEditorSelect,
}: HeroVideoProps) {
  const isTitleSelected = editorSelection?.sectionId === 'hero' && 
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.home.hero.title');
  const isSubtitleSelected = editorSelection?.sectionId === 'hero' && 
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.home.hero.subtitle');
  const isDescriptionSelected = editorSelection?.sectionId === 'hero' && 
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.home.hero.description');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-keyboard-2884/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <EditableText
              value={subtitle}
              fieldPath="pages.home.hero.subtitle"
              fieldLabel="Subtitle"
              sectionTitle="Hero Section"
              sectionId="hero"
              as="span"
              isEditable={isEditable}
              isSelected={isSubtitleSelected}
              onSelect={onEditorSelect}
              className="text-sm font-medium text-blue-300 tracking-wider uppercase"
            />
          </motion.div>

          {/* Main Title */}
          <EditableText
            value={title}
            fieldPath="pages.home.hero.title"
            fieldLabel="Title"
            sectionTitle="Hero Section"
            sectionId="hero"
            as="h1"
            isEditable={isEditable}
            isSelected={isTitleSelected}
            onSelect={onEditorSelect}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
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
            isSelected={isDescriptionSelected}
            onSelect={onEditorSelect}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            multiline
          />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/25"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-full"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Showreel
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 pt-10 border-t border-slate-800"
          >
            <p className="text-slate-500 text-sm mb-6">Trusted by leading brands</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['Netflix', 'Apple', 'Google', 'Meta', 'Amazon'].map((brand) => (
                <span key={brand} className="text-slate-400 font-semibold text-lg">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
