import { CheckCircle2, Lock } from 'lucide-react';
import { GeneratedContent } from '@/types/generated-website';

interface AboutPageProps {
  content: GeneratedContent['pages']['about'];
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  onLockedFeature?: (feature: string) => void;
  heroImage?: string;
}

export function AboutPage({ content, isDark, isNeutral, isEditable = false, onLockedFeature, heroImage }: AboutPageProps) {
  const heroGradient = isDark 
    ? 'from-slate-800 to-slate-900' 
    : isNeutral 
      ? 'from-stone-100 to-stone-200'
      : 'from-primary/5 to-primary/10';

  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';

  const handleLockedClick = () => {
    if (onLockedFeature) {
      onLockedFeature('Edit About page content');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className={`py-16 md:py-24 bg-gradient-to-br ${heroGradient} relative overflow-hidden`}
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {heroImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/70' : 'bg-white/70'} backdrop-blur-sm`} />
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.hero.title}
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-center flex-1">
                {content.story.title}
              </h2>
              {isEditable && (
                <button
                  onClick={handleLockedClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isDark 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {content.story.content}
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className={`py-16 ${isDark ? 'bg-slate-800/50' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {content.values.map((value, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl ${cardBg} border ${cardBorder} shadow-sm relative group`}
              >
                {isEditable && (
                  <button
                    onClick={handleLockedClick}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{content.team.title}</h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {content.team.description}
          </p>
        </div>
      </section>
    </div>
  );
}
