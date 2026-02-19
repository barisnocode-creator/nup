import { Mail, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SectionComponentProps } from '../types';

export function MessageFormSection({ section }: SectionComponentProps) {
  const { title = 'Bize Mesaj Bırakın', subtitle = 'Size en kısa sürede dönüş yapacağız', buttonText = 'Gönder' } = section.props;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-[var(--radius)] p-8 shadow-sm space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Adınız Soyadınız" className="pl-10" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="E-posta Adresiniz" type="email" className="pl-10" />
          </div>
          <Textarea placeholder="Mesajınız..." className="min-h-[120px]" />
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="w-4 h-4 mr-2" />{buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
