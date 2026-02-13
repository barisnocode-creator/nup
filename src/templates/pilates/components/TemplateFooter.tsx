interface PilatesFooterProps {
  siteName: string;
  tagline?: string;
}

export function PilatesFooter({ siteName, tagline }: PilatesFooterProps) {
  return (
    <footer className="bg-[#2d2420] py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#c4775a] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#c4775a]" />
              </div>
              <span className="font-serif text-xl text-[#f5ebe0]">{siteName}</span>
            </div>
            <p className="text-[#f5ebe0]/50 text-sm max-w-sm leading-relaxed">
              {tagline || 'Experience movement in its most authentic form at our one-of-a-kind studio.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#f5ebe0] font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Why Pilates', 'Our Studio', 'Teachers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#f5ebe0]/50 text-sm hover:text-[#c4775a] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#f5ebe0] font-semibold text-sm uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#f5ebe0]/20 flex items-center justify-center text-[#f5ebe0]/50 hover:border-[#c4775a] hover:text-[#c4775a] transition-all text-xs"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#f5ebe0]/30 text-xs">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#f5ebe0]/30 text-xs hover:text-[#f5ebe0]/60 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#f5ebe0]/30 text-xs hover:text-[#f5ebe0]/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
