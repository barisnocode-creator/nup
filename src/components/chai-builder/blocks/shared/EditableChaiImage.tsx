import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Global callback store for image updates
declare global {
  interface Window {
    __chaiImageCallback?: {
      setter: (url: string) => void;
      currentSrc: string;
    };
  }
}

interface EditableChaiImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  inBuilder?: boolean;
}

/**
 * Wrapper for <img> elements in Chai Builder blocks.
 * Shows an ImageActionBox overlay on hover when in the editor.
 * Manages local override state so image changes are always visually reflected.
 */
export function EditableChaiImage({
  src,
  alt = '',
  className,
  containerClassName,
  inBuilder = false,
}: EditableChaiImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);

  // Reset override when src prop changes (e.g. from undo/redo or prop panel)
  useEffect(() => {
    setOverrideSrc(null);
  }, [src]);

  const displaySrc = overrideSrc || src || '/placeholder.svg';

  const handleChangeImage = useCallback(() => {
    // Store the setter on window so ChaiBuilderWrapper can call it
    window.__chaiImageCallback = {
      setter: (url: string) => {
        setOverrideSrc(url);
      },
      currentSrc: displaySrc,
    };
    // Dispatch event to open the inline image switcher
    window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
      detail: { currentSrc: displaySrc },
    }));
  }, [displaySrc]);

  // Outside builder → plain img
  if (!inBuilder) {
    return <img src={src || '/placeholder.svg'} alt={alt} className={className} />;
  }

  return (
    <div
      className={cn('relative', containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={displaySrc}
        alt={alt}
        className={cn(className, 'transition-opacity duration-500')}
        key={displaySrc}
      />
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
          isHovered ? 'border-primary' : 'border-transparent',
        )}
      />
      <div
        className={cn(
          'absolute top-3 right-3 z-30 transition-all duration-200 pointer-events-auto',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none',
        )}
      >
        <div className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-black/10 overflow-hidden">
          <button
            className="px-3 py-2 text-[13px] font-medium text-foreground/80 hover:bg-black/5 hover:text-foreground active:scale-[0.98] transition-all whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleChangeImage(); }}
          >
            Görsel Değiştir
          </button>
        </div>
      </div>
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
  const [overrideBg, setOverrideBg] = useState<string | null>(null);

  useEffect(() => {
    setOverrideBg(null);
  }, [backgroundImage]);

  const displayBg = overrideBg || backgroundImage;

  const bgStyle: React.CSSProperties = {
    ...style,
    backgroundImage: displayBg ? `url(${displayBg})` : style?.backgroundImage,
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

  const handleChangeBg = () => {
    window.__chaiImageCallback = {
      setter: (url: string) => {
        setOverrideBg(url);
      },
      currentSrc: displayBg || '',
    };
    window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
      detail: { currentSrc: displayBg },
    }));
  };

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
      <div
        className={cn(
          'absolute top-3 right-3 z-30 transition-all duration-200 pointer-events-auto',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none',
        )}
      >
        <div className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-black/10 overflow-hidden">
          <button
            className="px-3 py-2 text-[13px] font-medium text-foreground/80 hover:bg-black/5 hover:text-foreground active:scale-[0.98] transition-all whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleChangeBg(); }}
          >
            Arka Plan Değiştir
          </button>
        </div>
      </div>
    </div>
  );
}
