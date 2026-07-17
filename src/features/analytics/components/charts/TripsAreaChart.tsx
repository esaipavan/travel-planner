import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint { month: string; count: number; }

const TICK = { fontSize: 11, fill: '#94a3b8' };

function EmptyChart() {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      No trip data yet
    </div>
  );
}

interface Props { data: DataPoint[]; }

export function TripsAreaChart({ data }: Props) {
  const hasData = data.some((d) => d.count > 0);

  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-1 font-semibold text-foreground">{String(label ?? '')}</p>
        <p style={{ color: '#8b5cf6' }}>
          {Number(payload[0]?.value ?? 0)} trip{Number(payload[0]?.value ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Trips per Month</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="tripsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis
                tick={TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickFormatter={(v: unknown) => String(Number(v))}
              />
              <Tooltip content={tooltipContent} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#tripsGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6' }}
                name="Trips"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
