import { useState } from 'react';
import { GeneratedContent, WebsitePage } from '@/types/generated-website';
import { WebsiteHeader } from './WebsiteHeader';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';

interface WebsitePreviewProps {
  content: GeneratedContent;
  colorPreference: string;
}

export function WebsitePreview({ content, colorPreference }: WebsitePreviewProps) {
  const [currentPage, setCurrentPage] = useState<WebsitePage>('home');

  const isDark = colorPreference === 'dark';
  const isNeutral = colorPreference === 'neutral';

  const themeClasses = isDark 
    ? 'bg-slate-900 text-white' 
    : isNeutral 
      ? 'bg-stone-50 text-stone-900'
      : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <WebsiteHeader 
        siteName={content.metadata.siteName}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDark={isDark}
      />
      
      <main>
        {currentPage === 'home' && (
          <HomePage content={content.pages.home} isDark={isDark} isNeutral={isNeutral} />
        )}
        {currentPage === 'about' && (
          <AboutPage content={content.pages.about} isDark={isDark} isNeutral={isNeutral} />
        )}
        {currentPage === 'services' && (
          <ServicesPage content={content.pages.services} isDark={isDark} isNeutral={isNeutral} />
        )}
        {currentPage === 'contact' && (
          <ContactPage content={content.pages.contact} isDark={isDark} isNeutral={isNeutral} />
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDark ? 'border-slate-700 bg-slate-950' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} {content.metadata.siteName}. All rights reserved.
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            {content.metadata.tagline}
          </p>
        </div>
      </footer>
    </div>
  );
}
