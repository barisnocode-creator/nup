import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplatePreviewBannerProps {
  templateName: string;
  onApply: () => void;
  onCancel: () => void;
  isApplying?: boolean;
}

export function TemplatePreviewBanner({
  templateName,
  onApply,
  onCancel,
  isApplying = false,
}: TemplatePreviewBannerProps) {
  return (
    <motion.div
      className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 shadow-lg"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ willChange: 'transform' }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm opacity-90">Önizleniyor:</span>
          <strong className="text-sm sm:text-base font-semibold">{templateName}</strong>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isApplying}
            className="text-white hover:bg-white/20 hover:text-white gap-1.5 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            İptal
          </Button>
          <Button
            size="sm"
            onClick={onApply}
            disabled={isApplying}
            className="bg-white text-purple-600 hover:bg-gray-100 gap-1.5 sm:gap-2 font-semibold flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {isApplying ? 'Uygulanıyor...' : 'Uygula'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
