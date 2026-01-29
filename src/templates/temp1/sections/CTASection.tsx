import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableImage } from '@/components/website-preview/EditableImage';
import { cn } from '@/lib/utils';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

interface CTASectionProps {
  siteName: string;
  tagline: string;
  ctaImage?: string;
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Legacy props
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export function CTASection({
  siteName,
  tagline,
  ctaImage,
  isDark,
  isNeutral,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  selectedImage,
  onImageSelect,
}: CTASectionProps) {
  const isImageSelected = selectedImage?.imagePath === 'images.ctaImage' ||
    editorSelection?.imageData?.imagePath === 'images.ctaImage';

  const handleImageSelect = (data: ImageData) => {
    if (onEditorSelect) {
      onEditorSelect({
        type: 'image',
        title: 'CTA Background',
        sectionId: 'cta',
        imageData: data,
        fields: [],
      });
    }
    if (onImageSelect) {
      onImageSelect(data);
    }
  };

  return (
    <section className={cn(
      'relative py-24 overflow-hidden',
      isDark ? 'bg-slate-800' : 'bg-primary'
    )} id="cta">
      {/* Background Image */}
      {ctaImage && (
        <div className="absolute inset-0">
          <EditableImage
            src={ctaImage}
            alt="CTA Background"
            type="cta"
            imagePath="images.ctaImage"
            className="w-full h-full object-cover opacity-20"
            containerClassName="w-full h-full"
            isEditable={isEditable}
            isSelected={isImageSelected}
            onSelect={handleImageSelect}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {tagline || `Contact ${siteName} today and take the first step towards better health and wellness.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-lg px-8 py-6"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                'gap-2 text-lg px-8 py-6',
                'border-white/30 text-white hover:bg-white/10'
              )}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
