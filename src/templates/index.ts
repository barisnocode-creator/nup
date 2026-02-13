import { TemplateConfig, TemplateComponent } from './types';
import { HealthcareModernTemplate } from './temp1';
import { BoldAgencyTemplate } from './temp2';
import { ElegantMinimalTemplate } from './temp3';
import { VideoStudioTemplate } from './temp4-video-studio';
import { GitH1Template } from './gith1';
import { GitH2Template } from './gith2';
import { GitH3Template } from './gith3';
import { PilatesTemplate } from './pilates';

// Import preview images
import showcaseDental from '@/assets/showcase-dental.jpg';
import showcaseRestaurant from '@/assets/showcase-restaurant.jpg';
import showcaseLawOffice from '@/assets/showcase-law-office.jpg';
import showcaseDigitalAgency from '@/assets/showcase-digital-agency.jpg';
import showcaseBoutique from '@/assets/showcase-boutique.jpg';
import showcasePharmacy from '@/assets/showcase-pharmacy.jpg';
import showcaseEyeClinic from '@/assets/showcase-eye-clinic.jpg';
import showcaseFamilyDoctor from '@/assets/showcase-family-doctor.jpg';
import showcaseVideoStudio from '@/assets/showcase-video-studio.jpg';
import gith1Preview from '@/assets/gith1-preview.jpg';
import gith2Preview from '@/assets/gith2-preview.jpg';
import gith3Preview from '@/assets/gith3-preview.jpg';
import templatePilates from '@/assets/template-pilates.jpg';

