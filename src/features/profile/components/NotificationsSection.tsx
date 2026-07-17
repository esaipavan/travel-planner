import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '../hooks/useProfile';
import type { ProfileRow } from '../types';

interface Props { profile: ProfileRow; }

interface ToggleItem {
  key:   keyof Pick<
    ProfileRow,
    | 'notifications_enabled'
    | 'trip_reminders_enabled'
    | 'document_reminders_enabled'
    | 'ai_suggestions_enabled'
    | 'browser_notifications_enabled'
    | 'email_notifications_enabled'
  >;
  label:       string;
  description: string;
}

const TOGGLES: ToggleItem[] = [
  {
    key:         'notifications_enabled',
    label:       'In-app Notifications',
    description: 'Master toggle — disabling this silences all in-app alerts.',
  },
  {
    key:         'trip_reminders_enabled',
    label:       'Trip Reminders',
    description: 'Reminders about upcoming and active trips.',
  },
  {
    key:         'document_reminders_enabled',
    label:       'Document Reminders',
    description: 'Alerts when passports, visas, or other documents are expiring.',
  },
  {
    key:         'ai_suggestions_enabled',
    label:       'AI Assistant Suggestions',
    description: 'Proactive tips and suggestions from the travel assistant.',
  },
  {
    key:         'browser_notifications_enabled',
    label:       'Browser Notifications',
    description: 'Native browser push notifications for time-sensitive reminders.',
  },
  {
    key:         'email_notifications_enabled',
    label:       'Email Notifications',
    description: 'Receive summaries and alerts via email.',
  },
];

export function NotificationsSection({ profile }: Props) {
  const { mutate, isPending } = useUpdateProfile();
  const masterOn = profile.notifications_enabled;

  function toggle(key: ToggleItem['key'], value: boolean) {
    mutate({ [key]: value });
  }

  return (
    <div className="space-y-4">
      {TOGGLES.map(({ key, label, description }) => {
        const disabled = isPending || (key !== 'notifications_enabled' && !masterOn);
        const checked  = !!profile[key];

        return (
          <div
            key={key}
            className={`flex items-start justify-between gap-4 rounded-xl border bg-card p-4 transition-opacity ${
              disabled && key !== 'notifications_enabled' ? 'opacity-50' : ''
            }`}
          >
            <div className="min-w-0">
              <Label htmlFor={`notif-${key}`} className="text-sm font-medium leading-none">
                {label}
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
              id={`notif-${key}`}
              checked={checked}
              disabled={disabled}
              onCheckedChange={(v) => toggle(key, v)}
            />
          </div>
        );
      })}
    </div>
  );
}
