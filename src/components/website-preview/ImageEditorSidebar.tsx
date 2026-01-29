import { useState, useEffect } from 'react';
import { ArrowLeft, Wand2, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ImageData {
  type: 'hero' | 'about' | 'gallery' | 'cta' | 'service';
  index?: number;
  imagePath: string;
  currentUrl: string;
  altText?: string;
  positionX?: number;
  positionY?: number;
}

interface ImageEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: ImageData | null;
  onRegenerate: () => void;
  onChangeImage: () => void;
  onUpdateAltText: (text: string) => void;
  onUpdatePosition: (x: number, y: number) => void;
  isRegenerating?: boolean;
  isDark?: boolean;
}

export function ImageEditorSidebar({
  isOpen,
  onClose,
  imageData,
  onRegenerate,
  onChangeImage,
  onUpdateAltText,
  onUpdatePosition,
  isRegenerating = false,
  isDark = false,
}: ImageEditorSidebarProps) {
  const [altText, setAltText] = useState(imageData?.altText || '');
  const [positionX, setPositionX] = useState(imageData?.positionX ?? 50);
  const [positionY, setPositionY] = useState(imageData?.positionY ?? 50);

  // Sync state when imageData changes
  useEffect(() => {
    if (imageData) {
      setAltText(imageData.altText || '');
      setPositionX(imageData.positionX ?? 50);
      setPositionY(imageData.positionY ?? 50);
    }
  }, [imageData]);

  const handleAltTextChange = (value: string) => {
    setAltText(value);
    onUpdateAltText(value);
  };

  const handlePositionXChange = (value: number[]) => {
    const x = value[0];
    setPositionX(x);
    onUpdatePosition(x, positionY);
  };

  const handlePositionYChange = (value: number[]) => {
    const y = value[0];
    setPositionY(y);
    onUpdatePosition(positionX, y);
  };

  const getImageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hero: 'Hero Image',
      about: 'About Image',
      gallery: 'Gallery Image',
      cta: 'CTA Background',
      service: 'Service Image',
    };
    return labels[type] || 'Image';
  };

  // Always render, but control visibility with isOpen
  const shouldShow = isOpen && imageData;

  return (
    <>
      {/* Backdrop - subtle overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-300',
          shouldShow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          'bg-black/20'
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          'fixed right-0 top-14 bottom-0 w-80 z-50 shadow-2xl transition-transform duration-300 ease-out',
          shouldShow ? 'translate-x-0' : 'translate-x-full',
          isDark 
            ? 'bg-slate-900 border-l border-slate-700' 
            : 'bg-white border-l border-gray-200'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between px-4 py-3 border-b',
          isDark ? 'border-slate-700' : 'border-gray-200'
        )}>
          <button
            onClick={onClose}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors',
              isDark 
                ? 'text-slate-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            {getImageTypeLabel(imageData.type)}
          </button>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="px-4"
          >
            Done
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-56px)]">
          {/* Image Preview */}
          <div className="space-y-3">
            <div className={cn(
              'relative aspect-video rounded-lg overflow-hidden border',
              isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-100'
            )}>
              {imageData && (
                <img
                  src={imageData.currentUrl}
                  alt={altText || 'Preview'}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${positionX}% ${positionY}%`
                  }}
                />
              )}
              {isRegenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className={cn(
                  'gap-2',
                  isDark && 'border-slate-600 hover:bg-slate-800'
                )}
              >
                <Wand2 className="w-4 h-4" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onChangeImage}
                disabled={isRegenerating}
                className={cn(
                  'gap-2',
                  isDark && 'border-slate-600 hover:bg-slate-800'
                )}
              >
                <ImageIcon className="w-4 h-4" />
                Change
              </Button>
            </div>
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label 
              htmlFor="alt-text"
              className={cn(
                'text-sm font-medium',
                isDark ? 'text-slate-300' : 'text-gray-700'
              )}
            >
              Alt text
            </Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => handleAltTextChange(e.target.value)}
              placeholder="Describe this image for SEO..."
              className={cn(
                isDark && 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
              )}
            />
            <p className={cn(
              'text-xs',
              isDark ? 'text-slate-500' : 'text-gray-500'
            )}>
              Helps with SEO and accessibility
            </p>
          </div>

          {/* Image Position */}
          <div className="space-y-4">
            <Label className={cn(
              'text-sm font-medium',
              isDark ? 'text-slate-300' : 'text-gray-700'
            )}>
              Image position
            </Label>

            {/* Horizontal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-slate-400' : 'text-gray-500'
                )}>
                  Horizontal
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  isDark ? 'text-slate-300' : 'text-gray-600'
                )}>
                  {positionX}%
                </span>
              </div>
              <Slider
                value={[positionX]}
                onValueChange={handlePositionXChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Vertical */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs',
                  isDark ? 'text-slate-400' : 'text-gray-500'
                )}>
                  Vertical
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  isDark ? 'text-slate-300' : 'text-gray-600'
                )}>
                  {positionY}%
                </span>
              </div>
              <Slider
                value={[positionY]}
                onValueChange={handlePositionYChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