// Template registry - add new templates here
const templateRegistry: Record<string, {
  config: TemplateConfig;
  component: TemplateComponent;
}> = {
  temp1: {
    config: {
      id: 'temp1',
      name: 'Modern Professional',
      description: 'Clean, professional template suitable for all business types',
      category: 'Professional',
      preview: showcaseDental,
      supportedProfessions: ['doctor', 'dentist', 'pharmacist', 'service', 'retail', 'food', 'technology', 'creative', 'other'],
      supportedTones: ['professional', 'friendly', 'premium'],
    },
    component: HealthcareModernTemplate,
  },
  temp2: {
    config: {
      id: 'temp2',
      name: 'Bold Agency',
      description: 'High-impact dark template for agencies and creatives',
      category: 'Creative',
      preview: showcaseDigitalAgency,
      supportedProfessions: ['agency', 'startup', 'tech', 'creative'],
      supportedTones: ['bold', 'modern', 'dramatic'],
    },
    component: BoldAgencyTemplate, // Different component!
  },
  temp3: {
    config: {
      id: 'temp3',
      name: 'Elegant Minimal',
      description: 'Premium minimal template with warm tones and serif typography',
      category: 'Minimal',
      preview: showcaseRestaurant,
      supportedProfessions: ['boutique', 'agency', 'consulting', 'luxury', 'restaurant', 'cafe', 'bakery'],
      supportedTones: ['elegant', 'minimal', 'premium', 'warm'],
    },
    component: ElegantMinimalTemplate,
  },
  temp4: {
    config: {
      id: 'temp4',
      name: 'Professional Services',
      description: 'Professional template for law firms, consulting, and service businesses',
      category: 'Professional',
      preview: showcaseLawOffice,
      supportedProfessions: ['lawyer', 'attorney', 'legal', 'service', 'consulting'],
      supportedTones: ['professional', 'authoritative', 'trustworthy'],
    },
    component: HealthcareModernTemplate,
  },
  temp5: {
    config: {
      id: 'temp5',
      name: 'Boutique & Retail',
      description: 'Stylish template for boutiques and retail stores',
      category: 'Retail',
      preview: showcaseBoutique,
      supportedProfessions: ['boutique', 'retail', 'fashion'],
      supportedTones: ['elegant', 'minimal', 'chic'],
    },
    component: HealthcareModernTemplate,
  },
  temp6: {
    config: {
      id: 'temp6',
      name: 'Wellness & Health',
      description: 'Clean template for pharmacies, wellness centers, and health businesses',
      category: 'Wellness',
      preview: showcasePharmacy,
      supportedProfessions: ['pharmacy', 'wellness', 'health', 'spa', 'gym'],
      supportedTones: ['clean', 'trustworthy', 'professional'],
    },
    component: HealthcareModernTemplate,
  },
  temp7: {
    config: {
      id: 'temp7',
      name: 'Medical Specialist',
      description: 'Specialized template for medical clinics and specialists',
      category: 'Medical',
      preview: showcaseEyeClinic,
      supportedProfessions: ['optometrist', 'ophthalmologist', 'eye-clinic', 'doctor', 'dentist'],
      supportedTones: ['professional', 'modern', 'clean'],
    },
    component: HealthcareModernTemplate,
  },
  temp8: {
    config: {
      id: 'temp8',
      name: 'Friendly Business',
      description: 'Warm and welcoming template for family businesses and local services',
      category: 'Local',
      preview: showcaseFamilyDoctor,
      supportedProfessions: ['family-doctor', 'general-practice', 'clinic', 'service', 'local', 'other'],
      supportedTones: ['friendly', 'warm', 'approachable'],
    },
    component: HealthcareModernTemplate,
  },
  temp9: {
    config: {
      id: 'temp9',
      name: 'AI Video Studio',
      description: 'Cinematic dark template for video production studios and creative agencies',
      category: 'Creative',
      preview: showcaseVideoStudio,
      supportedProfessions: ['video-production', 'film-studio', 'creative-agency', 'animation', 'media'],
      supportedTones: ['cinematic', 'bold', 'dramatic', 'modern'],
    },
    component: VideoStudioTemplate,
  },
  gith1: {
    config: {
      id: 'gith1',
      name: 'Modern SaaS',
      description: 'GitHub tabanlı modern SaaS landing page şablonu',
      category: 'SaaS',
      preview: gith1Preview,
      supportedProfessions: ['saas', 'startup', 'tech', 'app', 'software'],
      supportedTones: ['modern', 'tech', 'professional'],
    },
    component: GitH1Template,
  },
  gith2: {
    config: {
      id: 'gith2',
      name: 'Corporate Blue',
      description: 'Kurumsal mavi tonlarında profesyonel şablon',
      category: 'Corporate',
      preview: gith2Preview,
      supportedProfessions: ['consulting', 'finance', 'legal', 'corporate', 'business'],
      supportedTones: ['professional', 'trustworthy', 'corporate'],
    },
    component: GitH2Template,
  },
  gith3: {
    config: {
      id: 'gith3',
      name: 'Minimal Dark',
      description: 'Minimalist koyu tema, portföy ve ajanslar için',
      category: 'Minimal',
      preview: gith3Preview,
      supportedProfessions: ['creative', 'portfolio', 'agency', 'designer', 'photographer'],
      supportedTones: ['minimal', 'dark', 'elegant'],
    },
    component: GitH3Template,
  },
  pilates1: {
    config: {
      id: 'pilates1',
      name: 'Wellness Studio',
      description: 'Warm, elegant template for pilates studios, yoga centers, and wellness spaces',
      category: 'Wellness',
      preview: templatePilates,
      supportedProfessions: ['pilates', 'yoga', 'fitness', 'pt', 'gym', 'wellness', 'spa'],
      supportedTones: ['warm', 'elegant', 'premium', 'calm'],
    },
    component: PilatesTemplate,
  },
};

// Get all template configurations
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templateRegistry).map(t => t.config);
}

// Get a specific template configuration
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return templateRegistry[templateId]?.config || null;
}

// Get a template component by ID
export function getTemplate(templateId: string): TemplateComponent {
  const template = templateRegistry[templateId];
  if (!template) {
    // Fallback to temp1 if template not found
    console.warn(`Template "${templateId}" not found, falling back to temp1`);
    return templateRegistry.temp1.component;
  }
  return template.component;
}

// Automatically select the best template based on profession and tone
export function selectTemplate(
  profession: string,
  tone?: string
): string {
  const templates = Object.entries(templateRegistry);
  
  for (const [id, { config }] of templates) {
    if (config.supportedProfessions.includes(profession)) {
      if (!tone || config.supportedTones.includes(tone)) {
        return id;
      }
    }
  }
  
  // Default fallback
  return 'temp1';
}

// Export types for external use
export type { TemplateConfig };

// Export the default template ID
export const DEFAULT_TEMPLATE_ID = 'temp1';
