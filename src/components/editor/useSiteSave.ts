import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SiteSection, SiteTheme } from '@/components/sections/types';

interface UseSiteSaveOptions {
  projectId: string;
  sections: SiteSection[];
  theme: SiteTheme;
  debounceMs?: number;
}

export function useSiteSave({ projectId, sections, theme, debounceMs = 2000 }: UseSiteSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef(true);
  const prevJsonRef = useRef('');

  const saveNow = useCallback(async (s: SiteSection[], t: SiteTheme) => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          site_sections: s as any,
          site_theme: t as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (!error) {
        setHasUnsavedChanges(false);
        setLastSavedAt(new Date());
      } else {
        console.error('[SiteSave] Error:', error);
      }
    } catch (err) {
      console.error('[SiteSave] Exception:', err);
    } finally {
      setIsSaving(false);
    }
  }, [projectId]);

  // Watch sections/theme changes and debounce save
  useEffect(() => {
    // Skip initial render
    if (initialRef.current) {
      initialRef.current = false;
      prevJsonRef.current = JSON.stringify({ sections, theme });
      return;
    }

    const currentJson = JSON.stringify({ sections, theme });
    if (currentJson === prevJsonRef.current) return;
    prevJsonRef.current = currentJson;

    setHasUnsavedChanges(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNow(sections, theme);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sections, theme, debounceMs, saveNow]);

  // Force save (for publish or manual save)
  const forceSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    return saveNow(sections, theme);
  }, [sections, theme, saveNow]);

  return { isSaving, hasUnsavedChanges, lastSavedAt, forceSave };
}
