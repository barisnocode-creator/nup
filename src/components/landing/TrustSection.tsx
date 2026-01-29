import { Palette, Type, Search, Server } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Profesyonel Tasarım',
    description: 'Modern ve etkileyici',
  },
  {
    icon: Type,
    title: 'AI İçerik',
    description: 'Otomatik metin yazımı',
  },
  {
    icon: Search,
    title: 'SEO Optimizasyonu',
    description: 'Google\'da üst sıralarda',
  },
  {
    icon: Server,
    title: 'Anında Hosting',
    description: 'Hemen yayına alın',
  },
];

export function TrustSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-foreground">
            Sağlık Sektörü İçin
            <span className="text-primary"> AI Partneri</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Profesyonel web sitenizi dakikalar içinde oluşturun
          </p>
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
