import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings, Globe, Bell, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Preferences {
  language: string;
  theme: string;
  email_notifications: boolean;
}

export function PreferencesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState<Preferences>({
    language: 'tr',
    theme: 'system',
    email_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences)) {
        const prefs = data.preferences as unknown as Preferences;
        setPreferences({
          language: prefs.language || 'tr',
          theme: prefs.theme || 'system',
          email_notifications: prefs.email_notifications ?? true,
        });
        // Sync theme with next-themes
        if (prefs.theme) {
          setTheme(prefs.theme);
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof Preferences, value: string | boolean) => {
    if (!user) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // Special handling for theme
    if (key === 'theme') {
      setTheme(value as string);
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: newPreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Kaydedildi',
        description: 'Tercihleriniz güncellendi.',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Hata',
        description: 'Tercihler kaydedilemedi.',
        variant: 'destructive',
      });
      // Revert on error
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Tercihler
        </CardTitle>
        <CardDescription>
          Uygulama tercihlerinizi özelleştirin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Dil
          </Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => updatePreference('language', value)}
            disabled={saving}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dil seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tr">Türkçe</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Arayüz dilini değiştirir. İçerik üretimi etkilenmez.
          </p>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Tema
          </Label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => updatePreference('theme', value)}
            disabled={saving}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tema seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Sistem</SelectItem>
              <SelectItem value="light">Açık</SelectItem>
              <SelectItem value="dark">Koyu</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Uygulama görünümünü ayarlayın.
          </p>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              E-posta Bildirimleri
            </Label>
            <p className="text-xs text-muted-foreground">
              Önemli güncellemeler ve bildirimler için e-posta alın.
            </p>
          </div>
          <Switch
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            disabled={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
