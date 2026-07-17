import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '../hooks/useProfile';
import { AccountSection } from '../components/AccountSection';
import { PreferencesSection } from '../components/PreferencesSection';
import { NotificationsSection } from '../components/NotificationsSection';
import { PrivacySection } from '../components/PrivacySection';

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Settings"
        description="Account security, preferences, notifications, and privacy controls."
      />

      <Tabs defaultValue="account">
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="mt-6">
          <AccountSection />
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : profile ? (
            <PreferencesSection profile={profile} />
          ) : (
            <p className="text-sm text-muted-foreground">Could not load preferences.</p>
          )}
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : profile ? (
            <NotificationsSection profile={profile} />
          ) : (
            <p className="text-sm text-muted-foreground">Could not load notification settings.</p>
          )}
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="mt-6">
          <PrivacySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
