import { X, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { namedPresets } from '@/themes/presets';
import type { SiteTheme } from '@/components/sections/types';

interface CustomizePanelProps {
  theme: SiteTheme;
  onUpdateTheme: (updates: Partial<SiteTheme>) => void;
  onClose: () => void;
  onOpenTemplateModal: () => void;
}

const fontOptions = [
  'Inter', 'Playfair Display', 'Space Grotesk', 'Poppins', 'Open Sans',
  'Lora', 'DM Sans', 'Sora', 'Roboto', 'Montserrat',
];

export function CustomizePanel({ theme, onUpdateTheme, onClose, onOpenTemplateModal }: CustomizePanelProps) {
  const colors = theme.colors || {};
  const fonts = theme.fonts || {};

  const updateColor = (key: string, value: string) => {
    onUpdateTheme({ colors: { ...colors, [key]: value } });
  };

  const applyPreset = (preset: typeof namedPresets[0]['preset']) => {
    const presetColors: Record<string, string> = {};
    if (preset.colors) {
      Object.entries(preset.colors).forEach(([key, vals]) => {
        presetColors[key] = vals[0]; // light mode value
      });
    }
    onUpdateTheme({
      colors: presetColors,
      fonts: preset.fontFamily ? { heading: preset.fontFamily.heading || 'Inter', body: preset.fontFamily.body || 'Inter' } : undefined,
      borderRadius: preset.borderRadius,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed top-16 left-3 w-[300px] max-h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg z-[60] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Özelleştir</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Template Change */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Şablon</h4>
          <button
            onClick={onOpenTemplateModal}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-gray-500" />
            Template Değiştir
          </button>
        </div>

        {/* Theme Presets */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hızlı Tema</h4>
          <div className="grid grid-cols-3 gap-2">
            {namedPresets.map(({ name, preset }) => {
              const primaryColor = preset.colors?.primary?.[0] || '#f97316';
              const bgColor = preset.colors?.background?.[0] || '#ffffff';
              const fgColor = preset.colors?.foreground?.[0] || '#1a1a1a';
              return (
                <button
                  key={name}
                  onClick={() => applyPreset(preset)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
                  title={name}
                >
                  <div className="flex gap-0.5">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: bgColor }} />
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: primaryColor }} />
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: fgColor }} />
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight text-center group-hover:text-gray-900 dark:group-hover:text-white">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Renkler</h4>
          <ColorPicker label="Ana Renk" value={colors.primary || '#f97316'} onChange={(v) => updateColor('primary', v)} />
          <ColorPicker label="Arka Plan" value={colors.background || '#ffffff'} onChange={(v) => updateColor('background', v)} />
          <ColorPicker label="Metin" value={colors.foreground || '#1a1a1a'} onChange={(v) => updateColor('foreground', v)} />
          <ColorPicker label="Vurgu" value={colors.accent || '#f97316'} onChange={(v) => updateColor('accent', v)} />
          <ColorPicker label="Kart" value={colors.card || '#ffffff'} onChange={(v) => updateColor('card', v)} />
          <ColorPicker label="İkincil" value={colors.secondary || '#f4f4f5'} onChange={(v) => updateColor('secondary', v)} />
        </div>

        {/* Fonts */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yazı Tipleri</h4>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Başlık Fontu</label>
            <Select value={fonts.heading || 'Inter'} onValueChange={(v) => onUpdateTheme({ fonts: { ...fonts, heading: v } })}>
              <SelectTrigger className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[70]">
                {fontOptions.map(f => <SelectItem key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Gövde Fontu</label>
            <Select value={fonts.body || 'Inter'} onValueChange={(v) => onUpdateTheme({ fonts: { ...fonts, body: v } })}>
              <SelectTrigger className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[70]">
                {fontOptions.map(f => <SelectItem key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Border Radius */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Köşeler</h4>
          <Select value={theme.borderRadius || '0.5rem'} onValueChange={(v) => onUpdateTheme({ borderRadius: v })}>
            <SelectTrigger className="text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 z-[70]">
              <SelectItem value="0px">Keskin</SelectItem>
              <SelectItem value="4px">Hafif</SelectItem>
              <SelectItem value="0.5rem">Varsayılan</SelectItem>
              <SelectItem value="12px">Yuvarlak</SelectItem>
              <SelectItem value="16px">Çok Yuvarlak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer p-0.5" />
      <div className="flex-1">
        <label className="text-xs text-gray-500 dark:text-gray-400">{label}</label>
        <Input value={value} onChange={(e) => onChange(e.target.value)}
          className="text-xs h-7 mt-0.5 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" />
      </div>
    </div>
  );
}
