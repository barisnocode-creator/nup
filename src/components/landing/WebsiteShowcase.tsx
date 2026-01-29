import { Card } from '@/components/ui/card';

const showcaseSites = [
  {
    title: 'Diş Kliniği',
    description: 'Modern diş hekimliği web sitesi',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Aile Hekimliği',
    description: 'Güvenilir aile doktoru sitesi',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Eczane',
    description: 'Profesyonel eczane web sitesi',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Göz Kliniği',
    description: 'Uzman göz hastalıkları sitesi',
    gradient: 'from-orange-500 to-red-500',
  },
];

export function WebsiteShowcase() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-foreground">
            Örnek Web Siteleri
          </h2>
          <p className="text-muted-foreground">
            AI tarafından oluşturulmuş profesyonel sağlık sektörü web siteleri
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseSites.map((site, index) => (
            <Card 
              key={site.title}
              className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Mock Website Preview */}
              <div className={`h-40 bg-gradient-to-br ${site.gradient} p-4`}>
                <div className="bg-background/90 rounded-md h-full p-3">
                  <div className="h-2 w-16 bg-muted rounded mb-2" />
                  <div className="h-2 w-24 bg-muted rounded mb-4" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded" />
                    <div className="h-1.5 w-3/4 bg-muted rounded" />
                    <div className="h-1.5 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-medium text-foreground mb-1">{site.title}</h3>
                <p className="text-sm text-muted-foreground">{site.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
