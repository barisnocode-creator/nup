import { Card } from '@/components/ui/card';
import showcaseDental from '@/assets/showcase-dental.jpg';
import showcaseFamilyDoctor from '@/assets/showcase-family-doctor.jpg';
import showcasePharmacy from '@/assets/showcase-pharmacy.jpg';
import showcaseEyeClinic from '@/assets/showcase-eye-clinic.jpg';

const showcaseSites = [
  {
    title: 'Diş Kliniği',
    description: 'Modern diş hekimliği web sitesi',
    image: showcaseDental,
  },
  {
    title: 'Aile Hekimliği',
    description: 'Güvenilir aile doktoru sitesi',
    image: showcaseFamilyDoctor,
  },
  {
    title: 'Eczane',
    description: 'Profesyonel eczane web sitesi',
    image: showcasePharmacy,
  },
  {
    title: 'Göz Kliniği',
    description: 'Uzman göz hastalıkları sitesi',
    image: showcaseEyeClinic,
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
              {/* Website Preview Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={site.image} 
                  alt={site.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
