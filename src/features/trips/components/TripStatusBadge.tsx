import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import { getTripStatus, type ComputedTripStatus } from '@/utils/tripStatus';
import type { TripStatus } from '../types';

type TripLike = { start_date: string; end_date: string; status: TripStatus };

const STATUS_CONFIG: Record<ComputedTripStatus, { label: string; variant: BadgeProps['variant'] }> = {
  upcoming:  { label: 'Upcoming',  variant: 'info'        },
  active:    { label: 'Active',    variant: 'success'     },
  completed: { label: 'Completed', variant: 'secondary'   },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};

interface TripStatusBadgeProps {
  trip: TripLike;
  className?: string;
}

export function TripStatusBadge({ trip, className }: TripStatusBadgeProps) {
  const { label, variant } = STATUS_CONFIG[getTripStatus(trip)];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
