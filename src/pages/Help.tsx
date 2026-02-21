import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FAQSection } from '@/components/help/FAQSection';
import { ContactSupport } from '@/components/help/ContactSupport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageSquare, BookOpen, Play } from 'lucide-react';

export default function Help() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Yardım & Destek</h1>
          <p className="text-muted-foreground mt-1">
            Sorularınızın cevaplarını bulun veya bizimle iletişime geçin.
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Hızlı Başlangıç
            </CardTitle>
            <CardDescription>
              NUppel'i kullanmaya başlamak için temel adımlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Website Oluşturun</p>
                  <p className="text-sm text-muted-foreground">
                    Dashboard'dan "Yeni Website" ile başlayın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Özelleştirin</p>
                  <p className="text-sm text-muted-foreground">
                    Renkleri, fontları ve içeriği düzenleyin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Yayınlayın</p>
                  <p className="text-sm text-muted-foreground">
                    Subdomain seçin ve sitenizi yayınlayın
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Sıkça Sorulan Sorular
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              İletişim
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <FAQSection />
          </TabsContent>

          <TabsContent value="contact">
            <ContactSupport />
          </TabsContent>
        </Tabs>

        {/* Additional Resources */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Ek Kaynaklar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium">Video Eğitimler</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Adım adım video rehberlerimiz yakında
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium">Blog</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  İpuçları ve güncellemeler yakında
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium">API Dokümantasyonu</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Geliştiriciler için yakında
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
