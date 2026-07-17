import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { TravelDocumentRow } from '../types';
import { getExpiryStatus } from '../types';

interface StatCardProps {
  icon:      React.ReactNode;
  label:     string;
  value:     string | number;
  highlight?: boolean;
}

function StatCard({ icon, label, value, highlight }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 ${
        highlight ? 'border-destructive/40 bg-destructive/5' : 'bg-card'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          highlight ? 'bg-destructive/10' : 'bg-primary/10'
        }`}
      >
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
  documents: TravelDocumentRow[];
}

export function DocumentStats({ documents }: Props) {
  const total        = documents.length;
  const uniqueTypes  = new Set(documents.map((d) => d.type)).size;
  const expiringSoon = documents.filter(
    (d) => getExpiryStatus(d.expiry_date) === 'expiring_soon',
  ).length;
  const expired = documents.filter(
    (d) => getExpiryStatus(d.expiry_date) === 'expired',
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<FileText className="h-5 w-5 text-primary" />}
        label="Total Documents"
        value={total}
      />
      <StatCard
        icon={<CheckCircle className="h-5 w-5 text-primary" />}
        label="Document Types"
        value={uniqueTypes}
      />
      <StatCard
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        label="Expiring Soon"
        value={expiringSoon}
        highlight={expiringSoon > 0}
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
        label="Expired"
        value={expired}
        highlight={expired > 0}
      />
    </div>
  );
}
