import { TemplateConfig, TemplateComponent } from './types';
import { HealthcareModernTemplate } from './temp1';

// Import preview images
import showcaseDental from '@/assets/showcase-dental.jpg';
import showcaseRestaurant from '@/assets/showcase-restaurant.jpg';
import showcaseLawOffice from '@/assets/showcase-law-office.jpg';
import showcaseDigitalAgency from '@/assets/showcase-digital-agency.jpg';
import showcaseBoutique from '@/assets/showcase-boutique.jpg';
import showcasePharmacy from '@/assets/showcase-pharmacy.jpg';
import showcaseEyeClinic from '@/assets/showcase-eye-clinic.jpg';
import showcaseFamilyDoctor from '@/assets/showcase-family-doctor.jpg';

// Template registry - add new templates here
const templateRegistry: Record<string, {
  config: TemplateConfig;
  component: TemplateComponent;
}> = {
  temp1: {
    config: {
      id: 'temp1',
      name: 'Healthcare Modern',
      description: 'Clean, professional template designed for healthcare providers',
      category: 'Healthcare',
      preview: showcaseDental,
      supportedProfessions: ['doctor', 'dentist', 'pharmacist'],
      supportedTones: ['professional', 'friendly', 'premium'],
    },
    component: HealthcareModernTemplate,
  },
  temp2: {
    config: {
      id: 'temp2',
      name: 'Restaurant & Cafe',
      description: 'Elegant template for restaurants and food businesses',
      category: 'Restaurant',
      preview: showcaseRestaurant,
      supportedProfessions: ['restaurant', 'cafe', 'bakery'],
      supportedTones: ['warm', 'elegant', 'modern'],
    },
    component: HealthcareModernTemplate, // Same component for now
  },
  temp3: {
    config: {
      id: 'temp3',
      name: 'Law & Legal',
      description: 'Professional template for law firms and legal services',
      category: 'Legal',
      preview: showcaseLawOffice,
      supportedProfessions: ['lawyer', 'attorney', 'legal'],
      supportedTones: ['professional', 'authoritative', 'trustworthy'],
    },
    component: HealthcareModernTemplate,
  },
  temp4: {
    config: {
      id: 'temp4',
      name: 'Digital Agency',
      description: 'Creative template for digital agencies and tech startups',
      category: 'Agency',
      preview: showcaseDigitalAgency,
      supportedProfessions: ['agency', 'startup', 'tech'],
      supportedTones: ['creative', 'modern', 'bold'],
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
      name: 'Pharmacy & Wellness',
      description: 'Clean template for pharmacies and wellness centers',
      category: 'Healthcare',
      preview: showcasePharmacy,
      supportedProfessions: ['pharmacy', 'wellness', 'health'],
      supportedTones: ['clean', 'trustworthy', 'professional'],
    },
    component: HealthcareModernTemplate,
  },
  temp7: {
    config: {
      id: 'temp7',
      name: 'Eye Clinic',
      description: 'Specialized template for eye clinics and optometrists',
      category: 'Healthcare',
      preview: showcaseEyeClinic,
      supportedProfessions: ['optometrist', 'ophthalmologist', 'eye-clinic'],
      supportedTones: ['professional', 'modern', 'clean'],
    },
    component: HealthcareModernTemplate,
  },
  temp8: {
    config: {
      id: 'temp8',
      name: 'Family Doctor',
      description: 'Warm and welcoming template for family practices',
      category: 'Healthcare',
      preview: showcaseFamilyDoctor,
      supportedProfessions: ['family-doctor', 'general-practice', 'clinic'],
      supportedTones: ['friendly', 'warm', 'approachable'],
    },
    component: HealthcareModernTemplate,
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
