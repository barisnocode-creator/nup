import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadButtonProps {
  projectId: string;
  onUploadComplete: (publicUrl: string) => void;
  disabled?: boolean;
  isDark?: boolean;
  className?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploadButton({
  projectId,
  onUploadComplete,
  disabled = false,
  isDark = false,
  className,
}: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again
    event.target.value = '';

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Desteklenmeyen dosya formatı', {
        description: 'Lütfen JPG, PNG veya WebP formatında bir görsel seçin.',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('Dosya çok büyük', {
        description: `Maksimum dosya boyutu ${MAX_SIZE_MB}MB olmalıdır.`,
      });
      return;
    }

    if (!user) {
      toast.error('Oturum açmanız gerekiyor');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;
      
      // Path: user_id/project_id/filename
      const filePath = `${user.id}/${projectId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Public URL alınamadı');
      }

      toast.success('Görsel yüklendi!');
      onUploadComplete(urlData.publicUrl);

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Yükleme başarısız', {
        description: error instanceof Error ? error.message : 'Bir hata oluştu',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={cn(
          'gap-2',
          isDark && 'border-slate-600 hover:bg-slate-800',
          className
        )}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        Yükle
      </Button>
    </>
  );
}
