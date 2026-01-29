import { useState } from 'react';
import { Edit3, Trash2, ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EditableSectionProps {
  children: React.ReactNode;
  sectionId: string;
  sectionName: string;
  isEditable: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onLockedFeature?: (feature: string) => void;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function EditableSection({
  children,
  sectionId,
  sectionName,
  isEditable,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onLockedFeature,
  className,
  isFirst = false,
  isLast = false,
}: EditableSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLockedAction = (action: string) => {
    if (onLockedFeature) {
      onLockedFeature(`${action} ${sectionName}`);
    }
  };

  if (!isEditable) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isHovered && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-section-id={sectionId}
    >
      {/* Section Label Badge - pointer-events-auto to ensure clicks work */}
      {isHovered && (
        <div className="absolute -top-3 left-4 z-30 animate-fade-in pointer-events-auto">
          <Badge 
            variant="default" 
            className="bg-primary text-primary-foreground shadow-md text-xs font-medium"
          >
            {sectionName}
          </Badge>
        </div>
      )}

      {/* Action Buttons - pointer-events-auto to ensure clicks work */}
      {isHovered && (
        <div className="absolute -top-3 right-4 z-30 flex items-center gap-1 animate-fade-in pointer-events-auto">
          {/* Move Up */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow-md"
            onClick={() => onMoveUp?.()}
            disabled={isFirst || !onMoveUp}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>

          {/* Move Down */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow-md"
            onClick={() => onMoveDown?.()}
            disabled={isLast || !onMoveDown}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>

          {/* Edit Button */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow-md"
            onClick={() => onEdit?.()}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow-md"
            onClick={() => onDelete?.()}
            disabled={!onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Section Content */}
      <div className={cn(
        'transition-opacity duration-200',
        isHovered && 'opacity-95'
      )}>
        {children}
      </div>

      {/* Hover Overlay Effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-lg" />
      )}
    </div>
  );
}
