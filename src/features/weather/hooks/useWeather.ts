import { useQuery } from '@tanstack/react-query';
import { geocodeDestination, fetchWeather } from '../services/weather.service';
import type { WeatherResult } from '../types';

export function useWeather(destination: string) {
  return useQuery<WeatherResult, Error>({
    queryKey: ['weather', destination],
    queryFn:  async () => {
      const geo    = await geocodeDestination(destination);
      const result = await fetchWeather(geo.lat, geo.lon);
      result.location.displayName = geo.displayName;
      return result;
    },
    staleTime:       10 * 60 * 1000,
    retry:           1,
    enabled:         destination.trim().length > 0,
  });
}
