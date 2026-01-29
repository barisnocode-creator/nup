import { GeneratedContent } from '@/types/generated-website';
import { EditableSection } from '@/components/website-preview/EditableSection';
import { HeroSplitSection } from '../sections/HeroSplitSection';
import { StatisticsSection } from '../sections/StatisticsSection';
import { AboutInlineSection } from '../sections/AboutInlineSection';
import { ServicesGridSection } from '../sections/ServicesGridSection';
import { ProcessSection } from '../sections/ProcessSection';
import { ImageGallerySection } from '../sections/ImageGallerySection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FAQSection } from '../sections/FAQSection';
import { ContactInlineSection } from '../sections/ContactInlineSection';
import { CTASection } from '../sections/CTASection';

interface FullLandingPageProps {
  content: GeneratedContent;
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  onLockedFeature?: (feature: string) => void;
}

export function FullLandingPage({
  content,
  isDark,
  isNeutral,
  isEditable,
  onFieldEdit,
  onLockedFeature,
}: FullLandingPageProps) {
  const { pages, images, metadata } = content;

  return (
    <div>
      {/* Hero Section */}
      <EditableSection
        sectionId="hero"
        sectionName="Hero"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
        isFirst
      >
        <HeroSplitSection
          title={pages.home.hero.title}
          subtitle={pages.home.hero.subtitle}
          description={pages.home.hero.description}
          heroImage={images?.heroHome || images?.heroSplit}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
          onFieldEdit={onFieldEdit}
        />
      </EditableSection>

      {/* Statistics Section */}
      {pages.home.statistics && pages.home.statistics.length > 0 && (
        <EditableSection
          sectionId="statistics"
          sectionName="Statistics"
          isEditable={isEditable}
          onLockedFeature={onLockedFeature}
        >
          <StatisticsSection
            statistics={pages.home.statistics}
            isDark={isDark}
            isNeutral={isNeutral}
          />
        </EditableSection>
      )}

      {/* About Section */}
      <EditableSection
        sectionId="about"
        sectionName="About"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
      >
        <AboutInlineSection
          story={pages.about.story}
          values={pages.about.values}
          aboutImage={images?.aboutImage || images?.heroAbout}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
          onFieldEdit={onFieldEdit}
        />
      </EditableSection>

      {/* Services Section */}
      <EditableSection
        sectionId="services"
        sectionName="Services"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
      >
        <ServicesGridSection
          intro={pages.services.intro}
          services={pages.services.servicesList}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
        />
      </EditableSection>

      {/* Process Section */}
      {pages.home.process && pages.home.process.length > 0 && (
        <EditableSection
          sectionId="process"
          sectionName="Process"
          isEditable={isEditable}
          onLockedFeature={onLockedFeature}
        >
          <ProcessSection
            steps={pages.home.process}
            isDark={isDark}
            isNeutral={isNeutral}
          />
        </EditableSection>
      )}

      {/* Gallery Section */}
      <EditableSection
        sectionId="gallery"
        sectionName="Gallery"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
      >
        <ImageGallerySection
          images={images?.galleryImages || []}
          isDark={isDark}
          isNeutral={isNeutral}
        />
      </EditableSection>

      {/* Testimonials Section */}
      <EditableSection
        sectionId="testimonials"
        sectionName="Testimonials"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
      >
        <TestimonialsSection
          isDark={isDark}
          isNeutral={isNeutral}
        />
      </EditableSection>

      {/* FAQ Section */}
      {pages.services.faq && pages.services.faq.length > 0 && (
        <EditableSection
          sectionId="faq"
          sectionName="FAQ"
          isEditable={isEditable}
          onLockedFeature={onLockedFeature}
        >
          <FAQSection
            faqs={pages.services.faq}
            isDark={isDark}
            isNeutral={isNeutral}
          />
        </EditableSection>
      )}

      {/* Contact Section */}
      <EditableSection
        sectionId="contact"
        sectionName="Contact"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
      >
        <ContactInlineSection
          info={pages.contact.info}
          workingHours={pages.contact.workingHours}
          isDark={isDark}
          isNeutral={isNeutral}
          isEditable={isEditable}
        />
      </EditableSection>

      {/* CTA Section */}
      <EditableSection
        sectionId="cta"
        sectionName="Call to Action"
        isEditable={isEditable}
        onLockedFeature={onLockedFeature}
        isLast
      >
        <CTASection
          siteName={metadata.siteName}
          tagline={metadata.tagline}
          ctaImage={images?.ctaImage}
          isDark={isDark}
          isNeutral={isNeutral}
        />
      </EditableSection>
    </div>
  );
}
