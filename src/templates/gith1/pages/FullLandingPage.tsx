import { GeneratedContent, SectionStyle } from '@/types/generated-website';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroSaaS } from '../sections/hero/HeroSaaS';
import { FeaturesGrid } from '../sections/features/FeaturesGrid';
import { PricingSection } from '../sections/pricing/PricingSection';
import { CTASaaS } from '../sections/cta/CTASaaS';

interface Gith1FullLandingPageProps {
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

const DEFAULT_SECTION_ORDER = ['hero', 'features', 'pricing', 'cta'];

export function Gith1FullLandingPage({
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
}: Gith1FullLandingPageProps) {
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
            onEdit={createSectionEditHandler('hero', 'Hero', [
              { label: 'Başlık', fieldPath: 'pages.home.hero.title', value: pages.home.hero.title, type: 'text', canRegenerate: true },
              { label: 'Açıklama', fieldPath: 'pages.home.hero.description', value: pages.home.hero.description, type: 'textarea', canRegenerate: true },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('hero', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('hero', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('hero') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <HeroSaaS
              title={pages.home.hero.title}
              subtitle={pages.home.hero.subtitle}
              description={pages.home.hero.description}
              heroImage={images?.heroHome}
              isDark={isDark}
              isEditable={isEditable}
              onFieldEdit={onFieldEdit}
            />
          </EditableSection>
        );

      case 'features':
        return (
          <EditableSection
            key="features"
            sectionId="features"
            sectionName="Özellikler"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('features', 'Özellikler', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('features', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('features', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('features') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <FeaturesGrid
              features={pages.home.highlights.map(h => ({
                title: h.title,
                description: h.description,
                icon: h.icon,
              }))}
              isDark={isDark}
              isEditable={isEditable}
            />
          </EditableSection>
        );

      case 'pricing':
        return (
          <EditableSection
            key="pricing"
            sectionId="pricing"
            sectionName="Fiyatlandırma"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('pricing', 'Fiyatlandırma', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('pricing', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('pricing', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('pricing') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <PricingSection
              services={pages.services.servicesList}
              isDark={isDark}
              isEditable={isEditable}
            />
          </EditableSection>
        );

      case 'cta':
        return (
          <EditableSection
            key="cta"
            sectionId="cta"
            sectionName="CTA"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('cta', 'CTA', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('cta', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('cta', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('cta') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <CTASaaS
              siteName={metadata.siteName}
              tagline={metadata.tagline}
              isDark={isDark}
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
