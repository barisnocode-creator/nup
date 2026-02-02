import { ArrowUpRight } from 'lucide-react';

interface ContactMinimalProps {
  email: string;
  siteName: string;
}

export function ContactMinimal({ email, siteName }: ContactMinimalProps) {
  return (
    <section className="py-32" id="contact">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-8 block">
            İletişim
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-12">
            Bir proje fikriniz mi var?
            <br />
            <span className="text-zinc-500">Konuşalım.</span>
          </h2>

          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-4 text-2xl md:text-3xl font-light text-zinc-400 hover:text-white transition-colors group"
          >
            {email}
            <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

          {/* Decorative Line */}
          <div className="mt-24 flex items-center justify-center gap-8">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-zinc-600 text-xs uppercase tracking-widest">
              {siteName}
            </span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
