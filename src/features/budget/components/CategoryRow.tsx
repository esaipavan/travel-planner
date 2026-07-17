import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { useDeleteCategoryBudget } from '../hooks/useBudget';
import type { CategoryBudgetItem } from '../types';

interface Props {
  tripId: string;
  item: CategoryBudgetItem;
  onEdit: (item: CategoryBudgetItem) => void;
}

function pct(spent: number, allocated: number): number {
  if (allocated <= 0) return 0;
  return Math.min(Math.round((spent / allocated) * 100), 100);
}

function barColor(percent: number, isOver: boolean): string {
  if (isOver) return 'bg-destructive';
  if (percent >= 90) return 'bg-orange-500';
  if (percent >= 75) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function CategoryRow({ tripId, item, onEdit }: Props) {
  const { mutate: deleteCategory, isPending } = useDeleteCategoryBudget(tripId);
  const fmt = (n: number) => formatCurrency(n, item.currency);

  const hasAllocation = item.allocated > 0;
  const isOverBudget = hasAllocation && item.spent > item.allocated;
  const remaining = item.allocated - item.spent;
  const percent = pct(item.spent, item.allocated);

  function handleDelete() {
    deleteCategory(item.category, {
      onSuccess: () => toast.success(`Budget cleared for ${item.label}`),
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to clear budget'),
    });
  }

  return (
    <div className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* Left: category info */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl leading-none" role="img" aria-label={item.label}>
            {item.emoji}
          </span>
          <div className="min-w-0">
            <p className="font-medium leading-none">{item.label}</p>
            {item.spent > 0 && (
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                Spent: {fmt(item.spent)}
              </p>
            )}
          </div>
        </div>

        {/* Right: amounts + actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasAllocation ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{fmt(item.allocated)}</p>
                <p className={`text-xs tabular-nums ${isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  {isOverBudget ? `Over by ${fmt(Math.abs(remaining))}` : `${fmt(remaining)} left`}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.label} budget`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                disabled={isPending}
                aria-label={`Clear ${item.label} budget`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onEdit(item)}
            >
              Set budget
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar — only when budget is set */}
      {hasAllocation && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor(percent, isOverBudget)}`}
              style={{ width: isOverBudget ? '100%' : `${percent}%` }}
            />
          </div>
          {item.spent > 0 && (
            <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">
              {percent}%{isOverBudget ? ' — over budget' : ' used'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
