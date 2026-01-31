import { useState } from 'react';
import { Save, Globe, Search, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingsTabProps {
  projectId: string;
  projectName: string;
  generatedContent: any;
}

export function SettingsTab({ projectId, projectName, generatedContent }: SettingsTabProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: projectName || '',
    siteDescription: generatedContent?.hero?.subtitle || '',
    metaTitle: generatedContent?.seo?.title || projectName || '',
    metaDescription: generatedContent?.seo?.description || '',
    favicon: '',
    ogImage: '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update project with new SEO settings
      const updatedContent = {
        ...generatedContent,
        seo: {
          ...generatedContent?.seo,
          title: settings.metaTitle,
          description: settings.metaDescription,
        },
      };

      const { error } = await supabase
        .from('projects')
        .update({
          name: settings.siteName,
          generated_content: updatedContent,
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your website settings have been updated.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic information about your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="My Awesome Website"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="A brief description of your website"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Settings
          </CardTitle>
          <CardDescription>
            Optimize your site for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={settings.metaTitle}
              onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              placeholder="Page title for search results"
            />
            <p className="text-xs text-muted-foreground">
              {settings.metaTitle.length}/60 characters (recommended)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              placeholder="Description shown in search results"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {settings.metaDescription.length}/160 characters (recommended)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Images Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="w-5 h-5" />
            Images
          </CardTitle>
          <CardDescription>
            Favicon and social sharing image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input
              id="favicon"
              value={settings.favicon}
              onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
              placeholder="https://example.com/favicon.ico"
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 32x32 or 64x64 pixels
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImage">Social Share Image (OG Image)</Label>
            <Input
              id="ogImage"
              value={settings.ogImage}
              onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
              placeholder="https://example.com/og-image.png"
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 1200x630 pixels
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* SEO Tips */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">💡 SEO Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep your meta title under 60 characters</li>
            <li>• Write a compelling meta description under 160 characters</li>
            <li>• Include your main keyword in both title and description</li>
            <li>• Use a high-quality OG image for better social sharing</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
