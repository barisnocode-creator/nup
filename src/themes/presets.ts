// Theme Presets - Design System (standalone, no SDK dependency)

export interface ThemePresetValues {
  fontFamily?: { heading?: string; body?: string };
  borderRadius?: string;
  colors?: Record<string, string[]>;
}

// Modern Professional (temp1)
export const modernProfessionalPreset: ThemePresetValues = {
  fontFamily: { heading: "Inter", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#ffffff", "#0d0d0d"],
    foreground: ["#1a1a1a", "#fafafa"],
    primary: ["#f97316", "#fb923c"],
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

export const boldAgencyPreset: ThemePresetValues = {
  fontFamily: { heading: "Space Grotesk", body: "Inter" },
  borderRadius: "0px",
  colors: {
    background: ["#0f0f0f", "#0f0f0f"], foreground: ["#ffffff", "#ffffff"],
    primary: ["#ffffff", "#ffffff"], "primary-foreground": ["#0f0f0f", "#0f0f0f"],
    secondary: ["#1a1a1a", "#1a1a1a"], "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
    muted: ["#1a1a1a", "#1a1a1a"], "muted-foreground": ["#737373", "#737373"],
    accent: ["#ffffff", "#ffffff"], "accent-foreground": ["#0f0f0f", "#0f0f0f"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#2e2e2e", "#2e2e2e"], input: ["#2e2e2e", "#2e2e2e"], ring: ["#ffffff", "#ffffff"],
    card: ["#141414", "#141414"], "card-foreground": ["#ffffff", "#ffffff"],
    popover: ["#141414", "#141414"], "popover-foreground": ["#ffffff", "#ffffff"],
  },
};

export const elegantMinimalPreset: ThemePresetValues = {
  fontFamily: { heading: "Playfair Display", body: "Lora" },
  borderRadius: "4px",
  colors: {
    background: ["#F7F5F3", "#1a1814"], foreground: ["#37322F", "#e8e4e0"],
    primary: ["#37322F", "#e8e4e0"], "primary-foreground": ["#F7F5F3", "#1a1814"],
    secondary: ["#EAE6E1", "#2d2820"], "secondary-foreground": ["#5c5347", "#d4cfc6"],
    muted: ["#EAE6E1", "#2d2820"], "muted-foreground": ["#8b8177", "#a69d91"],
    accent: ["#a67c52", "#c49a6c"], "accent-foreground": ["#ffffff", "#1a1814"],
    destructive: ["#c53030", "#fc8181"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#DDD8D2", "#3d362c"], input: ["#DDD8D2", "#3d362c"], ring: ["#37322F", "#e8e4e0"],
    card: ["#ffffff", "#221e19"], "card-foreground": ["#37322F", "#e8e4e0"],
    popover: ["#ffffff", "#221e19"], "popover-foreground": ["#37322F", "#e8e4e0"],
  },
};

export const corporateBluePreset: ThemePresetValues = {
  fontFamily: { heading: "Poppins", body: "Open Sans" },
  borderRadius: "6px",
  colors: {
    background: ["#ffffff", "#0a0a0f"], foreground: ["#0f172a", "#f8fafc"],
    primary: ["#1e40af", "#3b82f6"], "primary-foreground": ["#ffffff", "#0f172a"],
    secondary: ["#f1f5f9", "#1e293b"], "secondary-foreground": ["#0f172a", "#f8fafc"],
    muted: ["#f1f5f9", "#1e293b"], "muted-foreground": ["#64748b", "#94a3b8"],
    accent: ["#1e40af", "#3b82f6"], "accent-foreground": ["#ffffff", "#0f172a"],
    destructive: ["#dc2626", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e2e8f0", "#334155"], input: ["#e2e8f0", "#334155"], ring: ["#1e40af", "#3b82f6"],
    card: ["#ffffff", "#0f172a"], "card-foreground": ["#0f172a", "#f8fafc"],
    popover: ["#ffffff", "#0f172a"], "popover-foreground": ["#0f172a", "#f8fafc"],
  },
};

export const minimalDarkPreset: ThemePresetValues = {
  fontFamily: { heading: "Space Grotesk", body: "Inter" },
  borderRadius: "0px",
  colors: {
    background: ["#0a0a0a", "#0a0a0a"], foreground: ["#fafafa", "#fafafa"],
    primary: ["#ffffff", "#ffffff"], "primary-foreground": ["#0a0a0a", "#0a0a0a"],
    secondary: ["#171717", "#171717"], "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
    muted: ["#171717", "#171717"], "muted-foreground": ["#737373", "#737373"],
    accent: ["#ffffff", "#ffffff"], "accent-foreground": ["#0a0a0a", "#0a0a0a"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#262626", "#262626"], input: ["#262626", "#262626"], ring: ["#ffffff", "#ffffff"],
    card: ["#0f0f0f", "#0f0f0f"], "card-foreground": ["#fafafa", "#fafafa"],
    popover: ["#0f0f0f", "#0f0f0f"], "popover-foreground": ["#fafafa", "#fafafa"],
  },
};

export const modernSaasPreset: ThemePresetValues = {
  fontFamily: { heading: "Inter", body: "Inter" },
  borderRadius: "12px",
  colors: {
    background: ["#ffffff", "#0f0f23"], foreground: ["#0f0f23", "#ffffff"],
    primary: ["#8B5CF6", "#a78bfa"], "primary-foreground": ["#ffffff", "#0f0f23"],
    secondary: ["#f1f0ff", "#1e1e3f"], "secondary-foreground": ["#5b5b9d", "#c4c4ff"],
    muted: ["#f1f0ff", "#1e1e3f"], "muted-foreground": ["#7c7c9e", "#9f9fc4"],
    accent: ["#06b6d4", "#22d3ee"], "accent-foreground": ["#ffffff", "#0f0f23"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e9e8ff", "#2d2d5a"], input: ["#e9e8ff", "#2d2d5a"], ring: ["#8B5CF6", "#a78bfa"],
    card: ["#ffffff", "#161632"], "card-foreground": ["#0f0f23", "#ffffff"],
    popover: ["#ffffff", "#161632"], "popover-foreground": ["#0f0f23", "#ffffff"],
  },
};

export const videoStudioPreset: ThemePresetValues = {
  fontFamily: { heading: "Space Grotesk", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#0a0a0a", "#0a0a0a"], foreground: ["#fafafa", "#fafafa"],
    primary: ["#a3e635", "#bef264"], "primary-foreground": ["#0a0a0a", "#0a0a0a"],
    secondary: ["#171717", "#171717"], "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
    muted: ["#171717", "#171717"], "muted-foreground": ["#737373", "#737373"],
    accent: ["#a3e635", "#bef264"], "accent-foreground": ["#0a0a0a", "#0a0a0a"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#262626", "#262626"], input: ["#262626", "#262626"], ring: ["#a3e635", "#bef264"],
    card: ["#141414", "#141414"], "card-foreground": ["#fafafa", "#fafafa"],
    popover: ["#141414", "#141414"], "popover-foreground": ["#fafafa", "#fafafa"],
  },
};

export const vibrantCreativePreset: ThemePresetValues = {
  fontFamily: { heading: "Sora", body: "Inter" },
  borderRadius: "16px",
  colors: {
    background: ["#ffffff", "#0f0f23"], foreground: ["#0f0f23", "#ffffff"],
    primary: ["#8b5cf6", "#a78bfa"], "primary-foreground": ["#ffffff", "#0f0f23"],
    secondary: ["#f1f0ff", "#1e1e3f"], "secondary-foreground": ["#5b5b9d", "#c4c4ff"],
    muted: ["#f1f0ff", "#1e1e3f"], "muted-foreground": ["#7c7c9e", "#9f9fc4"],
    accent: ["#06b6d4", "#22d3ee"], "accent-foreground": ["#ffffff", "#0f0f23"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e9e8ff", "#2d2d5a"], input: ["#e9e8ff", "#2d2d5a"], ring: ["#8b5cf6", "#a78bfa"],
    card: ["#ffffff", "#161632"], "card-foreground": ["#0f0f23", "#ffffff"],
    popover: ["#ffffff", "#161632"], "popover-foreground": ["#0f0f23", "#ffffff"],
  },
};

export const lawyerFirmPreset: ThemePresetValues = {
  fontFamily: { heading: "Playfair Display", body: "Inter" },
  borderRadius: "0px",
  colors: {
    background: ["#ffffff", "#0a0a0a"], foreground: ["#000000", "#fafafa"],
    primary: ["#000000", "#ffffff"], "primary-foreground": ["#ffffff", "#000000"],
    secondary: ["#f7f7f7", "#171717"], "secondary-foreground": ["#525252", "#a3a3a3"],
    muted: ["#f7f7f7", "#171717"], "muted-foreground": ["#737373", "#a3a3a3"],
    accent: ["#000000", "#ffffff"], "accent-foreground": ["#ffffff", "#000000"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e5e5e5", "#262626"], input: ["#e5e5e5", "#262626"], ring: ["#000000", "#ffffff"],
    card: ["#ffffff", "#0f0f0f"], "card-foreground": ["#000000", "#fafafa"],
    popover: ["#ffffff", "#0f0f0f"], "popover-foreground": ["#000000", "#fafafa"],
  },
};

export const wellnessStudioPreset: ThemePresetValues = {
  fontFamily: { heading: "Playfair Display", body: "DM Sans" },
  borderRadius: "8px",
  colors: {
    background: ["#f5ebe0", "#1a1412"], foreground: ["#2d2420", "#f5ebe0"],
    primary: ["#c4956a", "#d4a57a"], "primary-foreground": ["#ffffff", "#1a1412"],
    secondary: ["#e8ddd0", "#2d2820"], "secondary-foreground": ["#6b5e54", "#d4cfc6"],
    muted: ["#e8ddd0", "#2d2820"], "muted-foreground": ["#8b7d72", "#a69d91"],
    accent: ["#c4956a", "#d4a57a"], "accent-foreground": ["#ffffff", "#1a1412"],
    destructive: ["#c53030", "#fc8181"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#ddd3c5", "#3d362c"], input: ["#ddd3c5", "#3d362c"], ring: ["#c4956a", "#d4a57a"],
    card: ["#ffffff", "#221e19"], "card-foreground": ["#2d2420", "#f5ebe0"],
    popover: ["#ffffff", "#221e19"], "popover-foreground": ["#2d2420", "#f5ebe0"],
  },
};

export const naturalLifestylePreset: ThemePresetValues = {
  fontFamily: { heading: "Playfair Display", body: "Inter" },
  borderRadius: "16px",
  colors: {
    background: ["#f5f0e8", "#1a1a1a"], foreground: ["#2e2e2e", "#f5f0e8"],
    primary: ["#2e2e2e", "#f5f0e8"], "primary-foreground": ["#f5f0e8", "#2e2e2e"],
    secondary: ["#c4956a", "#3d2e1f"], "secondary-foreground": ["#2e2e2e", "#f5f0e8"],
    muted: ["#e8ddd0", "#333333"], "muted-foreground": ["#666666", "#999999"],
    accent: ["#5a8a6a", "#5a8a6a"], "accent-foreground": ["#f5f0e8", "#f5f0e8"],
    destructive: ["#dc3545", "#fc8181"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#ddd3c5", "#333333"], input: ["#ddd3c5", "#333333"], ring: ["#2e2e2e", "#f5f0e8"],
    card: ["#ede5d8", "#242424"], "card-foreground": ["#2e2e2e", "#f5f0e8"],
    popover: ["#f5f0e8", "#1a1a1a"], "popover-foreground": ["#2e2e2e", "#f5f0e8"],
  },
};

export const defaultTheme: ThemePresetValues = modernProfessionalPreset;

export const themePresets: Record<string, ThemePresetValues>[] = [
  { "Modern Profesyonel": modernProfessionalPreset },
  { "Cesur Ajans": boldAgencyPreset },
  { "Zarif Minimal": elegantMinimalPreset },
  { "Kurumsal Mavi": corporateBluePreset },
  { "Minimal Koyu": minimalDarkPreset },
  { "Modern SaaS": modernSaasPreset },
  { "Video Stüdyo": videoStudioPreset },
  { "Canlı Yaratıcı": vibrantCreativePreset },
  { "Hukuk Bürosu": lawyerFirmPreset },
  { "Natural Lifestyle": naturalLifestylePreset },
];

export const templateToPreset: Record<string, ThemePresetValues> = {
  "temp1": modernProfessionalPreset,
  "temp2": boldAgencyPreset,
  "temp3": elegantMinimalPreset,
  "temp4-video-studio": videoStudioPreset,
  "gith1": modernSaasPreset,
  "gith2": corporateBluePreset,
  "gith3": minimalDarkPreset,
  "pilates1": wellnessStudioPreset,
  "lawyer-firm": lawyerFirmPreset,
  "natural": naturalLifestylePreset,
};
