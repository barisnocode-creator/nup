import { Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ImageType } from '@/pages/Studio';

interface StudioImage {
  id: string;
  type: ImageType;
  prompt: string;
  image_url: string | null;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
}

interface ImageGalleryProps {
  images: StudioImage[];
  loading: boolean;
  onSelect: (image: StudioImage) => void;
  onDelete: (imageId: string) => void;
  selectedImageId?: string;
}

const typeLabels: Record<ImageType, string> = {
  logo: 'Logo',
  social: 'Sosyal',
  poster: 'Poster',
  creative: 'Yaratıcı',
};

export function ImageGallery({ 
  images, 
  loading, 
  onSelect, 
  onDelete,
  selectedImageId 
}: ImageGalleryProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">Galeri Boş</h3>
        <p className="text-muted-foreground text-sm">
          Oluşturduğunuz görseller burada görünecek
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Oluşturulan Görseller</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
              selectedImageId === image.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-primary/50"
            )}
            onClick={() => image.status === 'completed' && onSelect(image)}
          >
            {image.status === 'completed' && image.image_url ? (
              <img
                src={image.image_url}
                alt={image.prompt}
                className="w-full h-full object-cover"
              />
            ) : image.status === 'generating' ? (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
              <span className="text-white text-xs font-medium mb-1">
                {typeLabels[image.type]}
              </span>
              <p className="text-white/80 text-xs text-center line-clamp-2 mb-2">
                {image.prompt}
              </p>
              <Button
                variant="destructive"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                {typeLabels[image.type]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
