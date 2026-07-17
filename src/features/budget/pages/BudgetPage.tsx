import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { useBudget } from '../hooks/useBudget';
import { BudgetSummaryCard } from '../components/BudgetSummaryCard';
import { CategoryRow } from '../components/CategoryRow';
import { SetBudgetDialog } from '../components/SetBudgetDialog';
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
  const [editItem, setEditItem] = useState<CategoryBudgetItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) return <BudgetSkeleton />;
  if (isError || !data) return <Navigate to="/trips" replace />;

  const { items, summary } = data;
  const activeItems = items.filter((i) => i.allocated > 0 || i.spent > 0);
  const inactiveItems = items.filter((i) => i.allocated === 0 && i.spent === 0);

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
        <PageHeader
          title="Budget Planner"
          description={summary.tripTitle}
        >
          <Button size="sm" onClick={() => openEdit(inactiveItems[0] ?? items[0])}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add category budget
          </Button>
        </PageHeader>
      </div>

      {/* Summary cards + overall progress */}
      <BudgetSummaryCard summary={summary} />

      {/* Active categories */}
      {activeItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Category breakdown
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <CategoryRow
                key={item.category}
                tripId={tripId!}
                item={item}
                onEdit={openEdit}
              />
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
              <CategoryRow
                key={item.category}
                tripId={tripId!}
                item={item}
                onEdit={openEdit}
              />
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
    </div>
  );
}
