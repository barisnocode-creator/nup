interface AboutMinimalProps {
  story: {
    title: string;
    content: string;
  };
  values: Array<{
    title: string;
    description: string;
  }>;
}

export function AboutMinimal({ story, values }: AboutMinimalProps) {
  return (
    <section className="py-32 bg-zinc-900/50" id="about">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div>
            <span className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-8 block">
              Hakkımda
            </span>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              {story.title}
            </h2>
          </div>

          {/* Right Column */}
          <div>
            <p className="text-zinc-400 text-lg leading-relaxed mb-12">
              {story.content}
            </p>

            {/* Values */}
            <div className="space-y-8">
              {values.slice(0, 3).map((value, index) => (
                <div key={index} className="border-t border-zinc-800 pt-8">
                  <div className="flex items-start gap-8">
                    <span className="text-zinc-600 text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-lg font-light mb-2">{value.title}</h4>
                      <p className="text-zinc-500 text-sm">{value.description}</p>
                    </div>
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
