import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChaiImageActionOverlayProps {
  onChangeImage: () => void;
  onRegenerate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEditSection?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function ChaiImageActionOverlay({
  onChangeImage,
  onRegenerate,
  onMoveUp,
  onMoveDown,
  onEditSection,
  onDuplicate,
  onDelete,
  disabled = false,
}: ChaiImageActionOverlayProps) {
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showMore) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMore]);

  if (disabled) {
    return (
      <div className="flex items-center bg-black/60 backdrop-blur-md rounded-lg px-3 py-1.5">
        <span className="text-[12px] text-white/70 font-medium">🔒 Kilitli</span>
      </div>
    );
  }

  const btnBase =
    'px-2.5 py-1.5 text-[12px] font-medium text-white/90 hover:bg-white/15 hover:text-white active:scale-[0.96] transition-all whitespace-nowrap';
  const iconBtn =
    'p-1.5 text-white/80 hover:bg-white/15 hover:text-white active:scale-[0.96] transition-all';

  return (
    <div className="flex items-center bg-black/70 backdrop-blur-md rounded-lg shadow-xl border border-white/10 overflow-visible">
      {/* Change Image */}
      <button
        className={btnBase}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onChangeImage(); }}
        title="Görseli değiştir"
      >
        Değiştir
      </button>

      <div className="w-px h-5 bg-white/20" />

      {/* Regenerate */}
      {onRegenerate && (
        <>
          <button
            className={btnBase}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRegenerate(); }}
            title="Yeni görsel öner"
          >
            Yenile
          </button>
          <div className="w-px h-5 bg-white/20" />
        </>
      )}

      {/* Move Up */}
      {onMoveUp && (
        <button
          className={iconBtn}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onMoveUp(); }}
          title="Yukarı taşı"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}

      {/* Move Down */}
      {onMoveDown && (
        <button
          className={iconBtn}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onMoveDown(); }}
          title="Aşağı taşı"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* More Options */}
      {(onEditSection || onDuplicate || onDelete) && (
        <>
          <div className="w-px h-5 bg-white/20" />
          <div className="relative" ref={moreRef}>
            <button
              className={iconBtn}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowMore(!showMore); }}
              title="Diğer seçenekler"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMore && (
              <div
                className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-2xl border border-black/10 min-w-[160px] py-1 z-50"
                style={{ animation: 'fadeIn 140ms ease-out' }}
              >
                {onEditSection && (
                  <button
                    className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setShowMore(false); onEditSection(); }}
                  >
                    Bölümü Düzenle
                  </button>
                )}
                {onDuplicate && (
                  <button
                    className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setShowMore(false); onDuplicate(); }}
                  >
                    Çoğalt
                  </button>
                )}
                {onDelete && (
                  <>
                    <div className="my-1 border-t border-gray-200" />
                    <button
                      className="w-full text-left px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setShowMore(false); onDelete(); }}
                    >
                      Sil
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
