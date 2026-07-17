import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface DataPoint { name: string; value: number; emoji: string; }

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899',
];

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

export function ExpensePieChart({ data, currency }: Props) {
  if (!data.length) return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0"><EmptyChart /></CardContent>
    </Card>
  );

  function tooltipContent(props: TooltipProps<number, string>) {
    const { active, payload } = props;
    if (!active || !payload?.length) return null;
    const p = payload[0];
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
        <p className="mb-0.5 font-semibold text-foreground">{String(p?.name ?? '')}</p>
        <p style={{ color: String(p?.payload?.fill ?? '#3b82f6') }}>
          {formatCurrency(Number(p?.value ?? 0), currency)}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={tooltipContent} />
            <Legend
              iconSize={10}
              formatter={(value: string) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
