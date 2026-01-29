interface TemplateFooterProps {
  siteName: string;
  tagline: string;
  isDark: boolean;
}

export function TemplateFooter({ siteName, tagline, isDark }: TemplateFooterProps) {
  return (
    <footer className={`py-8 border-t ${isDark ? 'border-slate-700 bg-slate-950' : 'border-gray-200 bg-white'}`}>
      <div className="container mx-auto px-4 text-center">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          {tagline}
        </p>
      </div>
    </footer>
  );
}
