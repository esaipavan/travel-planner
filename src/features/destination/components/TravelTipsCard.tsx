import { Banknote, Phone, Clock, Globe } from 'lucide-react';
import type { CountryInfo } from '../types';

interface Props {
  country: CountryInfo;
}

interface TipItem {
  icon:    React.ReactNode;
  heading: string;
  body:    string;
}

export function TravelTipsCard({ country }: Props) {
  const primaryCurrency = country.currencies[0];
  const primaryTz       = country.timezones[0];
  const locationBody    = [country.subregion, country.region].filter(Boolean).join(', ');

  const currencyBody = primaryCurrency
    ? primaryCurrency.name
      ? `${primaryCurrency.name}${primaryCurrency.symbol ? ` (${primaryCurrency.symbol})` : ''} · Code: ${primaryCurrency.code}`
      : `Code: ${primaryCurrency.code}`
    : '—';

  const allTips: (TipItem & { skip?: boolean })[] = [
    {
      icon:    <Banknote className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
      heading: 'Local Currency',
      body:    currencyBody,
    },
    {
      icon:    <Clock className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />,
      heading: 'Time Zone',
      body:    primaryTz
        ? country.timezones.length > 1
          ? `${primaryTz} (${country.timezones.length} zones across the country)`
          : primaryTz
        : '',
      skip: !primaryTz,
    },
    {
      icon:    <Phone className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />,
      heading: 'International Dialing',
      body:    country.callingCode
        ? `Dial ${country.callingCode} from abroad to reach ${country.name}`
        : 'Calling code not available',
    },
    {
      icon:    <Globe className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />,
      heading: 'Location',
      body:    locationBody,
      skip:    !locationBody,
    },
  ];

  const tips = allTips.filter((t) => !t.skip);

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-base">Travel Tips</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {tips.map(({ icon, heading, body }) => (
          <div key={heading} className="flex gap-3 rounded-lg bg-muted/40 px-3 py-3">
            <div className="mt-0.5">{icon}</div>
            <div className="min-w-0">
              <p className="text-xs font-medium">{heading}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
