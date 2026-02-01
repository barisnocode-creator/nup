import { TemplateHeader } from '../components/TemplateHeader';
import { TemplateFooter } from '../components/TemplateFooter';
import { HeroVideo } from '../sections/hero';
import { PortfolioSection } from '../sections/portfolio';
import { AwardsSection } from '../sections/awards';
import { AboutProcess } from '../sections/about';
import { ServicesCards } from '../sections/services';
import { TeamWanted } from '../sections/team';
import { ContactEmbed } from '../sections/contact';
import type { GeneratedContent, SectionStyle } from '@/types/generated-website';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface FullLandingPageProps {
  content: GeneratedContent;
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  sectionOrder?: string[];
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  sectionStyles?: { [sectionId: string]: SectionStyle };
}

const defaultSectionOrder = ['hero', 'portfolio', 'awards', 'about', 'services', 'team', 'contact'];

export function FullLandingPage({
  content,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  sectionOrder = defaultSectionOrder,
  onMoveSection,
  onDeleteSection,
}: FullLandingPageProps) {
  const { pages, metadata } = content;

  const getSectionIndex = (sectionId: string) => sectionOrder.indexOf(sectionId);
  const isFirst = (sectionId: string) => getSectionIndex(sectionId) === 0;
  const isLast = (sectionId: string) => getSectionIndex(sectionId) === sectionOrder.length - 1;

  const renderSection = (sectionId: string) => {
    const commonProps = {
      isEditable,
      editorSelection,
      onEditorSelect,
      onMoveSection: (direction: 'up' | 'down') => onMoveSection?.(sectionId, direction),
      onDeleteSection: () => onDeleteSection?.(sectionId),
      isFirst: isFirst(sectionId),
      isLast: isLast(sectionId),
    };

    switch (sectionId) {
      case 'hero':
        return (
          <HeroVideo
            key={sectionId}
            title={pages.home.hero.title}
            subtitle={pages.home.hero.subtitle}
            description={pages.home.hero.description}
            isEditable={isEditable}
            editorSelection={editorSelection}
            onEditorSelect={onEditorSelect}
          />
        );

      case 'portfolio':
        return (
          <PortfolioSection
            key={sectionId}
            title="Featured Work"
            subtitle="Our latest projects that showcase our creative excellence"
            {...commonProps}
          />
        );

      case 'awards':
        return (
          <AwardsSection
            key={sectionId}
            {...commonProps}
          />
        );

      case 'about':
        return (
          <AboutProcess
            key={sectionId}
            title={pages.about.story.title}
            content={pages.about.story.content}
            steps={pages.home.process}
            {...commonProps}
          />
        );

      case 'services':
        return (
          <ServicesCards
            key={sectionId}
            title={pages.services.hero.title}
            subtitle={pages.services.hero.subtitle}
            services={pages.services.servicesList}
            {...commonProps}
          />
        );

      case 'team':
        return (
          <TeamWanted
            key={sectionId}
            title={pages.about.team.title}
            description={pages.about.team.description}
            {...commonProps}
          />
        );

      case 'contact':
        return (
          <ContactEmbed
            key={sectionId}
            title={pages.contact.hero.title}
            subtitle={pages.contact.hero.subtitle}
            info={pages.contact.info}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <TemplateHeader siteName={metadata.siteName} />
      
      <main>
        {sectionOrder.map(renderSection)}
      </main>

      <TemplateFooter 
        siteName={metadata.siteName} 
        tagline={metadata.tagline} 
      />
    </div>
  );
}
