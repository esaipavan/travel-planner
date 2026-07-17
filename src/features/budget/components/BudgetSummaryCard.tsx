import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import type { BudgetSummary } from '../types';

interface Props {
  summary: BudgetSummary;
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

  const stats = [
    {
      label: 'Trip Budget',
      value: tripBudget != null ? fmt(tripBudget) : '—',
      sub: 'Total set on trip',
      icon: Wallet,
      iconClass: 'text-primary',
    },
    {
      label: 'Allocated',
      value: fmt(totalAllocated),
      sub: tripBudget != null
        ? `${fmt(unallocated)} unallocated`
        : 'Across all categories',
      icon: PiggyBank,
      iconClass: 'text-blue-500',
    },
    {
      label: 'Spent',
      value: fmt(totalSpent),
      sub: `${overallPct}% of ${tripBudget != null ? 'budget' : 'allocated'}`,
      icon: TrendingUp,
      iconClass: 'text-amber-500',
    },
    {
      label: isOverBudget ? 'Over Budget' : 'Remaining',
      value: fmt(Math.abs(remaining)),
      sub: isOverBudget ? 'You have exceeded your budget' : 'Left to spend',
      icon: TrendingDown,
      iconClass: isOverBudget ? 'text-destructive' : 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, iconClass }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${iconClass}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall progress bar */}
      {(tripBudget != null || totalAllocated > 0) && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall spend</span>
              <span className={`font-medium tabular-nums ${isOverBudget ? 'text-destructive' : ''}`}>
                {fmt(totalSpent)} / {fmt(tripBudget ?? totalAllocated)}
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor(overallPct)}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className={overallPct >= 90 ? 'font-semibold text-destructive' : ''}>
                {overallPct}%
              </span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
