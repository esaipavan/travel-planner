import { WelcomeCard }         from '../components/WelcomeCard';
import { StatsGrid }           from '../components/StatsGrid';
import { UpcomingTrips }       from '../components/UpcomingTrips';
import { BudgetVsActualChart } from '../components/BudgetVsActualChart';
import { RecentExpenses }      from '../components/RecentExpenses';
import { WeatherWidget }       from '../components/WeatherWidget';
import { QuickActions }        from '../components/QuickActions';
import { UpcomingReminders }   from '../components/UpcomingReminders';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetVsActualChart />
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
