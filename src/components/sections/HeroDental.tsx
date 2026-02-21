import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableImage } from '@/components/website-preview/EditableImage';
import { PixabayImagePicker } from './PixabayImagePicker';
import type { SectionComponentProps } from './types';

export function HeroDental({ section, isEditing, onUpdate }: SectionComponentProps) {
  const p = section.props;
  const title = p.title || '';
  const description = p.description || '';
  const buttonText = p.buttonText || '';
  const buttonLink = p.buttonLink || '#appointment';
  const image = p.image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80';
  const badge = p.badge || '';

  const [pickerOpen, setPickerOpen] = useState(false);

  const handleImageSelect = (url: string) => {
    onUpdate?.({ image: url });
  };

  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 md:py-28 min-h-[calc(100vh-7rem)] flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            {badge && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {badge}
              </motion.span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-foreground"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              {description}
            </motion.p>

            {buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button size="lg" className="group text-base px-8" asChild={!isEditing}>
                  {isEditing ? (
                    <span>{buttonText} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  ) : (
                    <a href={buttonLink}>
                      {buttonText} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              {isEditing ? (
                <EditableImage
                  src={image}
                  alt={title}
                  type="hero"
                  imagePath="image"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  isEditable
                  actions={[
                    {
                      id: 'change-image',
                      icon: ImageIcon,
                      label: 'Görseli Değiştir',
                      onClick: () => setPickerOpen(true),
                      group: 'primary',
                    },
                  ]}
                />
              ) : (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
            </div>

            {/* Pixabay Picker */}
            {isEditing && (
              <PixabayImagePicker
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleImageSelect}
                defaultQuery="dental clinic"
              />
            )}

            {/* Decorative blobs */}
            <div className="absolute -z-10 -top-8 -right-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
