import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChaiBuilderSaveData {
  blocks: any[];
  theme?: any;
  globalStyles?: any;
}

export function useChaiBuilderSave(projectId: string) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveToSupabase = useCallback(async (data: ChaiBuilderSaveData): Promise<boolean> => {
    if (!projectId) {
      console.error('Project ID is required');
      return false;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          chai_blocks: data.blocks,
          chai_theme: data.theme || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) {
        console.error('Supabase save error:', error);
        toast({
          title: 'Kaydetme Hatası',
          description: 'Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Kaydedildi',
        description: 'Değişiklikleriniz başarıyla kaydedildi.',
      });
      
      return true;
    } catch (err) {
      console.error('Save exception:', err);
      toast({
        title: 'Hata',
        description: 'Beklenmeyen bir hata oluştu.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [projectId, toast]);

  return { saveToSupabase, isSaving };
}

export function useChaiBuilderLoad(projectId: string) {
  const [isLoading, setIsLoading] = useState(false);

  const loadFromSupabase = useCallback(async () => {
    if (!projectId) return null;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('chai_blocks, chai_theme, generated_content')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Load error:', error);
        return null;
      }

      return {
        blocks: data?.chai_blocks || [],
        theme: data?.chai_theme || {},
        generatedContent: data?.generated_content,
      };
    } catch (err) {
      console.error('Load exception:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  return { loadFromSupabase, isLoading };
}
