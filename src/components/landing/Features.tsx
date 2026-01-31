import { Sparkles, FileText, Layout, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Features() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 text-foreground">
            <span className="text-primary">#1 AI Web Sitesi Oluşturucu</span>
          </h2>
        </div>

        {/* Two Column Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Websites Card */}
          <Card className="overflow-hidden border-border">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                AI Web Siteleri
              </h3>
              <p className="text-muted-foreground mb-6">
                Sizin için özel olarak tasarlandı. Profesyonel, modern ve mobil uyumlu web siteleri.
                Kodlama bilgisi gerektirmez.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Sparkles className="w-4 h-4" />
                <span>AI destekli tasarım</span>
              </div>
            </div>
            
            {/* Mock Preview */}
            <div className="bg-secondary p-6">
              <div className="bg-background rounded-lg p-4 shadow-sm">
                <div className="h-3 w-20 bg-muted rounded mb-3" />
                <div className="h-2 w-32 bg-muted rounded mb-6" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Content Card */}
          <Card className="overflow-hidden border-border">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                AI İçerik Yazımı
              </h3>
              <p className="text-muted-foreground mb-6">
                Sizin için yazıldı. Hizmetleriniz, uzmanlık alanlarınız ve iletişim bilgileriniz
                otomatik olarak içerik haline getirilir.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Zap className="w-4 h-4" />
                <span>Saniyeler içinde hazır</span>
              </div>
            </div>
            
            {/* Mock Content Preview */}
            <div className="bg-secondary p-6">
              <div className="bg-background rounded-lg p-4 shadow-sm space-y-3">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-5/6 bg-muted rounded" />
                <div className="h-2 w-4/6 bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-3/4 bg-muted rounded" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
