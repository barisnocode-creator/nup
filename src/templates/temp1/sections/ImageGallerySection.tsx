import { cn } from '@/lib/utils';
import { EditableImage } from '@/components/website-preview/EditableImage';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

interface ImageGallerySectionProps {
  images: string[];
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Legacy props
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export function ImageGallerySection({
  images,
  isDark,
  isNeutral,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  selectedImage,
  onImageSelect,
}: ImageGallerySectionProps) {
  // Use placeholder images if no images provided
  const displayImages = images && images.length > 0 
    ? images.slice(0, 6) 
    : Array(6).fill(null);

  const handleImageSelect = (data: ImageData) => {
    if (onEditorSelect) {
      onEditorSelect({
        type: 'image',
        title: `Gallery Image ${(data.index || 0) + 1}`,
        sectionId: 'gallery',
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
      'py-20',
      isDark ? 'bg-slate-800' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'
    )} id="gallery">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            Gallery
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            Our Facility
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((image, index) => {
            const imagePath = `images.galleryImages[${index}]`;
            const isThisSelected = selectedImage?.imagePath === imagePath ||
              editorSelection?.imageData?.imagePath === imagePath;

            return (
              <div
                key={index}
                className={cn(
                  'relative rounded-xl overflow-hidden shadow-lg',
                  // Make first image larger
                  index === 0 && 'md:col-span-2 md:row-span-2',
                  index === 0 ? 'aspect-square' : 'aspect-[4/3]',
                  isDark ? 'bg-slate-700' : 'bg-gray-200'
                )}
              >
                {image ? (
                  <EditableImage
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    type="gallery"
                    index={index}
                    imagePath={imagePath}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    containerClassName="w-full h-full group cursor-pointer"
                    isEditable={isEditable}
                    isSelected={isThisSelected}
                    onSelect={handleImageSelect}
                  />
                ) : (
                  <div className={cn(
                    'w-full h-full flex items-center justify-center',
                    isDark ? 'bg-gradient-to-br from-slate-600 to-slate-700' : 'bg-gradient-to-br from-primary/10 to-primary/20'
                  )}>
                    <span className={cn(
                      'text-4xl',
                      isDark ? 'text-slate-500' : 'text-primary/30'
                    )}>
                      {['🏥', '👨‍⚕️', '💊', '🩺', '🔬', '❤️'][index % 6]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
