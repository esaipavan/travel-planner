import { useQuery } from '@tanstack/react-query';
import { fetchDestinationData } from '../services/destination.service';

export function useDestination(query: string) {
  return useQuery({
    queryKey:  ['destination', query],
    queryFn:   () => fetchDestinationData(query),
    staleTime: 30 * 60 * 1000,
    retry:     1,
    enabled:   query.trim().length > 0,
  });
}

const HISTORY_KEY = 'destination-history';
const MAX_HISTORY = 5;

export function getSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function addToHistory(query: string): string[] {
  const prev    = getSearchHistory().filter((h) => h.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
