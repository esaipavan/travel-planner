import { lazy, Suspense, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAnalyticsData } from '../hooks/useAnalytics';
import { DEFAULT_ANALYTICS_FILTERS } from '../types';
import type { AnalyticsFilters } from '../types';
import { KPICards } from '../components/KPICards';
import { AnalyticsFilters as AnalyticsFilterBar } from '../components/AnalyticsFilters';
import { InsightsPanel } from '../components/InsightsPanel';

const ExpenseLineChart  = lazy(() => import('../components/charts/ExpenseLineChart').then(m => ({ default: m.ExpenseLineChart })));
const ExpensePieChart   = lazy(() => import('../components/charts/ExpensePieChart').then(m => ({ default: m.ExpensePieChart })));
const BudgetBarChart    = lazy(() => import('../components/charts/BudgetBarChart').then(m => ({ default: m.BudgetBarChart })));
const TripsAreaChart    = lazy(() => import('../components/charts/TripsAreaChart').then(m => ({ default: m.TripsAreaChart })));
const JournalRatingsChart = lazy(() => import('../components/charts/JournalRatingsChart').then(m => ({ default: m.JournalRatingsChart })));
const ReminderDonutChart  = lazy(() => import('../components/charts/ReminderDonutChart').then(m => ({ default: m.ReminderDonutChart })));

function KPISkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-64 rounded-xl ${className ?? ''}`} />;
}

function buildCSV(
  kpis: ReturnType<typeof useAnalyticsData>['kpis'],
  currency: string,
  monthlyExpenses: { month: string; amount: number }[],
): string {
  const rows: string[][] = [
    ['Metric', 'Value'],
    ['Total Trips', String(kpis.totalTrips)],
    ['Upcoming Trips', String(kpis.upcomingTrips)],
    ['Completed Trips', String(kpis.completedTrips)],
    ['Countries Visited', String(kpis.countriesVisited)],
    ['Total Budget', `${currency} ${kpis.totalBudget.toFixed(2)}`],
    ['Total Expenses', `${currency} ${kpis.totalExpenses.toFixed(2)}`],
    ['Budget Remaining', `${currency} ${kpis.budgetRemaining.toFixed(2)}`],
    ['Avg Trip Cost', `${currency} ${kpis.avgTripCost.toFixed(2)}`],
    [],
    ['Month', 'Expenses'],
    ...monthlyExpenses.map((d) => [d.month, String(d.amount)]),
  ];
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_ANALYTICS_FILTERS);

  const {
    isLoading,
    trips,
    currency,
    kpis,
    monthlyExpenses,
    expenseByCategory,
    budgetVsActual,
    tripsPerMonth,
    journalRatings,
    reminderStatus,
    insights,
  } = useAnalyticsData(filters);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleExportCSV = useCallback(() => {
    const csv     = buildCSV(kpis, currency, monthlyExpenses);
    const blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url     = URL.createObjectURL(blob);
    const anchor  = document.createElement('a');
    anchor.href     = url;
    anchor.download = 'travel-analytics.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }, [kpis, currency, monthlyExpenses]);

  const tripOptions = trips.map((t) => ({ id: t.id, title: t.title }));

  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Analytics" description="Insights across all your trips" />

      {/* Filters + Export */}
      <AnalyticsFilterBar
        filters={filters}
        trips={tripOptions}
        onChange={setFilters}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {/* KPI Cards */}
      {isLoading ? <KPISkeleton /> : <KPICards data={kpis} currency={currency} />}

      {/* Charts grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton className="md:col-span-2" />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <Suspense fallback={<ChartSkeleton />}>
              <ExpenseLineChart data={monthlyExpenses} currency={currency} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <ExpensePieChart data={expenseByCategory} currency={currency} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <BudgetBarChart data={budgetVsActual} currency={currency} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <TripsAreaChart data={tripsPerMonth} />
            </Suspense>
            <div className="md:col-span-2">
              <Suspense fallback={<ChartSkeleton className="md:col-span-2" />}>
                <JournalRatingsChart data={journalRatings} />
              </Suspense>
            </div>
            <Suspense fallback={<ChartSkeleton />}>
              <ReminderDonutChart data={reminderStatus} />
            </Suspense>
          </>
        )}
      </div>

      {/* Insights */}
      {!isLoading && <InsightsPanel insights={insights} currency={currency} />}
    </div>
  );
}
