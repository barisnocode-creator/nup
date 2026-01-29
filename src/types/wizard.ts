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
  languages: z.array(z.string()).min(1, 'Please select at least one language'),
  tone: z.enum(['professional', 'friendly', 'premium'], {
    required_error: 'Please select a tone',
  }),
  colorTone: z.enum(['warm', 'cool', 'neutral']).optional(),
  colorMode: z.enum(['light', 'dark', 'neutral']).optional(),
});

// AI Chat extracted data - includes website preferences
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
  // Website preferences from AI chat
  colorTone?: 'warm' | 'cool' | 'neutral';
  colorMode?: 'light' | 'dark' | 'neutral';
  languages?: string[];
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
  websitePreferences: {
    languages: string[];
    tone: 'professional' | 'friendly' | 'premium';
    colorTone?: 'warm' | 'cool' | 'neutral';
    colorMode?: 'light' | 'dark' | 'neutral';
  };
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
    languages: ['Turkish'],
    tone: 'professional',
    colorTone: 'neutral',
    colorMode: 'light',
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

// Simplified language options - only Turkish and English
export const LANGUAGES = [
  { value: 'Turkish', label: 'Türkçe' },
  { value: 'English', label: 'İngilizce' },
];

// Sector mapping for AI responses
export const SECTOR_MAPPING: Record<string, Profession> = {
  // Turkish terms
  'hizmet': 'service',
  'danışmanlık': 'service',
  'consulting': 'service',
  'perakende': 'retail',
  'mağaza': 'retail',
  'store': 'retail',
  'yiyecek': 'food',
  'restoran': 'food',
  'restaurant': 'food',
  'kafe': 'food',
  'cafe': 'food',
  'yaratıcı': 'creative',
  'tasarım': 'creative',
  'design': 'creative',
  'creative': 'creative',
  'teknoloji': 'technology',
  'yazılım': 'technology',
  'software': 'technology',
  'tech': 'technology',
  // Direct English values
  'service': 'service',
  'retail': 'retail',
  'food': 'food',
  'technology': 'technology',
  'other': 'other',
  'diğer': 'other',
};

export function mapSectorToProfession(sector: string): Profession {
  if (!sector) return 'other';
  const normalized = sector.toLowerCase().trim();
  
  // First try direct match
  if (SECTOR_MAPPING[normalized]) {
    return SECTOR_MAPPING[normalized];
  }
  
  // Then try partial match
  for (const [key, value] of Object.entries(SECTOR_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  return 'other';
}
