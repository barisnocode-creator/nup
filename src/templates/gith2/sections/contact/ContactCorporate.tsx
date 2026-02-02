import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactCorporateProps {
  form: {
    title: string;
    subtitle: string;
  };
  info: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
}

export function ContactCorporate({ form, info }: ContactCorporateProps) {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              İletişim
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-6">
              {form.title}
            </h2>
            <p className="text-slate-600 mb-8">
              {form.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Telefon</h4>
                  <a href={`tel:${info.phone}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {info.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">E-posta</h4>
                  <a href={`mailto:${info.email}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                    {info.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Adres</h4>
                  <p className="text-slate-600">{info.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Çalışma Saatleri</h4>
                  <p className="text-slate-600">{info.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 rounded-2xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adınız
                  </label>
                  <Input placeholder="Adınız" className="bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Soyadınız
                  </label>
                  <Input placeholder="Soyadınız" className="bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  E-posta
                </label>
                <Input type="email" placeholder="ornek@email.com" className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefon
                </label>
                <Input type="tel" placeholder="0555 555 55 55" className="bg-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mesajınız
                </label>
                <Textarea placeholder="Mesajınızı yazın..." className="bg-white min-h-[120px]" />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Mesaj Gönder
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
