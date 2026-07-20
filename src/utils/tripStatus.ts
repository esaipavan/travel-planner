import type { TripStatus } from '@/features/trips/types';

export type ComputedTripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

type TripLike = {
  start_date: string;
  end_date: string;
  status: TripStatus;
};

// Single source of truth for classifying a trip. Uses dates (not the DB status
// field, which can lag) except for the 'cancelled' sentinel.
export function getTripStatus(trip: TripLike): ComputedTripStatus {
  if (trip.status === 'cancelled') return 'cancelled';
  const today = new Date().toISOString().split('T')[0];
  if (trip.start_date > today) return 'upcoming';
  if (trip.end_date >= today) return 'active';
  return 'completed';
}
