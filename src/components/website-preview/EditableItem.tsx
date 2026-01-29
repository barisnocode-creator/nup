import { cn } from '@/lib/utils';
import type { EditorSelection, EditableFieldData, ImageData } from './EditorSidebar';

export interface EditableItemData {
  title?: string;
  titlePath?: string;
  description?: string;
  descriptionPath?: string;
  image?: string;
  imagePath?: string;
  imageType?: ImageData['type'];
}

interface EditableItemProps {
  children: React.ReactNode;
  itemType: 'service' | 'statistic' | 'testimonial' | 'faq' | 'value' | 'process';
  itemIndex: number;
  sectionId: string;
  itemData: EditableItemData;
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: (selection: EditorSelection) => void;
  className?: string;
}

const itemTypeLabels: Record<string, string> = {
  service: 'Service',
  statistic: 'Statistic',
  testimonial: 'Testimonial',
  faq: 'FAQ',
  value: 'Value',
  process: 'Step',
};

export function EditableItem({
  children,
  itemType,
  itemIndex,
  sectionId,
  itemData,
  isEditable = false,
  isSelected = false,
  onSelect,
  className,
}: EditableItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditable || !onSelect) return;
    
    e.stopPropagation();
    
    const fields: EditableFieldData[] = [];

    if (itemData.title && itemData.titlePath) {
      fields.push({
        label: 'Title',
        fieldPath: itemData.titlePath,
        value: itemData.title,
        type: 'text',
        canRegenerate: true,
      });
    }

    if (itemData.description && itemData.descriptionPath) {
      fields.push({
        label: 'Description',
        fieldPath: itemData.descriptionPath,
        value: itemData.description,
        type: 'textarea',
        canRegenerate: true,
      });
    }

    const imageData: ImageData | undefined = itemData.image && itemData.imagePath ? {
      type: itemData.imageType || 'service',
      index: itemIndex,
      imagePath: itemData.imagePath,
      currentUrl: itemData.image,
    } : undefined;

    const selection: EditorSelection = {
      type: 'item',
      title: `${itemTypeLabels[itemType]} ${itemIndex + 1}`,
      sectionId,
      itemIndex,
      imageData,
      fields,
    };

    onSelect(selection);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        className,
        isEditable && 'cursor-pointer transition-all duration-200',
        isEditable && !isSelected && 'hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 rounded-xl',
        isSelected && 'ring-2 ring-primary ring-offset-2 rounded-xl'
      )}
    >
      {children}
    </div>
  );
}
