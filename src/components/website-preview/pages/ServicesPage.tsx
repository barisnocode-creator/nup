import { Stethoscope, Pill, Smile, Activity, Microscope, Syringe, Heart, Brain, Eye } from 'lucide-react';
import { GeneratedContent } from '@/types/generated-website';

interface ServicesPageProps {
  content: GeneratedContent['pages']['services'];
  isDark: boolean;
  isNeutral: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  pill: Pill,
  smile: Smile,
  activity: Activity,
  microscope: Microscope,
  syringe: Syringe,
  heart: Heart,
  brain: Brain,
  eye: Eye,
};

function getIcon(iconName: string) {
  const normalizedName = iconName.toLowerCase().replace(/[^a-z]/g, '');
  return iconMap[normalizedName] || Activity;
}

export function ServicesPage({ content, isDark, isNeutral }: ServicesPageProps) {
  const heroGradient = isDark 
    ? 'from-slate-800 to-slate-900' 
    : isNeutral 
      ? 'from-stone-100 to-stone-200'
      : 'from-primary/5 to-primary/10';

  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';

  return (
    <div>
      {/* Hero Section */}
      <section className={`py-16 md:py-24 bg-gradient-to-br ${heroGradient}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.hero.title}
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{content.intro.title}</h2>
            <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              {content.intro.content}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={`py-16 ${isDark ? 'bg-slate-800/50' : isNeutral ? 'bg-stone-100' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.servicesList.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <div 
                  key={index}
                  className={`p-6 rounded-xl ${cardBg} border ${cardBorder} shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {service.description}
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
