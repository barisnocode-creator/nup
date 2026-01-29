import { cn } from '@/lib/utils';

interface ImageGallerySectionProps {
  images: string[];
  isDark: boolean;
  isNeutral: boolean;
}

export function ImageGallerySection({
  images,
  isDark,
  isNeutral,
}: ImageGallerySectionProps) {
  // Use placeholder images if no images provided
  const displayImages = images && images.length > 0 
    ? images.slice(0, 6) 
    : Array(6).fill(null);

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
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                'relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group cursor-pointer',
                // Make first image larger
                index === 0 && 'md:col-span-2 md:row-span-2 md:aspect-square',
                isDark ? 'bg-slate-700' : 'bg-gray-200'
              )}
            >
              {image ? (
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              
              {/* Hover Overlay */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-t from-black/60 to-transparent'
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
