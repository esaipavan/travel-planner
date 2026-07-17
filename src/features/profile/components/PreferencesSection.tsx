import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/utils/constants';
import {
  THEME_OPTIONS,
  DATE_FORMATS,
  DISTANCE_UNITS,
  TEMPERATURE_UNITS,
} from '../types';
import type { ProfileRow, ThemeValue } from '../types';
import { useUpdateProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useTheme';

interface Props { profile: ProfileRow; }

interface PrefRowProps {
  label:       string;
  description: string;
  children:    React.ReactNode;
}

function PrefRow({ label, description, children }: PrefRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0 w-48">{children}</div>
    </div>
  );
}

export function PreferencesSection({ profile }: Props) {
  const { mutate, isPending } = useUpdateProfile();
  const { setTheme }          = useTheme();

  function save<K extends keyof ProfileRow>(key: K, value: ProfileRow[K]) {
    mutate({ [key]: value } as Partial<ProfileRow>);
  }

  function handleThemeChange(value: string) {
    const theme = value as ThemeValue;
    setTheme(theme);
    save('theme', theme);
  }

  return (
    <div className="space-y-3">
      <PrefRow label="Theme" description="Choose light, dark, or follow the system setting.">
        <Select
          value={profile.theme ?? 'system'}
          onValueChange={handleThemeChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>

      <PrefRow label="Currency" description="Default currency for budgets and expense display.">
        <Select
          value={profile.home_currency}
          onValueChange={(v) => save('home_currency', v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>

      <PrefRow label="Date Format" description="How dates are displayed across the app.">
        <Select
          value={profile.date_format ?? 'dd/MM/yyyy'}
          onValueChange={(v) => save('date_format', v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_FORMATS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                <span>{f.label}</span>
                <span className="ml-2 text-muted-foreground text-xs">({f.example})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>

      <PrefRow label="Distance Unit" description="Kilometres or miles for distance measurements.">
        <Select
          value={profile.distance_unit ?? 'km'}
          onValueChange={(v) => save('distance_unit', v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DISTANCE_UNITS.map((u) => (
              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>

      <PrefRow label="Temperature Unit" description="Celsius or Fahrenheit for weather display.">
        <Select
          value={profile.temperature_unit ?? 'celsius'}
          onValueChange={(v) => save('temperature_unit', v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPERATURE_UNITS.map((u) => (
              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PrefRow>
    </div>
  );
}
