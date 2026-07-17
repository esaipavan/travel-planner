import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface DataPoint { month: string; amount: number; }

const TICK = { fontSize: 11, fill: '#94a3b8' };

function EmptyChart() {
  return (
    <div className="flex h-52 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      No expense data yet
    </div>
  );
}

interface Props {
  data:     DataPoint[];
  currency: string;
}

export function ExpenseLineChart({ data, currency }: Props) {
  const hasData = data.some((d) => d.amount > 0);

  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-1 font-semibold text-foreground">{String(label ?? '')}</p>
        <p style={{ color: payload[0]?.color ?? '#3b82f6' }}>
          {formatCurrency(Number(payload[0]?.value ?? 0), currency)}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" tick={TICK} tickLine={false} axisLine={false} />
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
