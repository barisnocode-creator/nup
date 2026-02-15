import { useState, useEffect } from 'react';

interface LawyerHeaderProps {
  siteName: string;
  onNavigate?: (sectionId: string) => void;
}

export function LawyerHeader({ siteName, onNavigate }: LawyerHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Hakkımızda', id: 'about' },
    { label: 'Alanlar', id: 'practice' },
    { label: 'Ekip', id: 'team' },
    { label: 'SSS', id: 'faq' },
    { label: 'İletişim', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-md shadow-sm' : ''
      }`}
      style={{
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-lg tracking-wide"
          style={{ color: 'var(--lw-white)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}
        >
          {siteName}
        </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          style={{ color: 'var(--lw-white)' }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.9)', borderTop: '1px solid var(--lw-gray-800)' }}>
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left py-2 text-sm tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--lw-white)' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
