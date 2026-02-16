import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroFullscreen } from '../sections/hero/HeroFullscreen';
import { FeatureCards } from '../sections/features/FeatureCards';
import { TourGallery } from '../sections/tour/TourGallery';
import { TeacherGrid } from '../sections/teachers/TeacherGrid';
import { Testimonials } from '../sections/testimonials/Testimonials';
import { ContactSection } from '../sections/contact/ContactSection';

interface PilatesFullLandingPageProps {
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

export function PilatesFullLandingPage({
  content,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder = ['hero', 'features', 'tour', 'teachers', 'testimonials', 'contact'],
  onMoveSection,
  onDeleteSection,
  selectedImage,
  onImageSelect,
}: PilatesFullLandingPageProps) {
  const heroContent = content?.pages?.home?.hero ?? { title: '', subtitle: '', description: '' };
  const servicesContent = content?.pages?.services ?? { intro: { title: '', content: '' }, servicesList: [], hero: { title: '', subtitle: '' } };
  const contactInfo = content?.pages?.contact?.info ?? { address: '', phone: '', email: '', hours: '' };
  const aboutContent = content?.pages?.about ?? { team: { title: '', description: '' }, values: [], hero: { title: '', subtitle: '' }, story: { title: '', content: '' } };
  const highlights = content?.pages?.home?.highlights || [];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroFullscreen
            key="hero"
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            description={heroContent.description}
            heroImage={content.images?.heroHome}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'features':
        return (
          <FeatureCards
            key="features"
            title={servicesContent.intro.title}
            services={servicesContent.servicesList}
            images={content.images?.servicesImages}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'tour':
        return (
          <TourGallery
            key="tour"
            galleryImages={content.images?.galleryImages}
            serviceNames={servicesContent.servicesList.map(s => s.title)}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'teachers':
        return (
          <TeacherGrid
            key="teachers"
            teamTitle={aboutContent.team.title}
            teamDescription={aboutContent.team.description}
            teamMembers={aboutContent.values}
            teamImages={content.images?.servicesImages}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'testimonials':
        return (
          <Testimonials
            key="testimonials"
            highlights={highlights}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'contact':
        return (
          <ContactSection
            key="contact"
            contactInfo={contactInfo}
            formTitle={content.pages.contact.form.title}
            formSubtitle={content.pages.contact.form.subtitle}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
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
