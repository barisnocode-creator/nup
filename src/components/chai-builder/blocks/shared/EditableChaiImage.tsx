import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChaiImageActionOverlay } from './ChaiImageActionOverlay';

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

const HOVER_DEBOUNCE = 120;
const LEAVE_BUFFER = 200;

export function EditableChaiImage({
  src,
  alt = '',
  className,
  containerClassName,
  inBuilder = false,
}: EditableChaiImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setOverrideSrc(null);
  }, [src]);

  const displaySrc = overrideSrc || src || '/placeholder.svg';

  const handleChangeImage = useCallback(() => {
    window.__chaiImageCallback = {
      setter: (url: string) => { setOverrideSrc(url); },
      currentSrc: displaySrc,
    };
    window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
      detail: { currentSrc: displaySrc },
    }));
  }, [displaySrc]);

  const handleRegenerate = useCallback(() => {
    // Same flow as change image but could use different search terms
    handleChangeImage();
  }, [handleChangeImage]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DEBOUNCE);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    leaveTimer.current = setTimeout(() => setIsHovered(false), LEAVE_BUFFER);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  if (!inBuilder) {
    return <img src={src || '/placeholder.svg'} alt={alt} className={className} />;
  }

  return (
    <div
      className={cn('relative', containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={displaySrc}
        alt={alt}
        className={cn(className, 'transition-opacity duration-500')}
        key={displaySrc}
      />
      {/* Highlight border */}
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-[inherit] pointer-events-none transition-colors duration-200',
          isHovered ? 'border-primary' : 'border-transparent',
        )}
      />
      {/* Action overlay */}
      <div
        className={cn(
          'absolute top-3 right-3 z-30 transition-all duration-[160ms] ease-out pointer-events-auto',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5 pointer-events-none',
        )}
      >
        <ChaiImageActionOverlay
          onChangeImage={handleChangeImage}
          onRegenerate={handleRegenerate}
          onMoveUp={() => window.dispatchEvent(new CustomEvent('chai-move-block-up'))}
          onMoveDown={() => window.dispatchEvent(new CustomEvent('chai-move-block-down'))}
          onEditSection={() => window.dispatchEvent(new CustomEvent('chai-edit-section'))}
          onDuplicate={() => window.dispatchEvent(new CustomEvent('chai-duplicate-block'))}
          onDelete={() => window.dispatchEvent(new CustomEvent('chai-delete-block'))}
        />
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

export function EditableChaiBackground({
  backgroundImage,
  className,
  style,
  inBuilder = false,
  children,
}: EditableChaiBackgroundProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [overrideBg, setOverrideBg] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>();

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
      setter: (url: string) => { setOverrideBg(url); },
      currentSrc: displayBg || '',
    };
    window.dispatchEvent(new CustomEvent('chai-open-inline-image-switcher', {
      detail: { currentSrc: displayBg },
    }));
  };

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DEBOUNCE);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    leaveTimer.current = setTimeout(() => setIsHovered(false), LEAVE_BUFFER);
  };

  return (
    <div
      className={cn(className, 'relative')}
      style={bgStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          'absolute top-3 right-3 z-30 transition-all duration-[160ms] ease-out pointer-events-auto',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5 pointer-events-none',
        )}
      >
        <ChaiImageActionOverlay
          onChangeImage={handleChangeBg}
          onRegenerate={handleChangeBg}
        />
      </div>
    </div>
  );
}
