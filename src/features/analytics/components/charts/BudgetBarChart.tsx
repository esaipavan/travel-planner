import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface DataPoint { name: string; budget: number; actual: number; }

const TICK = { fontSize: 11, fill: '#94a3b8' };

function EmptyChart() {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      No trips with budget set
    </div>
  );
}

interface Props {
  data:     DataPoint[];
  currency: string;
}

export function BudgetBarChart({ data, currency }: Props) {
  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-1 font-semibold text-foreground">{String(label ?? '')}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: String(p.color ?? '#3b82f6') }}>
            {String(p.name ?? '')}: {formatCurrency(Number(p.value ?? 0), currency)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!data.length ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="name" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis
                tick={TICK}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: unknown) => {
                  const n = Number(v);
                  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
                }}
              />
              <Tooltip content={tooltipContent} />
              <Legend
                iconSize={10}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
