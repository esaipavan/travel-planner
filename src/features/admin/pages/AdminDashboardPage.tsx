import { PageHeader } from '@/components/shared/PageHeader';
import { Shield } from 'lucide-react';
export default function AdminDashboardPage() {
  return <div className="space-y-6"><PageHeader title="Admin Dashboard" description="App overview and key metrics." /><div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground flex flex-col items-center gap-2"><Shield className="h-8 w-8 text-teal-500" /><span>Admin UI — Phase 3</span></div></div>;
}
