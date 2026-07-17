import { Droplets, Wind, Sunrise, Sunset, Thermometer, ShieldAlert } from 'lucide-react';
import { getWeatherIcon, getWeatherLabel } from './WeatherIcon';
import type { CurrentWeather } from '../types';

interface Props {
  current:  CurrentWeather;
  location: string;
}

function formatTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function uvLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function uvColor(uv: number): string {
  if (uv <= 2) return 'text-emerald-600 dark:text-emerald-400';
  if (uv <= 5) return 'text-yellow-600 dark:text-yellow-400';
  if (uv <= 7) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function CurrentWeatherCard({ current, location }: Props) {
  const Icon = getWeatherIcon(current.weathercode, current.isDay);

  const stats = [
    {
      icon: Thermometer,
      label: 'Feels like',
      value: `${current.feelsLike}°C`,
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${current.humidity}%`,
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${current.windspeed} km/h`,
    },
    {
      icon: ShieldAlert,
      label: `UV Index`,
      value: `${current.uvIndex} · ${uvLabel(current.uvIndex)}`,
      valueClass: uvColor(current.uvIndex),
    },
    {
      icon: Sunrise,
      label: 'Sunrise',
      value: formatTime(current.sunrise),
    },
    {
      icon: Sunset,
      label: 'Sunset',
      value: formatTime(current.sunset),
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Location + condition */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground truncate max-w-xs">{location}</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-6xl font-bold tabular-nums leading-none">
              {current.temperature}°
            </span>
            <span className="mb-1 text-xl text-muted-foreground">C</span>
          </div>
          <p className="mt-1 text-muted-foreground">
            {getWeatherLabel(current.weathercode)}
          </p>
        </div>
        <Icon className="h-16 w-16 shrink-0 text-primary opacity-80" />
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map(({ icon: StatIcon, label, value, valueClass }) => (
          <div key={label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2.5">
            <StatIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-sm font-medium tabular-nums truncate ${valueClass ?? ''}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
