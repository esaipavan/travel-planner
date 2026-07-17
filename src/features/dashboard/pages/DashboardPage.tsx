import { lazy, Suspense }      from 'react';
import { WelcomeCard }         from '../components/WelcomeCard';
import { StatsGrid }           from '../components/StatsGrid';
import { UpcomingTrips }       from '../components/UpcomingTrips';
import { RecentExpenses }      from '../components/RecentExpenses';
import { WeatherWidget }       from '../components/WeatherWidget';
import { QuickActions }        from '../components/QuickActions';
import { UpcomingReminders }   from '../components/UpcomingReminders';
import { Skeleton }            from '@/components/ui/skeleton';

const BudgetVsActualChart = lazy(() =>
  import('../components/BudgetVsActualChart').then(m => ({ default: m.BudgetVsActualChart }))
);

function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full rounded-xl" />;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <BudgetVsActualChart />
          </Suspense>
        </div>
        <WeatherWidget />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <UpcomingTrips />
        <RecentExpenses />
        <UpcomingReminders />
      </div>
      <QuickActions />
    </div>
  );
}
