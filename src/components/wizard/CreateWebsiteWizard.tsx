import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WizardProgress } from './WizardProgress';
import { AIChatStep } from './steps/AIChatStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { WizardFormData, ExtractedBusinessData } from '@/types/wizard';
import { initialWizardData } from '@/types/wizard';

interface CreateWebsiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 2;

export function CreateWebsiteWizard({ open, onOpenChange }: CreateWebsiteWizardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({
    1: false,
    2: false,
  });
  
  const [formData, setFormData] = useState<Partial<WizardFormData>>(() => ({
    ...initialWizardData,
  }));

  const handleAIChatComplete = useCallback((extractedData: ExtractedBusinessData) => {
    setFormData((prev) => ({
      ...prev,
      extractedData,
      profession: (extractedData.sector as any) || 'other',
      // Also populate legacy fields for compatibility
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
    }));
  }, []);

  const handleAIChatValidityChange = useCallback((isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, 1: isValid }));
  }, []);

  const handlePreferencesChange = useCallback((data: WizardFormData['websitePreferences']) => {
    setFormData((prev) => ({ ...prev, websitePreferences: data }));
  }, []);

  const handlePreferencesValidityChange = useCallback((isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, 2: isValid }));
  }, []);

  const canProceed = stepValidity[currentStep];

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Hata',
        description: 'Proje oluşturmak için giriş yapmalısınız.',
        variant: 'destructive',
      });
      return;
    }

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
          profession: formData.profession! as string,
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

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData({ ...initialWizardData });
    setStepValidity({ 1: false, 2: false });
    onOpenChange(false);
  };

  const handleClose = () => {
    resetWizard();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Web Sitenizi Oluşturun</DialogTitle>
        <DialogDescription className="sr-only">
          AI asistanla sohbet ederek web sitenizi oluşturun
        </DialogDescription>
        
        <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <AIChatStep
              onComplete={handleAIChatComplete}
              onValidityChange={handleAIChatValidityChange}
            />
          )}

          {currentStep === 2 && (
            <PreferencesStep
              value={{
                language: formData.websitePreferences?.language || '',
                tone: formData.websitePreferences?.tone || 'professional',
                colorPreference: formData.websitePreferences?.colorPreference || 'light',
              }}
              onChange={handlePreferencesChange}
              onValidityChange={handlePreferencesValidityChange}
            />
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={!canProceed}>
              Devam Et
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                'Web Sitesi Oluştur'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
