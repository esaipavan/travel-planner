import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';
import { useBudgetVsActual, useDashboardStats } from '../hooks/useDashboard';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  currency: string;
}

function CustomTooltip({ active, payload, label, currency }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

export function BudgetVsActualChart() {
  const { data: items, isLoading } = useBudgetVsActual();
  const { data: stats } = useDashboardStats();
  const currency = stats?.homeCurrency ?? 'INR';

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-52 w-full" />
        ) : !items || items.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            No trips with budgets yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={items} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#888', fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis
                tick={{ fill: '#888', fontSize: 11 }}
                stroke="transparent"
                width={52}
                tickFormatter={(v: number) =>
                  Intl.NumberFormat('en', { notation: 'compact' }).format(v)
                }
              />
              <Tooltip
                content={<CustomTooltip currency={currency} />}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="budget"
                name="Budget"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                name="Actual"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
