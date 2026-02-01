import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Genel
  {
    category: 'Genel',
    question: 'Open Lucius nedir?',
    answer: 'Open Lucius, yapay zeka destekli bir web sitesi oluşturma platformudur. Küçük işletmeler ve profesyoneller için dakikalar içinde profesyonel web siteleri oluşturmanızı sağlar.',
  },
  {
    category: 'Genel',
    question: 'Nasıl başlarım?',
    answer: 'Dashboard\'a giriş yaptıktan sonra "Yeni Website" butonuna tıklayın. AI asistanımız size birkaç soru soracak ve cevaplarınıza göre sitenizi oluşturacak.',
  },
  {
    category: 'Genel',
    question: 'Platform ücretsiz mi?',
    answer: 'Evet, temel özellikler ücretsizdir. Subdomain ile yayınlama, temel düzenleme ve AI içerik oluşturma ücretsiz planımızda dahildir. Premium özellikler için Pro plana geçebilirsiniz.',
  },
  // Website Oluşturma
  {
    category: 'Website Oluşturma',
    question: 'Template nasıl değiştirilir?',
    answer: 'Website editöründeyken sol taraftaki "Customize" panelinden "Change Template" seçeneğine tıklayın. Mevcut template\'ler arasından seçim yapabilirsiniz.',
  },
  {
    category: 'Website Oluşturma',
    question: 'Görseller nereden geliyor?',
    answer: 'Görseller Pixabay\'den otomatik olarak çekilir ve mesleğinize uygun seçilir. İsterseniz kendi görsellerinizi de yükleyebilirsiniz.',
  },
  {
    category: 'Website Oluşturma',
    question: 'AI içerik nasıl düzenlenir?',
    answer: 'Sitenizdeki herhangi bir metne tıkladığınızda sağ tarafta editör paneli açılır. Metni manuel düzenleyebilir veya "AI ile Yeniden Oluştur" butonunu kullanabilirsiniz.',
  },
  {
    category: 'Website Oluşturma',
    question: 'Renkleri nasıl değiştiririm?',
    answer: 'Editör araç çubuğundaki "Customize" butonuna tıklayın. "Colors" bölümünden hazır renk paletlerini seçebilir veya özel renkler tanımlayabilirsiniz.',
  },
  {
    category: 'Website Oluşturma',
    question: 'Yeni sayfa nasıl eklenir?',
    answer: 'Editör araç çubuğundaki "Add" butonuna tıklayın. Buradan yeni sayfalar (Hakkımızda, Hizmetler, İletişim, Blog) ekleyebilirsiniz.',
  },
  // Yayınlama
  {
    category: 'Yayınlama',
    question: 'Subdomain nasıl alınır?',
    answer: 'Website Dashboard\'da "Publish" butonuna tıklayın. Açılan modalda istediğiniz subdomain\'i girin (örn: isletmem.openlucius.app) ve yayınlayın.',
  },
  {
    category: 'Yayınlama',
    question: 'Custom domain nasıl bağlanır?',
    answer: 'Website Dashboard\'da "Domain" sekmesine gidin. Domain adresinizi ekleyin, ardından DNS ayarlarınızda gösterilen A ve TXT kayıtlarını yapılandırın.',
  },
  {
    category: 'Yayınlama',
    question: 'SEO ayarları nerede?',
    answer: 'Website Dashboard\'da "Settings" sekmesine gidin. Buradan sayfa başlığı (title) ve açıklama (meta description) ayarlarını yapabilirsiniz.',
  },
  // AI Studio
  {
    category: 'AI Studio',
    question: 'AI Studio ne işe yarar?',
    answer: 'AI Studio, web siteniz için logo, favicon, sosyal medya görselleri ve hero banner\'lar oluşturmanızı sağlayan yapay zeka aracıdır.',
  },
  {
    category: 'AI Studio',
    question: 'Oluşturduğum görselleri nasıl kullanırım?',
    answer: 'AI Studio\'da oluşturduğunuz görseller galerinize kaydedilir. Web site editöründe görsel değiştirirken bu görselleri seçebilirsiniz.',
  },
  // Analytics
  {
    category: 'Analytics',
    question: 'Analytics verileri neyi gösterir?',
    answer: 'Analytics, sitenizin ziyaretçi sayısı, sayfa görüntülemeleri, cihaz dağılımı ve zaman bazlı trafik bilgilerini gösterir.',
  },
  {
    category: 'Analytics',
    question: 'Veriler ne kadar geriye gidiyor?',
    answer: 'Şu anda son 7, 30 ve 90 günlük verileri görüntüleyebilirsiniz. Daha detaylı analitikler için Pro plana geçebilirsiniz.',
  },
];

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqData.map((item) => item.category))];

  const groupedFAQ = categories.reduce((acc, category) => {
    acc[category] = filteredFAQ.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="SSS içinde ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQ by Category */}
      {categories.map((category) => {
        const items = groupedFAQ[category];
        if (items.length === 0) return null;

        return (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {category}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={index} value={`${category}-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );
      })}

      {filteredFAQ.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aramanızla eşleşen sonuç bulunamadı.</p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin.</p>
        </div>
      )}
    </div>
  );
}
