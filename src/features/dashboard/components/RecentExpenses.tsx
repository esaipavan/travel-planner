import { Link } from 'react-router-dom';
import { ArrowRight, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import { useRecentExpenses } from '../hooks/useDashboard';

function categoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function RecentExpenses() {
  const { data: expenses, isLoading } = useRecentExpenses();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base">Recent Expenses</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/trips" className="flex items-center gap-1 text-xs">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
            <Receipt className="h-8 w-8 opacity-40" />
            <p className="text-sm">No expenses recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm font-medium leading-none">
                    {expense.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {categoryLabel(expense.category)}
                    {expense.trip_title && ` · ${expense.trip_title}`}
                    {' · '}
                    {formatDate(expense.date, 'MMM d')}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(expense.amount, expense.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
