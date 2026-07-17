import { useQuery } from '@tanstack/react-query';
import { fetchNearbyPlaces } from '../services/nearby.service';

export function useNearbyPlaces(destination: string) {
  return useQuery({
    queryKey: ['nearby', destination],
    queryFn:  () => fetchNearbyPlaces(destination),
    staleTime: 30 * 60 * 1000,
    retry:     1,
    enabled:   destination.trim().length > 0,
  });
}
