import { ArrowUpRight } from 'lucide-react';

interface Service {
  title: string;
  description: string;
}

interface WorksGridProps {
  services: Service[];
  galleryImages?: string[];
}

export function WorksGrid({ services, galleryImages }: WorksGridProps) {
  // Combine services with gallery images for visual appeal
  const works = services.slice(0, 4).map((service, index) => ({
    ...service,
    image: galleryImages?.[index],
    number: String(index + 1).padStart(2, '0'),
  }));

  return (
    <section className="py-32" id="works">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b border-zinc-800 pb-8">
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-4 block">
              Seçili Çalışmalar
            </span>
            <h2 className="text-3xl md:text-4xl font-light">Projeler</h2>
          </div>
          <span className="text-zinc-600 text-sm">({works.length})</span>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {works.map((work, index) => (
            <a
              key={index}
              href="#"
              className="group block"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-zinc-900 rounded-lg overflow-hidden mb-6">
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl font-light text-zinc-800">
                      {work.number}
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-light mb-2 group-hover:text-zinc-400 transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">
                    {work.description}
                  </p>
                </div>
                <span className="text-zinc-600 text-sm">{work.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
