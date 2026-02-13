import { useState } from 'react';
import { Paintbrush, Wand2, ChevronUp, ChevronDown, MoreHorizontal, Edit3, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
  onRegenerate,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
  isFirst = false,
  isLast = false,
  fallback,
}: EditableImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  if (!src && !isEditable) {
    return fallback ? <>{fallback}</> : null;
  }

  const hasDropdown = !!(onEdit || onDuplicate || onDelete);
  const hasSecondaryActions = !!(onRegenerate || onMoveUp || onMoveDown);
  const showSeparator = hasDropdown && (hasSecondaryActions || onSelect);

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
          <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <TooltipProvider delayDuration={300}>
              {/* Restyle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={(e) => handleActionClick(e, () => onSelect?.({
                      type, index, imagePath, currentUrl: src, altText: alt, positionX, positionY,
                    }))}
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Stili Değiştir</TooltipContent>
              </Tooltip>

              {/* Regenerate */}
              {onRegenerate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
                      onClick={(e) => handleActionClick(e, onRegenerate)}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Yeniden Oluştur</TooltipContent>
                </Tooltip>
              )}

              {/* Move Up */}
              {onMoveUp && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700",
                        isFirst && "opacity-40 pointer-events-none"
                      )}
                      onClick={(e) => handleActionClick(e, onMoveUp)}
                      disabled={isFirst}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Yukarı Taşı</TooltipContent>
                </Tooltip>
              )}

              {/* Move Down */}
              {onMoveDown && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700",
                        isLast && "opacity-40 pointer-events-none"
                      )}
                      onClick={(e) => handleActionClick(e, onMoveDown)}
                      disabled={isLast}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Aşağı Taşı</TooltipContent>
                </Tooltip>
              )}

              {/* Separator */}
              {showSeparator && (
                <div className="w-px h-4 bg-gray-300 mx-0.5" />
              )}

              {/* More Options Dropdown */}
              {hasDropdown && (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Diğer</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="z-50">
                    {onEdit && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Bölümü Düzenle
                      </DropdownMenuItem>
                    )}
                    {onDuplicate && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Çoğalt
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                          onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}
