import { Receipt, TrendingUp, Hash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import type { ExpenseRow, ExpenseCategory } from '../types';

interface Props {
  expenses: ExpenseRow[];
  currency: string;
}

interface StatDef {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}

export function RunningTotalCard({ expenses, currency }: Props) {
  const fmt = (n: number) => formatCurrency(n, currency);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const count = expenses.length;

  const spentByCategory = new Map<string, number>();
  for (const e of expenses) {
    spentByCategory.set(e.category, (spentByCategory.get(e.category) ?? 0) + e.amount);
  }

  let topCategory: { label: string; emoji: string; amount: number } | null = null;
  let topAmount = 0;
  for (const [cat, amt] of spentByCategory) {
    if (amt > topAmount) {
      topAmount = amt;
      const meta = EXPENSE_CATEGORIES.find((c) => c.value === (cat as ExpenseCategory));
      if (meta) topCategory = { label: meta.label, emoji: meta.emoji, amount: amt };
    }
  }

  const stats: StatDef[] = [
    {
      label: 'Total Spent',
      value: fmt(total),
      sub: 'across all categories',
      icon: TrendingUp,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      label: 'Expenses',
      value: String(count),
      sub: count === 1 ? 'transaction' : 'transactions',
      icon: Hash,
      iconClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'Top Category',
      value: topCategory ? `${topCategory.emoji} ${topCategory.label}` : '—',
      sub: topCategory ? fmt(topCategory.amount) : 'No expenses yet',
      icon: Receipt,
      iconClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
  );
}
