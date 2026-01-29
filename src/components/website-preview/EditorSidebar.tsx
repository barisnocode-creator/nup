import { useState, useEffect } from 'react';
import { ArrowLeft, Wand2, ImageIcon, Loader2, Type, Sparkles, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export interface ImageOption {
  url: string;
  thumbnail: string;
  alt: string;
}

export interface EditableFieldData {
  label: string;
  fieldPath: string;
  value: string;
  type: 'text' | 'textarea';
  canRegenerate?: boolean;
}

export interface EditorSelection {
  type: 'image' | 'text' | 'section' | 'item';
  title: string;
  sectionId?: string;
  itemIndex?: number;
  imageData?: ImageData;
  fields: EditableFieldData[];
}

export type HeroVariant = 'split' | 'overlay' | 'centered' | 'gradient';

export interface LayoutOption {
  id: string;
  label: string;
  icon: string;
}

interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selection: EditorSelection | null;
  onFieldUpdate: (fieldPath: string, value: string) => void;
  onRegenerateField: (fieldPath: string) => void;
  onImageRegenerate: () => void;
  onImageChange: (imagePath: string) => void;
  onUpdateAltText: (text: string) => void;
  onUpdatePosition: (x: number, y: number) => void;
  isRegenerating?: boolean;
  isRegeneratingField?: string | null;
  isDark?: boolean;
  // Layout variant props
  currentHeroVariant?: HeroVariant;
  onHeroVariantChange?: (variant: HeroVariant) => void;
  // Image options
  imageOptions?: ImageOption[];
  isLoadingImageOptions?: boolean;
  onSelectImageOption?: (url: string) => void;
}

const heroLayoutOptions: { id: HeroVariant; label: string; description: string }[] = [
  { id: 'split', label: 'Split', description: 'Text left, image right' },
  { id: 'overlay', label: 'Overlay', description: 'Text over image' },
  { id: 'centered', label: 'Centered', description: 'Centered text, image below' },
  { id: 'gradient', label: 'Gradient', description: 'No image, gradient background' },
];

const fontSizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'base', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'X-Large' },
  { value: '2xl', label: '2X-Large' },
];

const textColorOptions = [
  { value: 'primary', label: 'Primary', color: 'bg-primary' },
  { value: 'secondary', label: 'Secondary', color: 'bg-secondary' },
  { value: 'muted', label: 'Muted', color: 'bg-muted-foreground' },
];

