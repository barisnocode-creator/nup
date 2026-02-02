import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Gith2HeaderProps {
  siteName: string;
  isEditable?: boolean;
}

export function Gith2Header({ siteName, isEditable }: Gith2HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Hizmetler', href: '#services' },
    { label: 'Hakkımızda', href: '#about' },
    { label: 'Referanslar', href: '#testimonials' },
    { label: 'İletişim', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {siteName.charAt(0)}
              </span>
            </div>
            <span className="font-bold text-xl text-slate-800">{siteName}</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
              Giriş
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Randevu Al
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t mt-2 px-4">
                <Button variant="outline" className="w-full">
                  Giriş
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Randevu Al
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
