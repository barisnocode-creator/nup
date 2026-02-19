/**
 * Content Mapper: Maps user's project data onto template section defaultProps.
 * Delegates to individual mapper modules for each section type.
 */
import type { TemplateSectionDef } from './definitions';
import { mapSections } from './mappers';

export interface ProjectData {
  generatedContent?: any;
  formData?: any;
  sector?: string;
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

  return mapSections(sections, projectData);
}
