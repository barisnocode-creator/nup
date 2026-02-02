import { Zap, Shield, BarChart3, Users, Clock, Globe } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesGridProps {
  features: Feature[];
  isDark: boolean;
  isEditable?: boolean;
}

const iconMap: Record<string, any> = {
  zap: Zap,
  shield: Shield,
  chart: BarChart3,
  users: Users,
  clock: Clock,
  globe: Globe,
  default: Zap,
};

export function FeaturesGrid({ features, isDark, isEditable }: FeaturesGridProps) {
  const getIcon = (iconName: string) => {
    const normalizedName = iconName?.toLowerCase() || 'default';
    return iconMap[normalizedName] || iconMap.default;
  };

  return (
    <section className="py-20 bg-muted/30" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Özellikler
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            İşinizi Büyütecek Araçlar
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            İhtiyacınız olan tüm özellikler tek platformda. Hızlı, güvenli ve kullanımı kolay.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            return (
              <div 
                key={index}
                className="group p-8 bg-background rounded-2xl border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;
