import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AIChatStep } from './steps/AIChatStep';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { WizardFormData, ExtractedBusinessData, Profession } from '@/types/wizard';
import { mapSectorToProfession } from '@/types/wizard';

interface CreateWebsiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWebsiteWizard({ open, onOpenChange }: CreateWebsiteWizardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const [formData, setFormData] = useState<Partial<WizardFormData>>({
    extractedData: undefined,
  });

  const handleAIChatComplete = useCallback((extractedData: ExtractedBusinessData) => {
    const profession: Profession = mapSectorToProfession(extractedData.sector);
    
    setFormData({
      extractedData,
      profession,
      businessInfo: {
        businessName: extractedData.businessName,
        city: extractedData.city,
        country: extractedData.country,
        phone: extractedData.phone,
        email: extractedData.email,
      },
      professionalDetails: {
        services: extractedData.services,
      },
      websitePreferences: {
        languages: extractedData.languages || ['Turkish'],
        tone: 'professional',
        colorTone: extractedData.colorTone || 'neutral',
        colorMode: extractedData.colorMode || 'light',
      },
    });
  }, []);

  const handleAIChatValidityChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Hata',
        description: 'Proje oluşturmak için giriş yapmalısınız.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.extractedData) {
      toast({
        title: 'Dikkat',
        description: 'Sohbet tamamlanmadan site oluşturulamaz.',
        variant: 'destructive',
      });
      return;
    }

    const profession = formData.profession || mapSectorToProfession(formData.extractedData?.sector || '');

    setIsSubmitting(true);

    try {
      const projectFormData = {
        businessInfo: formData.businessInfo,
        professionalDetails: formData.professionalDetails,
        websitePreferences: formData.websitePreferences,
        extractedData: formData.extractedData,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name: formData.extractedData?.businessName || formData.businessInfo?.businessName || 'Untitled Project',
          profession: profession as string,
          status: 'draft' as const,
          form_data: projectFormData as any,
        }])
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: 'Proje oluşturuldu!',
        description: 'Web siteniz hazırlanıyor.',
      });

      onOpenChange(false);
      navigate(`/project/${data.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Proje oluşturulamadı. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ extractedData: undefined });
    setIsValid(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Web Sitenizi Oluşturun</DialogTitle>
        <DialogDescription className="sr-only">
          AI asistanla sohbet ederek web sitenizi oluşturun
        </DialogDescription>

        <div className="min-h-[300px]">
          <AIChatStep
            onComplete={handleAIChatComplete}
            onValidityChange={handleAIChatValidityChange}
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              '🚀 Web Sitesi Oluştur'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
