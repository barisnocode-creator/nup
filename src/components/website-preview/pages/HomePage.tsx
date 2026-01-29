import { Heart, Shield, Clock, Star, Users, Award } from 'lucide-react';
import { GeneratedContent } from '@/types/generated-website';
import { EditableField } from '../EditableField';

interface HomePageProps {
  content: GeneratedContent['pages']['home'];
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
  heroImage?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  shield: Shield,
  clock: Clock,
  star: Star,
  users: Users,
  award: Award,
};

function getIcon(iconName: string) {
  const normalizedName = iconName.toLowerCase().replace(/[^a-z]/g, '');
  return iconMap[normalizedName] || Heart;
}

export function HomePage({ content, isDark, isNeutral, isEditable = false, onFieldEdit, heroImage }: HomePageProps) {
  const heroGradient = isDark 
    ? 'from-slate-800 to-slate-900' 
    : isNeutral 
      ? 'from-stone-100 to-stone-200'
      : 'from-primary/5 to-primary/10';

  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className={`py-20 md:py-32 bg-gradient-to-br ${heroGradient} relative overflow-hidden`}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {heroImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/70' : 'bg-white/70'} backdrop-blur-sm`} />
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          {isEditable ? (
            <div className="mb-6">
              <EditableField
                value={content.hero.title}
                fieldPath="pages.home.hero.title"
                onSave={handleFieldEdit}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                as="h1"
                isEditable={isEditable}
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {content.hero.title}
            </h1>
          )}
          
          {isEditable ? (
            <div className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              <EditableField
                value={content.hero.subtitle}
                fieldPath="pages.home.hero.subtitle"
                onSave={handleFieldEdit}
                className="text-xl md:text-2xl"
                as="p"
                isEditable={isEditable}
              />
            </div>
          ) : (
            <p className={`text-xl md:text-2xl mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {content.hero.subtitle}
            </p>
          )}
          
          {isEditable ? (
            <div className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              <EditableField
                value={content.hero.description}
                fieldPath="pages.home.hero.description"
                onSave={handleFieldEdit}
                as="p"
                isEditable={isEditable}
              />
            </div>
          ) : (
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {content.hero.description}
            </p>
          )}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {content.welcome.title}
            </h2>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {content.welcome.content}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className={`py-16 ${isDark ? 'bg-slate-800/50' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.highlights.map((highlight, index) => {
              const Icon = getIcon(highlight.icon);
              return (
                <div 
                  key={index}
                  className={`p-6 rounded-xl ${cardBg} border ${cardBorder} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
