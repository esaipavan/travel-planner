import { Umbrella, ShieldAlert } from 'lucide-react';
import { getWeatherIcon, getWeatherLabel } from './WeatherIcon';
import type { ForecastDay } from '../types';

interface Props {
  day:   ForecastDay;
  today: boolean;
}

function formatDay(dateStr: string, today: boolean): string {
  if (today) return 'Today';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ForecastRow({ day, today }: Props) {
  const Icon = getWeatherIcon(day.weathercode, true);

  return (
    <div
      className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-lg px-4 py-3 ${
        today ? 'bg-primary/5 border border-primary/20' : 'bg-card border'
      }`}
    >
      {/* Date + condition */}
      <div className="min-w-0">
        <p className={`text-sm font-medium ${today ? 'text-primary' : ''}`}>
          {formatDay(day.date, today)}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="truncate text-xs text-muted-foreground">
            {getWeatherLabel(day.weathercode)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          {day.precipProbabilityMax > 0 && (
            <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Umbrella className="h-3 w-3" />
              {day.precipProbabilityMax}%
            </span>
          )}
          {day.uvIndexMax > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldAlert className="h-3 w-3" />
              UV {day.uvIndexMax}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            ↑ {formatTime(day.sunrise)} · ↓ {formatTime(day.sunset)}
          </span>
        </div>
      </div>

      {/* Min temp */}
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Low</p>
        <p className="text-sm font-medium tabular-nums text-blue-600 dark:text-blue-400">
          {day.tempMin}°
        </p>
      </div>

      {/* Max temp */}
      <div className="text-right">
        <p className="text-xs text-muted-foreground">High</p>
        <p className="text-sm font-semibold tabular-nums text-orange-600 dark:text-orange-400">
          {day.tempMax}°
        </p>
      </div>
    </div>
  );
}
