import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowRight, Plane } from 'lucide-react';
import { differenceInDays, parseISO, isToday, isTomorrow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateRange } from '@/utils/formatters';
import { useUpcomingTrips } from '../hooks/useDashboard';

function daysUntilLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  const days = differenceInDays(d, new Date());
  return `In ${days} day${days === 1 ? '' : 's'}`;
}

export function UpcomingTrips() {
  const { data: trips, isLoading } = useUpcomingTrips();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base">Upcoming Trips</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/trips" className="flex items-center gap-1 text-xs">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))
        ) : !trips || trips.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center text-muted-foreground">
            <Plane className="h-8 w-8 opacity-40" />
            <p className="text-sm">No upcoming trips planned</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/trips/new">Plan a trip</Link>
            </Button>
          </div>
        ) : (
          trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trips/${trip.id}`}
              className="flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium leading-none">{trip.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 shrink-0" />
                  <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                </div>
              </div>
              <Badge
                variant={trip.status === 'active' ? 'success' : 'info'}
                className="mt-0.5 shrink-0"
              >
                {daysUntilLabel(trip.start_date)}
              </Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
