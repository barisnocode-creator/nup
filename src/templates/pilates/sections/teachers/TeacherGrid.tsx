import { useEffect, useRef, useState } from 'react';

interface TeacherGridProps {
  teamTitle?: string;
  teamDescription?: string;
  teamMembers?: Array<{ title: string; description: string }>;
  teamImages?: string[];
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function TeacherGrid({
  teamTitle = 'Ekibimiz',
  teamDescription = 'Yolculuğunuzda size rehberlik edecek uzmanlar.',
  teamMembers,
  teamImages,
  isEditable = false,
  onFieldEdit,
}: TeacherGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const defaultTeachers = [
    { name: 'Sarah Chen', role: 'Baş Eğitmen', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80' },
    { name: 'Maya Patel', role: 'Reformer Uzmanı', image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&q=80' },
    { name: 'Elena Rossi', role: 'Mat Pilates Uzmanı', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
    { name: 'Liam Foster', role: 'Rehabilitasyon Koçu', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
  ];

  // Use dynamic data from generated content if available
  const teachers = teamMembers?.length
    ? teamMembers.map((member, i) => ({
        name: member.title,
        role: member.description,
        image: teamImages?.[i] || defaultTeachers[i % defaultTeachers.length].image,
      }))
    : defaultTeachers;

  return (
    <section ref={sectionRef} id="teachers" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">{teamTitle}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{teamDescription}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className={`group text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-serif text-lg text-foreground">{teacher.name}</h3>
              <p className="text-muted-foreground text-sm">{teacher.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
