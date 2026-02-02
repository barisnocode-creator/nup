import { Briefcase, Target, Users, TrendingUp, Award, HeartHandshake } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface ServicesCorporateProps {
  intro: {
    title: string;
    content: string;
  };
  services: Service[];
}

const iconMap: Record<string, any> = {
  briefcase: Briefcase,
  target: Target,
  users: Users,
  trending: TrendingUp,
  award: Award,
  heart: HeartHandshake,
  default: Briefcase,
};

export function ServicesCorporate({ intro, services }: ServicesCorporateProps) {
  const getIcon = (iconName: string) => {
    const normalized = iconName?.toLowerCase() || 'default';
    return iconMap[normalized] || iconMap.default;
  };

  return (
    <section className="py-20 bg-white" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            Hizmetlerimiz
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
            {intro.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {intro.content}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={index}
                className="group bg-slate-50 hover:bg-blue-600 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-white mb-3 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 group-hover:text-blue-100 transition-colors">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
