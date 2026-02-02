// Chaibuilder Theme Presets - Open Lucius Design System

export interface ChaiThemeValues {
  fontFamily: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  colors: {
    [key: string]: [string, string]; // [light, dark]
  };
}

export const modernProfessionalPreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Inter",
    body: "Inter",
  },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0d0d0d"],
    foreground: ["#1a1a1a", "#fafafa"],
    primary: ["#f97316", "#fb923c"], // Orange
    "primary-foreground": ["#ffffff", "#0d0d0d"],
    secondary: ["#f4f4f5", "#262626"],
    "secondary-foreground": ["#4a4a4a", "#cccccc"],
    muted: ["#f4f4f5", "#262626"],
    "muted-foreground": ["#737373", "#a3a3a3"],
    accent: ["#f97316", "#fb923c"],
    "accent-foreground": ["#ffffff", "#0d0d0d"],
    destructive: ["#ef4444", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e5e5e5", "#2e2e2e"],
    input: ["#e5e5e5", "#2e2e2e"],
    ring: ["#f97316", "#fb923c"],
    card: ["#ffffff", "#141414"],
    "card-foreground": ["#1a1a1a", "#fafafa"],
    popover: ["#ffffff", "#141414"],
    "popover-foreground": ["#1a1a1a", "#fafafa"],
  },
};

export const corporateBluePreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Poppins",
    body: "Open Sans",
  },
  borderRadius: "4px",
  colors: {
    background: ["#ffffff", "#0a0a0f"],
    foreground: ["#0f172a", "#f8fafc"],
    primary: ["#1e40af", "#3b82f6"],
    "primary-foreground": ["#ffffff", "#0f172a"],
    secondary: ["#f1f5f9", "#1e293b"],
    "secondary-foreground": ["#0f172a", "#f8fafc"],
    muted: ["#f1f5f9", "#1e293b"],
    "muted-foreground": ["#64748b", "#94a3b8"],
    accent: ["#1e40af", "#3b82f6"],
    "accent-foreground": ["#ffffff", "#0f172a"],
    destructive: ["#dc2626", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e2e8f0", "#334155"],
    input: ["#e2e8f0", "#334155"],
    ring: ["#1e40af", "#3b82f6"],
    card: ["#ffffff", "#0f172a"],
    "card-foreground": ["#0f172a", "#f8fafc"],
    popover: ["#ffffff", "#0f172a"],
    "popover-foreground": ["#0f172a", "#f8fafc"],
  },
};

export const minimalDarkPreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Space Grotesk",
    body: "Inter",
  },
  borderRadius: "0px",
  colors: {
    background: ["#0a0a0a", "#0a0a0a"],
    foreground: ["#fafafa", "#fafafa"],
    primary: ["#ffffff", "#ffffff"],
    "primary-foreground": ["#0a0a0a", "#0a0a0a"],
    secondary: ["#171717", "#171717"],
    "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
    muted: ["#171717", "#171717"],
    "muted-foreground": ["#737373", "#737373"],
    accent: ["#ffffff", "#ffffff"],
    "accent-foreground": ["#0a0a0a", "#0a0a0a"],
    destructive: ["#ef4444", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#262626", "#262626"],
    input: ["#262626", "#262626"],
    ring: ["#ffffff", "#ffffff"],
    card: ["#0f0f0f", "#0f0f0f"],
    "card-foreground": ["#fafafa", "#fafafa"],
    popover: ["#0f0f0f", "#0f0f0f"],
    "popover-foreground": ["#fafafa", "#fafafa"],
  },
};

export const elegantSerifPreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Playfair Display",
    body: "Lora",
  },
  borderRadius: "12px",
  colors: {
    background: ["#faf9f7", "#1a1814"],
    foreground: ["#1a1814", "#f5f4f2"],
    primary: ["#a67c52", "#c49a6c"],
    "primary-foreground": ["#ffffff", "#1a1814"],
    secondary: ["#f0ebe4", "#2d2820"],
    "secondary-foreground": ["#5c5347", "#d4cfc6"],
    muted: ["#f0ebe4", "#2d2820"],
    "muted-foreground": ["#8b8177", "#a69d91"],
    accent: ["#a67c52", "#c49a6c"],
    "accent-foreground": ["#ffffff", "#1a1814"],
    destructive: ["#c53030", "#fc8181"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e8e2d9", "#3d362c"],
    input: ["#e8e2d9", "#3d362c"],
    ring: ["#a67c52", "#c49a6c"],
    card: ["#ffffff", "#221e19"],
    "card-foreground": ["#1a1814", "#f5f4f2"],
    popover: ["#ffffff", "#221e19"],
    "popover-foreground": ["#1a1814", "#f5f4f2"],
  },
};

export const vibrantCreativePreset: ChaiThemeValues = {
  fontFamily: {
    heading: "Sora",
    body: "Inter",
  },
  borderRadius: "16px",
  colors: {
    background: ["#ffffff", "#0f0f23"],
    foreground: ["#0f0f23", "#ffffff"],
    primary: ["#8b5cf6", "#a78bfa"],
    "primary-foreground": ["#ffffff", "#0f0f23"],
    secondary: ["#f1f0ff", "#1e1e3f"],
    "secondary-foreground": ["#5b5b9d", "#c4c4ff"],
    muted: ["#f1f0ff", "#1e1e3f"],
    "muted-foreground": ["#7c7c9e", "#9f9fc4"],
    accent: ["#06b6d4", "#22d3ee"],
    "accent-foreground": ["#ffffff", "#0f0f23"],
    destructive: ["#ef4444", "#f87171"],
    "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e9e8ff", "#2d2d5a"],
    input: ["#e9e8ff", "#2d2d5a"],
    ring: ["#8b5cf6", "#a78bfa"],
    card: ["#ffffff", "#161632"],
    "card-foreground": ["#0f0f23", "#ffffff"],
    popover: ["#ffffff", "#161632"],
    "popover-foreground": ["#0f0f23", "#ffffff"],
  },
};

export const themePresets = [
  { id: "modern-professional", name: "Modern Profesyonel", ...modernProfessionalPreset },
  { id: "corporate-blue", name: "Kurumsal Mavi", ...corporateBluePreset },
  { id: "minimal-dark", name: "Minimal Koyu", ...minimalDarkPreset },
  { id: "elegant-serif", name: "Zarif Serif", ...elegantSerifPreset },
  { id: "vibrant-creative", name: "Canlı Yaratıcı", ...vibrantCreativePreset },
];

export const defaultTheme = modernProfessionalPreset;
