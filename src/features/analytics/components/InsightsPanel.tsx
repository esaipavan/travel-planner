import { memo } from 'react';
import {
  TrendingUp, TrendingDown, MapPin, Clock,
  Star, FileWarning, Bell, PieChart,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface Insights {
  highestSpendingTrip:    { title: string; amount: number } | null;
  lowestSpendingTrip:     { title: string; amount: number } | null;
  mostVisitedDest:        string;
  avgTripDuration:        number;
  avgJournalRating:       number;
  docsExpiringSoon:       number;
  upcomingRemindersCount: number;
  budgetUtilization:      number;
}

interface Props {
  insights: Insights;
  currency: string;
}

interface InsightCardProps {
  icon:      React.ReactNode;
  label:     string;
  value:     string;
  sub?:      string;
  highlight?: boolean;
}

const InsightCard = memo(function InsightCard({ icon, label, value, sub, highlight }: InsightCardProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        highlight ? 'border-amber-500/40 bg-amber-500/5' : 'bg-card'
      }`}
    >
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        highlight ? 'bg-amber-500/10' : 'bg-primary/10'
      }`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate font-semibold leading-tight" title={value}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
});

export const InsightsPanel = memo(function InsightsPanel({ insights, currency }: Props) {
  const {
    highestSpendingTrip,
    lowestSpendingTrip,
    mostVisitedDest,
    avgTripDuration,
    avgJournalRating,
    docsExpiringSoon,
    upcomingRemindersCount,
    budgetUtilization,
  } = insights;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Insights</h2>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          label="Highest Spending Trip"
          value={highestSpendingTrip ? highestSpendingTrip.title : '—'}
          sub={highestSpendingTrip ? formatCurrency(highestSpendingTrip.amount, currency) : undefined}
        />
        <InsightCard
          icon={<TrendingDown className="h-4 w-4 text-emerald-500" />}
          label="Lowest Spending Trip"
          value={lowestSpendingTrip ? lowestSpendingTrip.title : '—'}
          sub={lowestSpendingTrip ? formatCurrency(lowestSpendingTrip.amount, currency) : undefined}
        />
        <InsightCard
          icon={<MapPin className="h-4 w-4 text-primary" />}
          label="Most Visited Destination"
          value={mostVisitedDest}
        />
        <InsightCard
          icon={<Clock className="h-4 w-4 text-primary" />}
          label="Avg Trip Duration"
          value={avgTripDuration > 0 ? `${avgTripDuration} days` : '—'}
        />
        <InsightCard
          icon={<Star className="h-4 w-4 text-amber-500" />}
          label="Avg Journal Rating"
          value={avgJournalRating > 0 ? `${avgJournalRating} / 5` : '—'}
        />
        <InsightCard
          icon={<FileWarning className="h-4 w-4 text-amber-500" />}
          label="Docs Expiring in 30 Days"
          value={String(docsExpiringSoon)}
          highlight={docsExpiringSoon > 0}
        />
        <InsightCard
          icon={<Bell className="h-4 w-4 text-primary" />}
          label="Pending Reminders"
          value={String(upcomingRemindersCount)}
        />
        <InsightCard
          icon={<PieChart className="h-4 w-4 text-primary" />}
          label="Budget Utilisation"
          value={budgetUtilization > 0 ? `${budgetUtilization}%` : '—'}
          highlight={budgetUtilization > 100}
          sub={budgetUtilization > 100 ? 'Over budget' : undefined}
        />
      </div>
    </div>
  );
});
