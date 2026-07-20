import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TripCard } from '../components/TripCard';
import { useTrips } from '../hooks/useTrips';
import type { TripRow, TripStatus } from '../types';

type FilterStatus = TripStatus | 'all' | 'favourites';
type SortKey = 'date-asc' | 'date-desc' | 'created-desc' | 'name-asc';

function sortTrips(trips: TripRow[], sort: SortKey): TripRow[] {
  return [...trips].sort((a, b) => {
    switch (sort) {
      case 'date-asc':    return a.start_date.localeCompare(b.start_date);
      case 'date-desc':   return b.start_date.localeCompare(a.start_date);
      case 'created-desc':return b.created_at.localeCompare(a.created_at);
      case 'name-asc':    return a.title.localeCompare(b.title);
      default:            return 0;
    }
  });
}

function TripsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <Skeleton className="h-36 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TripsPage() {
  const { data: trips, isLoading } = useTrips();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sort, setSort]                 = useState<SortKey>('date-asc');

  const filtered = useMemo(() => {
    let result = trips ?? [];

    if (filterStatus === 'favourites') {
      result = result.filter((t) => t.is_favourite);
    } else if (filterStatus !== 'all') {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q),
      );
    }

    return sortTrips(result, sort);
  }, [trips, filterStatus, search, sort]);

  const gridContainer = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06 } },
  };

  const gridItem = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 16 },
    show:   prefersReducedMotion ? {} : {
      opacity: 1, y: 0,
      transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Trips" description="Plan, track, and relive your adventures.">
        <Button asChild>
          <Link to="/trips/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search trips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search trips"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-full sm:w-[140px]" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trips</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="favourites">Favourites ♥</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-full sm:w-[160px]" aria-label="Sort trips">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Upcoming first</SelectItem>
              <SelectItem value="date-desc">Latest first</SelectItem>
              <SelectItem value="created-desc">Newest added</SelectItem>
              <SelectItem value="name-asc">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TripsGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-7 w-7 text-primary/70" />}
          title={
            (trips ?? []).length === 0
              ? 'No trips yet'
              : 'No trips match your filters'
          }
          description={
            (trips ?? []).length === 0
              ? 'Create your first trip and start planning your adventure.'
              : 'Try adjusting your search or filter.'
          }
          action={
            (trips ?? []).length === 0
              ? { label: 'Create your first trip', onClick: () => navigate('/trips/new') }
              : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
          </p>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={gridContainer}
            initial="hidden"
            animate="show"
          >
            {filtered.map((trip) => (
              <motion.div key={trip.id} variants={gridItem}>
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
