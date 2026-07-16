import { TrendingUp, Wallet, Receipt } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';
import { useDashboardStats } from '../hooks/useDashboard';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="text-2xl font-bold tabular-nums">{value}</p>
        )}
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
        isLoading={isLoading}
      />
      <StatCard
        title="Total Budget"
        value={formatCurrency(stats?.totalBudget ?? 0, stats?.homeCurrency)}
        icon={Wallet}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(stats?.totalExpenses ?? 0, stats?.homeCurrency)}
        icon={Receipt}
        isLoading={isLoading}
      />
    </div>
  );
}
