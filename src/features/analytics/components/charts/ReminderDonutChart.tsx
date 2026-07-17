import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint { name: string; value: number; color: string; }

function EmptyChart() {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      No reminders yet
    </div>
  );
}

interface Props { data: DataPoint[]; }

export function ReminderDonutChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0);

  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload } = props;
    if (!active || !payload?.length) return null;
    const p = payload[0];
    const item = p?.payload as DataPoint | undefined;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-0.5 font-semibold text-foreground">{String(p?.name ?? '')}</p>
        <p style={{ color: item?.color ?? '#3b82f6' }}>
          {Number(p?.value ?? 0)} reminder{Number(p?.value ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Reminder Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={tooltipContent} />
              <Legend
                iconSize={10}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground capitalize">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
