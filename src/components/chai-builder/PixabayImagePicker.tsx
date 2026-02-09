import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, X, Loader2, ImageIcon, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface PixabayImage {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
}

interface PixabayImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
  defaultQuery?: string;
}

const SUGGESTION_TAGS = [
  { label: 'Ofis', query: 'modern office interior' },
  { label: 'Restoran', query: 'restaurant food dining' },
  { label: 'Kafe', query: 'cafe coffee shop' },
  { label: 'Doktor', query: 'medical clinic doctor' },
  { label: 'Teknoloji', query: 'technology startup' },
  { label: 'Mağaza', query: 'retail store shopping' },
  { label: 'Doğa', query: 'nature landscape' },
  { label: 'Ekip', query: 'team collaboration business' },
  { label: 'Tasarım', query: 'creative design studio' },
  { label: 'Güzellik', query: 'beauty salon spa' },
];

export function PixabayImagePicker({
  open,
  onOpenChange,
  onSelect,
  defaultQuery = '',
}: PixabayImagePickerProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const searchImages = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelectedId(null);

    try {
      const { data, error } = await supabase.functions.invoke('search-pixabay', {
        body: { query: searchQuery.trim(), perPage: 20 },
      });

      if (error) {
        console.error('Pixabay search error:', error);
        setImages([]);
        return;
      }

      setImages(data?.images || []);
    } catch (err) {
      console.error('Search failed:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(query);
  };

  const handleTagClick = (tagQuery: string, label: string) => {
    setQuery(label);
    searchImages(tagQuery);
  };

  const handleSelectImage = (image: PixabayImage) => {
    setSelectedId(image.id);
    onSelect(image.largeImageURL);
    onOpenChange(false);
    // Reset for next open
    setTimeout(() => setSelectedId(null), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col gap-0">
        <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <DialogTitle className="text-base font-semibold mb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Görsel Ara
          </DialogTitle>

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Görsel ara... (ör: kafe, restoran, ofis)"
                className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setImages([]); setSearched(false); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ara'}
            </button>
          </form>

          {/* Suggestion tags */}
          {!searched && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {SUGGESTION_TAGS.map((tag) => (
                <button
                  key={tag.query}
                  onClick={() => handleTagClick(tag.query, tag.label)}
                  className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Görseller aranıyor...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleSelectImage(image)}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedId === image.id
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image.previewURL}
                    alt={image.tags}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {selectedId === image.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] truncate">{image.tags}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : searched ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Sonuç bulunamadı</p>
              <p className="text-xs text-muted-foreground/60">Farklı anahtar kelimeler deneyin</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Search className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Arama yaparak görsellere göz atın</p>
              <p className="text-xs text-muted-foreground/60">Üstteki etiketleri de kullanabilirsiniz</p>
            </div>
          )}
        </div>

        {/* Pixabay attribution */}
        {images.length > 0 && (
          <div className="px-4 py-2 border-t border-border text-center shrink-0">
            <span className="text-[10px] text-muted-foreground">
              Görseller{' '}
              <a
                href="https://pixabay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Pixabay
              </a>
              {' '}tarafından sağlanmaktadır
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
