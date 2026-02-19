import { Scale, User, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SectionComponentProps } from '../types';

const defaultCaseTypes = ['Ceza Hukuku', 'İş Hukuku', 'Aile Hukuku', 'Ticaret Hukuku', 'İcra & İflas', 'Gayrimenkul Hukuku', 'Diğer'];

export function CaseEvaluationSection({ section }: SectionComponentProps) {
  const {
    title = 'Ücretsiz Hukuki Değerlendirme',
    subtitle = 'Durumunuzu kısaca anlatın, size en kısa sürede dönüş yapalım.',
    caseTypes = defaultCaseTypes,
    buttonText = 'Değerlendirme Talep Et',
  } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-[var(--radius)] p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Adınız Soyadınız" className="pl-10" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Telefon Numarası" className="pl-10" />
            </div>
          </div>
          <Select>
            <SelectTrigger><SelectValue placeholder="Dava Türü Seçin" /></SelectTrigger>
            <SelectContent>
              {(caseTypes as string[]).map((ct, i) => <SelectItem key={i} value={ct}>{ct}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea placeholder="Durumunuzu kısaca açıklayın..." className="pl-10 min-h-[100px]" />
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{buttonText}</Button>
        </div>
      </div>
    </section>
  );
}
