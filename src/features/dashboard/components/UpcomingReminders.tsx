import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Bell, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useReminders } from '@/features/reminders/hooks/useReminders';
import {
  REMINDER_TYPE_MAP,
  PRIORITY_CONFIG,
  getEffectiveStatus,
} from '@/features/reminders/types';

export function UpcomingReminders() {
  const { data: reminders = [], isLoading } = useReminders();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const today     = new Date().toISOString().split('T')[0];
  const overdue   = reminders.filter((r) => getEffectiveStatus(r) === 'overdue');
  const todaysRem = reminders.filter(
    (r) => r.status !== 'completed' && r.reminder_date === today,
  );
  const upcoming  = reminders
    .filter((r) => r.status !== 'completed' && r.reminder_date > today)
    .sort((a, b) => a.reminder_date.localeCompare(b.reminder_date))
    .slice(0, 5);

  const displayed = [
    ...overdue.slice(0, 3),
    ...todaysRem.filter((r) => !overdue.find((o) => o.id === r.id)).slice(0, 2),
    ...upcoming,
  ].slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          Upcoming Reminders
          {overdue.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {overdue.length}
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-xs">
          <Link to="/reminders">
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
            <Bell className="h-7 w-7 opacity-30" />
            <p>No upcoming reminders</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/reminders">Create reminder</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((r) => {
              const meta   = REMINDER_TYPE_MAP[r.type] ?? REMINDER_TYPE_MAP['custom'];
              const status = getEffectiveStatus(r);
              const priCfg = PRIORITY_CONFIG[r.priority];

              let dateLabel = '';
              try {
                dateLabel = format(parseISO(r.reminder_date), 'dd MMM');
              } catch {
                dateLabel = r.reminder_date;
              }

              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                    status === 'overdue' ? 'border-destructive/40 bg-destructive/5' : 'bg-muted/30'
                  }`}
                >
                  {status === 'overdue' ? (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                  ) : (
                    <span className="shrink-0 text-sm">{meta.emoji}</span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" title={r.title}>
                      {r.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateLabel}
                      {r.reminder_time && ` · ${r.reminder_time.slice(0, 5)}`}
                    </p>
                  </div>

                  {r.priority !== 'low' && (
                    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${priCfg.badgeClass}`}>
                      {priCfg.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
