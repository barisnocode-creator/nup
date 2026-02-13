import { useEffect } from 'react';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

interface ThemeFonts {
  heading?: string;
  body?: string;
}

interface ThemeSettings {
  colors?: ThemeColors;
  fonts?: ThemeFonts;
  corners?: 'rounded' | 'sharp' | 'pill';
  animations?: boolean;
}

// Convert HEX color to HSL values for CSS variables
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  // Return HSL values as space-separated (for CSS var format)
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Validate hex color
function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

// Google Fonts loading
function loadGoogleFont(fontFamily: string) {
  const formattedFont = fontFamily.replace(/ /g, '+');
  const linkId = `google-font-${formattedFont}`;
  
  // Check if already loaded
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function useThemeColors(settings?: ThemeSettings) {
  useEffect(() => {
    if (!settings) return;
    
    const root = document.documentElement;
    
    // Apply colors
    if (settings.colors) {
      const { primary, secondary, accent } = settings.colors;
      
      if (primary && isValidHex(primary)) {
        const hsl = hexToHsl(primary);
        root.style.setProperty('--primary', hsl);
        root.style.setProperty('--ring', hsl);
        root.style.setProperty('--accent', hsl);
        root.style.setProperty('--sidebar-primary', hsl);
        root.style.setProperty('--sidebar-ring', hsl);
      }
      
      if (secondary && isValidHex(secondary)) {
        // Secondary is used for gradients and secondary buttons
        // We store it as a custom property for use in gradients
        root.style.setProperty('--color-secondary-custom', hexToHsl(secondary));
      }
      
      if (accent && isValidHex(accent)) {
        // Accent can be used for highlights
        root.style.setProperty('--color-accent-custom', hexToHsl(accent));
      }
    }
    
    // Apply fonts
    if (settings.fonts) {
      const { heading, body } = settings.fonts;
      
      if (heading) {
        loadGoogleFont(heading);
        root.style.setProperty('--font-heading', `'${heading}', Georgia, serif`);
      }
      
      if (body) {
        loadGoogleFont(body);
        root.style.setProperty('--font-body', `'${body}', system-ui, sans-serif`);
      }
    }
    
    // Apply corners/border-radius
    if (settings.corners) {
      const radiusMap = {
        sharp: '0',
        rounded: '0.5rem',
        pill: '9999px',
      };
      root.style.setProperty('--radius', radiusMap[settings.corners]);
    }
    
    // Apply animations toggle
    if (settings.animations !== undefined) {
      root.style.setProperty('--animations-enabled', settings.animations ? '1' : '0');
      if (!settings.animations) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
    }
    
    // Cleanup: reset CSS variables so SaaS UI reverts to orange theme
    return () => {
      const props = [
        '--primary', '--ring', '--accent', '--sidebar-primary', '--sidebar-ring',
        '--color-secondary-custom', '--color-accent-custom',
        '--font-heading', '--font-body', '--radius',
      ];
      props.forEach((p) => root.style.removeProperty(p));
      root.classList.remove('reduce-motion');
    };
  }, [settings]);
}

// Export utility for components to use
export { hexToHsl, isValidHex, loadGoogleFont };
