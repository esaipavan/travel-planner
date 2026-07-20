import { Link } from 'react-router-dom';
import { Heart, MapPin, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateRange, formatCurrency, tripDuration } from '@/utils/formatters';
import { TripStatusBadge } from './TripStatusBadge';
import { useToggleFavourite } from '../hooks/useTrips';
import type { TripRow } from '../types';

interface TripCardProps {
  trip: TripRow;
}

export function TripCard({ trip }: TripCardProps) {
  const { mutate: toggle, isPending } = useToggleFavourite();

  function handleFavourite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle({ id: trip.id, isFavourite: !trip.is_favourite });
  }

  const duration = tripDuration(trip.start_date, trip.end_date);

  return (
    <Link to={`/trips/${trip.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* Cover */}
        <div
          className="relative h-32 bg-gradient-to-br from-primary/30 via-primary/15 to-background"
          style={
            trip.cover_image_url
              ? { backgroundImage: `url(${trip.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <TripStatusBadge trip={trip} />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleFavourite}
              disabled={isPending}
              aria-label={trip.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-colors ${
                  trip.is_favourite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Body */}
        <CardContent className="space-y-2 p-4">
          <h3 className="truncate font-semibold leading-none tracking-tight">
            {trip.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{trip.destination}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 shrink-0" />
            <span>
              {formatDateRange(trip.start_date, trip.end_date)} · {duration} day
              {duration !== 1 ? 's' : ''}
            </span>
          </div>

          {trip.total_budget != null && (
            <p className="text-sm font-medium">
              {formatCurrency(trip.total_budget, trip.currency)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
