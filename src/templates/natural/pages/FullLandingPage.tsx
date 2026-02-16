import { GeneratedContent } from '@/types/generated-website';
import type { EditorSelection, ImageData } from '@/components/website-preview/EditorSidebar';
import { HeroSection } from '../sections/HeroSection';
import { IntroSection } from '../sections/IntroSection';
import { ArticleCard } from '../sections/ArticleCard';
import { NewsletterSection } from '../sections/NewsletterSection';
import { defaultArticles } from '../data/articles';

// Default English content for the Natural template
const DEFAULT_HERO_TITLE = "Journey Through Life's Spectrum";
const DEFAULT_HERO_DESC = "Explore wellness, creativity, travel, and personal growth through thoughtful articles and inspiring stories that help you live with more intention and joy.";
const DEFAULT_INTRO_TITLE = "Perspective is a space for exploring ideas that shape how we live, think, and grow.";
const DEFAULT_INTRO_DESC = "We believe in the power of thoughtful content to inspire meaningful change. Our articles blend practical wisdom with creative inspiration, covering everything from mindful living to adventurous travel.";

// Check if content is generic/demo or template-mismatched
function isGenericContent(title: string): boolean {
  const generic = ['Hoş Geldiniz', 'Hos Geldiniz', 'Profesyonel Hizmet', 'Welcome'];
  return !title || title.length < 10 || generic.some(g => title.includes(g));
}

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

  const useDefaults = isGenericContent(heroContent.title);

  const heroTitle = useDefaults ? DEFAULT_HERO_TITLE : heroContent.title;
  const heroDesc = useDefaults ? DEFAULT_HERO_DESC : heroContent.description;
  const introTitle = useDefaults ? DEFAULT_INTRO_TITLE : (aboutContent.story?.title || aboutContent.hero?.title || DEFAULT_INTRO_TITLE);
  const introDesc = useDefaults ? DEFAULT_INTRO_DESC : (aboutContent.story?.content || aboutContent.hero?.subtitle || DEFAULT_INTRO_DESC);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return <HeroSection key="hero" title={heroTitle} description={heroDesc} />;
      case 'intro':
        return <IntroSection key="intro" title={introTitle} description={introDesc} />;
      case 'articles':
        return (
          <section key="articles" id="articles" className="py-12">
            <div className="flex items-center justify-between mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Articles</h2>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60">
                View all →
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
