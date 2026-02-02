import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroCorporate } from '../sections/hero/HeroCorporate';
import { ServicesCorporate } from '../sections/services/ServicesCorporate';
import { AboutCorporate } from '../sections/about/AboutCorporate';
import { ContactCorporate } from '../sections/contact/ContactCorporate';

interface Gith2FullLandingPageProps {
  content: GeneratedContent;
  isDark: boolean;
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

const DEFAULT_SECTION_ORDER = ['hero', 'services', 'about', 'contact'];

export function Gith2FullLandingPage({
  content,
  isDark,
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
}: Gith2FullLandingPageProps) {
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
            <HeroCorporate
              title={pages.home.hero.title}
              subtitle={pages.home.hero.subtitle}
              description={pages.home.hero.description}
              heroImage={images?.heroHome}
              statistics={pages.home.statistics}
            />
          </EditableSection>
        );

      case 'services':
        return (
          <EditableSection
            key="services"
            sectionId="services"
            sectionName="Hizmetler"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('services', 'Hizmetler', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('services', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('services', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('services') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ServicesCorporate
              intro={pages.services.intro}
              services={pages.services.servicesList}
            />
          </EditableSection>
        );

      case 'about':
        return (
          <EditableSection
            key="about"
            sectionId="about"
            sectionName="Hakkımızda"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('about', 'Hakkımızda', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('about', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('about', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('about') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <AboutCorporate
              story={pages.about.story}
              values={pages.about.values}
              aboutImage={images?.aboutImage}
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
            <ContactCorporate
              form={pages.contact.form}
              info={pages.contact.info}
            />
          </EditableSection>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
}
