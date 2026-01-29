import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageData } from './EditorSidebar';

interface EditableImageProps {
  src: string;
  alt?: string;
  type: ImageData['type'];
  index?: number;
  imagePath: string;
  className?: string;
  containerClassName?: string;
  isEditable?: boolean;
  isSelected?: boolean;
  positionX?: number;
  positionY?: number;
  onSelect?: (data: ImageData) => void;
  fallback?: React.ReactNode;
}

export function EditableImage({
  src,
  alt = '',
  type,
  index,
  imagePath,
  className,
  containerClassName,
  isEditable = false,
  isSelected = false,
  positionX = 50,
  positionY = 50,
  onSelect,
  fallback,
}: EditableImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('EditableImage clicked:', { isEditable, hasOnSelect: !!onSelect, type, imagePath, src });
    
    if (!isEditable || !onSelect) return;
    
    onSelect({
      type,
      index,
      imagePath,
      currentUrl: src,
      altText: alt,
      positionX,
      positionY,
    });
  };

  // If no src and not editable, show fallback or nothing
  if (!src && !isEditable) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div
      className={cn(
        'relative group',
        containerClassName,
        isEditable && 'cursor-pointer z-10',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={isEditable ? "button" : undefined}
      tabIndex={isEditable ? 0 : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(className)}
          style={{
            objectPosition: `${positionX}% ${positionY}%`
          }}
        />
      ) : (
        fallback
      )}

      {/* Edit Overlay */}
      {isEditable && (
        <div
          className={cn(
            'absolute inset-0 transition-all duration-200',
            isHovered || isSelected
              ? 'bg-black/40 opacity-100'
              : 'opacity-0'
          )}
        >
          {/* Edit Icon */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-all duration-200',
              isHovered || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            )}
          >
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Pencil className="w-5 h-5 text-gray-700" />
            </div>
          </div>

          {/* Border on hover/selected */}
          <div
            className={cn(
              'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
              isHovered || isSelected
                ? 'border-primary'
                : 'border-transparent'
            )}
          />
        </div>
      )}
    </div>
  );
}
