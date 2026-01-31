import { useState, useMemo } from 'react';
import { RefreshCw, Edit3, Globe, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { ImageType } from '@/pages/Studio';

interface StudioImage {
  id: string;
  type: ImageType;
  prompt: string;
  image_url: string | null;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  metadata?: Record<string, unknown>;
}

interface ImagePreviewProps {
  image: StudioImage | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onEdit: (editInstruction: string) => void;
  onApplyToWebsite: () => void;
}

export function ImagePreview({ 
  image, 
  isGenerating, 
  onRegenerate, 
  onEdit,
  onApplyToWebsite 
}: ImagePreviewProps) {
  // ALL HOOKS MUST BE AT THE TOP - before any conditional returns
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');

  // useMemo hook MUST be called before conditional returns
  const aspectRatioClass = useMemo(() => {
    const ratio = (image?.metadata as Record<string, unknown>)?.aspectRatio;
    switch (ratio) {
      case 'story': return 'aspect-[9/16] max-w-xs';
      case 'facebook-landscape': return 'aspect-[1.91/1] max-w-2xl';
      case 'twitter': return 'aspect-video max-w-2xl';
      case 'pinterest': return 'aspect-[2/3] max-w-sm';
      case 'instagram-square': return 'aspect-square max-w-lg';
      default: return 'aspect-square max-w-lg';
    }
  }, [image?.metadata]);

  // Derived values (not hooks, safe anywhere but keeping with hooks for clarity)
  const isFavicon = image?.type === 'favicon';

  const handleEditSubmit = () => {
    if (editInstruction.trim()) {
      onEdit(editInstruction.trim());
      setEditDialogOpen(false);
      setEditInstruction('');
    }
  };

  // Empty state
  if (!image && !isGenerating) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Henüz görsel yok</h3>
          <p className="text-muted-foreground max-w-md">
            Yukarıdan bir kategori seçin ve oluşturmak istediğiniz görseli tanımlayın
          </p>
        </CardContent>
      </Card>
    );
  }

  // Generating state
  if (isGenerating || image?.status === 'generating') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Görsel oluşturuluyor...</h3>
          <p className="text-muted-foreground text-sm">
            Bu işlem birkaç saniye sürebilir
          </p>
        </CardContent>
      </Card>
    );
  }

  // Failed state
  if (image?.status === 'failed') {
    return (
      <Card className="border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-medium mb-2">Görsel oluşturulamadı</h3>
          <p className="text-muted-foreground mb-4">
            Bir hata oluştu. Lütfen tekrar deneyin.
          </p>
          <Button onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Success state with image
  return (
    <>
      <Card>
        <CardContent className="p-6">
          {isFavicon ? (
            // Favicon multi-size preview
            <div className="flex flex-wrap items-end justify-center gap-6 mb-6 p-6 bg-muted/50 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-sm overflow-hidden border bg-background">
                  <img src={image?.image_url || ''} alt="16px" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded overflow-hidden border bg-background">
                  <img src={image?.image_url || ''} alt="32px" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded overflow-hidden border bg-background">
                  <img src={image?.image_url || ''} alt="48px" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground">48px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border bg-background">
                  <img src={image?.image_url || ''} alt="64px" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground">64px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-lg overflow-hidden border bg-background">
                  <img src={image?.image_url || ''} alt="128px" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground">128px</span>
              </div>
            </div>
          ) : (
            // Normal image preview
            <div className={cn("mx-auto rounded-lg overflow-hidden bg-muted mb-6", aspectRatioClass)}>
              <img
                src={image?.image_url || ''}
                alt={image?.prompt || 'Generated image'}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={onRegenerate} disabled={isGenerating}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tekrar Oluştur
            </Button>
            <Button variant="outline" onClick={() => setEditDialogOpen(true)} disabled={isGenerating}>
              <Edit3 className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
            <Button onClick={onApplyToWebsite} disabled={isGenerating}>
              <Globe className="w-4 h-4 mr-2" />
              Web Sitesine Uygula
            </Button>
          </div>

          {/* Prompt display */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Prompt:</span> {image?.prompt}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Görseli Düzenle</DialogTitle>
            <DialogDescription>
              Görseli nasıl değiştirmek istediğinizi açıklayın
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editInstruction}
            onChange={(e) => setEditInstruction(e.target.value)}
            placeholder='Örn: "Rengi maviye çevir", "Alt tarafa metin ekle", "Daha minimalist yap"'
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleEditSubmit} disabled={!editInstruction.trim()}>
              Uygula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
