import { useState, useMemo } from 'react';
import { Paintbrush, Wand2, ChevronUp, ChevronDown, Edit3, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageActionBox, type ImageAction } from './ImageActionBox';
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
  onRegenerate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isLocked?: boolean;
  fallback?: React.ReactNode;
  /** New: pass actions directly instead of individual callbacks */
  actions?: ImageAction[];
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
  onRegenerate,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
  isFirst = false,
  isLast = false,
  isLocked = false,
  fallback,
  actions: actionsProp,
}: EditableImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isEditable || !onSelect) return;
    onSelect({
      type, index, imagePath, currentUrl: src, altText: alt, positionX, positionY,
    });
  };

  // Build actions from legacy props if actionsProp is not provided
  const actions = useMemo<ImageAction[]>(() => {
    if (actionsProp) return actionsProp;

    const result: ImageAction[] = [];

    // Primary: Restyle
    if (onSelect) {
      result.push({
        id: 'restyle',
        icon: Paintbrush,
        label: 'Stili Değiştir',
        onClick: () => onSelect({ type, index, imagePath, currentUrl: src, altText: alt, positionX, positionY }),
        group: 'primary',
      });
    }

    // Primary: Regenerate
    if (onRegenerate) {
      result.push({
        id: 'regenerate',
        icon: Wand2,
        label: 'Yeniden Oluştur',
        onClick: onRegenerate,
        group: 'primary',
      });
    }

    // Secondary: Move Up/Down
    if (onMoveUp) {
      result.push({
        id: 'move-up',
        icon: ChevronUp,
        label: 'Yukarı Taşı',
        onClick: onMoveUp,
        disabled: isFirst,
        group: 'secondary',
      });
    }
    if (onMoveDown) {
      result.push({
        id: 'move-down',
        icon: ChevronDown,
        label: 'Aşağı Taşı',
        onClick: onMoveDown,
        disabled: isLast,
        group: 'secondary',
      });
    }

    // Overflow: Edit, Duplicate, Delete
    if (onEdit) {
      result.push({
        id: 'edit',
        icon: Edit3,
        label: 'Bölümü Düzenle',
        onClick: onEdit,
        group: 'overflow',
      });
    }
    if (onDuplicate) {
      result.push({
        id: 'duplicate',
        icon: Copy,
        label: 'Çoğalt',
        onClick: onDuplicate,
        group: 'overflow',
      });
    }
    if (onDelete) {
      result.push({
        id: 'delete',
        icon: Trash2,
        label: 'Sil',
        onClick: onDelete,
        variant: 'danger',
        group: 'overflow',
      });
    }

    return result;
  }, [actionsProp, onSelect, onRegenerate, onMoveUp, onMoveDown, onEdit, onDuplicate, onDelete, isFirst, isLast, type, index, imagePath, src, alt, positionX, positionY]);

  if (!src && !isEditable) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div
      className={cn(
        'relative group',
        containerClassName,
        isEditable && !isLocked && 'cursor-pointer z-10',
        isEditable && isLocked && 'cursor-default z-10',
        isSelected && 'ring-2 ring-primary ring-offset-2',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(className)}
          style={{ objectPosition: `${positionX}% ${positionY}%` }}
        />
      ) : (
        fallback
      )}

      {/* Hover border */}
      {isEditable && (
        <div
          className={cn(
            'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
            isHovered || isSelected
              ? isLocked ? 'border-muted-foreground/30' : 'border-primary'
              : 'border-transparent',
          )}
        />
      )}

      {/* Action toolbar */}
      {isEditable && !isLocked && actions.length > 0 && (
        <ImageActionBox
          actions={actions}
          isVisible={isHovered || isSelected}
        />
      )}
    </div>
  );
}
