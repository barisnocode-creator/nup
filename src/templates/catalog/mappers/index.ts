/**
 * Mapper orchestrator — selects the right mapper for each section type
 * and applies sector compatibility checks.
 */
import type { TemplateSectionDef } from '../definitions';
import type { ProjectData } from '../contentMapper';

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
    if (!entry) return sec; // unknown type — leave as-is

    // Sector compatibility check
    if (entry.compatibleSectors.length > 0 && sector) {
      if (!entry.compatibleSectors.includes(sector)) {
        return sec; // incompatible sector — skip mapping
      }
    }

    const mappedProps = entry.fn({ ...sec.defaultProps }, projectData);
    return { ...sec, defaultProps: mappedProps };
  });
}
