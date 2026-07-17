import { Receipt, TrendingUp, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import type { ExpenseRow, ExpenseCategory } from '../types';

interface Props {
  expenses: ExpenseRow[];
  currency: string;
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

  const stats = [
    {
      label: 'Total Spent',
      value: fmt(total),
      sub: 'across all categories',
      icon: TrendingUp,
      iconClass: 'text-primary',
    },
    {
      label: 'Expenses',
      value: String(count),
      sub: count === 1 ? 'transaction' : 'transactions',
      icon: Hash,
      iconClass: 'text-blue-500',
    },
    {
      label: 'Top Category',
      value: topCategory ? `${topCategory.emoji} ${topCategory.label}` : '—',
      sub: topCategory ? fmt(topCategory.amount) : 'No expenses yet',
      icon: Receipt,
      iconClass: 'text-amber-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
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
  );
}
