import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/shared/PageHeader';
import { useTrip } from '@/features/trips/hooks/useTrips';
import { tripDuration } from '@/utils/formatters';
import { useBudget } from '../hooks/useBudget';
import { BudgetSummaryCard } from '../components/BudgetSummaryCard';
import { BudgetHealthCard } from '../components/BudgetHealthCard';
import { CategoryRow } from '../components/CategoryRow';
import { SetBudgetDialog } from '../components/SetBudgetDialog';
import { AIBudgetEstimator } from '../components/AIBudgetEstimator';
import type { CategoryBudgetItem } from '../types';

function BudgetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const { id: tripId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBudget(tripId!);
  const { data: trip } = useTrip(tripId!);

  const [editItem, setEditItem] = useState<CategoryBudgetItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  if (isLoading) return <BudgetSkeleton />;
  if (isError || !data) return <Navigate to="/trips" replace />;

  const { items, summary, tripStartDate, tripEndDate } = data;
  const activeItems   = items.filter((i) => i.allocated > 0 || i.spent > 0);
  const inactiveItems = items.filter((i) => i.allocated === 0 && i.spent === 0);

  const days = trip ? tripDuration(trip.start_date, trip.end_date) : 0;

  function openEdit(item: CategoryBudgetItem) {
    setEditItem(item);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
          <Link to={`/trips/${tripId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Budget Planner" description={summary.tripTitle}>
          <div className="flex items-center gap-2">
            {/* AI Estimate button */}
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setAiOpen(true)}
              disabled={!trip}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Estimate
            </Button>

            {/* Add category — dropdown picker */}
            {inactiveItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">+ Add Category</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {inactiveItems.map((item) => (
                    <DropdownMenuItem key={item.category} onClick={() => openEdit(item)}>
                      <span className="mr-2">{item.emoji}</span>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </PageHeader>
      </div>

      {/* Summary cards + overall progress */}
      <BudgetSummaryCard summary={summary} />

      {/* Spending health */}
      <BudgetHealthCard
        summary={summary}
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
      />

      {/* Active categories */}
      {activeItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Category breakdown
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <CategoryRow key={item.category} tripId={tripId!} item={item} onEdit={openEdit} />
            ))}
          </div>
        </section>
      )}

      {/* Unbudgeted categories */}
      {inactiveItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Unbudgeted categories
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveItems.map((item) => (
              <CategoryRow key={item.category} tripId={tripId!} item={item} onEdit={openEdit} />
            ))}
          </div>
        </section>
      )}

      {/* Set / edit budget dialog */}
      <SetBudgetDialog
        tripId={tripId!}
        item={editItem}
        summary={summary}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditItem(null);
        }}
      />

      {/* AI budget estimator */}
      {trip && (
        <AIBudgetEstimator
          tripId={tripId!}
          destination={trip.destination}
          days={days}
          currency={summary.tripCurrency}
          open={aiOpen}
          onOpenChange={setAiOpen}
        />
      )}
    </div>
  );
}
