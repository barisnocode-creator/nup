import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WizardProgress } from './WizardProgress';
import { ProfessionStep } from './steps/ProfessionStep';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { ProfessionalDetailsStep } from './steps/ProfessionalDetailsStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { WizardFormData, Profession } from '@/types/wizard';
import { initialWizardData } from '@/types/wizard';

interface CreateWebsiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 4;

export function CreateWebsiteWizard({ open, onOpenChange }: CreateWebsiteWizardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  
  const [formData, setFormData] = useState<Partial<WizardFormData>>(() => ({
    ...initialWizardData,
    businessInfo: {
      ...initialWizardData.businessInfo!,
      email: user?.email || '',
    },
  }));

  const handleProfessionChange = (profession: Profession) => {
    setFormData((prev) => ({ ...prev, profession }));
    setStepValidity((prev) => ({ ...prev, 1: true }));
  };

  const handleBusinessInfoChange = useCallback((data: WizardFormData['businessInfo']) => {
    setFormData((prev) => ({ ...prev, businessInfo: data }));
  }, []);

  const handleBusinessInfoValidityChange = useCallback((isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, 2: isValid }));
  }, []);

  const handleProfessionalDetailsChange = useCallback((data: WizardFormData['professionalDetails']) => {
    setFormData((prev) => ({ ...prev, professionalDetails: data }));
  }, []);

  const handleProfessionalDetailsValidityChange = useCallback((isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, 3: isValid }));
  }, []);

  const handlePreferencesChange = useCallback((data: WizardFormData['websitePreferences']) => {
    setFormData((prev) => ({ ...prev, websitePreferences: data }));
  }, []);

  const handlePreferencesValidityChange = useCallback((isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, 4: isValid }));
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
        title: 'Error',
        description: 'You must be logged in to create a project.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        user_id: user.id,
        name: formData.businessInfo?.businessName || 'Untitled Project',
        profession: formData.profession!,
        status: 'draft',
        form_data: {
          businessInfo: formData.businessInfo,
          professionalDetails: formData.professionalDetails,
          websitePreferences: formData.websitePreferences,
        },
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: 'Project created!',
        description: 'Your website is being prepared.',
      });

      onOpenChange(false);
      navigate(`/project/${data.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      ...initialWizardData,
      businessInfo: {
        ...initialWizardData.businessInfo!,
        email: user?.email || '',
      },
    });
    setStepValidity({ 1: false, 2: false, 3: false, 4: false });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create Your Website</DialogTitle>
        
        <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <ProfessionStep
              value={formData.profession}
              onChange={handleProfessionChange}
            />
          )}

          {currentStep === 2 && (
            <BusinessInfoStep
              value={formData.businessInfo!}
              onChange={handleBusinessInfoChange}
              onValidityChange={handleBusinessInfoValidityChange}
            />
          )}

          {currentStep === 3 && formData.profession && (
            <ProfessionalDetailsStep
              profession={formData.profession}
              value={formData.professionalDetails || {}}
              onChange={handleProfessionalDetailsChange}
              onValidityChange={handleProfessionalDetailsValidityChange}
            />
          )}

          {currentStep === 4 && (
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
            Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={!canProceed}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Website'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
