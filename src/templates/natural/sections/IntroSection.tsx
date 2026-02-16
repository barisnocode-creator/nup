interface IntroSectionProps {
  title?: string;
  description?: string;
}

export function IntroSection({
  title = "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.",
  description = "We believe in the power of thoughtful storytelling. Our platform brings together diverse voices and perspectives to create meaningful conversations about life, wellness, creativity, and personal growth.",
}: IntroSectionProps) {
  return (
    <section id="about" className="max-w-4xl mx-auto py-12 md:py-16 px-4 animate-fade-in">
      <div className="text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight animate-slide-up">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-1">
          {description}
        </p>
      </div>
    </section>
  );
}
