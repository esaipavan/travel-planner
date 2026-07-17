import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function getWeatherIcon(code: number, isDay: boolean): LucideIcon {
  if (code === 0)   return isDay ? Sun : Moon;
  if (code <= 3)    return isDay ? CloudSun : CloudMoon;
  if (code <= 48)   return Cloud;
  if (code <= 55)   return Droplets;
  if (code <= 67)   return CloudRain;
  if (code <= 77)   return CloudSnow;
  if (code <= 82)   return CloudRain;
  return CloudLightning;
}

export function getWeatherLabel(code: number): string {
  if (code === 0)   return 'Clear sky';
  if (code <= 2)    return 'Partly cloudy';
  if (code === 3)   return 'Overcast';
  if (code <= 48)   return 'Foggy';
  if (code <= 55)   return 'Drizzle';
  if (code <= 67)   return 'Rain';
  if (code <= 77)   return 'Snow';
  if (code <= 82)   return 'Rain showers';
  if (code <= 99)   return 'Thunderstorm';
  return 'Unknown';
}
