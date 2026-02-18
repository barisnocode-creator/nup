// Theme Presets - Design System (standalone, no SDK dependency)

export interface ThemePresetValues {
  fontFamily?: { heading?: string; body?: string };
  borderRadius?: string;
  colors?: Record<string, string[]>;
}

// Specialty Cafe — warm terracotta/coral inspired by pencil.dev
export const specialtyCafePreset: ThemePresetValues = {
  fontFamily: { heading: "Playfair Display", body: "DM Sans" },
  borderRadius: "16px",
  colors: {
    background: ["#F5EDE4", "#1a1412"],
    foreground: ["#2C1810", "#F5EDE4"],
    primary: ["#C65D3E", "#D4714F"],
    "primary-foreground": ["#ffffff", "#1a1412"],
    secondary: ["#E8DDD0", "#2d2820"],
    "secondary-foreground": ["#6B5B50", "#d4cfc6"],
    muted: ["#E8DDD0", "#2d2820"],
    "muted-foreground": ["#8B7D72", "#a69d91"],
    accent: ["#C65D3E", "#D4714F"],
    "accent-foreground": ["#ffffff", "#1a1412"],
    destructive: ["#c53030", "#fc8181"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#DDD3C5", "#3d362c"],
    input: ["#DDD3C5", "#3d362c"],
    ring: ["#C65D3E", "#D4714F"],
    card: ["#ffffff", "#221e19"],
    "card-foreground": ["#2C1810", "#F5EDE4"],
    popover: ["#ffffff", "#221e19"],
    "popover-foreground": ["#2C1810", "#F5EDE4"],
  },
};

// Keep other presets as fallback for existing projects
export const modernProfessionalPreset: ThemePresetValues = {
  fontFamily: { heading: "Inter", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0d0d0d"], foreground: ["#1a1a1a", "#fafafa"],
    primary: ["#f97316", "#fb923c"], "primary-foreground": ["#ffffff", "#0d0d0d"],
    secondary: ["#f4f4f5", "#262626"], "secondary-foreground": ["#4a4a4a", "#cccccc"],
    muted: ["#f4f4f5", "#262626"], "muted-foreground": ["#737373", "#a3a3a3"],
    accent: ["#f97316", "#fb923c"], "accent-foreground": ["#ffffff", "#0d0d0d"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e5e5e5", "#2e2e2e"], input: ["#e5e5e5", "#2e2e2e"], ring: ["#f97316", "#fb923c"],
    card: ["#ffffff", "#141414"], "card-foreground": ["#1a1a1a", "#fafafa"],
    popover: ["#ffffff", "#141414"], "popover-foreground": ["#1a1a1a", "#fafafa"],
  },
};

export const defaultTheme: ThemePresetValues = specialtyCafePreset;

export const themePresets: Record<string, ThemePresetValues>[] = [
  { "Specialty Cafe": specialtyCafePreset },
  { "Modern Profesyonel": modernProfessionalPreset },
];

export const templateToPreset: Record<string, ThemePresetValues> = {
  "specialty-cafe": specialtyCafePreset,
  "temp1": modernProfessionalPreset,
  // Legacy mappings for existing projects
  "pilates1": specialtyCafePreset,
  "lawyer-firm": specialtyCafePreset,
  "natural": specialtyCafePreset,
};
