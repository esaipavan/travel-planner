import { differenceInDays, parseISO, isAfter, isBefore } from 'date-fns';
import { TrendingUp, TrendingDown, CalendarClock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import type { BudgetSummary } from '../types';

interface Props {
  summary: BudgetSummary;
  tripStartDate: string;
  tripEndDate: string;
}

type HealthStatus = 'healthy' | 'warning' | 'danger' | 'inactive';

interface HealthInfo {
  status: HealthStatus;
  label: string;
  color: string;
  barColor: string;
  icon: React.ElementType;
}

function getHealth(paceRatio: number): HealthInfo {
  if (paceRatio < 1.05) return {
    status: 'healthy', label: 'On track',
    color: 'text-emerald-600 dark:text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: TrendingDown,
  };
  if (paceRatio < 1.25) return {
    status: 'warning', label: 'Spending fast',
    color: 'text-amber-600 dark:text-amber-400',
    barColor: 'bg-amber-500',
    icon: TrendingUp,
  };
  return {
    status: 'danger', label: 'Over pace',
    color: 'text-destructive',
    barColor: 'bg-destructive',
    icon: TrendingUp,
  };
}

export function BudgetHealthCard({ summary, tripStartDate, tripEndDate }: Props) {
  const budget = summary.tripBudget ?? summary.totalAllocated;
  const fmt = (n: number) => formatCurrency(n, summary.tripCurrency);

  // No data to show
  if (!tripStartDate || !tripEndDate || budget <= 0 || summary.totalSpent === 0) {
    return null;
  }

  const today = new Date();
  const start = parseISO(tripStartDate);
  const end = parseISO(tripEndDate);
  const totalDays = Math.max(differenceInDays(end, start) + 1, 1);

  const tripNotStarted = isBefore(today, start);
  const tripEnded = isAfter(today, end);

  if (tripNotStarted) return null;

  const daysElapsed = tripEnded
    ? totalDays
    : Math.min(Math.max(differenceInDays(today, start) + 1, 1), totalDays);
  const tripProgress = daysElapsed / totalDays;                // 0–1
  const expectedSpend = budget * tripProgress;
  const paceRatio = expectedSpend > 0 ? summary.totalSpent / expectedSpend : 0;

  const projectedTotal = tripProgress > 0
    ? Math.round(summary.totalSpent / tripProgress)
    : summary.totalSpent;

  const healthInfo: HealthInfo = summary.remaining < 0
    ? { status: 'danger', label: 'Over budget', color: 'text-destructive', barColor: 'bg-destructive', icon: TrendingUp }
    : getHealth(paceRatio);

  const HealthIcon = healthInfo.icon;
  const tripProgressPct = Math.round(tripProgress * 100);
  const spendProgressPct = budget > 0 ? Math.min(Math.round((summary.totalSpent / budget) * 100), 100) : 0;

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold">Spending Health</p>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${healthInfo.color}`}>
            <HealthIcon className="h-4 w-4" />
            {healthInfo.label}
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-2.5">
          {/* Trip progress */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Trip progress</span>
              <span className="tabular-nums font-medium">
                Day {daysElapsed} of {totalDays} ({tripProgressPct}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${tripProgressPct}%` }}
              />
            </div>
          </div>

          {/* Budget consumed */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Budget consumed</span>
              <span className="tabular-nums font-medium">
                {fmt(summary.totalSpent)} / {fmt(budget)} ({spendProgressPct}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${healthInfo.barColor}`}
                style={{ width: `${spendProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 border-t pt-3 sm:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Expected by now</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">{fmt(Math.round(expectedSpend))}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Actual spend</p>
            <p className={`mt-0.5 text-sm font-semibold tabular-nums ${
              summary.totalSpent > expectedSpend * 1.05 ? 'text-amber-600 dark:text-amber-400' : ''
            }`}>
              {fmt(summary.totalSpent)}
            </p>
          </div>
          {!tripEnded && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Projected total</p>
              <p className={`mt-0.5 text-sm font-semibold tabular-nums ${
                projectedTotal > budget ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {fmt(projectedTotal)}
              </p>
            </div>
          )}
        </div>

        {/* Insight */}
        <p className="text-xs text-muted-foreground">
          {summary.remaining < 0
            ? `You've exceeded your budget by ${fmt(Math.abs(summary.remaining))}.`
            : !tripEnded && projectedTotal > budget
              ? `At this pace you'll overspend by ${fmt(projectedTotal - budget)} — consider cutting back.`
              : !tripEnded && projectedTotal < budget * 0.85
                ? `Great pace — you should finish well under budget.`
                : tripEnded
                  ? `Trip complete. You ${summary.remaining >= 0 ? 'saved' : 'overspent by'} ${fmt(Math.abs(summary.remaining))}.`
                  : `You're spending at about the expected rate. Keep it up!`}
        </p>
      </CardContent>
    </Card>
  );
}
