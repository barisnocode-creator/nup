import { Eye, Check, X } from 'lucide-react';
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
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm opacity-90">Önizleniyor:</span>
            <strong className="ml-2 font-semibold">{templateName}</strong>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isApplying}
            className="text-white hover:bg-white/20 hover:text-white gap-2"
          >
            <X className="w-4 h-4" />
            İptal
          </Button>
          <Button
            size="sm"
            onClick={onApply}
            disabled={isApplying}
            className="bg-white text-purple-600 hover:bg-gray-100 gap-2 font-semibold"
          >
            <Check className="w-4 h-4" />
            {isApplying ? 'Uygulanıyor...' : 'Uygula'}
          </Button>
        </div>
      </div>
    </div>
  );
}
