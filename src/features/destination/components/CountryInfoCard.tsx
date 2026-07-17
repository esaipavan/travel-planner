import type { CountryInfo } from '../types';

interface Props {
  country: CountryInfo;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatArea(km2: number): string {
  return `${km2.toLocaleString()} km²`;
}

interface StatItem {
  label:    string;
  value:    string;
  emoji:    string;
  optional: boolean;
}

export function CountryInfoCard({ country }: Props) {
  const currencyDisplay = country.currencies
    .map((c) => (c.name ? `${c.name}${c.symbol ? ` (${c.symbol})` : ''} · ${c.code}` : c.code))
    .join(', ');

  const regionDisplay = [country.region, country.subregion].filter(Boolean).join(' · ');

  const tzDisplay = country.timezones.length
    ? country.timezones.slice(0, 3).join(', ') +
      (country.timezones.length > 3 ? ` +${country.timezones.length - 3} more` : '')
    : '';

  const allStats: StatItem[] = [
    { emoji: '🏛️',  label: 'Capital',      value: country.capital,                           optional: false },
    { emoji: '🌍',  label: 'Region',        value: regionDisplay,                             optional: true  },
    { emoji: '👥',  label: 'Population',    value: country.population ? formatNumber(country.population) : '', optional: true },
    { emoji: '📐',  label: 'Area',          value: country.area ? formatArea(country.area) : '', optional: true },
    { emoji: '🗣️', label: 'Languages',     value: country.languages.join(', '),              optional: true  },
    { emoji: '💰',  label: 'Currency',      value: currencyDisplay,                           optional: false },
    { emoji: '🕐',  label: 'Time Zone',     value: tzDisplay,                                 optional: true  },
    { emoji: '📞',  label: 'Calling Code',  value: country.callingCode,                       optional: false },
  ];

  const stats = allStats.filter((s) => !s.optional || (s.value !== '' && s.value !== '—'));

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Flag header */}
      <div className="flex items-center gap-4 border-b p-5">
        <img
          src={country.flagUrl}
          alt={`Flag of ${country.name}`}
          className="h-14 w-auto rounded shadow-sm object-cover"
          loading="lazy"
        />
        <div>
          <h2 className="text-xl font-bold">{country.name}</h2>
          {country.officialName !== country.name && (
            <p className="text-sm text-muted-foreground">{country.officialName}</p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {stats.map(({ emoji, label, value }) => (
          <div key={label} className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{emoji} {label}</p>
            <p className="mt-0.5 text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
