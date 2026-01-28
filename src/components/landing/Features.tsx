import { Sparkles, Layout, Rocket, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    description: 'Our AI creates stunning, professional websites tailored specifically for healthcare professionals in seconds.',
  },
  {
    icon: Layout,
    title: 'Professional Templates',
    description: 'Choose from beautiful templates designed for doctors, dentists, pharmacists, and other medical professionals.',
  },
  {
    icon: Rocket,
    title: 'Easy Management',
    description: 'Update your content, add services, and manage your online presence with our intuitive dashboard.',
  },
  {
    icon: Server,
    title: 'Instant Hosting',
    description: 'Your website is automatically hosted and optimized. No technical setup required—just publish and go live.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="gradient-text"> Stand Out Online</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed specifically for healthcare professionals who want to grow their practice.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
