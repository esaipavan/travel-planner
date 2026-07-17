import {
  Map, Globe, BookOpen, FileText, Bell, Receipt,
} from 'lucide-react';
import { useProfileStats } from '../hooks/useProfile';
import { useProfile } from '../hooks/useProfile';
import { formatCurrency } from '@/utils/formatters';

interface StatCardProps {
  icon:  React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-none tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function ProfileStats() {
  const stats    = useProfileStats();
  const { data: profile } = useProfile();
  const currency = profile?.home_currency ?? 'INR';

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Statistics</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard
          icon={<Map className="h-5 w-5 text-primary" />}
          label="Total Trips"
          value={stats.totalTrips}
        />
        <StatCard
          icon={<Globe className="h-5 w-5 text-primary" />}
          label="Countries Visited"
          value={stats.countriesVisited}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          label="Journal Entries"
          value={stats.journalEntries}
        />
        <StatCard
          icon={<FileText className="h-5 w-5 text-primary" />}
          label="Documents Stored"
          value={stats.documentsStored}
        />
        <StatCard
          icon={<Bell className="h-5 w-5 text-primary" />}
          label="Reminders"
          value={stats.reminders}
        />
        <StatCard
          icon={<Receipt className="h-5 w-5 text-primary" />}
          label="Total Expenses"
          value={formatCurrency(stats.totalExpenses, currency)}
        />
      </div>
    </div>
  );
}
