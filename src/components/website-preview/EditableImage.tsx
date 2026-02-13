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

      {/* Hover border */}
      {isEditable && (
        <div
          className={cn(
            'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
            isHovered || isSelected ? 'border-primary' : 'border-transparent'
          )}
        />
      )}

      {/* Action box - top right */}
      {isEditable && (
        <div
          className={cn(
            'absolute top-2 right-2 z-20 transition-all duration-200 pointer-events-auto',
            isHovered || isSelected
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          )}
        >
          <div className="flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button
              title="Düzenle"
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleClick}
            >
              <Pencil className="w-3.5 h-3.5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
