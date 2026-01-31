import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroBold } from '../sections/hero/HeroBold';
import { AboutCards } from '../sections/about/AboutCards';
import { ServicesShowcase } from '../sections/services/ServicesShowcase';
import { BoldTestimonialsSection } from '../sections/testimonials/TestimonialsSection';
import { BoldContactSection } from '../sections/contact/ContactSection';
import { BoldCTASection } from '../sections/cta/CTASection';

interface BoldFullLandingPageProps {
  content: GeneratedContent;
  isDark: boolean;
  isNeutral: boolean;
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

export function BoldFullLandingPage({
  content,
  isDark,
  isNeutral,
  isEditable = false,
  onFieldEdit,
  onLockedFeature,
  editorSelection,
  onEditorSelect,
  sectionOrder = ['hero', 'about', 'services', 'testimonials', 'contact', 'cta'],
  onMoveSection,
  onDeleteSection,
  selectedImage,
  onImageSelect,
}: BoldFullLandingPageProps) {
  const heroContent = content.pages.home.hero;
  const aboutContent = content.pages.about;
  const servicesContent = content.pages.services;
  const contactContent = content.pages.contact;
  
  // Extract testimonials from home page highlights (as fallback)
  const testimonials = content.pages.home.highlights?.map((h, i) => ({
    quote: h.description,
    author: `Client ${i + 1}`,
    role: h.title,
  })) || [];
  
  // Render sections in order
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroBold
            key="hero"
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            description={heroContent.description}
            ctaText="Get Started"
            heroImage={content.images?.heroHome}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'about':
        return (
          <AboutCards
            key="about"
            title={aboutContent.story.title}
            description={aboutContent.story.content}
            mission={aboutContent.team.description}
            values={aboutContent.values.map(v => v.title)}
            aboutImage={content.images?.aboutImage}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'services':
        return (
          <ServicesShowcase
            key="services"
            services={servicesContent.servicesList.map(s => ({
              name: s.title,
              description: s.description,
              features: [],
            }))}
            headline={servicesContent.intro.title}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );
      case 'testimonials':
        return (
          <BoldTestimonialsSection
            key="testimonials"
            testimonials={testimonials}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'contact':
        return (
          <BoldContactSection
            key="contact"
            headline={contactContent.form.title}
            address={contactContent.info.address}
            phone={contactContent.info.phone}
            email={contactContent.info.email}
            hours={contactContent.info.hours}
            isEditable={isEditable}
            onFieldEdit={onFieldEdit}
          />
        );
      case 'cta':
        return (
          <BoldCTASection
            key="cta"
            headline={heroContent.title}
            ctaText="Get Started"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-950">
      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
}
