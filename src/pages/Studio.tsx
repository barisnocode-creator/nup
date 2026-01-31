import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ImageTypeCards } from '@/components/studio/ImageTypeCards';
import { PromptInput } from '@/components/studio/PromptInput';
import { ImagePreview } from '@/components/studio/ImagePreview';
import { ImageGallery } from '@/components/studio/ImageGallery';
import { ApplyToWebsiteModal } from '@/components/studio/ApplyToWebsiteModal';
import { AspectRatioSelector, type AspectRatioOption } from '@/components/studio/AspectRatioSelector';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type ImageType = 'logo' | 'favicon' | 'social' | 'poster' | 'creative';

interface StudioImage {
  id: string;
  type: ImageType;
  prompt: string;
  image_url: string | null;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  metadata: Record<string, any>;
}

interface Project {
  id: string;
  name: string;
}

export default function Studio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ImageType>('logo');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioOption>('instagram-square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<StudioImage | null>(null);
  const [images, setImages] = useState<StudioImage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch user's studio images
  useEffect(() => {
    async function fetchImages() {
      if (!user) return;

      const { data, error } = await supabase
        .from('studio_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching studio images:', error);
      } else {
        setImages((data as StudioImage[]) || []);
      }
      setLoadingImages(false);
    }

    fetchImages();
  }, [user]);

  // Fetch user's projects for apply modal
  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    }

    fetchProjects();
  }, [user]);

  const handleGenerate = async (prompt: string) => {
    if (!user) return;

    setIsGenerating(true);
    
    try {
      // Create a placeholder record
      const { data: imageRecord, error: insertError } = await supabase
        .from('studio_images')
        .insert({
          user_id: user.id,
          type: selectedType,
          prompt,
          status: 'generating',
          metadata: { 
            style: 'modern',
            aspectRatio: selectedType === 'social' ? selectedAspectRatio : undefined
          }
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentImage(imageRecord as StudioImage);

      // Call the edge function to generate the image
      const { data, error } = await supabase.functions.invoke('studio-generate-image', {
        body: {
          type: selectedType,
          prompt,
          imageId: imageRecord.id,
          aspectRatio: selectedType === 'social' ? selectedAspectRatio : undefined,
        }
      });

      if (error) throw error;

      if (data.success) {
        // Refresh the image record
        const { data: updatedImage } = await supabase
          .from('studio_images')
          .select('*')
          .eq('id', imageRecord.id)
          .single();

        if (updatedImage) {
          setCurrentImage(updatedImage as StudioImage);
          setImages(prev => [updatedImage as StudioImage, ...prev.filter(img => img.id !== updatedImage.id)]);
        }

        toast({
          title: "Görsel oluşturuldu!",
          description: "Görseliniz başarıyla oluşturuldu.",
        });
      } else {
        throw new Error(data.error || 'Görsel oluşturulamadı');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: "Hata",
        description: error.message || "Görsel oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
      
      // Update status to failed
      if (currentImage?.id) {
        await supabase
          .from('studio_images')
          .update({ status: 'failed' })
          .eq('id', currentImage.id);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentImage) return;
    await handleGenerate(currentImage.prompt);
  };

  const handleEdit = async (editInstruction: string) => {
    if (!currentImage || !user) return;

    setIsGenerating(true);

    try {
      // Create a new record for the edited version
      const { data: imageRecord, error: insertError } = await supabase
        .from('studio_images')
        .insert({
          user_id: user.id,
          type: currentImage.type,
          prompt: `${currentImage.prompt} - Düzenleme: ${editInstruction}`,
          status: 'generating',
          metadata: { 
            style: 'modern',
            editedFrom: currentImage.id,
            editInstruction 
          }
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentImage(imageRecord as StudioImage);

      // Call the edge function with edit instruction
      const { data, error } = await supabase.functions.invoke('studio-generate-image', {
        body: {
          type: currentImage.type,
          prompt: currentImage.prompt,
          imageId: imageRecord.id,
          editInstruction,
          previousImageUrl: currentImage.image_url,
        }
      });

      if (error) throw error;

      if (data.success) {
        const { data: updatedImage } = await supabase
          .from('studio_images')
          .select('*')
          .eq('id', imageRecord.id)
          .single();

        if (updatedImage) {
          setCurrentImage(updatedImage as StudioImage);
          setImages(prev => [updatedImage as StudioImage, ...prev.filter(img => img.id !== updatedImage.id)]);
        }

        toast({
          title: "Görsel düzenlendi!",
          description: "Görseliniz başarıyla güncellendi.",
        });
      } else {
        throw new Error(data.error || 'Görsel düzenlenemedi');
      }
    } catch (error: any) {
      console.error('Error editing image:', error);
      toast({
        title: "Hata",
        description: error.message || "Görsel düzenlenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectFromGallery = (image: StudioImage) => {
    setCurrentImage(image);
    setSelectedType(image.type);
  };

  const handleApplyToWebsite = () => {
    if (!currentImage?.image_url) return;
    setApplyModalOpen(true);
  };

  const handleDelete = async (imageId: string) => {
    const { error } = await supabase
      .from('studio_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      toast({
        title: "Hata",
        description: "Görsel silinemedi.",
        variant: "destructive",
      });
    } else {
      setImages(prev => prev.filter(img => img.id !== imageId));
      if (currentImage?.id === imageId) {
        setCurrentImage(null);
      }
      toast({
        title: "Silindi",
        description: "Görsel başarıyla silindi.",
      });
    }
  };

  const completedImagesCount = images.filter(img => img.status === 'completed').length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Studio</h1>
          <p className="text-muted-foreground">
            AI ile profesyonel görseller oluşturun
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">{completedImagesCount}/5</span>
        </div>
      </div>

      {/* Image Type Cards */}
      <ImageTypeCards 
        selectedType={selectedType} 
        onSelectType={setSelectedType} 
      />

      {/* Aspect Ratio Selector - only for social type */}
      {selectedType === 'social' && (
        <AspectRatioSelector
          selectedRatio={selectedAspectRatio}
          onSelectRatio={setSelectedAspectRatio}
        />
      )}

      {/* Current Image Preview or Empty State */}
      <div className="my-8">
        <ImagePreview
          image={currentImage}
          isGenerating={isGenerating}
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
          onApplyToWebsite={handleApplyToWebsite}
        />
      </div>

      {/* Prompt Input */}
      <PromptInput
        selectedType={selectedType}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Gallery */}
      <div className="mt-12">
        <ImageGallery
          images={images}
          loading={loadingImages}
          onSelect={handleSelectFromGallery}
          onDelete={handleDelete}
          selectedImageId={currentImage?.id}
        />
      </div>

      {/* Apply to Website Modal */}
      <ApplyToWebsiteModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        imageUrl={currentImage?.image_url || ''}
        imageType={currentImage?.type || 'logo'}
        projects={projects}
      />
    </DashboardLayout>
  );
}
