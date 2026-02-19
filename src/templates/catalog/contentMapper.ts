/**
 * Content Mapper: Maps user's project data (generated_content, form_data) 
 * onto template section defaultProps.
 * 
 * Rules:
 * - Only text fields are mapped; images stay as template defaults
 * - If user data is missing/empty for a field, template default is preserved
 * - Unknown section types are left untouched
 */

import type { TemplateSectionDef } from './definitions';

export interface ProjectData {
  generatedContent?: any;
  formData?: any;
}

/**
 * Maps project data onto a template's section definitions, returning new sections
 * with merged props. Original definitions are NOT mutated.
 */
export function mapContentToTemplate(
  sections: TemplateSectionDef[],
  projectData?: ProjectData | null
): TemplateSectionDef[] {
  if (!projectData) return sections;

  const gc = projectData.generatedContent;
  const fd = projectData.formData;
  if (!gc && !fd) return sections;

  const pages = gc?.pages || {};
  const meta = gc?.metadata || {};
  const businessName = fd?.businessName || meta?.siteName || '';

  // Extract commonly used data
  const heroData = pages?.home?.hero || {};
  const contactInfo = pages?.contact?.info || {};
  const aboutData = pages?.about?.story || pages?.home?.welcome || {};
  const servicesList = pages?.services?.servicesList || pages?.home?.highlights || [];

  return sections.map(sec => {
    const mapped = mapSectionProps(sec, {
      businessName,
      heroData,
      contactInfo,
      aboutData,
      servicesList,
      meta,
      pages,
    });
    return mapped;
  });
}

interface MappingContext {
  businessName: string;
  heroData: any;
  contactInfo: any;
  aboutData: any;
  servicesList: any[];
  meta: any;
  pages: any;
}

function mapSectionProps(sec: TemplateSectionDef, ctx: MappingContext): TemplateSectionDef {
  const type = sec.type;
  const props = { ...sec.defaultProps };

  // Hero sections — map title, description, badge
  if (type.startsWith('Hero')) {
    assign(props, 'title', ctx.heroData.title || ctx.businessName);
    assign(props, 'description', ctx.heroData.description);
    assign(props, 'subtitle', ctx.heroData.subtitle);
    // For HeroPortfolio: map name + bio
    if (type === 'HeroPortfolio') {
      assign(props, 'name', ctx.businessName);
      assign(props, 'bio', ctx.heroData.description || ctx.aboutData?.content);
      assign(props, 'title', ctx.heroData.subtitle || ctx.meta?.profession || props.title);
    }
    if (ctx.businessName && props.badge !== undefined) {
      assign(props, 'badge', ctx.businessName);
    }
  }

  // About / Story sections
  if (type === 'AboutSection' || type === 'CafeStory') {
    assign(props, 'title', ctx.aboutData?.title);
    assign(props, 'description', ctx.aboutData?.content || ctx.aboutData?.description);
    if (type === 'AboutSection') {
      assign(props, 'sectionTitle', ctx.aboutData?.title);
    }
  }

  // Features sections — map service data
  if (type === 'CafeFeatures' || type === 'DentalServices') {
    if (ctx.servicesList.length > 0 && Array.isArray(props.features || props.services)) {
      const key = props.services ? 'services' : 'features';
      const existing = props[key] as any[];
      props[key] = existing.map((item: any, i: number) => {
        const src = ctx.servicesList[i];
        if (!src) return item;
        return {
          ...item,
          title: src.title || item.title,
          description: src.description || item.description,
        };
      });
    }
  }

  // Contact sections
  if (type === 'ContactForm') {
    assign(props, 'phone', ctx.contactInfo.phone);
    assign(props, 'email', ctx.contactInfo.email);
    assign(props, 'address', ctx.contactInfo.address);
  }

  // CTA sections — personalize with business name
  if (type === 'CTABanner') {
    if (ctx.businessName) {
      assign(props, 'title', `${ctx.businessName} ile Tanışın`);
    }
  }

  // Chef / Team sections
  if (type === 'ChefShowcase') {
    const team = ctx.pages?.about?.team;
    if (Array.isArray(team) && team.length > 0) {
      assign(props, 'title', team[0].name);
      assign(props, 'description', team[0].bio || team[0].description);
    }
  }

  // Statistics — keep template defaults (user rarely has this data)
  // Testimonials — keep template defaults
  // Menu/Room/Skills — keep template defaults (too specialized)

  return { ...sec, defaultProps: props };
}

/** Assign value to props[key] only if value is a non-empty string */
function assign(props: Record<string, any>, key: string, value: any) {
  if (value && typeof value === 'string' && value.trim()) {
    props[key] = value;
  }
}
