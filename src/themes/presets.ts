// Theme Presets - Design System (standalone, no SDK dependency)

export interface ThemePresetValues {
  fontFamily?: { heading?: string; body?: string };
  borderRadius?: string;
  colors?: Record<string, string[]>;
}

// Specialty Cafe — warm terracotta/coral
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

// Modern Professional — orange/white
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

// Dark Minimal — black bg, turquoise accent
export const darkMinimalPreset: ThemePresetValues = {
  fontFamily: { heading: "Space Grotesk", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#0a0a0a", "#0a0a0a"], foreground: ["#fafafa", "#fafafa"],
    primary: ["#14b8a6", "#2dd4bf"], "primary-foreground": ["#ffffff", "#0a0a0a"],
    secondary: ["#1a1a1a", "#1a1a1a"], "secondary-foreground": ["#a3a3a3", "#a3a3a3"],
    muted: ["#1a1a1a", "#1a1a1a"], "muted-foreground": ["#737373", "#737373"],
    accent: ["#14b8a6", "#2dd4bf"], "accent-foreground": ["#ffffff", "#0a0a0a"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#262626", "#262626"], input: ["#262626", "#262626"], ring: ["#14b8a6", "#2dd4bf"],
    card: ["#111111", "#111111"], "card-foreground": ["#fafafa", "#fafafa"],
    popover: ["#111111", "#111111"], "popover-foreground": ["#fafafa", "#fafafa"],
  },
};

// Pastel Elegant — cream bg, rose accent, serif
export const pastelElegantPreset: ThemePresetValues = {
  fontFamily: { heading: "Lora", body: "DM Sans" },
  borderRadius: "12px",
  colors: {
    background: ["#FDF8F4", "#1a1412"], foreground: ["#3D2B1F", "#F5EDE4"],
    primary: ["#C2717B", "#D4838D"], "primary-foreground": ["#ffffff", "#1a1412"],
    secondary: ["#F0E6DE", "#2d2820"], "secondary-foreground": ["#7A6B62", "#d4cfc6"],
    muted: ["#F0E6DE", "#2d2820"], "muted-foreground": ["#9B8E84", "#a69d91"],
    accent: ["#C2717B", "#D4838D"], "accent-foreground": ["#ffffff", "#1a1412"],
    destructive: ["#c53030", "#fc8181"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#E8DDD0", "#3d362c"], input: ["#E8DDD0", "#3d362c"], ring: ["#C2717B", "#D4838D"],
    card: ["#ffffff", "#221e19"], "card-foreground": ["#3D2B1F", "#F5EDE4"],
    popover: ["#ffffff", "#221e19"], "popover-foreground": ["#3D2B1F", "#F5EDE4"],
  },
};

// Vibrant Bold — white bg, red accent, sans-serif
export const vibrantBoldPreset: ThemePresetValues = {
  fontFamily: { heading: "Poppins", body: "Poppins" },
  borderRadius: "12px",
  colors: {
    background: ["#ffffff", "#0d0d0d"], foreground: ["#111111", "#fafafa"],
    primary: ["#dc2626", "#ef4444"], "primary-foreground": ["#ffffff", "#0d0d0d"],
    secondary: ["#f5f5f5", "#1a1a1a"], "secondary-foreground": ["#525252", "#d4d4d4"],
    muted: ["#f5f5f5", "#1a1a1a"], "muted-foreground": ["#737373", "#a3a3a3"],
    accent: ["#dc2626", "#ef4444"], "accent-foreground": ["#ffffff", "#0d0d0d"],
    destructive: ["#b91c1c", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e5e5e5", "#2e2e2e"], input: ["#e5e5e5", "#2e2e2e"], ring: ["#dc2626", "#ef4444"],
    card: ["#ffffff", "#141414"], "card-foreground": ["#111111", "#fafafa"],
    popover: ["#ffffff", "#141414"], "popover-foreground": ["#111111", "#fafafa"],
  },
};

// Corporate Blue — professional blue accent
export const corporateBluePreset: ThemePresetValues = {
  fontFamily: { heading: "Sora", body: "Inter" },
  borderRadius: "8px",
  colors: {
    background: ["#f8fafc", "#0f172a"], foreground: ["#0f172a", "#f1f5f9"],
    primary: ["#2563eb", "#3b82f6"], "primary-foreground": ["#ffffff", "#0f172a"],
    secondary: ["#e2e8f0", "#1e293b"], "secondary-foreground": ["#475569", "#cbd5e1"],
    muted: ["#e2e8f0", "#1e293b"], "muted-foreground": ["#64748b", "#94a3b8"],
    accent: ["#2563eb", "#3b82f6"], "accent-foreground": ["#ffffff", "#0f172a"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#e2e8f0", "#334155"], input: ["#e2e8f0", "#334155"], ring: ["#2563eb", "#3b82f6"],
    card: ["#ffffff", "#1e293b"], "card-foreground": ["#0f172a", "#f1f5f9"],
    popover: ["#ffffff", "#1e293b"], "popover-foreground": ["#0f172a", "#f1f5f9"],
  },
};

// Dental Clinic — sky-blue tones
export const dentalClinicPreset: ThemePresetValues = {
  fontFamily: { heading: "Sora", body: "Inter" },
  borderRadius: "12px",
  colors: {
    background: ["#f0f9ff", "#0c1a2e"], foreground: ["#0c4a6e", "#e0f2fe"],
    primary: ["#0284c7", "#38bdf8"], "primary-foreground": ["#ffffff", "#0c1a2e"],
    secondary: ["#e0f2fe", "#1e3a5f"], "secondary-foreground": ["#0369a1", "#bae6fd"],
    muted: ["#e0f2fe", "#1e3a5f"], "muted-foreground": ["#64748b", "#94a3b8"],
    accent: ["#0284c7", "#38bdf8"], "accent-foreground": ["#ffffff", "#0c1a2e"],
    destructive: ["#ef4444", "#f87171"], "destructive-foreground": ["#ffffff", "#ffffff"],
    border: ["#bae6fd", "#2d4a6f"], input: ["#bae6fd", "#2d4a6f"], ring: ["#0284c7", "#38bdf8"],
    card: ["#ffffff", "#152238"], "card-foreground": ["#0c4a6e", "#e0f2fe"],
    popover: ["#ffffff", "#152238"], "popover-foreground": ["#0c4a6e", "#e0f2fe"],
  },
};

export const defaultTheme: ThemePresetValues = specialtyCafePreset;

export const themePresets: Record<string, ThemePresetValues>[] = [
  { "Specialty Cafe": specialtyCafePreset },
  { "Modern Profesyonel": modernProfessionalPreset },
];

// Named presets for CustomizePanel display
export const namedPresets: { name: string; preset: ThemePresetValues }[] = [
  { name: "Sıcak Kafe", preset: specialtyCafePreset },
  { name: "Modern Profesyonel", preset: modernProfessionalPreset },
  { name: "Koyu Minimal", preset: darkMinimalPreset },
  { name: "Pastel Zarif", preset: pastelElegantPreset },
  { name: "Canlı Cesur", preset: vibrantBoldPreset },
  { name: "Kurumsal Mavi", preset: corporateBluePreset },
  { name: "Dental Klinik", preset: dentalClinicPreset },
];

export const templateToPreset: Record<string, ThemePresetValues> = {
  "specialty-cafe": specialtyCafePreset,
  "dental-clinic": dentalClinicPreset,
  "temp1": modernProfessionalPreset,
  "pilates1": specialtyCafePreset,
  "lawyer-firm": specialtyCafePreset,
  "natural": specialtyCafePreset,
};