export function EditorSidebar({
  isOpen,
  onClose,
  selection,
  onFieldUpdate,
  onRegenerateField,
  onImageRegenerate,
  onImageChange,
  onUpdateAltText,
  onUpdatePosition,
  isRegenerating = false,
  isRegeneratingField = null,
  isDark = false,
  currentHeroVariant = 'overlay',
  onHeroVariantChange,
  imageOptions = [],
  isLoadingImageOptions = false,
  onSelectImageOption,
}: EditorSidebarProps) {
  const [localFields, setLocalFields] = useState<Record<string, string>>({});
  const [altText, setAltText] = useState('');
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [fontSize, setFontSize] = useState('base');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('primary');

  // Sync state when selection changes
  useEffect(() => {
    if (selection) {
      const fieldValues: Record<string, string> = {};
      selection.fields.forEach(field => {
        fieldValues[field.fieldPath] = field.value;
      });
      setLocalFields(fieldValues);

      if (selection.imageData) {
        setAltText(selection.imageData.altText || '');
        setPositionX(selection.imageData.positionX ?? 50);
        setPositionY(selection.imageData.positionY ?? 50);
      }
    }
  }, [selection]);

  const handleFieldChange = (fieldPath: string, value: string) => {
    setLocalFields(prev => ({ ...prev, [fieldPath]: value }));
    onFieldUpdate(fieldPath, value);
  };

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

  const shouldShow = isOpen && selection;

  const hasImage = selection?.type === 'image' || (selection?.type === 'item' && selection?.imageData);
  const hasFields = selection?.fields && selection.fields.length > 0;
  const isHeroSection = selection?.sectionId === 'hero';

  return (
    <>
      {/* Backdrop */}
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
            {selection?.title || 'Editor'}
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
        <div className="h-[calc(100%-56px)] overflow-hidden">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className={cn(
              'w-full justify-start rounded-none border-b px-4 pt-2',
              isDark ? 'border-slate-700 bg-transparent' : 'border-gray-200 bg-transparent'
            )}>
              <TabsTrigger 
                value="content"
                className={cn(
                  'data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none',
                  isDark && 'text-slate-400 data-[state=active]:text-white'
                )}
              >
                Content
              </TabsTrigger>
              <TabsTrigger 
                value="style"
                className={cn(
                  'data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none',
                  isDark && 'text-slate-400 data-[state=active]:text-white'
                )}
              >
                Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-6 mt-0">
              {/* Image Section */}
              {hasImage && selection?.imageData && (
                <div className="space-y-3">
                  <div className={cn(
                    'relative aspect-video rounded-lg overflow-hidden border',
                    isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-100'
                  )}>
                    <img
                      src={selection.imageData.currentUrl}
                      alt={altText || 'Preview'}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${positionX}% ${positionY}%`
                      }}
                    />
                    {isRegenerating && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Image Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onImageRegenerate}
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
                      onClick={() => selection.imageData && onImageChange(selection.imageData.imagePath)}
                      disabled={isRegenerating || isLoadingImageOptions}
                      className={cn(
                        'gap-2',
                        isDark && 'border-slate-600 hover:bg-slate-800'
                      )}
                    >
                      {isLoadingImageOptions ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      Change
                    </Button>
                  </div>

                  {/* Image Options Grid */}
                  {imageOptions.length > 0 && (
                    <div className="space-y-2">
                      <Label className={cn(
                        'text-sm font-medium',
                        isDark ? 'text-slate-300' : 'text-gray-700'
                      )}>
                        Choose an alternative
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {imageOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => onSelectImageOption?.(option.url)}
                            className={cn(
                              'relative aspect-video rounded-md overflow-hidden border-2 transition-all hover:border-primary',
                              isDark ? 'border-slate-700 hover:border-primary' : 'border-gray-200'
                            )}
                          >
                            <img
                              src={option.thumbnail}
                              alt={option.alt}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoadingImageOptions && (
                    <div className={cn(
                      'flex items-center justify-center py-4 gap-2',
                      isDark ? 'text-slate-400' : 'text-gray-500'
                    )}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading alternatives...</span>
                    </div>
                  )}

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
                  </div>

                  {/* Image Position */}
                  <div className="space-y-4">
                    <Label className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    )}>
                      Image position
                    </Label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-gray-500')}>
                          Horizontal
                        </span>
                        <span className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-gray-600')}>
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-gray-500')}>
                          Vertical
                        </span>
                        <span className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-gray-600')}>
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

                  {/* Divider if there are also text fields */}
                  {hasFields && (
                    <div className={cn(
                      'border-t pt-4',
                      isDark ? 'border-slate-700' : 'border-gray-200'
                    )} />
                  )}
                </div>
              )}

              {/* Text Fields */}
              {hasFields && selection?.fields.map((field) => (
                <div key={field.fieldPath} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className={cn(
                      'text-sm font-medium flex items-center gap-2',
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    )}>
                      <Type className="w-3.5 h-3.5" />
                      {field.label}
                    </Label>
                    {field.canRegenerate !== false && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerateField(field.fieldPath)}
                        disabled={isRegeneratingField === field.fieldPath}
                        className={cn(
                          'h-7 px-2 gap-1.5 text-xs',
                          isDark 
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                            : 'text-gray-500 hover:text-gray-900'
                        )}
                      >
                        {isRegeneratingField === field.fieldPath ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        Regenerate
                      </Button>
                    )}
                  </div>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={localFields[field.fieldPath] || ''}
                      onChange={(e) => handleFieldChange(field.fieldPath, e.target.value)}
                      rows={4}
                      className={cn(
                        'resize-none',
                        isDark && 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                      )}
                    />
                  ) : (
                    <Input
                      value={localFields[field.fieldPath] || ''}
                      onChange={(e) => handleFieldChange(field.fieldPath, e.target.value)}
                      className={cn(
                        isDark && 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                      )}
                    />
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="style" className="flex-1 overflow-y-auto p-4 mt-0 space-y-6">
              {/* Hero Layout Options */}
              {isHeroSection && onHeroVariantChange && (
                <div className="space-y-4">
                  <Label className={cn(
                    'text-sm font-medium',
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  )}>
                    Layout Style
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {heroLayoutOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => onHeroVariantChange(option.id)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-left transition-all',
                          currentHeroVariant === option.id
                            ? 'border-primary bg-primary/10'
                            : isDark 
                              ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50' 
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50',
                          isDark ? 'text-white' : 'text-gray-900'
                        )}
                      >
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className={cn(
                          'text-xs mt-1',
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        )}>
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Font Size */}
              <div className="space-y-3">
                <Label className={cn(
                  'text-sm font-medium',
                  isDark ? 'text-slate-300' : 'text-gray-700'
                )}>
                  Font Size
                </Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className={cn(
                    isDark && 'bg-slate-800 border-slate-700 text-white'
                  )}>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Alignment */}
              <div className="space-y-3">
                <Label className={cn(
                  'text-sm font-medium',
                  isDark ? 'text-slate-300' : 'text-gray-700'
                )}>
                  Text Alignment
                </Label>
                <div className="flex gap-2">
                  {[
                    { value: 'left', icon: AlignLeft },
                    { value: 'center', icon: AlignCenter },
                    { value: 'right', icon: AlignRight },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTextAlign(value as 'left' | 'center' | 'right')}
                      className={cn(
                        'flex-1 p-2 rounded-lg border transition-all flex items-center justify-center',
                        textAlign === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : isDark 
                            ? 'border-slate-700 hover:border-slate-600 text-slate-400' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-3">
                <Label className={cn(
                  'text-sm font-medium',
                  isDark ? 'text-slate-300' : 'text-gray-700'
                )}>
                  Text Color
                </Label>
                <div className="flex gap-2">
                  {textColorOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTextColor(option.value)}
                      className={cn(
                        'flex-1 p-2 rounded-lg border transition-all flex items-center justify-center gap-2',
                        textColor === option.value
                          ? 'border-primary bg-primary/10'
                          : isDark 
                            ? 'border-slate-700 hover:border-slate-600' 
                            : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className={cn('w-4 h-4 rounded-full', option.color)} />
                      <span className={cn(
                        'text-xs font-medium',
                        isDark ? 'text-slate-300' : 'text-gray-700'
                      )}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coming Soon Message for non-hero sections */}
              {!isHeroSection && (
                <div className={cn(
                  'p-4 rounded-lg border text-center',
                  isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                )}>
                  <Sparkles className={cn(
                    'w-6 h-6 mx-auto mb-2',
                    isDark ? 'text-slate-500' : 'text-gray-400'
                  )} />
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-slate-400' : 'text-gray-500'
                  )}>
                    More style options for this section coming soon
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
