import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroElegant } from '../sections/hero/HeroElegant';
import { AboutElegant } from '../sections/about/AboutElegant';
import { ServicesElegant } from '../sections/services/ServicesElegant';
import { TestimonialsElegant } from '../sections/testimonials/TestimonialsElegant';
import { CTAElegant } from '../sections/cta/CTAElegant';

interface ElegantFullLandingPageProps {
  content: GeneratedContent;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  selectedImage?: ImageData | null;
  onImageSelect?: (data: ImageData) => void;
}

export function ElegantFullLandingPage({
  content,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder = ['hero', 'about', 'services', 'testimonials', 'cta'],
  onMoveSection,
  onDeleteSection,
  selectedImage,
  onImageSelect,
}: ElegantFullLandingPageProps) {
  const heroContent = content.pages.home.hero;
  const aboutContent = content.pages.about;
  const servicesContent = content.pages.services;
  const statistics = content.pages.home.statistics || [];
  const highlights = content.pages.home.highlights || [];
  
  // Render sections in order
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroElegant
            key="hero"
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            description={heroContent.description}
            ctaText="Get Started"
            statistics={statistics}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'about':
        return (
          <AboutElegant
            key="about"
            title={aboutContent.story.title}
            content={aboutContent.story.content}
            values={aboutContent.values}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'services':
        return (
          <ServicesElegant
            key="services"
            title={servicesContent.intro.title}
            description={servicesContent.intro.content}
            services={servicesContent.servicesList}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsElegant
            key="testimonials"
            highlights={highlights}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'cta':
        return (
          <CTAElegant
            key="cta"
            headline="Ready to get started?"
            ctaText="Contact Us"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F7F5F3]">
      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
}
