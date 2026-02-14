import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, Loader2, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PixabayImage {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
}

interface InlineImageSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  profession: string;
  currentImageSrc?: string;
  /** Position anchor point */
  anchorRect?: DOMRect | null;
}

// Map profession keywords to good search terms
function getSearchTerms(profession: string): string[] {
  const prof = profession.toLowerCase();
  const map: Record<string, string[]> = {
    'doktor': ['medical clinic modern', 'doctor office', 'healthcare professional', 'hospital interior'],
    'diş': ['dental clinic', 'dentist office modern', 'dental care', 'smile teeth'],
    'avukat': ['law office', 'lawyer professional', 'legal justice', 'courtroom modern'],
    'restoran': ['restaurant food', 'gourmet dining', 'chef cooking', 'restaurant interior'],
    'kafe': ['cafe coffee', 'coffee shop interior', 'barista', 'cafe food'],
    'güzellik': ['beauty salon', 'spa wellness', 'skincare beauty', 'hair salon'],
    'eczane': ['pharmacy modern', 'medicine health', 'drugstore', 'pharmaceutical'],
    'pilates': ['pilates yoga', 'fitness studio', 'wellness exercise', 'gym workout'],
    'video': ['video production', 'film studio', 'camera cinematography', 'video editing'],
    'teknoloji': ['technology startup', 'software development', 'tech office', 'digital innovation'],
    'e-ticaret': ['ecommerce shopping', 'online store', 'retail product', 'shopping bag'],
    'emlak': ['real estate', 'modern house', 'apartment interior', 'property building'],
    'eğitim': ['education school', 'classroom learning', 'teacher student', 'university campus'],
    'fotoğraf': ['photography studio', 'camera lens', 'photo portrait', 'creative photography'],
    'mimarlık': ['architecture modern', 'building design', 'architectural interior', 'urban design'],
    'danışman': ['business consulting', 'professional meeting', 'corporate office', 'strategy planning'],
  };

  // Find matching key
  for (const [key, terms] of Object.entries(map)) {
    if (prof.includes(key)) return terms;
  }

  // Fallback: use profession directly with generic business terms
  return [
    `${profession} professional`,
    `${profession} business`,
    `modern office ${profession}`,
    `${profession} service`,
  ];
}

export function InlineImageSwitcher({
  isOpen,
  onClose,
  onSelect,
  profession,
  currentImageSrc,
}: InlineImageSwitcherProps) {
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [customQuery, setCustomQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchTerms = getSearchTerms(profession);

  // Auto-fetch on open
  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      setCurrentTermIndex(0);
      setShowSearch(false);
      setCustomQuery('');
      fetchImages(searchTerms[0]);
    }
  }, [isOpen, profession]);

  const fetchImages = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-pixabay', {
        body: { query, perPage: 8 },
      });
      if (!error && data?.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('Fetch images error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    const nextIndex = (currentTermIndex + 1) % searchTerms.length;
    setCurrentTermIndex(nextIndex);
    fetchImages(searchTerms[nextIndex]);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      fetchImages(customQuery.trim());
    }
  };

  const handleSelectImage = (image: PixabayImage) => {
    setSelectedId(image.id);
    onSelect(image.largeImageURL);
    // Close after a brief delay for visual feedback
    setTimeout(() => onClose(), 400);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] pointer-events-none">
      <div
        ref={panelRef}
        className={cn(
          'pointer-events-auto w-[calc(100vw-2rem)] max-w-[420px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-black/10',
          'flex flex-col overflow-hidden',
          'animate-in fade-in slide-in-from-bottom-4 duration-300',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Görsel Seç</span>
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {profession}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground"
              title="Ara"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
              title="Farklı görseller"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar (toggleable) */}
        {showSearch && (
          <form onSubmit={handleCustomSearch} className="px-4 py-2 border-b border-black/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Örn: modern ofis, restoran..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !customQuery.trim()}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                Ara
              </button>
            </div>
          </form>
        )}

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Görseller yükleniyor...</span>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image) => {
                const isSelected = selectedId === image.id;
                return (
                  <button
                    key={image.id}
                    onClick={() => handleSelectImage(image)}
                    className={cn(
                      'relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 group',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 scale-[0.97]'
                        : 'border-transparent hover:border-primary/40 hover:scale-[1.02]',
                    )}
                  >
                    <img
                      src={image.previewURL}
                      alt={image.tags}
                      className={cn(
                        'w-full h-full object-cover transition-all duration-500',
                        isSelected && 'brightness-110',
                      )}
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className={cn(
                      'absolute inset-0 transition-all duration-200',
                      isSelected
                        ? 'bg-primary/20'
                        : 'bg-black/0 group-hover:bg-black/10',
                    )} />
                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                        <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="text-xs text-muted-foreground">Görsel bulunamadı</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-black/5 text-center">
          <span className="text-[10px] text-muted-foreground">
            Görseller Pixabay tarafından sağlanmaktadır
          </span>
        </div>
      </div>
    </div>
  );
}
