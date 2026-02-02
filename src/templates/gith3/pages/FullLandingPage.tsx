import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroMinimal } from '../sections/hero/HeroMinimal';
import { WorksGrid } from '../sections/works/WorksGrid';
import { AboutMinimal } from '../sections/about/AboutMinimal';
import { ContactMinimal } from '../sections/contact/ContactMinimal';

interface Gith3FullLandingPageProps {
  content: GeneratedContent;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  sectionStyles?: { [sectionId: string]: SectionStyle };
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

const DEFAULT_SECTION_ORDER = ['hero', 'works', 'about', 'contact'];

export function Gith3FullLandingPage({
  content,
  isEditable,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder = DEFAULT_SECTION_ORDER,
  onMoveSection,
  onDeleteSection,
  sectionStyles,
  selectedImage,
  onImageSelect,
}: Gith3FullLandingPageProps) {
  const { pages, images, metadata } = content;

  const getSectionPosition = (sectionId: string) => {
    const index = sectionOrder.indexOf(sectionId);
    return {
      isFirst: index === 0,
      isLast: index === sectionOrder.length - 1,
    };
  };

  const createSectionEditHandler = (sectionId: string, sectionName: string, fields: any[]) => {
    return () => {
      if (onEditorSelect) {
        onEditorSelect({
          type: 'section',
          title: sectionName,
          sectionId,
          fields,
        });
      }
    };
  };

  const renderSection = (sectionId: string) => {
    const { isFirst, isLast } = getSectionPosition(sectionId);

    switch (sectionId) {
      case 'hero':
        return (
          <EditableSection
            key="hero"
            sectionId="hero"
            sectionName="Hero"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('hero', 'Hero', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('hero', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('hero', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('hero') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <HeroMinimal
              title={pages.home.hero.title}
              subtitle={pages.home.hero.subtitle}
              description={pages.home.hero.description}
            />
          </EditableSection>
        );

      case 'works':
        return (
          <EditableSection
            key="works"
            sectionId="works"
            sectionName="Çalışmalar"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('works', 'Çalışmalar', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('works', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('works', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('works') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <WorksGrid
              services={pages.services.servicesList}
              galleryImages={images?.galleryImages}
            />
          </EditableSection>
        );

      case 'about':
        return (
          <EditableSection
            key="about"
            sectionId="about"
            sectionName="Hakkımda"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('about', 'Hakkımda', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('about', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('about', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('about') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <AboutMinimal
              story={pages.about.story}
              values={pages.about.values}
            />
          </EditableSection>
        );

      case 'contact':
        return (
          <EditableSection
            key="contact"
            sectionId="contact"
            sectionName="İletişim"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('contact', 'İletişim', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('contact', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('contact', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('contact') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ContactMinimal
              email={pages.contact.info.email}
              siteName={metadata.siteName}
            />
          </EditableSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20">
      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
}
