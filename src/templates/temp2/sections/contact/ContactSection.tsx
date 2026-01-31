interface BoldContactSectionProps {
  headline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function BoldContactSection({
  headline,
  address,
  phone,
  email,
  hours,
  isEditable = false,
  onFieldEdit,
}: BoldContactSectionProps) {
  return (
    <section id="contact" className="py-24 bg-gray-950 relative">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <div>
            <span className="inline-block px-3 py-1 bg-white/5 text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-l-4 border-white">
              Get In Touch
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-8">
              {headline || "Let's Work Together"}
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Address</div>
                  <div className="text-gray-300">{address}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</div>
                  <div className="text-gray-300">{phone}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</div>
                  <div className="text-gray-300">{email}</div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Hours</div>
                  <div className="text-gray-300">{hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-gray-900 p-8 lg:p-12 border border-gray-800">
            <h3 className="text-2xl font-bold uppercase tracking-wide text-white mb-8">
              Send a Message
            </h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-gray-950 border border-gray-800 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-4 bg-gray-950 border border-gray-800 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 bg-gray-950 border border-gray-800 text-white focus:border-white focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-5 bg-white text-gray-950 font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
