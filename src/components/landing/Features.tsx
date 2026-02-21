import { Layout, FileText, Palette, Globe, Zap, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Layout,
    title: 'AI Web Siteleri',
    description: 'Her sektöre özel, profesyonel ve mobil uyumlu web siteleri saniyeler içinde oluşturulur.',
  },
  {
    icon: FileText,
    title: 'AI İçerik Yazımı',
    description: 'Hizmetleriniz, uzmanlık alanlarınız ve iletişim bilgileriniz otomatik içerik haline getirilir.',
  },
  {
    icon: Palette,
    title: 'Sürükle-Bırak Editör',
    description: 'Kod yazmadan renkleri, fontları ve düzeni kolayca özelleştirin.',
  },
  {
    icon: Globe,
    title: 'Özel Domain',
    description: 'Kendi alan adınızı bağlayın veya ücretsiz subdomain ile yayına alın.',
  },
  {
    icon: Zap,
    title: 'Hızlı & SEO Uyumlu',
    description: "Google'da üst sıralarda yer alın. Mobil uyumlu, hızlı yüklenen siteler.",
  },
  {
    icon: BarChart3,
    title: 'Analitik & Randevu',
    description: 'Ziyaretçi istatistikleri, online randevu sistemi ve mesaj yönetimi dahil.',
  },
];

export function Features() {
  return (
    <section id="features" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Özellikler</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4 text-foreground tracking-tight">
            İhtiyacınız olan her şey tek platformda
          </h2>
          <p className="text-muted-foreground text-lg">
            AI destekli araçlarla profesyonel web sitenizi dakikalar içinde oluşturun.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="p-6 h-full border-border/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-card">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
