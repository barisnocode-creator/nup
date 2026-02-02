import { Check } from 'lucide-react';

interface AboutCorporateProps {
  story: {
    title: string;
    content: string;
  };
  values: Array<{
    title: string;
    description: string;
  }>;
  aboutImage?: string;
}

export function AboutCorporate({ story, values, aboutImage }: AboutCorporateProps) {
  return (
    <section className="py-20 bg-slate-50" id="about">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          {aboutImage && (
            <div className="relative">
              <img
                src={aboutImage}
                alt="About us"
                className="rounded-2xl shadow-lg w-full"
              />
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">15+</div>
                <div className="text-blue-100 text-sm">Yıllık Deneyim</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              Hakkımızda
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-6">
              {story.title}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {story.content}
            </p>

            {/* Values */}
            <div className="space-y-4">
              {values.slice(0, 4).map((value, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{value.title}</h4>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
