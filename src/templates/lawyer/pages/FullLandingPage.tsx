import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroLawyer } from '../sections/hero/HeroLawyer';
import { OverviewSection } from '../sections/overview/OverviewSection';
import { ValuesGrid } from '../sections/values/ValuesGrid';
import { TeamSection } from '../sections/team/TeamSection';
import { PracticeAreas } from '../sections/practice/PracticeAreas';
import { TestimonialsSection } from '../sections/testimonials/TestimonialsSection';
import { ContactSection } from '../sections/contact/ContactSection';
import { FAQSection } from '../sections/faq/FAQSection';
import { CTADark } from '../sections/cta/CTADark';

interface LawyerFullLandingPageProps {
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

export function LawyerFullLandingPage({
  content,
  isEditable = false,
  onFieldEdit,
  sectionOrder = ['hero', 'overview', 'values', 'team', 'practice', 'testimonials', 'contact', 'faq', 'cta'],
}: LawyerFullLandingPageProps) {
  const heroContent = content.pages.home.hero;
  const aboutContent = content.pages.about;
  const contactInfo = content.pages.contact.info;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroLawyer
            key="hero"
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            description={heroContent.description}
            heroImage={content.images?.heroHome}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'overview':
        return (
          <OverviewSection
            key="overview"
            description={aboutContent.story.content}
            features={aboutContent.values.map(v => v.title)}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'values':
        return <ValuesGrid key="values" />;
      case 'team':
        return <TeamSection key="team" isEditable={isEditable} onFieldEdit={onFieldEdit} />;
      case 'practice':
        return <PracticeAreas key="practice" />;
      case 'testimonials':
        return <TestimonialsSection key="testimonials" isEditable={isEditable} onFieldEdit={onFieldEdit} />;
      case 'contact':
        return (
          <ContactSection
            key="contact"
            contactInfo={contactInfo}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'faq':
        return <FAQSection key="faq" />;
      case 'cta':
        return <CTADark key="cta" />;
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
