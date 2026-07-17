import { CheckSquare } from 'lucide-react';
import { PACKING_CATEGORIES } from '../types';
import type { PackingItemRow, CategoryProgress } from '../types';

interface Props {
  items: PackingItemRow[];
}

function buildCategoryProgress(items: PackingItemRow[]): CategoryProgress[] {
  const catMap = new Map<string, { total: number; packed: number }>();

  for (const item of items) {
    const key = item.category ?? 'Other';
    const cur = catMap.get(key) ?? { total: 0, packed: 0 };
    cur.total += 1;
    if (item.is_packed) cur.packed += 1;
    catMap.set(key, cur);
  }

  const emojiMap = Object.fromEntries(PACKING_CATEGORIES.map((c) => [c.value, c.emoji]));

  return Array.from(catMap.entries()).map(([category, { total, packed }]) => ({
    category,
    emoji: emojiMap[category] ?? '📦',
    total,
    packed,
  }));
}

export function ProgressCard({ items }: Props) {
  const total  = items.length;
  const packed = items.filter((i) => i.is_packed).length;
  const pct    = total > 0 ? Math.round((packed / total) * 100) : 0;

  const barColor =
    pct === 100
      ? 'bg-emerald-500'
      : pct >= 75
      ? 'bg-blue-500'
      : pct >= 40
      ? 'bg-amber-500'
      : 'bg-muted-foreground/40';

  const categories = buildCategoryProgress(items);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Overall progress */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Overall progress</span>
        </div>
        <span className="tabular-nums text-sm font-semibold">
          {packed} / {total} packed
          <span className="ml-2 text-muted-foreground font-normal">({pct}%)</span>
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map(({ category, emoji, total: catTotal, packed: catPacked }) => {
            const catPct = catTotal > 0 ? Math.round((catPacked / catTotal) * 100) : 0;
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {emoji} {category}
                  </span>
                  <span className="tabular-nums font-medium">
                    {catPacked}/{catTotal}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      catPct === 100 ? 'bg-emerald-500' : 'bg-primary/60'
                    }`}
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
