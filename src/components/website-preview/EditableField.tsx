import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  fieldPath: string;
  onSave: (fieldPath: string, newValue: string) => void;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  isEditable?: boolean;
  placeholder?: string;
}

export function EditableField({
  value,
  fieldPath,
  onSave,
  className = '',
  as: Component = 'span',
  isEditable = true,
  placeholder = 'Click to edit...',
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(fieldPath, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditable) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    const isMultiline = value.length > 100 || value.includes('\n');
    
    return (
      <div className="relative inline-flex items-center gap-2 w-full">
        {isMultiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'w-full bg-primary/5 border-2 border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none',
              className
            )}
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'w-full bg-primary/5 border-2 border-primary rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50',
              className
            )}
            placeholder={placeholder}
          />
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleSave}
            className="p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      className="relative inline-flex items-center gap-2 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
    >
      <Component 
        className={cn(
          className,
          'transition-all border-b-2 border-transparent hover:border-primary/30'
        )}
      >
        {value || placeholder}
      </Component>
      <span
        className={cn(
          'inline-flex items-center justify-center p-1.5 rounded-full bg-primary/10 text-primary transition-all',
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        )}
        title="Click to edit"
      >
        <Pencil className="w-3.5 h-3.5" />
      </span>
    </span>
  );
}
