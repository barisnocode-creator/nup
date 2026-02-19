import { safeGet } from './utils';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

export const compatibleSectors: string[] = []; // all sectors

export function mapTestimonialsSection(
  sectionProps: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const overrides: Record<string, any> = {};
  const profile = getSectorProfile(projectData.sector);

  // Map section title from sector labels
  if (profile) {
    const labelMap: Record<string, string> = {
      doctor: 'Hastalarımız Ne Diyor?',
      dentist: 'Hastalarımız Ne Diyor?',
      lawyer: 'Müvekkillerimiz Ne Diyor?',
      restaurant: 'Misafirlerimiz Ne Diyor?',
      cafe: 'Müşterilerimiz Ne Diyor?',
      hotel: 'Misafirlerimiz Ne Diyor?',
      beauty_salon: 'Müşterilerimiz Ne Diyor?',
      gym: 'Üyelerimiz Ne Diyor?',
      veterinary: 'Müşterilerimiz Ne Diyor?',
      pharmacy: 'Müşterilerimiz Ne Diyor?',
    };
    const roleMap: Record<string, string> = {
      doctor: 'Hasta',
      dentist: 'Hasta',
      lawyer: 'Müvekkil',
      restaurant: 'Misafir',
      cafe: 'Müşteri',
      hotel: 'Misafir',
      beauty_salon: 'Müşteri',
      gym: 'Üye',
      veterinary: 'Müşteri',
      pharmacy: 'Müşteri',
    };

    const sectorKey = projectData.sector?.toLowerCase().replace(/[\s-]/g, '_') || '';
    if (labelMap[sectorKey]) {
      overrides.sectionTitle = labelMap[sectorKey];
    }

    // Update testimonial roles to match sector
    if (Array.isArray(sectionProps.testimonials) && roleMap[sectorKey]) {
      overrides.testimonials = sectionProps.testimonials.map((t: any) => ({
        ...t,
        role: roleMap[sectorKey],
      }));
    }
  }

  // Override from generated content if available
  const gcTestimonials = safeGet<any[]>(projectData, 'generatedContent.testimonials', []);
  if (gcTestimonials.length > 0 && Array.isArray(sectionProps.testimonials)) {
    overrides.testimonials = sectionProps.testimonials.map((t: any, i: number) => {
      const src = gcTestimonials[i];
      if (!src) return overrides.testimonials?.[i] || t;
      return {
        ...t,
        name: src.name || t.name,
        role: src.role || overrides.testimonials?.[i]?.role || t.role,
        content: src.content || src.text || t.content,
      };
    });
  }

  return { ...sectionProps, ...overrides };
}
