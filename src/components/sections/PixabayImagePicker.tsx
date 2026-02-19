import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PixabayImage {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
}

interface PixabayImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultQuery?: string;
}

export function PixabayImagePicker({ isOpen, onClose, onSelect, defaultQuery = 'dental clinic' }: PixabayImagePickerProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const debounceRef = { current: null as ReturnType<typeof setTimeout> | null };

  const searchImages = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-pixabay', {
        body: { query: q, perPage: 12 },
      });
      if (!error && data?.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('Pixabay search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      searchImages(defaultQuery);
    }
  }, [isOpen, defaultQuery, searchImages]);

  useEffect(() => {
    if (!isOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim()) searchImages(query);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, isOpen, searchImages]);

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSelect = (img: PixabayImage) => {
    setSelectedId(img.id);
    setTimeout(() => {
      onSelect(img.largeImageURL);
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Görsel Seç</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Pixabay'dan ücretsiz yüksek kaliteli görseller</p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-6 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Görsel ara..."
                  className="pl-9 h-10 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">Sonuç bulunamadı</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <motion.button
                      key={img.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(img)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-lg transition-all group focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={img.previewURL}
                        alt={img.tags}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Tag overlay on hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white truncate">{img.tags}</p>
                      </div>
                      {/* Selection checkmark */}
                      <AnimatePresence>
                        {selectedId === img.id && (
                          <motion.div
                            className="absolute inset-0 bg-primary/30 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', damping: 15 }}
                            >
                              <Check className="w-5 h-5 text-primary-foreground" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                Pixabay üzerinden ücretsiz görseller · ESC ile kapat
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
