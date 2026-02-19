import { Heart, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SectionComponentProps } from '../types';

export function PetRegistrationSection({ section }: SectionComponentProps) {
  const {
    title = 'Hasta Kaydı Oluştur',
    subtitle = 'Evcil dostunuz için bilgilerini girin',
    buttonText = 'Kayıt Oluştur',
  } = section.props;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-[var(--radius)] p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Sahip Adı Soyadı" className="pl-10" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Telefon Numarası" className="pl-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Hayvan Adı" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Tür Seçin" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Köpek</SelectItem>
                <SelectItem value="cat">Kedi</SelectItem>
                <SelectItem value="bird">Kuş</SelectItem>
                <SelectItem value="rabbit">Tavşan</SelectItem>
                <SelectItem value="other">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Irk" />
            <Input placeholder="Yaş" />
          </div>
          <Textarea placeholder="Randevu nedeni / şikayetler..." className="min-h-[80px]" />
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{buttonText}</Button>
        </div>
      </div>
    </section>
  );
}
