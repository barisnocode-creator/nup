/**
 * Mapper orchestrator — selects the right mapper for each section type
 * and applies sector compatibility checks.
 */
import type { TemplateSectionDef } from '../definitions';
import type { ProjectData } from '../contentMapper';
import { getSectorProfile } from '../sectorProfiles';

import { mapHeroSection, compatibleSectors as heroSectors } from './mapHeroSection';
import { mapServicesSection, compatibleSectors as servicesSectors } from './mapServicesSection';
import { mapContactSection, compatibleSectors as contactSectors } from './mapContactSection';
import { mapAboutSection, compatibleSectors as aboutSectors } from './mapAboutSection';
import { mapCtaSection, compatibleSectors as ctaSectors } from './mapCtaSection';
import { mapTeamSection, compatibleSectors as teamSectors } from './mapTeamSection';

type MapperFn = (props: Record<string, any>, data: ProjectData) => Record<string, any>;

interface MapperEntry {
  fn: MapperFn;
  compatibleSectors: string[];
}

const mapperRegistry: Record<string, MapperEntry> = {};

function register(types: string[], fn: MapperFn, sectors: string[]) {
  types.forEach(t => { mapperRegistry[t] = { fn, compatibleSectors: sectors }; });
}

// Hero variants
register(
  ['HeroCafe', 'HeroDental', 'HeroRestaurant', 'HeroHotel', 'HeroPortfolio', 'HeroCentered', 'HeroSplit', 'HeroOverlay'],
  mapHeroSection,
  heroSectors
);

// Services/Features
register(
  ['CafeFeatures', 'DentalServices', 'ServicesGrid'],
  mapServicesSection,
  servicesSectors
);

// Contact
register(['ContactForm'], mapContactSection, contactSectors);

// About
register(['AboutSection', 'CafeStory'], mapAboutSection, aboutSectors);

// CTA
register(['CTABanner'], mapCtaSection, ctaSectors);

// Team
register(['ChefShowcase'], mapTeamSection, teamSectors);

/**
 * Generic label replacements based on sector profile.
 * Replaces template-specific labels with sector-appropriate ones.
 */
const genericLabels = [
  'menümüz', 'menü', 'our menu', 'şeflerimiz', 'chef team',
  'odalarımız', 'rooms', 'tedavilerimiz', 'treatments',
];

function applySectorLabels(
  props: Record<string, any>,
  projectData: ProjectData
): Record<string, any> {
  const profile = getSectorProfile(projectData.sector);
  if (!profile) return props;

  const result = { ...props };
  const labels = profile.sectionLabels;

  // Check title/sectionTitle for generic labels and replace
  for (const key of ['title', 'sectionTitle']) {
    const val = result[key];
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (genericLabels.some(g => lower.includes(g))) {
        // Determine which label to use based on context
        if (lower.includes('menü') || lower.includes('menu')) result[key] = labels.services;
        else if (lower.includes('şef') || lower.includes('chef') || lower.includes('ekip') || lower.includes('team')) result[key] = labels.team;
        else if (lower.includes('oda') || lower.includes('room')) result[key] = labels.services;
        else if (lower.includes('tedavi') || lower.includes('treatment')) result[key] = labels.services;
      }
    }
  }

  return result;
}

/**
 * Maps project data onto template section definitions.
 * Unknown section types are returned untouched.
 */
export function mapSections(
  sections: TemplateSectionDef[],
  projectData: ProjectData
): TemplateSectionDef[] {
  const sector = projectData.sector || '';

  return sections.map(sec => {
    const entry = mapperRegistry[sec.type];
    let mappedProps = { ...sec.defaultProps };

    if (entry) {
      // Sector compatibility check
      if (entry.compatibleSectors.length > 0 && sector) {
        if (!entry.compatibleSectors.includes(sector)) {
          // Still apply sector labels even for incompatible mappers
          mappedProps = applySectorLabels(mappedProps, projectData);
          return { ...sec, defaultProps: mappedProps };
        }
      }
      mappedProps = entry.fn(mappedProps, projectData);
    }

    // Post-process: apply sector label adaptation
    mappedProps = applySectorLabels(mappedProps, projectData);

    return { ...sec, defaultProps: mappedProps };
  });
}
