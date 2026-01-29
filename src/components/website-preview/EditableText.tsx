import { createElement } from 'react';
import { cn } from '@/lib/utils';
import type { EditorSelection, EditableFieldData } from './EditorSidebar';

export interface EditableTextData {
  type: 'text';
  title: string;
  sectionId: string;
  fields: EditableFieldData[];
}

interface EditableTextProps {
  value: string;
  fieldPath: string;
  fieldLabel: string;
  sectionTitle: string;
  sectionId: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'button';
  isEditable?: boolean;
  isSelected?: boolean;
  onSelect?: (selection: EditorSelection) => void;
  className?: string;
  additionalFields?: EditableFieldData[];
  multiline?: boolean;
}

export function EditableText({
  value,
  fieldPath,
  fieldLabel,
  sectionTitle,
  sectionId,
  as = 'p',
  isEditable = false,
  isSelected = false,
  onSelect,
  className,
  additionalFields = [],
  multiline = false,
}: EditableTextProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditable || !onSelect) return;
    
    e.stopPropagation();
    
    const mainField: EditableFieldData = {
      label: fieldLabel,
      fieldPath,
      value,
      type: multiline ? 'textarea' : 'text',
      canRegenerate: true,
    };

    const selection: EditorSelection = {
      type: 'text',
      title: sectionTitle,
      sectionId,
      fields: [mainField, ...additionalFields],
    };

    onSelect(selection);
  };

  const element = createElement(
    as,
    {
      onClick: handleClick,
      className: cn(
        className,
        isEditable && 'cursor-pointer transition-all duration-200',
        isEditable && !isSelected && 'hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 rounded-sm',
        isSelected && 'ring-2 ring-primary ring-offset-2 rounded-sm'
      ),
    },
    value
  );

  return element;
}
