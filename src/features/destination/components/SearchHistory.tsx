import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  history:  string[];
  onSelect: (q: string) => void;
  onClear:  () => void;
}

export function SearchHistory({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <History className="h-3.5 w-3.5" />
        Recent:
      </span>
      {history.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {q}
        </button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground"
        onClick={onClear}
      >
        <X className="mr-1 h-3 w-3" />
        Clear
      </Button>
    </div>
  );
}
