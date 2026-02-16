import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroSection } from '../sections/HeroSection';
import { IntroSection } from '../sections/IntroSection';
import { ArticleCard } from '../sections/ArticleCard';
import { NewsletterSection } from '../sections/NewsletterSection';
import { defaultArticles } from '../data/articles';

interface NaturalFullLandingPageProps {
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

export function NaturalFullLandingPage({
  content,
  isEditable = false,
  sectionOrder = ['hero', 'intro', 'articles', 'newsletter'],
}: NaturalFullLandingPageProps) {
  const heroContent = content.pages.home.hero;
  const aboutContent = content.pages.about;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <HeroSection
            key="hero"
            title={heroContent.title}
            description={heroContent.description}
          />
        );
      case 'intro':
        return (
          <IntroSection
            key="intro"
            title={aboutContent.story?.title || aboutContent.hero?.title || ''}
            description={aboutContent.story?.content || aboutContent.hero?.subtitle || ''}
          />
        );
      case 'articles':
        return (
          <section key="articles" id="articles" className="py-12">
            <div className="flex items-center justify-between mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Öne Çıkanlar</h2>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60">
                Tümünü gör →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {defaultArticles.map((article, index) => (
                <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>
          </section>
        );
      case 'newsletter':
        return <NewsletterSection key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {sectionOrder.map(renderSection)}
    </main>
  );
}
