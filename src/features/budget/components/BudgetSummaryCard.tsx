import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import type { BudgetSummary } from '../types';

interface Props {
  summary: BudgetSummary;
}

interface StatDef {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}

function pct(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}

function progressColor(percent: number): string {
  if (percent >= 100) return 'bg-destructive';
  if (percent >= 90) return 'bg-orange-500';
  if (percent >= 75) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function BudgetSummaryCard({ summary }: Props) {
  const { tripBudget, tripCurrency, totalAllocated, totalSpent, unallocated, remaining } = summary;
  const fmt = (n: number) => formatCurrency(n, tripCurrency);
  const overallPct = tripBudget ? pct(totalSpent, tripBudget) : pct(totalSpent, totalAllocated);
  const isOverBudget = remaining < 0;

  const stats: StatDef[] = [
    {
      label: 'Trip Budget',
      value: tripBudget != null ? fmt(tripBudget) : '—',
      sub: 'Total set on trip',
      icon: Wallet,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      label: 'Allocated',
      value: fmt(totalAllocated),
      sub: tripBudget != null
        ? `${fmt(unallocated)} unallocated`
        : 'Across all categories',
      icon: PiggyBank,
      iconClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'Spent',
      value: fmt(totalSpent),
      sub: `${overallPct}% of ${tripBudget != null ? 'budget' : 'allocated'}`,
      icon: TrendingUp,
      iconClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: isOverBudget ? 'Over Budget' : 'Remaining',
      value: fmt(Math.abs(remaining)),
      sub: isOverBudget ? 'Exceeded your budget' : 'Left to spend',
      icon: TrendingDown,
      iconClass: isOverBudget
        ? 'text-destructive'
        : 'text-emerald-600 dark:text-emerald-400',
      bgClass: isOverBudget
        ? 'bg-destructive/10'
        : 'bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, iconClass, bgClass }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">{value}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
                  <Icon className={`h-5 w-5 ${iconClass}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall progress bar */}
      {(tripBudget != null || totalAllocated > 0) && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall spend</span>
              <span className={`tabular-nums ${isOverBudget ? 'font-semibold text-destructive' : 'text-muted-foreground'}`}>
                {fmt(totalSpent)} / {fmt(tripBudget ?? totalAllocated)}
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor(overallPct)}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className={`mt-1.5 text-right text-xs tabular-nums ${overallPct >= 90 ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
              {overallPct}% used
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
