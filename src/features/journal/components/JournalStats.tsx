import { BookOpen, MapPin, Star, Heart } from 'lucide-react';
import type { JournalEntryRow } from '../types';

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
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface Props {
  entries: JournalEntryRow[];
}

export function JournalStats({ entries }: Props) {
  const total        = entries.length;
  const destinations = new Set(entries.map((e) => e.location_name).filter(Boolean)).size;
  const rated        = entries.filter((e) => e.rating != null);
  const avgRating    = rated.length
    ? (rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';
  const favourites   = entries.filter((e) => e.is_favourite).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<BookOpen className="h-5 w-5 text-primary" />}
        label="Total Entries"
        value={total}
      />
      <StatCard
        icon={<MapPin className="h-5 w-5 text-primary" />}
        label="Destinations"
        value={destinations}
      />
      <StatCard
        icon={<Star className="h-5 w-5 text-primary" />}
        label="Avg Rating"
        value={avgRating}
      />
      <StatCard
        icon={<Heart className="h-5 w-5 text-primary" />}
        label="Favourites"
        value={favourites}
      />
    </div>
  );
}
