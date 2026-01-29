import { z } from 'zod';

// Sector types (previously Profession)
export type Profession = 'service' | 'retail' | 'food' | 'creative' | 'technology' | 'other';

// Step 1: Sector Selection
export const professionSchema = z.object({
  profession: z.enum(['service', 'retail', 'food', 'creative', 'technology', 'other'], {
    required_error: 'Lütfen bir sektör seçin',
  }),
});

// Step 2: Business Information (legacy - kept for backwards compatibility)
export const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(100, 'Name must be less than 100 characters'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
});

// Step 3: Professional Details (conditional schemas - legacy)
export const doctorDetailsSchema = z.object({
  specialty: z.string().min(1, 'Please select your specialty'),
  yearsExperience: z.string().min(1, 'Please select years of experience'),
});

export const dentistDetailsSchema = z.object({
  services: z.array(z.string()).min(1, 'Please select at least one service'),
});

export const pharmacistDetailsSchema = z.object({
  pharmacyType: z.string().min(1, 'Please select pharmacy type'),
});

// Step 4: Website Preferences
export const preferencesSchema = z.object({
  language: z.string().min(1, 'Please select a language'),
  tone: z.enum(['professional', 'friendly', 'premium'], {
    required_error: 'Please select a tone',
  }),
  colorPreference: z.enum(['light', 'dark', 'neutral'], {
    required_error: 'Please select a color preference',
  }),
});

// AI Chat extracted data
export interface ExtractedBusinessData {
  businessName: string;
  sector: string;
  city: string;
  country: string;
  yearsExperience: string;
  services: string[];
  targetAudience: string;
  uniqueValue: string;
  phone: string;
  email: string;
  workingHours: string;
  address: string;
  story: string;
  vision: string;
  achievements: string;
  siteGoals: string;
  mainCTA: string;
  additionalInfo: string;
}

// Combined form data type
export interface WizardFormData {
  profession: Profession;
  businessInfo: z.infer<typeof businessInfoSchema>;
  professionalDetails: {
    specialty?: string;
    yearsExperience?: string;
    services?: string[];
    pharmacyType?: string;
  };
  websitePreferences: z.infer<typeof preferencesSchema>;
  // New: AI extracted data
  extractedData?: ExtractedBusinessData;
}

// Initial empty state
export const initialWizardData: Partial<WizardFormData> = {
  profession: undefined,
  businessInfo: {
    businessName: '',
    city: '',
    country: '',
    phone: '',
    email: '',
  },
  professionalDetails: {},
  websitePreferences: {
    language: '',
    tone: 'professional',
    colorPreference: 'light',
  },
  extractedData: undefined,
};

// Options for dropdowns
export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland',
  'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland',
  'Portugal', 'Poland', 'Brazil', 'Mexico', 'Argentina', 'India',
  'Japan', 'China', 'South Korea', 'Singapore', 'United Arab Emirates',
  'Saudi Arabia', 'Egypt', 'South Africa', 'Nigeria', 'Other',
];

export const MEDICAL_SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Ophthalmology',
  'Gastroenterology',
  'Oncology',
  'Other',
];

export const YEARS_EXPERIENCE = [
  '0-2 years',
  '3-5 years',
  '6-10 years',
  '10-20 years',
  '20+ years',
];

export const DENTAL_SERVICES = [
  'General Dentistry',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Periodontics',
  'Pediatric Dentistry',
  'Oral Surgery',
  'Endodontics',
];

export const PHARMACY_TYPES = [
  { value: 'local', label: 'Local / Community Pharmacy' },
  { value: '24h', label: '24-Hour Pharmacy' },
  { value: 'hospital', label: 'Hospital / Clinical Pharmacy' },
];

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Chinese',
  'Portuguese',
  'Italian',
  'Dutch',
  'Turkish',
  'Other',
];
