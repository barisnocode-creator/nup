import { GeneratedContent } from '@/types/generated-website';
import { EditableSection } from '@/components/website-preview/EditableSection';
import { getHeroComponent, HeroVariant } from '../sections/hero';
import { StatisticsSection } from '../sections/StatisticsSection';
import { AboutInlineSection } from '../sections/AboutInlineSection';
import { ServicesGridSection } from '../sections/ServicesGridSection';
import { ProcessSection } from '../sections/ProcessSection';
import { ImageGallerySection } from '../sections/ImageGallerySection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FAQSection } from '../sections/FAQSection';
import { ContactInlineSection } from '../sections/ContactInlineSection';
import { CTASection } from '../sections/CTASection';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';

interface FullLandingPageProps {
  content: GeneratedContent;
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  // Section management props
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  // Legacy props
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

// Default section order
const DEFAULT_SECTION_ORDER = [
  'hero', 'statistics', 'about', 'services', 'process', 'gallery', 'testimonials', 'faq', 'contact', 'cta'
];

export function FullLandingPage({
  content,
  isDark,
  isNeutral,
  isEditable,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder = DEFAULT_SECTION_ORDER,
  onMoveSection,
  onDeleteSection,
  selectedImage,
  onImageSelect,
}: FullLandingPageProps) {
  const { pages, images, metadata, sectionVariants } = content;

  // Get the appropriate hero component based on variant
  const heroVariant: HeroVariant = sectionVariants?.hero || 'overlay';
  const HeroComponent = getHeroComponent(heroVariant);

  // Helper to check section position
  const getSectionPosition = (sectionId: string) => {
    const index = sectionOrder.indexOf(sectionId);
    return {
      isFirst: index === 0,
      isLast: index === sectionOrder.length - 1,
    };
  };

  // Helper to create section edit handler
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

  // Render sections based on order
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
              { label: 'Headline', fieldPath: 'pages.home.hero.title', value: pages.home.hero.title, type: 'text', canRegenerate: true },
              { label: 'Subtitle', fieldPath: 'pages.home.hero.subtitle', value: pages.home.hero.subtitle, type: 'text', canRegenerate: true },
              { label: 'Description', fieldPath: 'pages.home.hero.description', value: pages.home.hero.description, type: 'textarea', canRegenerate: true },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('hero', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('hero', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('hero') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <HeroComponent
              title={pages.home.hero.title}
              subtitle={pages.home.hero.subtitle}
              description={pages.home.hero.description}
              heroImage={images?.heroHome || images?.heroSplit}
              heroImagePosition={content.imagePositions?.heroHome}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              onFieldEdit={onFieldEdit}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
              selectedImage={selectedImage}
              onImageSelect={onImageSelect}
            />
          </EditableSection>
        );

      case 'statistics':
        if (!pages.home.statistics || pages.home.statistics.length === 0) return null;
        return (
          <EditableSection
            key="statistics"
            sectionId="statistics"
            sectionName="Statistics"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('statistics', 'Statistics', 
              pages.home.statistics.map((stat, i) => ({
                label: `Stat ${i + 1}`,
                fieldPath: `pages.home.statistics[${i}].value`,
                value: stat.value,
                type: 'text',
              }))
            )}
            onMoveUp={onMoveSection ? () => onMoveSection('statistics', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('statistics', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('statistics') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <StatisticsSection
              statistics={pages.home.statistics}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
            />
          </EditableSection>
        );

      case 'about':
        return (
          <EditableSection
            key="about"
            sectionId="about"
            sectionName="About"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('about', 'About', [
              { label: 'Story', fieldPath: 'pages.about.story', value: pages.about.story, type: 'textarea', canRegenerate: true },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('about', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('about', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('about') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <AboutInlineSection
              story={pages.about.story}
              values={pages.about.values}
              aboutImage={images?.aboutImage || images?.heroAbout}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              onFieldEdit={onFieldEdit}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
              selectedImage={selectedImage}
              onImageSelect={onImageSelect}
            />
          </EditableSection>
        );

      case 'services':
        return (
          <EditableSection
            key="services"
            sectionId="services"
            sectionName="Services"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('services', 'Services', [
              { label: 'Intro', fieldPath: 'pages.services.intro', value: pages.services.intro, type: 'textarea', canRegenerate: true },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('services', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('services', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('services') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ServicesGridSection
              intro={pages.services.intro}
              services={pages.services.servicesList}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
            />
          </EditableSection>
        );

      case 'process':
        if (!pages.home.process || pages.home.process.length === 0) return null;
        return (
          <EditableSection
            key="process"
            sectionId="process"
            sectionName="Process"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('process', 'Process', 
              pages.home.process.map((step, i) => ({
                label: `Step ${i + 1}`,
                fieldPath: `pages.home.process[${i}].title`,
                value: step.title,
                type: 'text',
              }))
            )}
            onMoveUp={onMoveSection ? () => onMoveSection('process', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('process', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('process') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ProcessSection
              steps={pages.home.process}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
            />
          </EditableSection>
        );

      case 'gallery':
        return (
          <EditableSection
            key="gallery"
            sectionId="gallery"
            sectionName="Gallery"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('gallery', 'Gallery', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('gallery', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('gallery', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('gallery') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ImageGallerySection
              images={images?.galleryImages || []}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
              selectedImage={selectedImage}
              onImageSelect={onImageSelect}
            />
          </EditableSection>
        );

      case 'testimonials':
        return (
          <EditableSection
            key="testimonials"
            sectionId="testimonials"
            sectionName="Testimonials"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('testimonials', 'Testimonials', [])}
            onMoveUp={onMoveSection ? () => onMoveSection('testimonials', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('testimonials', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('testimonials') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <TestimonialsSection
              isDark={isDark}
              isNeutral={isNeutral}
            />
          </EditableSection>
        );

      case 'faq':
        if (!pages.services.faq || pages.services.faq.length === 0) return null;
        return (
          <EditableSection
            key="faq"
            sectionId="faq"
            sectionName="FAQ"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('faq', 'FAQ', 
              pages.services.faq.map((faq, i) => ({
                label: `Q${i + 1}`,
                fieldPath: `pages.services.faq[${i}].question`,
                value: faq.question,
                type: 'text',
              }))
            )}
            onMoveUp={onMoveSection ? () => onMoveSection('faq', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('faq', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('faq') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <FAQSection
              faqs={pages.services.faq}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
            />
          </EditableSection>
        );

      case 'contact':
        return (
          <EditableSection
            key="contact"
            sectionId="contact"
            sectionName="Contact"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('contact', 'Contact', [
              { label: 'Phone', fieldPath: 'pages.contact.info.phone', value: pages.contact.info.phone, type: 'text' },
              { label: 'Email', fieldPath: 'pages.contact.info.email', value: pages.contact.info.email, type: 'text' },
              { label: 'Address', fieldPath: 'pages.contact.info.address', value: pages.contact.info.address, type: 'text' },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('contact', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('contact', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('contact') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <ContactInlineSection
              info={pages.contact.info}
              workingHours={pages.contact.workingHours}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
            />
          </EditableSection>
        );

      case 'cta':
        return (
          <EditableSection
            key="cta"
            sectionId="cta"
            sectionName="Call to Action"
            isEditable={isEditable}
            onLockedFeature={onLockedFeature}
            onEdit={createSectionEditHandler('cta', 'Call to Action', [
              { label: 'Title', fieldPath: 'metadata.siteName', value: metadata.siteName, type: 'text' },
              { label: 'Tagline', fieldPath: 'metadata.tagline', value: metadata.tagline, type: 'text', canRegenerate: true },
            ])}
            onMoveUp={onMoveSection ? () => onMoveSection('cta', 'up') : undefined}
            onMoveDown={onMoveSection ? () => onMoveSection('cta', 'down') : undefined}
            onDelete={onDeleteSection ? () => onDeleteSection('cta') : undefined}
            isFirst={isFirst}
            isLast={isLast}
          >
            <CTASection
              siteName={metadata.siteName}
              tagline={metadata.tagline}
              ctaImage={images?.ctaImage}
              isDark={isDark}
              isNeutral={isNeutral}
              isEditable={isEditable}
              editorSelection={editorSelection}
              onEditorSelect={onEditorSelect}
              selectedImage={selectedImage}
              onImageSelect={onImageSelect}
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
