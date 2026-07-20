import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Pencil,
  Trash2,
  MapPin,
  CalendarDays,
  Wallet,
  Receipt,
  Map,
  CheckSquare,
  BookOpen,
  FileDown,
  FolderOpen,
  Bot,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateRange, formatCurrency, tripDuration } from '@/utils/formatters';
import { TripStatusBadge } from '../components/TripStatusBadge';
import { EditTripDialog } from '../components/EditTripDialog';
import { DeleteTripDialog } from '../components/DeleteTripDialog';
import { useTrip, useToggleFavourite } from '../hooks/useTrips';

interface SubFeatureCard {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

function buildCards(tripId: string): SubFeatureCard[] {
  return [
    {
      label: 'Budget',
      description: 'Set budgets and track spending by category',
      href: `/trips/${tripId}/budget`,
      icon: Wallet,
    },
    {
      label: 'Expenses',
      description: 'Log and review every transaction',
      href: `/trips/${tripId}/expenses`,
      icon: Receipt,
    },
    {
      label: 'Itinerary',
      description: 'Day-by-day plan for your trip',
      href: `/trips/${tripId}/itinerary`,
      icon: Map,
    },
    {
      label: 'Checklist',
      description: 'Packing lists and to-dos',
      href: `/trips/${tripId}/checklist`,
      icon: CheckSquare,
    },
    {
      label: 'Journal',
      description: 'Memories, notes, and photos',
      href: `/trips/${tripId}/journal`,
      icon: BookOpen,
    },
    {
      label: 'Export',
      description: 'Download a PDF or CSV summary',
      href: `/trips/${tripId}/export`,
      icon: FileDown,
    },
    {
      label: 'Documents',
      description: 'Passports, bookings, and attachments',
      href: `/trips/${tripId}/documents`,
      icon: FolderOpen,
    },
    {
      label: 'AI Assistant',
      description: 'Get recommendations and answers',
      href: `/assistant?tripId=${tripId}`,
      icon: Bot,
    },
  ];
}

function TripDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, isError } = useTrip(id!);
  const { mutate: toggleFav, isPending: isFavPending } = useToggleFavourite();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <TripDetailSkeleton />;
  if (isError || !trip) return <Navigate to="/trips" replace />;

  const duration = tripDuration(trip.start_date, trip.end_date);
  const cards = buildCards(trip.id);

  function handleFavToggle() {
    toggleFav(
      { id: trip!.id, isFavourite: !trip!.is_favourite },
      {
        onSuccess: () =>
          toast.success(trip!.is_favourite ? 'Removed from favourites' : 'Added to favourites'),
        onError: () => toast.error('Failed to update favourite'),
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
          <Link to="/trips">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title={trip.title} description={trip.destination}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavToggle}
              disabled={isFavPending}
              aria-label={trip.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  trip.is_favourite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Trip hero card */}
      <Card className="overflow-hidden">
        <div
          className="relative h-44 bg-gradient-to-br from-primary/40 via-primary/20 to-primary/5 sm:h-52"
          style={
            trip.cover_image_url
              ? {
                  backgroundImage: `url(${trip.cover_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {trip.cover_image_url && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <TripStatusBadge status={trip.status} />
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {trip.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              {formatDateRange(trip.start_date, trip.end_date)}
              <span className="text-muted-foreground/60">·</span>
              {duration} day{duration !== 1 ? 's' : ''}
            </span>
            {trip.total_budget != null && (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Wallet className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {formatCurrency(trip.total_budget, trip.currency)}
              </span>
            )}
          </div>
          {trip.notes && (
            <p className="mt-3 text-sm text-muted-foreground">{trip.notes}</p>
          )}
        </CardContent>
      </Card>

      {/* Sub-feature navigation grid */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          Trip tools
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, description, href, icon: Icon }) => (
            <Link key={label} to={href}>
              <Card className="h-full transition-all hover:border-primary/40 hover:shadow-sm">
                <CardContent className="flex flex-col gap-2.5 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <EditTripDialog trip={trip} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteTripDialog
        tripId={trip.id}
        tripTitle={trip.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
