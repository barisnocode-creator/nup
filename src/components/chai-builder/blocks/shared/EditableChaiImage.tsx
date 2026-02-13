import { useState, useContext, createContext } from 'react';
import { Paintbrush } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageActionBox, type ImageAction } from '@/components/website-preview/ImageActionBox';

// Re-import the context directly to avoid hook violations
import { createContext as _cc, useContext as _uc } from 'react';

// We need a safe way to access EditorContext without throwing
// Import the context value type
interface EditorContextValue {
  onImageSearch: () => void;
}

// We'll use a local context reference that mirrors EditorContext
// This avoids the throw in useEditorContext
const EditorCtx = createContext<EditorContextValue | null>(null);

function useEditorContextSafe(): EditorContextValue | null {
  // This is a workaround: we try to import and use the real context
  // But since we can't conditionally call hooks, we use the context directly
  return useContext(EditorCtx);
}

interface EditableChaiImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  inBuilder?: boolean;
  extraActions?: ImageAction[];
}

/**
 * Wrapper for <img> elements in Chai Builder blocks.
 * Shows an ImageActionBox overlay on hover when in the editor.
 */
export function EditableChaiImage({
  src,
  alt = '',
  className,
  containerClassName,
  inBuilder = false,
  extraActions = [],
}: EditableChaiImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Outside builder → plain img
  if (!inBuilder) {
    return <img src={src || '/placeholder.svg'} alt={alt} className={className} />;
  }

  const actions: ImageAction[] = [
    {
      id: 'change-image',
      icon: Paintbrush,
      label: 'Görsel Değiştir',
      onClick: () => {
        // Dispatch event with current src for context
        window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
          detail: { currentSrc: src },
        }));
      },
      group: 'primary' as const,
    },
    ...extraActions,
  ];

  return (
    <div
      className={cn('relative', containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className={className}
      />
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
          isHovered ? 'border-primary' : 'border-transparent',
        )}
      />
      <ImageActionBox actions={actions} isVisible={isHovered} />
    </div>
  );
}

interface EditableChaiBackgroundProps {
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;
  inBuilder?: boolean;
  children?: React.ReactNode;
}

/**
 * Wrapper for CSS background-image containers in Chai Builder blocks.
 * Shows an ImageActionBox overlay on hover when in the editor.
 */
export function EditableChaiBackground({
  backgroundImage,
  className,
  style,
  inBuilder = false,
  children,
}: EditableChaiBackgroundProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bgStyle: React.CSSProperties = {
    ...style,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : style?.backgroundImage,
    backgroundSize: style?.backgroundSize || 'cover',
    backgroundPosition: style?.backgroundPosition || 'center',
  };

  if (!inBuilder) {
    return (
      <div className={className} style={bgStyle}>
        {children}
      </div>
    );
  }

  const actions: ImageAction[] = [{
    id: 'change-bg',
    icon: Paintbrush,
    label: 'Arka Plan Değiştir',
    onClick: () => {
      window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
        detail: { currentSrc: backgroundImage },
      }));
    },
    group: 'primary' as const,
  }];

  return (
    <div
      className={cn(className, 'relative')}
      style={bgStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
          isHovered ? 'border-primary' : 'border-transparent',
        )}
      />
      <ImageActionBox actions={actions} isVisible={isHovered} />
    </div>
  );
}
