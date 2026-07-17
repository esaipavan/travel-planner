import { PLACE_CATEGORIES } from '../types';
import type { PlaceCategory } from '../types';

interface Props {
  active:   PlaceCategory | 'all';
  counts:   Partial<Record<PlaceCategory, number>>;
  onChange: (cat: PlaceCategory | 'all') => void;
}

export function CategoryFilter({ active, counts, onChange }: Props) {
  const total = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          active === 'all'
            ? 'border-primary bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent'
        }`}
      >
        All
        <span className="tabular-nums text-xs opacity-70">({total})</span>
      </button>

      {PLACE_CATEGORIES.map(({ value, label, emoji }) => {
        const count = counts[value] ?? 0;
        if (count === 0) return null;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              active === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {emoji} {label}
            <span className="tabular-nums text-xs opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
