import { memo } from 'react';
import {
  Map, Plane, CheckCircle, Globe,
  Wallet, Receipt, TrendingDown, Calculator,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface KPIs {
  totalTrips:       number;
  upcomingTrips:    number;
  completedTrips:   number;
  countriesVisited: number;
  totalBudget:      number;
  totalExpenses:    number;
  budgetRemaining:  number;
  avgTripCost:      number;
}

interface Props {
  data:     KPIs;
  currency: string;
}

interface CardDef {
  label:     string;
  getValue:  (d: KPIs, cur: string) => string;
  icon:      React.ElementType;
  highlight?: (d: KPIs) => boolean;
}

const CARDS: CardDef[] = [
  {
    label:    'Total Trips',
    getValue: (d) => String(d.totalTrips),
    icon:     Map,
  },
  {
    label:    'Upcoming Trips',
    getValue: (d) => String(d.upcomingTrips),
    icon:     Plane,
  },
  {
    label:    'Completed Trips',
    getValue: (d) => String(d.completedTrips),
    icon:     CheckCircle,
  },
  {
    label:    'Countries Visited',
    getValue: (d) => String(d.countriesVisited),
    icon:     Globe,
  },
  {
    label:    'Total Budget',
    getValue: (d, cur) => d.totalBudget > 0 ? formatCurrency(d.totalBudget, cur) : '—',
    icon:     Wallet,
  },
  {
    label:    'Total Expenses',
    getValue: (d, cur) => formatCurrency(d.totalExpenses, cur),
    icon:     Receipt,
  },
  {
    label:     'Budget Remaining',
    getValue:  (d, cur) => d.totalBudget > 0 ? formatCurrency(d.budgetRemaining, cur) : '—',
    icon:      TrendingDown,
    highlight: (d) => d.totalBudget > 0 && d.budgetRemaining < 0,
  },
  {
    label:    'Avg Trip Cost',
    getValue: (d, cur) => d.avgTripCost > 0 ? formatCurrency(d.avgTripCost, cur) : '—',
    icon:     Calculator,
  },
];

export const KPICards = memo(function KPICards({ data, currency }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ label, getValue, icon: Icon, highlight }) => {
        const isHighlighted = highlight?.(data) ?? false;
        return (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              isHighlighted ? 'border-destructive/40 bg-destructive/5' : 'bg-card'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isHighlighted ? 'bg-destructive/10' : 'bg-primary/10'
              }`}
            >
              <Icon className={`h-5 w-5 ${isHighlighted ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-xl font-bold leading-none tabular-nums truncate ${
                isHighlighted ? 'text-destructive' : ''
              }`}>
                {getValue(data, currency)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});
