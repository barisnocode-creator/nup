import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { PreferencesSection } from '@/components/settings/PreferencesSection';
import { DangerZoneSection } from '@/components/settings/DangerZoneSection';
import { User, Shield, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Ayarlar</h1>
          <p className="text-muted-foreground mt-1">
            Hesap bilgilerinizi ve tercihlerinizi yönetin.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Güvenlik</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Tercihler</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2 text-destructive data-[state=active]:text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Tehlikeli</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySection />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSection />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZoneSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
