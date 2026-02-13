import { useEffect, useRef, useState } from 'react';

interface ContactSectionProps {
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  formTitle?: string;
  formSubtitle?: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function ContactSection({
  contactInfo,
  formTitle = 'Get In Touch',
  formSubtitle = "We'd love to hear from you",
  isEditable = false,
  onFieldEdit,
}: ContactSectionProps) {
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

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-[#f5ebe0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-serif text-3xl md:text-5xl text-[#2d2420] mb-4">{formTitle}</h2>
          <p className="text-[#6b5e54] text-lg">{formSubtitle}</p>
        </div>

        <div className={`grid md:grid-cols-2 gap-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-8">
            {[
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: 'Address', value: contactInfo.address },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Phone', value: contactInfo.phone },
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: contactInfo.email },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Hours', value: contactInfo.hours },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c4775a]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#c4775a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2d2420] mb-1">{item.label}</h4>
                  <p className="text-[#6b5e54]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8ddd0]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full px-4 py-3 bg-[#f5ebe0]/50 border border-[#e8ddd0] rounded-lg text-[#2d2420] placeholder:text-[#6b5e54]/50 focus:outline-none focus:ring-2 focus:ring-[#c4775a]/30" />
                <input type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-[#f5ebe0]/50 border border-[#e8ddd0] rounded-lg text-[#2d2420] placeholder:text-[#6b5e54]/50 focus:outline-none focus:ring-2 focus:ring-[#c4775a]/30" />
              </div>
              <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-[#f5ebe0]/50 border border-[#e8ddd0] rounded-lg text-[#2d2420] placeholder:text-[#6b5e54]/50 focus:outline-none focus:ring-2 focus:ring-[#c4775a]/30" />
              <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 bg-[#f5ebe0]/50 border border-[#e8ddd0] rounded-lg text-[#2d2420] placeholder:text-[#6b5e54]/50 focus:outline-none focus:ring-2 focus:ring-[#c4775a]/30 resize-none" />
              <button className="w-full py-3 bg-[#c4775a] text-white font-semibold rounded-lg hover:bg-[#b36a4f] transition-colors duration-300">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
