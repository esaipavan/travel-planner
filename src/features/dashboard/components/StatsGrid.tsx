import { TrendingUp, Wallet, Receipt } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';
import { useDashboardStats } from '../hooks/useDashboard';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, iconClass, bgClass, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p className="text-2xl font-bold tabular-nums">{value}</p>
            )}
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Trips"
        value={String(stats?.totalTrips ?? 0)}
        icon={TrendingUp}
        iconClass="text-primary"
        bgClass="bg-primary/10"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Budget"
        value={formatCurrency(stats?.totalBudget ?? 0, stats?.homeCurrency)}
        icon={Wallet}
        iconClass="text-emerald-600 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-950/40"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(stats?.totalExpenses ?? 0, stats?.homeCurrency)}
        icon={Receipt}
        iconClass="text-amber-600 dark:text-amber-400"
        bgClass="bg-amber-50 dark:bg-amber-950/40"
        isLoading={isLoading}
      />
    </div>
  );
}
