import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Variant {
  text: string;
  length: 'short' | 'medium' | 'long';
}

interface RegeneratePopoverProps {
  projectId: string;
  fieldPath?: string;
  currentValue?: string;
  onApply?: (newValue: string, previousValue: string) => void;
}

const lengthLabels: Record<string, string> = {
  short: 'Kısa',
  medium: 'Orta',
  long: 'Uzun',
};

export function RegeneratePopover({ projectId, fieldPath, currentValue, onApply }: RegeneratePopoverProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchVariants = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setVariants([]);
    setSelectedIdx(null);

    try {
      const { data, error } = await supabase.functions.invoke('regenerate-content', {
        body: {
          projectId,
          fieldPath: fieldPath || 'pages.home.hero.title',
          currentValue: currentValue || '',
          variants: 3,
        },
      });

      if (error) throw error;

      if (data?.variants && Array.isArray(data.variants)) {
        setVariants(data.variants);
      } else if (data?.newValue) {
        // Fallback: single value from old API
        setVariants([
          { text: data.newValue, length: 'medium' },
        ]);
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      toast({
        title: 'Hata',
        description: 'İçerik oluşturulamadı. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, fieldPath, currentValue]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    fetchVariants();
  }, [fetchVariants]);

  const handleApply = useCallback((variant: Variant) => {
    setSelectedIdx(variants.indexOf(variant));
    onApply?.(variant.text, currentValue || '');
    setOpen(false);
    toast({
      title: 'İçerik güncellendi',
      description: 'Yeni metin uygulandı.',
      action: (
        <button
          onClick={() => onApply?.(currentValue || '', variant.text)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Geri Al
        </button>
      ),
    });
  }, [variants, currentValue, onApply]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/50"
        title="İçerik Yeniden Oluştur"
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-label="Alternatif içerikler"
            className="absolute right-0 top-full mt-2 w-[300px] bg-white border border-border/50 rounded-xl shadow-2xl z-[70] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Alternatif İçerikler</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-accent/80 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg border border-border/30 space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </>
              ) : variants.length > 0 ? (
                variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApply(variant)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleApply(variant); }}
                    aria-label={`${lengthLabels[variant.length] || variant.length} varyant: ${variant.text.slice(0, 40)}`}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 group focus-visible:ring-2 focus-visible:ring-primary/50',
                      selectedIdx === idx ? 'border-primary bg-primary/5' : 'border-border/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {lengthLabels[variant.length] || variant.length}
                      </span>
                      <Check className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{variant.text}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">Henüz varyant yok</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2.5 border-t border-border/30">
              <button
                onClick={fetchVariants}
                disabled={loading}
                className="flex items-center gap-1.5 w-full justify-center py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                Tekrar Oluştur
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
