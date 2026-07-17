import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint { destination: string; rating: number; count: number; }

const TICK = { fontSize: 11, fill: '#94a3b8' };

function ratingColor(rating: number): string {
  if (rating >= 4.5) return '#10b981';
  if (rating >= 3.5) return '#3b82f6';
  if (rating >= 2.5) return '#f59e0b';
  return '#ef4444';
}

function EmptyChart() {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      No journal ratings yet
    </div>
  );
}

interface Props { data: DataPoint[]; }

export function JournalRatingsChart({ data }: Props) {
  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload } = props;
    if (!active || !payload?.length) return null;
    const p = payload[0];
    const item = p?.payload as DataPoint | undefined;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-0.5 font-semibold text-foreground">{String(item?.destination ?? '')}</p>
        <p style={{ color: ratingColor(Number(p?.value ?? 0)) }}>
          {Number(p?.value ?? 0).toFixed(1)} / 5
        </p>
        <p className="text-muted-foreground">{item?.count} entr{(item?.count ?? 0) !== 1 ? 'ies' : 'y'}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Journal Ratings by Destination</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!data.length ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, data.length * 32 + 40)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 5]}
                tick={TICK}
                tickLine={false}
                axisLine={false}
                tickCount={6}
              />
              <YAxis
                type="category"
                dataKey="destination"
                tick={TICK}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={tooltipContent} />
              <Bar dataKey="rating" radius={[0, 3, 3, 0]} name="Rating">
                {data.map((d, i) => (
                  <Cell key={i} fill={ratingColor(d.rating)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
